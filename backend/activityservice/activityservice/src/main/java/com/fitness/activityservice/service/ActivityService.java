package com.fitness.activityservice.service;


import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ActivityResponse trackActivity(ActivityRequest request) {

        boolean isValidUser = userValidationService.validateUser(request.getUserId());

        if(!isValidUser) {
            throw  new RuntimeException("Invalid User: " + request.getUserId());
        }

        Optional<Activity> existingActivity =
                activityRepository.findByUserIdAndTypeAndStartTime(
                        request.getUserId(),
                        request.getType(),
                        request.getStartTime()
                );

        Activity savedActivity;

        if (existingActivity.isPresent()) {
            Activity existing = existingActivity.get();

            existing.setDuration(request.getDuration());
            existing.setCaloriesBurned(request.getCaloriesBurned());
            existing.setAdditionalMetrics(request.getAdditionalMetrics());

            savedActivity = activityRepository.save(existing); // ✅ update
        } else {
            Activity activity = Activity.builder()
                    .userId(request.getUserId())
                    .type(request.getType())
                    .duration(request.getDuration())
                    .caloriesBurned(request.getCaloriesBurned())
                    .startTime(request.getStartTime())
                    .additionalMetrics(request.getAdditionalMetrics())
                    .build();
            savedActivity = activityRepository.save(activity);
        }



//        Activity savedActivity = activityRepository.save(activity);

        try {
            kafkaTemplate.send(topicName, savedActivity.getUserId(), savedActivity);
            System.out.println("Send to Kafka: " + savedActivity.getId() );
        } catch(Exception e) {
            log.error("Failed to publish activity for userId={}", savedActivity.getUserId(), e);
        }
        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());

        return response;
    }

    public List<ActivityResponse>  getUserActivities(String userId) {
        List<Activity> activityList =  activityRepository.findByUserId(userId);
        return activityList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


//    public void deleteByUserAndType(String userId, String type) {
//        activityRepository.deleteByUserAndType(userId, type);
//    }
}


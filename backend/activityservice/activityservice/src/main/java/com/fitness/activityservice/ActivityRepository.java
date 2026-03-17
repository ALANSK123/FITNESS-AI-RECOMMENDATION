package com.fitness.activityservice;

import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.model.ActivityType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ActivityRepository extends MongoRepository<Activity, String> {

    Optional<Activity> findByUserIdAndTypeAndStartTime(String userId,
                                                       ActivityType type,
                                                       LocalDateTime startTime);
}

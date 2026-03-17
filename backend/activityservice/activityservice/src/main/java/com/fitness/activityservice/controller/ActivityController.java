package com.fitness.activityservice.controller;


import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import jakarta.ws.rs.Path;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {
    private ActivityService activityService;


    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

//    @DeleteMapping("/user/{userId}/type/{type}")
//    public String deleteActivities(@PathVariable String userId,
//                                   @PathVariable String type) {
//        activityService.deleteByUserAndType(userId, type);
//        return "Deleted successfully";
//    }
}

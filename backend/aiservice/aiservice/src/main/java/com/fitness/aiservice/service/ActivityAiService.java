package com.fitness.aiservice.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class ActivityAiService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getRecommendations(prompt);
//        log.info("RESPONSE FROM AI {}", aiResponse);
        return processAIResponse(activity, aiResponse);
    }

    private Recommendation processAIResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .get("parts")
                    .get(0)
                    .path("text");



            String jsonContent = textNode.asText()
                    .replaceAll("\\n```","")
                    .trim();
//            log.info("RESPONSE FROM CLEANED AI {}", jsonContent);

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");


            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSaftyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .type(activity.getType().toString())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType().toString())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness consultant"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSaftyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if(safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }

        return  safety.isEmpty() ?
                Collections.singletonList("Follow general safety guidelines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if(suggestionsNode.isArray()) {
            suggestionsNode.forEach(improvement -> {
                String area = improvement.path("workout").asText();
                String detail = improvement.path("description").asText();
                suggestions.add(String.format("%s: %s", area, detail));
            });
        }

        return  suggestions.isEmpty() ?
                Collections.singletonList("No specific suggestions provided") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if(improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }

        return  improvements.isEmpty() ?
                Collections.singletonList("No specific improvements provided") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }

    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                You are an expert fitness coach, sports scientist, and performance analyst.
                
                Your task is to analyze a user's workout activity and generate actionable insights, performance feedback, and future workout suggestions.
                
                IMPORTANT RULES:
                1. Your response MUST be valid JSON.
                2. Follow the EXACT JSON structure provided below.
                3. Do NOT include explanations, markdown, or text outside the JSON.
                4. If some metrics are missing or unclear, infer reasonable insights based on the available data.
                5. Keep recommendations practical, safe, and personalized to the activity type and duration.
                6. Avoid generic advice — provide specific and meaningful guidance.
                
                OUTPUT FORMAT (STRICT JSON):
                
                {
                  "analysis": {
                    "overall": "Comprehensive summary of the workout performance, intensity, and effectiveness",
                    "pace": "Analysis of pacing consistency, speed, and efficiency where applicable",
                    "heartRate": "Evaluation of cardiovascular effort, intensity zones, and endurance impact (if heart rate data exists)",
                    "caloriesBurned": "Interpretation of calorie expenditure relative to workout duration and type"
                  },
                  "improvements": [
                    {
                      "area": "Specific performance area (e.g., endurance, pacing, recovery, intensity control)",
                      "recommendation": "Detailed and actionable improvement recommendation"
                    }
                  ],
                  "suggestions": [
                    {
                      "workout": "Recommended workout name",
                      "description": "Detailed description of the suggested workout including duration, intensity, and purpose"
                    }
                  ],
                  "safety": [
                    "Clear safety guideline relevant to this workout type",
                    "Another safety recommendation focused on injury prevention or recovery"
                  ]
                }
                
                WORKOUT DATA TO ANALYZE:
                
                Activity Type: %s \s
                Duration: %d minutes \s
                Calories Burned: %d \s
                Additional Metrics: %s
                
                ANALYSIS GUIDELINES:
                - Evaluate workout intensity based on duration and calories burned.
                - Comment on efficiency, endurance impact, and training quality.
                - Provide at least 3 improvement recommendations.
                - Provide at least 3 workout suggestions for future training.
                - Ensure safety tips are specific to the activity type.
                - Focus on helping the user improve performance, endurance, and recovery.
                
                Return ONLY the JSON object.
                """,
                    activity.getType(),
                    activity.getDuration(),
                    activity.getCaloriesBurned(),
                    activity.getAdditionalMetrics()
                );

    }

}

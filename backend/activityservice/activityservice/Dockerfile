# Build Stage
FROM amazoncorretto:21-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Runtime Stage
FROM amazoncorretto:21-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# No EXPOSE needed here if only Gateway is public,
# but good for documentation:
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
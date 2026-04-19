# Build Stage
FROM amazoncorretto:21-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Runtime Stage
FROM amazoncorretto:21-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]

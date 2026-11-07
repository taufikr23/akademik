FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /source
COPY backend backend
COPY deploy/render deploy/render
RUN sh deploy/render/assemble.sh /build && mvn -B -q -f /build/pom.xml -DskipTests package
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
ENV SPRING_PROFILES_ACTIVE=render
ENTRYPOINT ["java","-Xmx220m","-Xss512k","-XX:ActiveProcessorCount=1","-XX:+UseSerialGC","-jar","app.jar"]

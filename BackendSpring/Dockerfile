# Étape 1 : Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copie le contenu du dossier backend
COPY . .
RUN mvn clean package -DskipTests

# Étape 2 : Exécution
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
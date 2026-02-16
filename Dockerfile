# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build WAR
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Install Jetty 12.1.6
RUN apt-get update && \
    apt-get install -y curl && \
    curl -SL https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-home/12.1.6/jetty-home-12.1.6.tar.gz | tar -xz -C /opt && \
    mv /opt/jetty-home-12.1.6 /opt/jetty && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy WAR file
COPY --from=builder /app/target/Weather-web.war /opt/jetty/webapps/ROOT.war

# Create minimal Jetty base
RUN mkdir -p /opt/jetty-base/webapps && \
    cd /opt/jetty-base && \
    java -jar /opt/jetty/start.jar --create-startd --add-modules=http,deploy,annotations

# Configure Jetty to use our base
ENV JETTY_HOME=/opt/jetty
ENV JETTY_BASE=/opt/jetty-base

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

WORKDIR /opt/jetty-base

# Start Jetty
CMD ["java", "-jar", "/opt/jetty/start.jar", "jetty.http.port=7860", "jetty.http.host=0.0.0.0"]

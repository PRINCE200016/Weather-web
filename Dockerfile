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

# Create minimal Jetty base
RUN mkdir -p /opt/jetty-base/webapps && \
    cd /opt/jetty-base && \
    java -jar /opt/jetty/start.jar --create-startd --add-modules=http,ee10-deploy,ee10-annotations

# Copy WAR file to JETTY_BASE/webapps
COPY --from=builder /app/target/Weather-web.war /opt/jetty-base/webapps/ROOT.war

# Configure Jetty to use our base
ENV JETTY_HOME=/opt/jetty
ENV JETTY_BASE=/opt/jetty-base

# IMPORTANT FOR HUGGING FACE: Fix permissions for default user (1000)
RUN chown -R 1000:1000 /opt/jetty-base /opt/jetty
USER 1000

# Expose default port
EXPOSE 8080

WORKDIR /opt/jetty-base

# Start Jetty with dynamic PORT provided by Render
CMD ["sh", "-c", "java -jar /opt/jetty/start.jar jetty.http.port=${PORT:-8080} jetty.http.host=0.0.0.0"]
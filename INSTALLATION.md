# Weather Web Application - Installation Guide

This document provides step-by-step instructions to set up and deploy the Weather Web Application.

## Prerequisites

Before starting, ensure you have the following installed:

- Java Development Kit (JDK) 11 or higher
- Apache Tomcat 10.0 or higher (or any Jakarta EE 9+ compatible servlet container)
- Git (optional, for cloning the repository)
- An IDE such as Eclipse, IntelliJ IDEA, or Visual Studio Code (optional)
- Web browser (Chrome, Firefox, Safari, etc.)

## Step 1: Obtain the Project

### Option 1: Clone from Git repository (if available)
```bash
git clone https://github.com/your-username/Weather-web.git
cd Weather-web
```

### Option 2: Download as ZIP archive
1. Download the ZIP file
2. Extract to a directory of your choice
3. Navigate to the extracted directory

## Step 2: Build the Project

### Option 1: Using Maven (if Maven is configured)
```bash
mvn clean package
```
This will create a WAR file in the target directory.

### Option 2: Using an IDE
1. Open the project in your preferred IDE
2. Build the project using the IDE's build functionality
3. Export as a WAR file

### Option 3: Manual Build
1. Compile Java classes:
   ```bash
   javac -d build/classes -cp "lib/*" src/main/java/Mypackage/*.java
   ```
2. Create a WAR file structure and package it

## Step 3: Deploy to Tomcat

### Option 1: Using Tomcat Web Application Manager
1. Start Tomcat server
2. Open a browser and navigate to `http://localhost:8080/manager/html`
3. Log in with your Tomcat credentials
4. In the "WAR file to deploy" section, choose the WAR file you built
5. Click "Deploy"

### Option 2: Manual Deployment
1. Stop Tomcat server if it's running
2. Copy the WAR file to the `webapps` directory of your Tomcat installation
3. Start Tomcat server
4. Tomcat will automatically extract and deploy the application

### Option 3: IDE Deployment (if using an IDE)
1. Configure Tomcat server in your IDE
2. Deploy directly from the IDE to the server

## Step 4: Verify the Installation

1. Open a web browser
2. Navigate to `http://localhost:8080/Weather-web` (or the context path you configured)
3. You should see the Weather Web Application landing page
4. Test the application by entering a city name and checking if weather data is displayed

## Common Installation Issues

### Issue: 404 Not Found
- Verify the context path is correct
- Check if the WAR file was deployed correctly
- Look for deployment errors in Tomcat logs

### Issue: 500 Internal Server Error
- Check Tomcat logs for exceptions
- Verify all libraries are correctly included
- Ensure the GSON library is in the WEB-INF/lib directory

### Issue: No Weather Data Displayed
- Verify your internet connection
- Check if the API key is valid
- Look for exceptions in server logs related to API calls or parsing

## Customizing Your Installation

### Changing the API Key
1. Open `src/main/java/Mypackage/MyServlet.java`
2. Locate the line: `String apiKey = "ce1975c094e06d6265fbf681defdf0fc";`
3. Replace the key with your own OpenWeather API key
4. Rebuild and redeploy the application

### Changing the Context Path
To change the URL path where your application is available:
1. Rename your WAR file before deployment (e.g., `weather.war` will be available at `/weather`)
2. Alternatively, configure the context path in Tomcat's `server.xml` or a context fragment file

## Production Deployment Considerations

For production deployments, consider the following:

1. **Security**:
   - Move API keys to environment variables or secure configuration files
   - Configure HTTPS in your servlet container
   - Apply security headers and best practices

2. **Performance**:
   - Increase JVM memory if needed
   - Consider implementing caching for API responses
   - Optimize static resources (minification, compression)

3. **Monitoring and Logging**:
   - Configure appropriate logging levels
   - Set up monitoring for application health
   - Implement error tracking

4. **Scalability**:
   - Consider load balancing for high traffic
   - Use a CDN for static resources

## Troubleshooting

### Java Version Issues
If you encounter compatibility issues, verify that you're using a compatible JDK version with your servlet container:
- Jakarta EE 9+ requires JDK 11 or higher
- Older servlet containers may not be compatible with newer JDK versions

### Library Conflicts
If you encounter `ClassNotFoundException` or similar errors:
1. Verify all required libraries are in WEB-INF/lib
2. Check for version conflicts
3. Look for missing dependencies

### Connection Issues
If the application can't connect to the OpenWeather API:
1. Verify your network connectivity
2. Check if the API endpoint is reachable
3. Verify if a proxy is needed in your environment

---

For additional help, please refer to the DEVELOPER.md file or contact the project maintainers. 
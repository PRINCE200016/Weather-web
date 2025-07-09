# Weather Web Application - Developer Documentation

This document provides technical information for developers working on the Weather Web Application.

## Architecture Overview

The application follows a simple MVC (Model-View-Controller) architecture:

- **Model**: Java objects representing weather data
- **View**: JSP and HTML pages with CSS styling
- **Controller**: Java Servlet handling API requests and business logic

## Technology Stack

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6)
  - JSP (Jakarta Server Pages)

- **Backend**:
  - Java (Jakarta EE)
  - Servlets API
  - GSON library for JSON parsing

- **API**:
  - OpenWeather API (https://openweathermap.org/api)

## Key Components

### 1. MyServlet.java

Location: `src/main/java/Mypackage/MyServlet.java`

This servlet acts as the controller for the application:
- Handles HTTP requests (primarily POST)
- Makes API calls to OpenWeather
- Parses JSON responses using GSON
- Extracts relevant weather data
- Sets attributes for the JSP page
- Forwards the request to the JSP view

Key method is `doPost()` which:
1. Retrieves city name from request parameters
2. Constructs the OpenWeather API URL with the API key
3. Makes an HTTP GET request to the API
4. Reads and parses the JSON response
5. Extracts data like temperature, humidity, etc.
6. Sets these values as request attributes
7. Forwards to index.jsp for rendering

### 2. index.html

Location: `src/main/webapp/index.html`

The landing page that:
- Displays the application logo and title
- Shows technologies used
- Provides the initial search form that submits to MyServlet

### 3. index.jsp

Location: `src/main/webapp/index.jsp`

The dynamic view that:
- Displays weather information received from the servlet
- Shows the weather icon based on conditions
- Presents formatted temperature, humidity, and wind speed
- Includes another search form for new searches

### 4. javascript.js

Location: `src/main/webapp/javascript.js`

Contains client-side logic to:
- Select appropriate weather icon based on weather conditions
- Update the UI dynamically

### 5. style.css

Location: `src/main/webapp/style.css`

Contains all styling for the application including:
- Layout and positioning
- Colors and gradients
- Responsive design elements
- Card and input styling

### 6. web.xml

Location: `src/main/webapp/WEB-INF/web.xml`

Web application deployment descriptor that:
- Defines servlet mappings
- Sets welcome files
- Configures the web application

## API Integration

The application uses OpenWeather API with the following endpoint:
```
https://api.openweathermap.org/data/2.5/weather?q={CITY_NAME}&appid={API_KEY}
```

The API key is currently hardcoded in `MyServlet.java`:
```java
String apiKey = "ce1975c094e06d6265fbf681defdf0fc";
```

**Security Note**: For production, move this to a secure configuration file or environment variable.

## Response Parsing

The application parses the following JSON fields from the OpenWeather API response:

- `dt`: Timestamp for the weather data
- `main.temp`: Temperature in Kelvin (converted to Celsius)
- `main.humidity`: Humidity percentage
- `wind.speed`: Wind speed in meters per second
- `weather[0].main`: General weather condition (Clear, Clouds, Rain, etc.)

## Weather Icons

Weather icons are conditionally loaded based on the `weatherCondition` value:
- Clear: sun.png
- Clouds: Clouds.png
- Rain: rainy.png
- Mist: mist.png
- Snow: snow.png
- Haze: haze.png

## Development Setup

1. Install Java Development Kit (JDK) 11 or higher
2. Set up a Jakarta EE compatible servlet container (Apache Tomcat 10+)
3. Import the project into your IDE
4. Configure the build path to include the GSON library
5. Deploy to your servlet container

## Building and Deploying

1. Compile the Java source files
2. Package the application as a WAR file
3. Deploy to a servlet container (Tomcat, Jetty, etc.)

## Common Issues and Solutions

### API Key Issues
If weather data is not loading, verify:
- API key is valid and active
- API endpoint is accessible
- No typos in the API URL construction

### Parsing Errors
If seeing parsing exceptions:
- Check for changes in the OpenWeather API response format
- Verify GSON library is properly included
- Debug the JSON structure received from the API

### Rendering Issues
If weather icons or styling is broken:
- Verify CSS paths and links
- Check if the weather condition value matches expected case (e.g., "Clear" vs "clear")
- Inspect browser console for JavaScript errors

## Future Development Opportunities

1. **Refactoring Opportunities**:
   - Move API key to configuration file
   - Create proper model classes for weather data
   - Implement error handling and user feedback

2. **Feature Enhancements**:
   - Add multi-day forecast
   - Implement geolocation
   - Add temperature unit conversion
   - Create weather history tracking

3. **Technical Improvements**:
   - Implement caching for API responses
   - Add comprehensive error handling
   - Create automated tests
   - Optimize for mobile devices

## Code Contribution Guidelines

1. Follow Java and Jakarta EE best practices
2. Maintain the existing code style
3. Comment complex logic
4. Test thoroughly before submitting changes
5. Document API changes or configuration requirements 
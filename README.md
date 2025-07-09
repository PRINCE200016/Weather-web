# Weather Web Application

A simple and elegant web application that displays weather information for cities around the world.

![Weather App Logo](src/main/webapp/image/weather-logo.png)

## Overview

This Weather Web Application allows users to search for real-time weather information of any city. It provides details including:
- Current temperature in Celsius
- Weather conditions (Clear, Cloudy, Rainy, etc.)
- Humidity percentage
- Wind speed

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Java Servlets, JSP (JavaServer Pages)
- **API**: OpenWeather API
- **Libraries**: GSON (for JSON parsing)
- **Server**: Jakarta EE compatible servlet container

## Project Structure

```
Weather-web-master/
  - src/
    - main/
      - java/
        - Mypackage/
          - MyServlet.java (Backend servlet for API handling)
      - webapp/
        - image/
          - weather-logo.png
        - index.html (Landing page)
        - index.jsp (Dynamic weather display page)
        - javascript.js (Handles weather icon display)
        - style.css (Application styling)
        - WEB-INF/
          - lib/
            - gson-2.8.5.jar (JSON parsing library)
          - web.xml (Web application configuration)
```

## How It Works

1. Users access the application and are greeted by the landing page (index.html)
2. Users enter a city name in the search box and submit the form
3. The form sends a POST request to MyServlet
4. MyServlet makes an API call to OpenWeather API with the provided city name
5. Weather data is received in JSON format and parsed using GSON library
6. The servlet forwards the processed weather data to index.jsp
7. index.jsp renders the weather information with appropriate styling and icons
8. javascript.js selects the appropriate weather icon based on current conditions

## Features

- Clean and responsive user interface
- Real-time weather data from OpenWeather API
- Visual representation with weather icons
- Display of key weather metrics (temperature, humidity, wind speed)
- Search functionality for any city worldwide

## Setup Instructions

1. Clone the repository
2. Ensure you have a Java Development Kit (JDK) installed
3. Deploy the application to a Jakarta EE compatible servlet container (like Tomcat)
4. Access the application through your web browser

## API Key

The application uses the OpenWeather API. The API key is currently hardcoded in the MyServlet.java file. For production use, it's recommended to move this to a secure configuration file.

## Screenshots

[Place screenshots of the application here]

## Future Enhancements

- Multi-day forecast
- Temperature unit conversion (Celsius/Fahrenheit)
- Geolocation to automatically detect user's city
- More detailed weather information
- Dark/Light theme options

## License

[Specify your license information here]

## Contributors

[List contributors here]
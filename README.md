---
title: Weather Web App
emoji: 🌤️
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# Weather Web Application

A modern weather application built with Java Servlets and Jakarta EE.

## Features

- Search weather by city name
- Real-time weather data from OpenWeatherMap API
- Modern glassmorphism UI design
- Responsive layout

## Local Development

### Prerequisites
- Java 11 or higher
- Maven 3.6+

### Run Locally

```bash
mvn clean package
mvn jetty:run
```

Then open `http://localhost:9090/Weather-web`

## Deployment

This application is configured for deployment on Hugging Face Spaces using Docker.

### Hugging Face Spaces Deployment

1. Push your code to GitHub
2. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
3. Click "Create new Space"
4. Select "Docker" as the SDK
5. Connect your GitHub repository
6. The Space will automatically build and deploy

The application will be available at: `https://your-username-weather-web.hf.space`

## API Key

Make sure to set your OpenWeatherMap API key in `MyServlet.java` or use environment variables for production.

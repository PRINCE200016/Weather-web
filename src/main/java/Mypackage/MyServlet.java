package Mypackage;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Date;
import java.util.Scanner;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * Servlet implementation class MyServlet
 */
@WebServlet(name = "MyServlet", urlPatterns = { "/MyServlet" })
public class MyServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public MyServlet() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.getWriter().append("Served at: ").append(request.getContextPath());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String apiKey = "ce1975c094e06d6265fbf681defdf0fc";
        String city = request.getParameter("city");

        if (city == null || city.trim().isEmpty()) {
            city = "Delhi"; // Default city
        }

        // URL encoding for city name to handle spaces and special characters
        String encodedCity = java.net.URLEncoder.encode(city, "UTF-8");
        String apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + encodedCity + "&appid=" + apiKey;

        try {
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == 200) {
                InputStream inputStream = connection.getInputStream();
                InputStreamReader reader = new InputStreamReader(inputStream);
                Scanner scanner = new Scanner(reader);
                StringBuilder responseContent = new StringBuilder();

                while (scanner.hasNext()) {
                    responseContent.append(scanner.nextLine());
                }
                scanner.close();

                // Parse the JSON response
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(responseContent.toString(), JsonObject.class);

                // Extract and set attributes
                long dateTimestamp = jsonObject.get("dt").getAsLong() * 1000;
                String date = new Date(dateTimestamp).toString();

                JsonObject main = jsonObject.getAsJsonObject("main");
                double temperatureKelvin = main.get("temp").getAsDouble();
                int temperatureCelsius = (int) (temperatureKelvin - 273.15);

                double feelsLikeKelvin = main.get("feels_like").getAsDouble();
                int feelsLikeCelsius = (int) (feelsLikeKelvin - 273.15);

                int humidity = main.get("humidity").getAsInt();
                int pressure = main.get("pressure").getAsInt();

                double windSpeed = jsonObject.getAsJsonObject("wind").get("speed").getAsDouble();
                int visibility = jsonObject.has("visibility") ? jsonObject.get("visibility").getAsInt() : 0;

                String weatherCondition = jsonObject.getAsJsonArray("weather").get(0).getAsJsonObject().get("main")
                        .getAsString();

                request.setAttribute("date", date);
                request.setAttribute("city", city);
                request.setAttribute("temperature", temperatureCelsius);
                request.setAttribute("feelsLike", feelsLikeCelsius);
                request.setAttribute("weatherCondition", weatherCondition);
                request.setAttribute("humidity", humidity);
                request.setAttribute("pressure", pressure);
                request.setAttribute("windSpeed", windSpeed);
                request.setAttribute("visibility", visibility / 1000.0); // Convert to km
                request.setAttribute("weatherData", responseContent.toString());
            } else {
                request.setAttribute("error", "City not found or API error. (Code: " + responseCode + ")");
            }

            connection.disconnect();
        } catch (IOException e) {
            e.printStackTrace();
            request.setAttribute("error", "Network error occurred.");
        }

        // Forward the request to the index.jsp page for rendering
        request.getRequestDispatcher("index.jsp").forward(request, response);
    }
}

package Mypackage;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Date;
import java.util.Scanner;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * REST API Servlet - returns JSON weather data for a given city.
 * Endpoint: GET /weather?city=London
 * Deployed on Hugging Face Spaces (Jetty).
 */
@WebServlet(name = "MyServlet", urlPatterns = { "/weather" })
public class MyServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public MyServlet() {
        super();
    }

    // ── CORS pre-flight ──────────────────────────────────────────────────────
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // ── Main API endpoint ────────────────────────────────────────────────────
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String envApiKey = System.getenv("OPENWEATHER_API_KEY");
        String apiKey = (envApiKey != null && !envApiKey.isEmpty())
                ? envApiKey
                : "ce1975c094e06d6265fbf681defdf0fc";

        String city = request.getParameter("city");
        if (city == null || city.trim().isEmpty()) {
            city = "Delhi";
        }

        PrintWriter out = response.getWriter();

        // URL-encode city to handle spaces / special characters
        String encodedCity = java.net.URLEncoder.encode(city, "UTF-8");
        String apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
                + encodedCity + "&appid=" + apiKey;

        try {
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(8000);

            int responseCode = connection.getResponseCode();

            if (responseCode == 200) {
                InputStream inputStream = connection.getInputStream();
                InputStreamReader reader = new InputStreamReader(inputStream, "UTF-8");
                Scanner scanner = new Scanner(reader);
                StringBuilder rawJson = new StringBuilder();
                while (scanner.hasNextLine()) {
                    rawJson.append(scanner.nextLine());
                }
                scanner.close();

                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(rawJson.toString(), JsonObject.class);

                // Build our own clean response object
                long dateTimestamp = jsonObject.get("dt").getAsLong() * 1000;
                String date = new Date(dateTimestamp).toString();

                JsonObject main = jsonObject.getAsJsonObject("main");
                double tempKelvin      = main.get("temp").getAsDouble();
                int    tempCelsius     = (int) (tempKelvin - 273.15);

                double feelsLikeKelvin = main.get("feels_like").getAsDouble();
                int    feelsLikeCelsius = (int) (feelsLikeKelvin - 273.15);

                int humidity    = main.get("humidity").getAsInt();
                int pressure    = main.get("pressure").getAsInt();

                double windSpeed   = jsonObject.getAsJsonObject("wind").get("speed").getAsDouble();
                int    visibilityM = jsonObject.has("visibility")
                        ? jsonObject.get("visibility").getAsInt() : 0;
                double visibilityKm = visibilityM / 1000.0;

                String weatherCondition = jsonObject
                        .getAsJsonArray("weather").get(0).getAsJsonObject()
                        .get("main").getAsString();

                // Compose JSON response
                JsonObject result = new JsonObject();
                result.addProperty("city",             city);
                result.addProperty("date",             date);
                result.addProperty("temperature",      tempCelsius);
                result.addProperty("feelsLike",        feelsLikeCelsius);
                result.addProperty("humidity",         humidity);
                result.addProperty("pressure",         pressure);
                result.addProperty("windSpeed",        windSpeed);
                result.addProperty("visibility",       visibilityKm);
                result.addProperty("weatherCondition", weatherCondition);

                out.print(gson.toJson(result));

            } else {
                // Forward the OpenWeather error response
                InputStream errorStream = connection.getErrorStream();
                String errorBody = "";
                if (errorStream != null) {
                    Scanner sc = new Scanner(errorStream, "UTF-8");
                    if (sc.hasNextLine()) errorBody = sc.nextLine();
                    sc.close();
                }
                response.setStatus(responseCode);
                JsonObject err = new JsonObject();
                err.addProperty("error", "City not found or API error. (Code: " + responseCode + ")");
                err.addProperty("detail", errorBody);
                out.print(new Gson().toJson(err));
            }

            connection.disconnect();

        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject err = new JsonObject();
            err.addProperty("error", "Network error: " + e.getMessage());
            out.print(new Gson().toJson(err));
        }
    }

    // ── CORS helper ──────────────────────────────────────────────────────────
    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin",  "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}

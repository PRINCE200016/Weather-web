<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SkyCast | Modern Weather</title>
            <link rel="stylesheet" href="style.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>

        <body>

            <div class="mainContainer">
                <form action="MyServlet" method="post" class="searchInput">
                    <input type="text" placeholder="Search City..." id="searchInput" name="city"
                        value="${city != null ? city : ''}" autocomplete="off" required />
                    <button id="searchButton" type="submit">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>

                <c:if test="${not empty error}">
                    <div class="error-message">
                        <i class="fa-solid fa-circle-exclamation"></i> ${error}
                    </div>
                </c:if>

                <div id="weatherContent" class="weatherDetails"
                    style="${not empty error || empty city ? 'display:none' : 'display:block'}">
                    <div class="weatherIcon">
                        <img src="" alt="${weatherCondition}" id="weather-icon">
                        <h2 id="tempValue">${temperature}°C</h2>
                        <input type="hidden" id="wc" value="${weatherCondition}">
                        <input type="hidden" id="currentTemp" value="${temperature}">
                    </div>

                    <div class="cityDetails">
                        <div class="desc">${city}</div>
                        <div class="date">${date}</div>
                    </div>

                    <div class="additionalInfo">
                        <div class="infoCard">
                            <i class="fa-solid fa-temperature-three-quarters"></i>
                            <div>
                                <span>FEELS LIKE</span>
                                <h3>${feelsLike}°C</h3>
                            </div>
                        </div>
                        <div class="infoCard">
                            <i class="fa-solid fa-droplet"></i>
                            <div>
                                <span>HUMIDITY</span>
                                <h3>${humidity}%</h3>
                            </div>
                        </div>
                        <div class="infoCard">
                            <i class="fa-solid fa-wind"></i>
                            <div>
                                <span>WIND SPEED</span>
                                <h3>${windSpeed} km/h</h3>
                            </div>
                        </div>
                        <div class="infoCard">
                            <i class="fa-solid fa-gauge"></i>
                            <div>
                                <span>PRESSURE</span>
                                <h3>${pressure} hPa</h3>
                            </div>
                        </div>
                        <div class="infoCard">
                            <i class="fa-solid fa-eye"></i>
                            <div>
                                <span>VISIBILITY</span>
                                <h3>${visibility} km</h3>
                            </div>
                        </div>
                        <div class="infoCard">
                            <i class="fa-solid fa-cloud-sun"></i>
                            <div>
                                <span>CONDITION</span>
                                <h3>${weatherCondition}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <c:if test="${empty city && empty error}">
                    <div class="weatherDetails welcome-state">
                        <div class="cityDetails">
                            <div class="desc">SkyCast</div>
                            <div class="date underline-animation">PREMIUM WEATHER INTELLIGENCE</div>
                        </div>
                    </div>
                </c:if>
            </div>

            <script src="javascript.js"></script>
        </body>

        </html>
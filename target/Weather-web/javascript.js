document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mainContainer');
    const weatherIcon = document.getElementById("weather-icon");
    const wcInput = document.getElementById("wc");
    const weatherCondition = wcInput ? wcInput.value : null;
    const tempElement = document.getElementById("tempValue");
    const targetTemp = document.getElementById("currentTemp") ? parseFloat(document.getElementById("currentTemp").value) : null;
    const searchForm = document.querySelector(".searchInput");
    const searchButton = document.getElementById("searchButton");

    // --- 3D TILT EFFECT ---
    let bounds;

    function updateBounds() {
        bounds = container.getBoundingClientRect();
    }

    function rotateToMouse(e) {
        if (!container) return;
        updateBounds();

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.left;
        const topY = mouseY - bounds.top;
        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };
        const distance = Math.sqrt(Math.pow(center.x, 2) + Math.pow(center.y, 2));

        container.style.transform = `
            rotate3d(
                ${center.y / 100},
                ${-center.x / 100},
                0,
                ${Math.log(distance) * 2}deg
            )
        `;
    }

    container.addEventListener('mouseenter', () => {
        updateBounds();
        container.style.transition = 'none';
        document.addEventListener('mousemove', rotateToMouse);
    });

    container.addEventListener('mouseleave', () => {
        document.removeEventListener('mousemove', rotateToMouse);
        container.style.transition = 'transform 0.5s ease-out';
        container.style.transform = '';
    });

    // --- WEATHER LOGIC ---
    function setWeatherIcon(condition) {
        if (!weatherIcon) return;

        const iconMap = {
            'Clouds': '03d', 'Clear': '01d', 'Rain': '10d', 'Drizzle': '09d',
            'Mist': '50d', 'Snow': '13d', 'Thunderstorm': '11d', 'Haze': '50d',
            'Smoke': '50d', 'Dust': '50d', 'Fog': '50d', 'Sand': '50d',
            'Ash': '50d', 'Squall': '50d', 'Tornado': '50d'
        };

        const iconCode = iconMap[condition] || '01d';
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        weatherIcon.style.opacity = '0';
        weatherIcon.onload = () => {
            weatherIcon.style.transition = 'opacity 1s ease';
            weatherIcon.style.opacity = '1';
        };
    }

    function animateTemperature(target) {
        if (!tempElement || target === null || isNaN(target)) return;

        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            const currentVal = (start + (target - start) * easeOutExpo(progress)).toFixed(1);

            tempElement.textContent = `${currentVal}°C`;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    if (weatherCondition) {
        setWeatherIcon(weatherCondition);
        animateTemperature(targetTemp);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', () => {
            searchButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
            searchButton.style.pointerEvents = 'none';
            searchButton.style.opacity = '0.8';
        });
    }
});
// ════════════════════════════════════════════════════════════════════════════
//  SkyCast – Frontend Logic
//  Backend API: Hugging Face Space  →  /weather?city=<name>
//  Frontend:    Vercel static hosting
// ════════════════════════════════════════════════════════════════════════════

// ⚠️ Replace 'your-render-url' with your actual Render URL after deployment
// Dhyan rakhein, aapke pom.xml me context path '/Weather-web' set hai
const BACKEND_URL = 'https://weather-web-1-l5aa.onrender.com';

document.addEventListener('DOMContentLoaded', () => {

    // ── DOM references ────────────────────────────────────────────────────
    const container = document.querySelector('.mainContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const weatherContent = document.getElementById('weatherContent');
    const welcomeState = document.getElementById('welcomeState');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    const weatherIcon = document.getElementById('weather-icon');
    const tempValueEl = document.getElementById('tempValue');
    const cityNameEl = document.getElementById('cityName');
    const dateValueEl = document.getElementById('dateValue');
    const feelsLikeEl = document.getElementById('feelsLike');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('windSpeed');
    const pressureEl = document.getElementById('pressure');
    const visibilityEl = document.getElementById('visibility');
    const weatherCondEl = document.getElementById('weatherCondition');

    // ── Particle system ───────────────────────────────────────────────────
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles';
    document.body.appendChild(particleContainer);

    function createParticle() {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 1;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;
        p.style.opacity = Math.random() * 0.4;
        particleContainer.appendChild(p);

        const duration = Math.random() * 15000 + 10000;
        p.animate([
            { transform: 'translate(0, 0)', opacity: p.style.opacity },
            { transform: `translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 - 150}px)`, opacity: 0 }
        ], { duration, easing: 'linear' }).onfinish = () => {
            p.remove();
            createParticle();
        };
    }
    for (let i = 0; i < 40; i++) setTimeout(createParticle, Math.random() * 5000);

    // ── Liquid mouse glow ─────────────────────────────────────────────────
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.opacity = '1';
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        if (window.innerWidth > 500) {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
            document.body.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        }
    });

    // ── 3D tilt + parallax ────────────────────────────────────────────────
    let bounds;
    function rotateToMouse(e) {
        if (!container || window.innerWidth <= 500) return;
        if (!bounds) bounds = container.getBoundingClientRect();
        const center = {
            x: e.clientX - bounds.left - bounds.width / 2,
            y: e.clientY - bounds.top - bounds.height / 2
        };
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
        container.style.transform = `
            rotate3d(${center.y / 100}, ${-center.x / 100}, 0, ${Math.log(distance + 1) * 3}deg)
        `;
        container.querySelectorAll('.weatherIcon, .cityDetails, .additionalInfo')
            .forEach((el, i) => {
                const depth = (i + 1) * 20;
                el.style.transform = `translateZ(${60 + depth}px) translateX(${center.x / 40}px) translateY(${center.y / 40}px)`;
            });
    }

    if (container) {
        container.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 500) return;
            bounds = container.getBoundingClientRect();
            container.style.transition = 'none';
            document.addEventListener('mousemove', rotateToMouse);
        });
        container.addEventListener('mouseleave', () => {
            document.removeEventListener('mousemove', rotateToMouse);
            container.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            container.style.transform = '';
            container.querySelectorAll('.weatherIcon, .cityDetails, .additionalInfo')
                .forEach(el => el.style.transition = 'transform 0.8s ease');
            setTimeout(() => {
                container.querySelectorAll('.weatherIcon, .cityDetails, .additionalInfo')
                    .forEach(el => { el.style.transform = ''; el.style.transition = ''; });
            }, 800);
        });
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    const iconMap = {
        'Clouds': '03d', 'Clear': '01d', 'Rain': '10d', 'Drizzle': '09d',
        'Mist': '50d', 'Snow': '13d', 'Thunderstorm': '11d', 'Haze': '50d',
        'Smoke': '50d', 'Dust': '50d', 'Fog': '50d', 'Sand': '50d',
        'Ash': '50d', 'Squall': '50d', 'Tornado': '50d'
    };

    function setWeatherIcon(condition) {
        const code = iconMap[condition] || '01d';
        weatherIcon.src = `https://openweathermap.org/img/wn/${code}@4x.png`;
        weatherIcon.style.opacity = '0';
        weatherIcon.onload = () => {
            weatherIcon.animate([
                { opacity: 0, transform: 'scale(0.5) translateZ(100px)' },
                { opacity: 1, transform: 'scale(1)  translateZ(120px)' }
            ], { duration: 1500, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' });
        };
    }

    function animateTemperature(target) {
        if (!tempValueEl || target === null || isNaN(target)) return;
        const duration = 3000;
        const startTime = performance.now();
        function step(now) {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            tempValueEl.textContent = `${(target * eased).toFixed(1)}°C`;
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function showError(msg) {
        errorText.textContent = msg;
        errorMessage.style.display = 'flex';
        weatherContent.style.display = 'none';
        welcomeState.style.display = 'none';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function showLoading() {
        searchButton.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i>';
        searchButton.style.pointerEvents = 'none';
    }

    function resetButton() {
        searchButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
        searchButton.style.pointerEvents = 'auto';
    }

    // ── Fetch weather from Hugging Face backend ───────────────────────────
    async function fetchWeather(city) {
        if (!city || !city.trim()) return;

        showLoading();
        hideError();

        try {
            const res = await fetch(`${BACKEND_URL}?city=${encodeURIComponent(city.trim())}`);
            const data = await res.json();

            if (!res.ok || data.error) {
                showError(data.error || `Error ${res.status}: Unable to fetch weather.`);
                resetButton();
                return;
            }

            // Populate the UI
            cityNameEl.textContent = data.city;
            dateValueEl.textContent = data.date;
            feelsLikeEl.textContent = `${data.feelsLike}°C`;
            humidityEl.textContent = `${data.humidity}%`;
            windSpeedEl.textContent = `${data.windSpeed} km/h`;
            pressureEl.textContent = `${data.pressure} hPa`;
            visibilityEl.textContent = `${data.visibility} km`;
            weatherCondEl.textContent = data.weatherCondition;

            setWeatherIcon(data.weatherCondition);
            animateTemperature(data.temperature);

            // Show results, hide welcome
            welcomeState.style.display = 'none';
            weatherContent.style.display = 'block';

        } catch (err) {
            showError('Network error – could not reach the weather service.');
            console.error(err);
        } finally {
            resetButton();
        }
    }

    // ── Event listeners ───────────────────────────────────────────────────
    searchButton.addEventListener('click', () => {
        fetchWeather(searchInput.value);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fetchWeather(searchInput.value);
    });

});
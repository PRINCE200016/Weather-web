document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.mainContainer');
    const weatherIcon = document.getElementById("weather-icon");
    const wcInput = document.getElementById("wc");
    const weatherCondition = wcInput ? wcInput.value : null;
    const tempElement = document.getElementById("tempValue");
    const targetTemp = document.getElementById("currentTemp") ? parseFloat(document.getElementById("currentTemp").value) : null;
    const searchForm = document.querySelector(".searchInput");
    const searchButton = document.getElementById("searchButton");

    // --- ENHANCED PARTICLE SYSTEM ---
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

    // --- LIQUID MOUSE GLOW ---
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.opacity = '1';
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

        // Background Morph logic
        if (window.innerWidth > 500) {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
            document.body.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        }
    });

    // --- ENHANCED 3D TILT WITH LAYER PARALLAX ---
    let bounds;
    function rotateToMouse(e) {
        if (!container || window.innerWidth <= 500) return;
        if (!bounds) bounds = container.getBoundingClientRect();

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.left;
        const topY = mouseY - bounds.top;
        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };
        const distance = Math.sqrt(Math.pow(center.x, 2) + Math.pow(center.y, 2));

        // Tilt the card
        container.style.transform = `
            rotate3d(
                ${center.y / 100},
                ${-center.x / 100},
                0,
                ${Math.log(distance + 1) * 3}deg
            )
        `;

        // Parallax internal elements based on tilt
        const parallaxElements = container.querySelectorAll('.weatherIcon, .cityDetails, .additionalInfo');
        parallaxElements.forEach((el, i) => {
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

            // Reset internal parallax
            container.querySelectorAll('.weatherIcon, .cityDetails, .additionalInfo')
                .forEach(el => el.style.transition = 'transform 0.8s ease');
            setTimeout(() => {
                container.querySelectorAll('.weatherIcon, .cityDetails, .additionalInfo')
                    .forEach(el => {
                        el.style.transform = '';
                        el.style.transition = '';
                    });
            }, 800);
        });
    }

    // --- WEATHER & SEARCH LOGIC ---
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
            weatherIcon.animate([
                { opacity: 0, transform: 'scale(0.5) translateZ(100px)' },
                { opacity: 1, transform: 'scale(1) translateZ(120px)' }
            ], { duration: 1500, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' });
        };
    }

    function animateTemperature(target) {
        if (!tempElement || target === null || isNaN(target)) return;
        let start = 0;
        const duration = 3000;
        const startTime = performance.now();
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            tempElement.textContent = `${(start + (target - start) * easeOutExpo(progress)).toFixed(1)}°C`;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (weatherCondition) {
        setWeatherIcon(weatherCondition);
        animateTemperature(targetTemp);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', () => {
            searchButton.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i>';
            searchButton.style.pointerEvents = 'none';
        });
    }
});
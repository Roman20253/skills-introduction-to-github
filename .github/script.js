const colors = ["#ff6f91", "#ff9671", "#ffc75f", "#f9f871", "#ff4c4c", "#ffcc00"];
const letters = "I LOVE YOU"; // Mensaje que aparecerá en la explosión
let letterIndex = 0;

// Obtener la siguiente letra en secuencia
function getNextLetter() {
    const letter = letters.charAt(letterIndex);
    letterIndex = (letterIndex + 1) % letters.length; // Ciclo del mensaje
    return letter;
}

// Crear un fuego artificial en la posición dada
function createFirework(x, y) {
    const launchHeight = Math.random() * (window.innerHeight / 4) + window.innerHeight / 4;
    const projectile = document.createElement("div");
    projectile.classList.add("projectile");
    document.body.appendChild(projectile);
    projectile.style.left = `${x}px`;
    projectile.style.top = `${y}px`;

    anime({
        targets: projectile,
        translateY: -launchHeight,
        duration: 1200,
        easing: "easeOutQuad",
        complete: () => {
            projectile.remove();
            createExplosion(x, y - launchHeight);
        },
    });
}

// Crear la explosión con letras y chispas
function createExplosion(x, y) {
    const numLetters = 10; // Letras en la explosión
    const numSparkles = 30; // Chispas adicionales

    for (let i = 0; i < numLetters; i++) {
        createParticle(x, y, false);
    }

    for (let i = 0; i < numSparkles; i++) {
        createParticle(x, y, true);
    }
}

// Crear partículas individuales (letras o chispas)
function createParticle(x, y, isSparkle) {
    const el = document.createElement("div");
    el.classList.add(isSparkle ? "sparkle" : "particle");
    document.querySelector(".instructions").style.display = "none";

    if (!isSparkle) {
        el.textContent = getNextLetter();
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
    } else {
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    animateParticle(el, isSparkle);
}

// Animar las partículas
function animateParticle(el, isSparkle) {
    const angle = Math.random() * Math.PI * 2;
    const distance = anime.random(100, 200);
    const duration = anime.random(1200, 2000);
    const fallDistance = anime.random(20, 80);
    const scale = isSparkle ? Math.random() * 0.5 + 0.5 : Math.random() * 1 + 0.5;

    anime
        .timeline({
            targets: el,
            easing: "easeOutCubic",
            duration: duration,
            complete: () => el.remove(),
        })
        .add({
            translateX: Math.cos(angle) * distance,
            translateY: Math.sin(angle) * distance,
            scale: [0, scale],
            opacity: [1, 0.9],
        })
        .add({
            translateY: `+=${fallDistance}px`,
            opacity: [0.9, 0],
            easing: "easeInCubic",
            duration: duration / 2,
        });
}

// Evento para crear un fuego artificial en cada clic
document.addEventListener("click", (e) => {
    createFirework(e.clientX, e.clientY);
});

// Crear un fuego artificial automático al cargar la página
window.onload = function () {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    createFirework(centerX, centerY);
};

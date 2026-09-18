const visitTime = new Date((new Date).setSeconds(0, 0)).getTime();
let previousValues = {};

function setScrollValue() {
    document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    document.documentElement.style.setProperty("--scroll-y-percent", window.scrollY / window.innerHeight);
    document.documentElement.classList.toggle("scrolled", window.scrollY > 0);
}

function setClock() {
    const now = new Date();

    const { year, month, day, hour, minute, second } = (() => {
        const parts = {};
        new Intl.DateTimeFormat([], {
            timeZone: "Europe/Moscow",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
            day: "numeric",
            month: "numeric",
            year: "numeric"
        }).formatToParts(new Date()).forEach(({ type, value }) => {
            if (type !== "literal") {
                parts[type] = Number(value);
            }
        });
        return parts;
    })();

    const localOffsetHours = -now.getTimezoneOffset() / 60;
    const localMidnight = new Date(now.getTime() - now.getTime() % 1000 - 60 * localOffsetHours * 60 * 1000);
    const moscowOffsetHours = (new Date(year, month - 1, day, hour, minute, second) - localMidnight) / 1000 / 60 / 60;
    const timezoneDiff = moscowOffsetHours - localOffsetHours;
    const elapsedMs = now.getTime() - visitTime;

    updateElement("hour-hand", `rotate(${hour % 12 / 12 * 360 + minute / 60 * 30 + second / 60 / 60 * 30}deg)`);
    updateElement("minute-hand", `rotate(${minute / 60 * 360 + second / 60 * 6}deg)`);
    updateElement("second-hand", `rotate(${360 * Math.floor(elapsedMs / 60 / 1000) + second / 60 * 360}deg)`);

    updateElement("#date", new Date(now.getTime() + 60 * timezoneDiff * 60 * 1000).toLocaleDateString());
    updateElement("#hour", hour.toString().padStart(2, "0"));
    updateElement("#minute", minute.toString().padStart(2, "0"));
    updateElement("#second", second.toString().padStart(2, "0"));

    updateElement("#timezone-diff",
        timezoneDiff === 0
            ? ""
            : timezoneDiff > 0
                ? `${formatTimezoneDiff(timezoneDiff)} ahead`
                : `${formatTimezoneDiff(-timezoneDiff)} behind`
    );

    updateElement("#utc-offset", `   UTC ${moscowOffsetHours >= 0 ? "+" : ""}${Math.floor(moscowOffsetHours)}:${(moscowOffsetHours % 1 * 60).toString().padStart(2, "0")}`);
}

function updateElement(selector, value) {
    if (previousValues[selector] != value) {
        if (value.includes("rotate")) {
            document.querySelector(selector).style.transform = value;
        } else {
            document.querySelector(selector).innerHTML = value;
        }
        previousValues[selector] = value;
    }
}

function formatTimezoneDiff(hours) {
    if (hours < 0) return `-${formatTimezoneDiff(-hours)}`;
    const minutes = hours % 1 * 60;
    hours = Math.floor(hours);
    return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function setSquareSizeAndGap() {
    const grid = document.querySelector("bento-grid");
    const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    const gap = parseInt(getComputedStyle(grid).columnGap);
    const squareSize = (grid.offsetWidth - gap * (columns - 1)) / columns;

    grid.style.setProperty("--square-size", `${squareSize}px`);
    grid.style.setProperty("--gap", `${gap}px`);
}

// Scroll
setScrollValue();
window.addEventListener("scroll", setScrollValue);
window.addEventListener("resize", setScrollValue);

// Down arrow smooth scroll
document.querySelector("down-arrow svg").addEventListener("click", () => {
    const targetY = 0.3 * window.innerHeight;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function animate() {
        const progress = (performance.now() - startTime) / 300;
        const eased = (() => {
            let t = progress;
            return --t * t * t + 1;
        })();

        window.scrollTo({ top: startY + distance * eased });
        if (progress < 1) requestAnimationFrame(animate);
    }
    animate();
});

// Clock
setClock();
setInterval(setClock, 1000);

// Bento grid sizing
setSquareSizeAndGap();
window.addEventListener("resize", setSquareSizeAndGap);

// Parallax background on mouse move
document.addEventListener("mousemove", ({ clientX, clientY }) => {
    document.querySelector("background-filter").style.setProperty(
        "--tx",
        20 * (clientX - window.innerWidth / 2) / window.innerWidth + "px"
    );
    document.querySelector("background-filter").style.setProperty(
        "--ty",
        20 * (clientY - window.innerHeight / 2) / window.innerHeight + "px"
    );
});

document.addEventListener("mouseleave", () => {
    document.querySelector("background-filter").style.setProperty("--tx", "0px");
    document.querySelector("background-filter").style.setProperty("--ty", "0px");
});

// Touch device detection
window.addEventListener("touchstart", () => {
    document.body.classList.add("touch-device");
}, { once: true });

// Minecraft skin viewer
const skinViewer = new skinview3d.SkinViewer({
    canvas: document.getElementById("skin"),
    skin: "https://mc-heads.net/skin/Jorik_Smith",
    model: "default",
    animation: new skinview3d.IdleAnimation,
    zoom: 0.80
});
skinViewer.controls.enableZoom = false;
skinViewer.autoRotate = true;

function setSkinSize() {
    const card = document.querySelector("widget-card-model");
    skinViewer.setSize(card.clientWidth, card.clientHeight);
}

setSkinSize();
window.addEventListener("resize", setSkinSize);

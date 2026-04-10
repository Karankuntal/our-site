const fileInput = document.getElementById("fileInput");
const orbitSystem = document.getElementById("orbitSystem");
let activeMediaWrapper = null;

// FETCH IMAGES/VIDEOS FROM SERVER (PERMANENT LOAD)
fetch('/api/images')
  .then(res => res.json())
  .then(files => {
    files.forEach(file => {
        createFloatingMedia(file.url, file.public_id);
    });
  });

function openUpload(){
    fileInput.click();
}

// CREATE FLOATING MEDIA (IMAGE / VIDEO)
function createFloatingMedia(url, publicId) {
    let element;

    if (
        url.endsWith(".mp4") ||
        url.endsWith(".webm") ||
        url.endsWith(".ogg") ||
        url.includes("video/upload")
    ) {
        element = document.createElement("video");
        element.src = url;
        element.controls = true;
        element.onclick = () => openVideo(url, element);
    } else {
        element = document.createElement("img");
        element.src = url;
        element.onclick = () => openImage(url, element);
    }

    element.className = "media";

    // 🔥 IMPORTANT: store cloudinary id for delete
    element.dataset.publicId = publicId;

    orbitSystem.appendChild(element);
    startFloating(element);
}

// UPLOAD FILES
fileInput.addEventListener("change", function () {
    for (let file of this.files) {

        const reader = new FileReader();
        reader.onload = (e) => {
            createFloatingMedia(e.target.result, null); // temporary preview
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("image", file);

        fetch("/api/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.url && data.public_id) {
                createFloatingMedia(data.url, data.public_id);
            }
        })
        .catch(err => console.error("Upload failed:", err));
    }
});

// FLOATING ANIMATION
function startFloating(element){
    let x = Math.random() * (window.innerWidth - 120);
    let y = Math.random() * (window.innerHeight - 120);
    let dx = (Math.random() * 1 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
    let dy = (Math.random() * 1 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
    let rotation = 0;
    let trailTimer = 0;

    element.style.position = "fixed";

    function animate(){
        x += dx;
        y += dy;
        rotation += 0.2;

        if (x <= 0 || x >= window.innerWidth - element.offsetWidth) dx *= -1;
        if (y <= 0 || y >= window.innerHeight - element.offsetHeight) dy *= -1;

        element.style.transform =
            `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

        trailTimer++;
        if (trailTimer % 15 === 0) createTrail(x, y);

        requestAnimationFrame(animate);
    }

    animate();
}

// UPWARD HEARTS ANIMATION
function spawnUpwardHeart(type) {
    const heart = document.createElement("div");

    if (type === "gold") {
        heart.className = "goldHeart3D";
        heart.innerHTML = "💛";
    } else if (type === "red") {
        heart.className = "redHeart3D";
        heart.innerHTML = "❤️";
    } else {
        heart.className = "sparkleHeart";
        heart.innerHTML = "❤️";
    }

    document.body.appendChild(heart);

    let x = Math.random() * (window.innerWidth - 50);
    let y = window.innerHeight + 50;

    heart.style.left = x + "px";
    heart.style.top = y + "px";

    const duration = 10000;
    const startTime = performance.now();

    function animate(time) {
        const progress = (time - startTime) / duration;

        heart.style.top =
            (window.innerHeight - progress * (window.innerHeight + 100)) + "px";

        heart.style.opacity = Math.min(progress + 0.2, 1);

        heart.style.transform =
            `translateX(${10 * Math.sin(progress * Math.PI * 4)}px)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            heart.remove();
        }
    }

    requestAnimationFrame(animate);
}

// HEART SPAWN LOOP
setInterval(() => {
    const types = ["gold", "red", "sparkle"];
    const choice = types[Math.floor(Math.random() * types.length)];
    spawnUpwardHeart(choice);
}, 800);

// FULLSCREEN VIEWER
function openImage(src, element){
    activeMediaWrapper = element;
    const viewer = document.getElementById("fullscreenViewer");
    const img = document.getElementById("viewerImage");
    const video = document.getElementById("viewerVideo");

    video.style.display = "none";
    img.style.display = "block";
    img.src = src;

    viewer.style.display = "flex";
}

function openVideo(src, element){
    activeMediaWrapper = element;
    const viewer = document.getElementById("fullscreenViewer");
    const img = document.getElementById("viewerImage");
    const video = document.getElementById("viewerVideo");

    img.style.display = "none";
    video.style.display = "block";
    video.src = src;
    video.play();

    viewer.style.display = "flex";
}

function closeViewer(){
    const viewer = document.getElementById("fullscreenViewer");
    const video = document.getElementById("viewerVideo");

    video.pause();
    viewer.style.display = "none";
}

// TRAIL HEARTS
function createTrail(x, y){
    let trail = document.createElement("div");
    trail.innerHTML = "💖";
    trail.className = "trailHeart";
    trail.style.left = x + "px";
    trail.style.top = y + "px";

    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 1000);
}

// DELETE (Cloudinary + UI)
const deleteBtn = document.getElementById("deleteMediaBtn");

if (deleteBtn) {
    deleteBtn.onclick = function (e) {
        e.stopPropagation();

        if (activeMediaWrapper) {
            const publicId = activeMediaWrapper.dataset.publicId;

            activeMediaWrapper.remove();

            if (publicId) {
                fetch("/api/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ public_id: publicId })
                })
                .then(res => res.json())
                .then(data => console.log("Deleted:", data))
                .catch(err => console.error("Delete error:", err));
            }
        }

        closeViewer();
    };
}
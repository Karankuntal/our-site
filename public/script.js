const fileInput = document.getElementById("fileInput");
const orbitSystem = document.getElementById("orbitSystem");
let activeMediaWrapper = null; 

// FETCH IMAGES/VIDEOS FROM SERVER
fetch('/api/images')
  .then(res => res.json())
  .then(files => {
    files.forEach(file => {
        createFloatingMedia(file.url);
    });
  });

function openUpload(){
    fileInput.click();
}

// CREATE FLOATING MEDIA (IMAGES OR VIDEOS)
function createFloatingMedia(url) {
    let element;
    if(url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.includes("video/upload")) {
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
    orbitSystem.appendChild(element);
    startFloating(element);
}

/* FILE UPLOAD TO SERVER */
fileInput.addEventListener("change", function(){
    for(let file of this.files){
        // Show immediately
        const reader = new FileReader();
        reader.onload = function(e) {
            createFloatingMedia(e.target.result);
        }
        reader.readAsDataURL(file);

        // Then upload
        const formData = new FormData();
        formData.append('image', file);
        fetch('/api/upload', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => console.log("Uploaded:", data))
          .catch(err => console.error("Upload failed:", err));
    }
});

// FLOATING/BOUNCING MEDIA
function startFloating(element){
    let x=Math.random()*(window.innerWidth-120);
    let y=Math.random()*(window.innerHeight-120);
    let dx=(Math.random()*1+0.5)*(Math.random()>0.5?1:-1);
    let dy=(Math.random()*1+0.5)*(Math.random()>0.5?1:-1);
    let rotation=0;
    let trailTimer=0;

    element.style.position = "fixed";

    function animate(){
        x+=dx; y+=dy; rotation+=0.2;
        if(x<=0 || x>=window.innerWidth-element.offsetWidth) dx*=-1;
        if(y<=0 || y>=window.innerHeight-element.offsetHeight) dy*=-1;
        element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
        trailTimer++;
        if(trailTimer%15===0) createTrail(x,y);
        requestAnimationFrame(animate);
    }
    animate();
}

/* --- REQUIRED CHANGES: FLOATING UPWARD HEARTS --- */
function spawnUpwardHeart(type) {
    const heart = document.createElement("div");

    if(type === "gold") {
        heart.className = "goldHeart3D";
        heart.innerHTML = "💛";
    } else if(type === "red") {
        heart.className = "redHeart3D";
        heart.innerHTML = "❤️";
    } else if(type === "sparkle") {
        heart.className = "sparkleHeart";
        heart.innerHTML = "❤️";
    }

    document.body.appendChild(heart);

    let x = Math.random() * (window.innerWidth - 50);
    let y = window.innerHeight + 50; // start below screen
    heart.style.left = x + "px";
    heart.style.top = y + "px";

    const duration = 10000; // 10 seconds
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = elapsed / duration;

        heart.style.top = (window.innerHeight - progress * (window.innerHeight + 100)) + "px";
        heart.style.opacity = Math.min(progress + 0.2, 1);

        // Optional sway
        heart.style.transform = `translateX(${10 * Math.sin(progress * Math.PI * 4)}px)`;

        if(elapsed < duration) {
            requestAnimationFrame(animate);
        } else {
            heart.remove();
        }
    }

    requestAnimationFrame(animate);
}

// Spawn hearts randomly every 0.8s
setInterval(() => {
    const types = ["gold", "red", "sparkle"];
    const choice = types[Math.floor(Math.random() * types.length)];
    spawnUpwardHeart(choice);
}, 800);

/* FULLSCREEN VIEWER FUNCTIONS */
function openImage(src,element){
    activeMediaWrapper = element;
    const viewer=document.getElementById("fullscreenViewer");
    const img=document.getElementById("viewerImage");
    const video=document.getElementById("viewerVideo");
    video.style.display="none";
    img.style.display="block";
    img.src=src;
    viewer.style.display="flex";
}

function openVideo(src,element){
    activeMediaWrapper = element;
    const viewer=document.getElementById("fullscreenViewer");
    const img=document.getElementById("viewerImage");
    const video=document.getElementById("viewerVideo");
    img.style.display="none";
    video.style.display="block";
    video.src = src;
    video.play();
    viewer.style.display = "flex";
}

function closeViewer(){
    const viewer=document.getElementById("fullscreenViewer");
    const video=document.getElementById("viewerVideo");
    video.pause();
    viewer.style.display="none";
}

// TRAIL HEARTS
function createTrail(x,y){
    let trail=document.createElement("div");
    trail.innerHTML="💖";
    trail.className="trailHeart";
    trail.style.left=x+"px";
    trail.style.top=y+"px";
    document.body.appendChild(trail);
    setTimeout(()=>trail.remove(),1000);
}

// DELETE MEDIA BUTTON
const deleteBtn = document.getElementById("deleteMediaBtn");
if(deleteBtn){
    deleteBtn.onclick = function(e){
        e.stopPropagation();
        if(activeMediaWrapper) activeMediaWrapper.remove();
        closeViewer();
    };
}
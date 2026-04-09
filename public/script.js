const fileInput = document.getElementById("fileInput");
const orbitSystem = document.getElementById("orbitSystem");
let activeMediaWrapper = null; 

// FIXED: Updated path to /api/images for Vercel
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
        const formData = new FormData();
        formData.append('image', file);

        // FIXED: Updated path to /api/upload for Vercel
        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if(data.url) {
                createFloatingMedia(data.url);
            }
        })
        .catch(err => console.error("Upload failed:", err));
    }
});

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

/* --- REQUIRED CHANGES START HERE --- */

/* FLOATING HEARTS WITH SPARKLES (Fixed for 15s) */
setInterval(() => {
    const heart = document.createElement("div");
    
    // Combining sparkles with the hearts as requested
    const types = [
        { char: "✨💛", class: "goldHeart3D" },
        { char: "✨❤️", class: "redHeart3D" }
    ];
    const choice = types[Math.floor(Math.random() * types.length)];

    heart.className = choice.class;
    heart.innerHTML = choice.char;
    
    // Random position across the bottom
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = "100vh"; 

    document.body.appendChild(heart);

    // Keep them on screen for the full 15s animation set in CSS
    setTimeout(() => {
        heart.remove();
    }, 15000); 

}, 1200); // Spawns every 1.2 seconds to avoid clutter

/* --- REQUIRED CHANGES END HERE --- */


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

function createTrail(x,y){
    let trail=document.createElement("div");
    trail.innerHTML="💖";
    trail.className="trailHeart";
    trail.style.left=x+"px";
    trail.style.top=y+"px";
    document.body.appendChild(trail);
    setTimeout(()=>trail.remove(),1000);
}

const deleteBtn = document.getElementById("deleteMediaBtn");
if(deleteBtn){
    deleteBtn.onclick = function(e){
        e.stopPropagation();
        if(activeMediaWrapper) activeMediaWrapper.remove();
        closeViewer();
    };
}

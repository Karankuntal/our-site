let activeMediaWrapper = null; 
// Load previously uploaded files from server and float them
fetch('/images')
  .then(res => res.json())
  .then(files => {
    files.forEach(file => {
      if(file.url.endsWith(".mp4") || file.url.endsWith(".webm") || file.url.endsWith(".ogg")) {
        let video = document.createElement("video");
        video.src = file.url;
        video.controls = true;
        video.className = "media";
        video.onclick = () => openVideo(video.src);
        orbitSystem.appendChild(video);
        startFloating(video);
      } else {
        let img = document.createElement("img");
        img.src = file.url;
        img.className = "media";
        img.decoding = "async";
        img.onclick = () => openImage(img.src);
        orbitSystem.appendChild(img);
        startFloating(img);
      }
    });
  });
const fileInput = document.getElementById("fileInput");
const orbitSystem = document.getElementById("orbitSystem");

function openUpload(){
fileInput.click();
}

/* FILE UPLOAD */

fileInput.addEventListener("change",function(){

for(let file of this.files){

/* IMAGE */

if(file.type.startsWith("image")){

const reader = new FileReader();

reader.onload=function(e){

let img=document.createElement("img");

img.src=e.target.result;
img.className="media";
img.decoding = "async";

img.onclick=()=>openImage(img.src);

orbitSystem.appendChild(img);

startFloating(img);

};

reader.readAsDataURL(file);
}

/* VIDEO */

if(file.type.startsWith("video")){

let video=document.createElement("video");

video.src=URL.createObjectURL(file);
video.controls=true;
video.className="media";
video.preservesPitch = false; 

video.onclick=()=>openVideo(video.src);

orbitSystem.appendChild(video);

startFloating(video);

}

}

});


/* SMOOTH FLOATING + BOUNCE */

function startFloating(element){

let x=Math.random()*(window.innerWidth-120);
let y=Math.random()*(window.innerHeight-120);

let dx=(Math.random()*1+0.5)*(Math.random()>0.5?1:-1);
let dy=(Math.random()*1+0.5)*(Math.random()>0.5?1:-1);

let rotation=0;
let trailTimer=0;

element.style.position = "fixed";
element.style.left = "0px";
element.style.top = "0px";
element.style.willChange = "transform";


function animate(){

x+=dx;
y+=dy;
rotation+=0.2;

/* BOUNCE */

if(x<=0 || x>=window.innerWidth-element.offsetWidth){
dx*=-1;
}

if(y<=0 || y>=window.innerHeight-element.offsetHeight){
dy*=-1;
}

/* APPLY POSITION */
element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

/* HEART TRAIL (reduced frequency) */

trailTimer++;

if(trailTimer%15===0){
createTrail(x,y);
}

/* NEXT FRAME */

requestAnimationFrame(animate);

}

animate();

}


/* FLOATING BACKGROUND HEARTS */

setInterval(()=>{

let heart=document.createElement("div");

heart.className="heart";

heart.innerHTML=Math.random()>0.5?"❤️":"💖";

heart.style.left=Math.random()*100+"%";

document.body.appendChild(heart);

setTimeout(()=>{
heart.remove();
},6000);

},100);


/* FLOATING GOLD HEARTS */

setInterval(()=>{

let heart=document.createElement("div");

heart.className="goldHeart3D";

heart.innerHTML="💛";

heart.style.left=Math.random()*100+"vw";
heart.style.top=Math.random()*100+"vh";

document.body.appendChild(heart);

setTimeout(()=>{
heart.remove();
},8000);

},500);


/* FULLSCREEN IMAGE */

function openImage(src){

const viewer=document.getElementById("fullscreenViewer");
const img=document.getElementById("viewerImage");
const video=document.getElementById("viewerVideo");

video.style.display="none";
img.style.display="block";

img.src=src;

viewer.style.display="flex";

}


/* FULLSCREEN VIDEO */

function openVideo(src){

const viewer=document.getElementById("fullscreenViewer");
const img=document.getElementById("viewerImage");
const video=document.getElementById("viewerVideo");

img.style.display="none";
video.style.display="block";

video.src=src;

viewer.style.display="flex";

}


/* CLOSE VIEWER */

function closeViewer(){

document.getElementById("fullscreenViewer").style.display="none";

}


/* HEART TRAIL */

function createTrail(x,y){

let trail=document.createElement("div");

trail.innerHTML="💖";

trail.className="trailHeart";

trail.style.left=x+"px";
trail.style.top=y+"px";

document.body.appendChild(trail);

setTimeout(()=>{
trail.remove();
},1000);

}

const visitTime=new Date((new Date).setSeconds(0,0)).getTime();let previousValues={};function setScrollValue(){document.documentElement.style.setProperty("--scroll-y",`${window.scrollY}px`),document.documentElement.style.setProperty("--scroll-y-percent",window.scrollY/window.innerHeight),document.documentElement.classList.toggle("scrolled",window.scrollY>0)}function setClock(){const e=new Date,{year:t,month:n,day:o,hour:r,minute:i,second:a}=(()=>{const e={};return new Intl.DateTimeFormat([],{timeZone:"Europe/Moscow",hour:"numeric",minute:"numeric",second:"numeric",hour12:!1,day:"numeric",month:"numeric",year:"numeric"}).formatToParts(new Date).forEach((({type:t,value:n})=>{"literal"!==t&&(e[t]=Number(n))})),e})(),l=-e.getTimezoneOffset()/60,s=new Date(e.getTime()-e.getTime()%1e3-60*l*60*1e3),c=(new Date(t,n-1,o,r,i,a)-s)/1e3/60/60,d=c-l,u=e.getTime()-visitTime;updateElement("hour-hand",`rotate(${r%12/12*360+i/60*30+a/60/60*30}deg)`);updateElement("minute-hand",`rotate(${i/60*360+a/60*6}deg)`);updateElement("second-hand",`rotate(${360*Math.floor(u/60/1e3)+a/60*360}deg)`);updateElement("#date",new Date(e.getTime()+60*d*60*1e3).toLocaleDateString());updateElement("#hour",r.toString().padStart(2,"0"));updateElement("#minute",i.toString().padStart(2,"0"));updateElement("#second",a.toString().padStart(2,"0"));updateElement("#timezone-diff",0===d?"same time":d>0?`${formatTimezoneDiff(d)} ahead`:`${formatTimezoneDiff(-d)} behind`);updateElement("#utc-offset",` / UTC ${c>=0?"+":""}${Math.floor(c)}:${(c%1*60).toString().padStart(2,"0")}`)}function updateElement(e,t){previousValues[e]!=t&&(t.includes("rotate")?document.querySelector(e).style.transform=t:document.querySelector(e).innerHTML=t,previousValues[e]=t)}function formatTimezoneDiff(e){if(e<0)return`-${formatTimezoneDiff(-e)}`;const t=e%1*60;return e=Math.floor(e),t?`${e}h ${t}m`:`${e}h`}function setSquareSizeAndGap(){const e=document.querySelector("bento-grid"),t=getComputedStyle(e).gridTemplateColumns.split(" ").length,n=parseInt(getComputedStyle(e).columnGap),o=(e.offsetWidth-n*(t-1))/t;e.style.setProperty("--square-size",`${o}px`),e.style.setProperty("--gap",`${n}px`)}setScrollValue(),window.addEventListener("scroll",setScrollValue),window.addEventListener("resize",setScrollValue),document.querySelector("down-arrow svg").addEventListener("click",(()=>{const e=.3*window.innerHeight,t=window.scrollY,n=e-t,o=performance.now();!function e(){const r=(performance.now()-o)/300,i=(a=r,--a*a*a+1);var a;window.scrollTo({top:t+n*i}),r<1&&requestAnimationFrame(e)}()})),setClock(),setInterval(setClock,1e3),setSquareSizeAndGap(),window.addEventListener("resize",setSquareSizeAndGap),document.addEventListener("mousemove",(({clientX:e,clientY:t})=>{document.querySelector("background-filter").style.setProperty("--tx",20*(e-window.innerWidth/2)/window.innerWidth+"px"),document.querySelector("background-filter").style.setProperty("--ty",20*(t-window.innerHeight/2)/window.innerHeight+"px")})),document.addEventListener("mouseleave",(()=>{document.querySelector("background-filter").style.setProperty("--tx","0px"),document.querySelector("background-filter").style.setProperty("--ty","0px")})),window.addEventListener("touchstart",(()=>{document.body.classList.add("touch-device")}),{once:!0}),document.querySelectorAll("project-card").forEach((async e=>{const t=e.querySelector("a").getAttribute("href");if(!t.startsWith("https://github.com/"))return;const{star:n,fork:o}=await(await fetch(`/repos/${t.slice(19)}`)).json();e.querySelector("project-meta").insertAdjacentHTML("afterbegin",`\n    <project-star>\n        <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em">\n            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>\n            <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" stroke-width="0" fill="currentColor"></path>\n        </svg>${n??"-"}\n    </project-star>\n    <project-fork>\n        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em">\n            <g>\n                <path fill="none" d="M0 0h24v24H0z"></path>\n                <path d="M7.105 15.21A3.001 3.001 0 1 1 5 15.17V8.83a3.001 3.001 0 1 1 2 0V12c.836-.628 1.874-1 3-1h4a3.001 3.001 0 0 0 2.895-2.21 3.001 3.001 0 1 1 2.032.064A5.001 5.001 0 0 1 14 13h-4a3.001 3.001 0 0 0-2.895 2.21z"></path>\n            </g>\n        </svg>${o??"-"}\n    </project-fork>`)}));

// JavaScript код для создания 3D-сцены скина
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(500, 500); // Задайте размеры рендерера
document.getElementById("skin-widget").appendChild(renderer.domElement);

const loader = new THREE.ObjectLoader();
loader.load(
  "images/model.obj",
  function (object) {
    scene.add(object);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.z = 5; // Расположение камеры

const light = new THREE.DirectionalLight(0xff0000); // red направленный свет
light.position.set(1, 1, 1).normalize();
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  // Здесь можно добавить анимацию, если нужно
  renderer.render(scene, camera);
}

animate();

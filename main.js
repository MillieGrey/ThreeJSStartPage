import './style.css'
import * as THREE from 'three'
import { STLLoader } from './loaders/STLLoader.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

//renderer and camera definition
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.position.setZ(30);
camera.position.setY(10);
camera.position.setX(0);

renderer.render(scene, camera);

//fog
scene.fog = new THREE.Fog( 0x3E2A35, 1, 60 );

//background
const backgroundImg = new THREE.TextureLoader().load('1454968727969.jpg');
scene.background = backgroundImg;


let object;

  //stl loader
  const loader = new STLLoader();
  loader.load( './models/Body88.stl', function ( geometry ) {
    const material = new THREE.MeshStandardMaterial( {color: 0x888888} ); 
    var mesh =  new THREE.Mesh (geometry, material);
    object = mesh
    mesh.position.set(0,0,-5)
    mesh.rotation.set(0,0,0)
    mesh.scale.set(.2,.2,.2)
    mesh.castShadow = true;
    scene.add(mesh)
    animate()
});


//this function makes dots in random places. its neat but i didn't make it
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );

  star.position.set(x,y,z);
  scene.add(star)
}

Array(300).fill().forEach(addStar)



//torus mesh
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// const material = new THREE.MeshStandardMaterial( {color: 0xff6347} ); 
// const torus =  new THREE.Mesh (geometry, material);

// scene.add(torus)

// Ground

const plane = new THREE.Mesh(
	new THREE.PlaneGeometry( 500, 200 ),
	new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } ));
plane.rotation.x = - Math.PI / 2;
plane.position.y = - 0.5;
scene.add( plane );
plane.receiveShadow = true;

//lights
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(15,20,10)
scene.add(pointLight)

//Create a DirectionalLight and turn on shadows for the light
const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 20, -5 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default


//helpers (they show you what must not be seen)
//const pointLightHelper = new THREE.PointLightHelper(pointLight)
//const helper = new THREE.CameraHelper( pointLight.shadow.camera );
//scene.add(pointLightHelper );


//game/animation loop
function animate(){
  requestAnimationFrame(animate);

  // torus.rotation.y += 0.01
  object.rotation.y += 0.02


  renderer.render(scene, camera);
}



// const getWeather = async () => {
//   const response = await fetch('api.openweathermap.org/data/2.5/weather?q=Winnipeg&appid={80c28bd5ebd669b3c27a1f010c50567e}')
//   const weatherJSON = await response.json();

// }

// function weatherBalloon() {
//   fetch('api.openweathermap.org/data/2.5/weather?q=Winnipeg&appid=80c28bd5ebd669b3c27a1f010c50567e')
//   .then(function(response) { return response.json() }) // Convert data to json
//   .then(function(data) {
//     console.log(data);
//   })
//   .catch(function() {
//     // catch any errors
//   });
// }

function weatherBalloon( cityID ) {
  var key = '80c28bd5ebd669b3c27a1f010c50567e';
  fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    console.log(data);
    drawWeather(data)
  })
  .catch(function() {
    // catch any errors
  });
}

window.onload = function() {
  weatherBalloon( 6183235 );
}

function drawWeather( d ) {
	var celcius = Math.round(parseFloat(d.main.temp)-273.15);

	document.getElementById('description').innerHTML = d.weather[0].description;
	document.getElementById('temp').innerHTML = celcius + '&deg;';
	document.getElementById('wind').innerHTML = d.wind.speed + ' km/h';
}

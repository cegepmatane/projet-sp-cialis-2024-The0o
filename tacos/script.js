var elementSelected = "viande"

document.getElementById("salade").addEventListener("click", newElementSelected)
document.getElementById("tomate").addEventListener("click", newElementSelected)
document.getElementById("viande").addEventListener("click", newElementSelected)
document.getElementById("gruyere").addEventListener("click", newElementSelected)

document.getElementById("formerTacosBouton").addEventListener("click", newTacos)

document.getElementById("cuissonTacos").addEventListener("mousedown", startTimerCuisson);
document.getElementById("cuissonTacos").addEventListener("mouseup", stopTimer);
var intervalId;
var temps = 0; //en dixieme de seconde pour + de precision
let timerInterval;
let startTime = 0;

function showRegles() {
    if (document.getElementById("popup").style.display === "block") {
        document.getElementById("popup").style.display = "none"
    }
    else {
        document.getElementById("popup").style.display = "block"
    }
}

function startTimerCuisson() {
    intervalId = setInterval(function() {
        temps += 1;
    }, 100);
}

function stopTimer() {
    clearInterval(intervalId);
}

function newTacos() {
    if (listeCubePhysique.length !== 0) {
        clearInterval(timerInterval);
        noterTacos()
        let obj
        for( var i = scene.children.length - 1; i >= 0; i--) { 
            obj = scene.children[i];
            if (obj.name === "viande" || obj.name === "gruyere" || obj.name === "salade" || obj.name === "tomate") {
                scene.remove(obj); 
            }
        }
        elementSelected = "viande"
        temps = 0
        listeCubePhysique = []
        listeCubeThree = []
    }
}

function noterTacos() {
    let differenceTemps
    if (temps > 100) {
        differenceTemps = temps - 100
    }
    else {
        differenceTemps = 100 - temps
    }

    let nbElementsTacos = detecterCollisions()
    let nbElementsHorsTacos = listeCubePhysique.length - nbElementsTacos
    let currentTime = Date.now() - startTime
    let harmonie = getHarmonie()

    let noteElementsTacos = nbElementsTacos
    let noteElementsHorsTacos = 20 - nbElementsHorsTacos
    let noteTemps = Math.max((120 - (currentTime / 1000)) / 6, 0)
    let noteCuisson = 20 - (differenceTemps / 5)
    let noteHarmonie = harmonie
    let noteTotal = noteElementsTacos + noteElementsHorsTacos + noteTemps + noteCuisson + noteHarmonie
    console.log("La note est de " + noteTotal);
    console.log("noteElementsTacos", noteElementsTacos);
    console.log("noteElementsHorsTacos", noteElementsHorsTacos);
    console.log("noteTemps", noteTemps);
    console.log("noteCuisson", noteCuisson);
    console.log("noteHarmonie", noteHarmonie);
    document.getElementById("noteTacos").style.display = "block"
    document.getElementById("noteTotale").innerText = "La note totale du tacos est de " + noteTotal + "/20"
    document.getElementById("noteElementsTacos").innerText = "La note pour le nombre d'éléments dans le tacos est de " + noteElementsTacos + "/20"
    document.getElementById("noteElementsHorsTacos").innerText = "La note pour la proprete de la cuisine est de " + noteElementsHorsTacos + "/20"
    document.getElementById("noteCuisson").innerText = "La note pour le temps de cuisson du tacos est de " + noteCuisson + "/20"
    document.getElementById("noteHarmonie").innerText = "La note pour l'harmonie des ingrédients est de " + noteHarmonie + "/20"
    document.getElementById("noteTemps").innerText = "La note pour le temps de réalisation du tacos est de " + noteTemps + "/20"
}

function fermerPopup() {
    document.getElementById("noteTacos").style.display = "none"
}

function getHarmonie() {
    let nbCubesViande = 0;
    let nbCubesTomate = 0;
    let nbCubesGruyere = 0;
    let nbCubesSalade = 0;
    let totalCubes = listeCubeThree.length;
    for (let i = 0; i < listeCubeThree.length; i++) {
        let cube = listeCubeThree[i];
        switch (cube.name) {
            case "viande":
                nbCubesViande++;
                break;
            case "tomate":
                nbCubesTomate++;
                break;
            case "gruyere":
                nbCubesGruyere++;
                break;
            case "salade":
                nbCubesSalade++;
                break;
        }
    }
    let proportionViande = nbCubesViande / totalCubes;
    let proportionTomate = nbCubesTomate / totalCubes;
    let proportionGruyere = nbCubesGruyere / totalCubes;
    let proportionSalade = nbCubesSalade / totalCubes;

    let maxDifference = Math.max(proportionViande, proportionTomate, proportionGruyere, proportionSalade) - Math.min(proportionViande, proportionTomate, proportionGruyere, proportionSalade);

    let harmonie = (1 - maxDifference) * 20;
    return harmonie;
}

function startTimer() {
    startTime = Date.now();
    //timerInterval = setInterval(updateTimer, 100);
}

function detecterCollisions() {
    let nombreCollisions = 0;
    let circlePosition = circle.position;
    for (let i = 0; i < listeCubePhysique.length; i++) {
        let cubePosition = listeCubeThree[i].position;
        let distance = circlePosition.distanceTo(cubePosition);
        let combinedRadius = 1 + 0.1; // rayon du cercle + rayon du cube
        if (distance < combinedRadius) {
            nombreCollisions++;
        }
    }
    return nombreCollisions;
}


function newElementSelected(element) {
    document.getElementById("salade").classList = []
    document.getElementById("tomate").classList = []
    document.getElementById("viande").classList = []
    document.getElementById("gruyere").classList = []
    element.originalTarget.classList.add("selected")
    elementSelected = element.originalTarget.id
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var world = new CANNON.World();
world.gravity.set(0, 0, -9.82);

var groundShape = new CANNON.Plane();
var groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(groundShape);
groundBody.position.set(100, 100, 100);
world.addBody(groundBody);

/*var cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
var cubeBody = new CANNON.Body({ mass: 1 });
cubeBody.addShape(cubeShape);
cubeBody.position.set(0, 1, 5);
world.addBody(cubeBody);*/

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var circleGeometry = new THREE.CircleGeometry(1, 32);
var circleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.set(0, -1.5, -5);
scene.add(circle);

let objects = [cube]

var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
var previousY;

var listeCubePhysique = []
var listeCubeThree = []

renderer.domElement.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    createNewCube()
    
});

function createNewCube() {
    let cubeShape = new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1));
    let cubeBody = new CANNON.Body({ mass: 1 });
    cubeBody.addShape(cubeShape);
    cubeBody.position.set(cube.position.x, cube.position.y, 5);
    if (listeCubePhysique.length === 0) {
        startTimer()
    }
    listeCubePhysique.push(cubeBody)
    world.addBody(cubeBody);
    let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    let material = new THREE.MeshBasicMaterial({ color: 0x5d2f06 });
    if (elementSelected === "gruyere") {
        material = new THREE.MeshBasicMaterial({ color: 0xe0ca00 });
    }
    else if (elementSelected === "tomate") {
        material = new THREE.MeshBasicMaterial({ color: 0xcc0d0d });
    }
    else if (elementSelected === "salade") {
        material = new THREE.MeshBasicMaterial({ color: 0x04e252 });
    }
    let cube2 = new THREE.Mesh(geometry, material);
    cube2.name = "viande"
    if (elementSelected === "gruyere") {
        cube2.name = "gruyere"
    }
    else if (elementSelected === "tomate") {
        cube2.name = "tomate"
    }
    else if (elementSelected === "salade") {
        cube2.name = "salade"
    }
    listeCubeThree.push(cube2)
    scene.add(cube2);
}

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    groundBody.position.copy(circle.position);
    world.step(1 / 60);
    for (let i = 0; i < listeCubeThree.length; i++) {
        listeCubeThree[i].position.copy(listeCubePhysique[i].position);
    }

    renderer.render(scene, camera);
}

animate();
document.addEventListener('DOMContentLoaded', function() {
// Attachez l'événement mousedown à l'élément de rendu
renderer.domElement.addEventListener('mousedown', onMouseDown);
});
// Définissez une variable globale pour contrôler si le bouton droit est enfoncé
let rightMouseDown = false;

function onMouseDown(event) {
// Vérifiez si le bouton enfoncé est le bouton droit (2 pour le bouton droit)
console.log("test");
if (event.button === 2) {
rightMouseDown = true;
// Lancez une fonction pour ajouter des cubes continuellement
addCubesContinuously();
}
}

// Ajoutez un événement mouseup pour arrêter l'ajout de cubes lorsque le bouton est relâché
renderer.domElement.addEventListener('mouseup', onMouseUp);

function onMouseUp(event) {
// Vérifiez si le bouton relâché est le bouton droit
if (event.button === 2) {
rightMouseDown = false;
}
}

// Fonction pour ajouter des cubes continuellement jusqu'à ce que le bouton soit relâché
function addCubesContinuously() {
// Vérifiez si le bouton droit est toujours enfoncé
if (rightMouseDown) {
// Ajoutez un cube à chaque itération
createNewCube();
// Utilisez requestAnimationFrame pour appeler récursivement la fonction
requestAnimationFrame(addCubesContinuously);
}
}

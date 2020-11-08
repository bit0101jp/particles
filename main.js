// create a scene, that will hold all our elements such as objects, cameras and lights.
const scene = new THREE.Scene();

// create a camera, which defines where we're looking at.
const camera = new THREE.PerspectiveCamera(
                    45,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    200  );

// create a render and set the size
const webGLRenderer = new THREE.WebGLRenderer();
webGLRenderer.setClearColor(new THREE.Color(0x000000));
webGLRenderer.setSize(window.innerWidth, window.innerHeight);

// position and point the camera to the center of the scene
camera.position.x = 20;
camera.position.y = 40;
camera.position.z = 110;
camera.lookAt(new THREE.Vector3(20, 30, 0));

// add the output of the renderer to the html element
document.getElementById("WebGL-div").appendChild(webGLRenderer.domElement);

let system1;
let system2;
let size = 10;
let transparent = true;
let opacity = 0.6;
let color = 0x55ffff;
let sizeAttenuation = true;

let redraw = function(){
    const toRemove = [];
    scene.children.forEach(function(child){
        if (child instanceof THREE.Points){
            toRemove.push(child);
        }
    });

    toRemove.forEach(function(child){
        scene.remove(child)
    });

    createMultiPoints(size, transparent, opacity, sizeAttenuation, color);
};

redraw();
render();


function createPoints(name, texture, size, transparent, opacity, sizeAttenuation, color) {
    const geom = new THREE.Geometry();

    let colorObj = new THREE.Color(color);
    colorObj.setHSL(colorObj.getHSL().h,
                    colorObj.getHSL().s,
                    (Math.random()) * colorObj.getHSL().l);

    console.log(colorObj.getHSL())


    const material = new THREE.PointsMaterial({
        size: size,
        transparent: transparent,
        opacity: opacity,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: sizeAttenuation,
        color: colorObj
    });

    const range = 40;
    for (let i = 0; i < 50; i++) {
        const particle = new THREE.Vector3(
                Math.random() * range - range / 2,
                Math.random() * range * 1.5,
                Math.random() * range - range / 2);
        particle.velocityY = 0.1 + Math.random() / 5;
        particle.velocityX = (Math.random() - 0.5) / 3;
        particle.velocityZ = (Math.random() - 0.5) / 3;
        geom.vertices.push(particle);
    }

    const system = new THREE.Points(geom, material);
    system.name = name;
    system.sortParticles = true;
    return system;
}


function createMultiPoints(size, transparent, opacity, sizeAttenuation, color) {
    const textureLoader = new THREE.TextureLoader();
    const texture1 = textureLoader.load("./snowflake1.png");
    const texture2 = textureLoader.load("./snowflake4.png");

    scene.add(createPoints("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
    scene.add(createPoints("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
}


function render() {
    scene.children.forEach(function (child) {
        if (child instanceof THREE.Points) {
            const vertices = child.geometry.vertices;
            const col = child.material.color;

//            console.log("before: ")
//            console.log(col.getHSL())

            // col.setHSL(col.getHSL().h,
            //             col.getHSL().s,
            //             (Math.random()) * col.getHSL().l);

            // console.log("after: ")
            // console.log(col.getHSL())


            vertices.forEach(function (v) {
                v.x = v.x - (v.velocityX);
                v.y = v.y - (v.velocityY);
                v.z = v.z - (v.velocityZ);

                if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
                if (v.y <= 0) v.y = 60;
                if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
            });
            child.geometry.verticesNeedUpdate = true;
        }
    });

    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
}

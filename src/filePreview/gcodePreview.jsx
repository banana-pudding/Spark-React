import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GCodeLoader } from "./res/customGcodeLoader";

import "./css/modelPreview.css";

class Gcode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileID: props.fileID,
        };
        this.mount = React.createRef();
    }

    updateDimensions = (renderer, camera) => {
        if (this.mount) {
            renderer.setSize(this.mount.current.clientWidth, this.mount.current.clientWidth);
            camera.aspect = this.mount.current.clientWidth / this.mount.current.clientWidth;
            camera.updateProjectionMatrix();
        }
    };

    componentDidMount() {
        var scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf7f7f7);

        /* -------------------------------------------------------------------------- */
        /*                             Camera and Renderer                            */
        /* -------------------------------------------------------------------------- */
        var camera = new THREE.PerspectiveCamera(
            70,
            this.mount.current.clientWidth / this.mount.current.clientWidth,
            1,
            5000
        );

        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        /* -------------------------------------------------------------------------- */
        /*                                Insert Scene                                */
        /* -------------------------------------------------------------------------- */
        //renderer.setSize(this.mount.current.clientWidth, this.mount.current.clientWidth);
        this.updateDimensions(renderer, camera);
        this.mount.current.appendChild(renderer.domElement);
        //this.updateDimensions(renderer, camera);

        window.addEventListener("resize", () => {
            this.updateDimensions(renderer, camera);
        });

        /* -------------------------------------------------------------------------- */
        /*                               Create Controls                              */
        /* -------------------------------------------------------------------------- */
        var controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.rotateSpeed = 2;
        controls.dampingFactor = 0.1;
        controls.enableZoom = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2;

        /* -------------------------------------------------------------------------- */
        /*                                 Bottom Grid                                */
        /* -------------------------------------------------------------------------- */
        var size = 500;
        var divisions = 50;
        var centerColor = 0xaaaaaa;
        var gridColor = 0xdddddd;
        var gridHelper = new THREE.GridHelper(size, divisions, centerColor, gridColor);
        gridHelper.position.set(0, -1, 0);
        scene.add(gridHelper);

        /* -------------------------------------------------------------------------- */
        /*                              Build Volume Cube                             */
        /* -------------------------------------------------------------------------- */
        addBuildVolume(250, 210, 210, "hsl(50, 30%, 70%)", "Prusa");
        addBuildVolume(220, 220, 250, "hsl(150, 30%, 70%)", "Ender 3");
        addBuildVolume(229, 229, 229, "hsl(255, 30%, 70%)", "Poly 229");
        addBuildVolume(465, 229, 229, "hsl(195, 30%, 70%)", "Poly 465x Dual");
        addBuildVolume(350, 350, 400, "hsl(305, 30%, 70%)", "Ender 5 Plus");

        camera.position.z = 240;
        camera.position.y = 200;

        /* -------------------------------------------------------------------------- */
        /*                                   Lights                                   */
        /* -------------------------------------------------------------------------- */
        scene.add(new THREE.HemisphereLight(0xffffff, 0x7a7a7a, 0.87));

        const color = 0xffe6ee;
        const intensity = 0.3;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(100, 150, 200);
        scene.add(light);

        /* -------------------------------------------------------------------------- */
        /*                                  STL Mesh                                  */
        /* -------------------------------------------------------------------------- */

        new GCodeLoader().load("/download/gcode/" + this.state.fileID, function (object) {
            var boundingBox = new THREE.Box3().setFromObject(object);
            var size = boundingBox.getSize();
            object.position.set(-(size.x / 2), 0, size.z / 2);
            scene.add(object);

            //-------------CAMERA-------------//

            boundingBox = new THREE.Box3().setFromObject(object);
            size = boundingBox.getSize();
            const center = boundingBox.getCenter();

            // get the max side of the bounding box (fits to width OR height as needed )
            const maxDim = Math.max(size.x, size.y, size.z);
            //const fov = camera.fov * (Math.PI / 180);
            //let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));
            camera.position.z = maxDim;
            camera.position.y = maxDim;

            controls.target = center;

            /* -------------------------------------------------------------------------- */
            /*                               Start Animating                              */
            /* -------------------------------------------------------------------------- */

            var animate = function () {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };

            animate();
        });

        function addBuildVolume(xDim, yDim, zDim, color, name) {
            const fontSize = 72;
            const geometry = new THREE.BoxBufferGeometry(xDim, zDim, yDim);
            const edges = new THREE.EdgesGeometry(geometry);
            const boxMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color(color),
                linewidth: 1,
            });

            const buildVolume = new THREE.LineSegments(edges, boxMaterial);
            buildVolume.computeLineDistances();

            buildVolume.position.set(0, zDim / 2, 0);

            scene.add(buildVolume);

            const ctx = document.createElement("canvas").getContext("2d");
            const font = fontSize + "px Arial";
            ctx.font = font;

            const width = ctx.measureText(name).width;
            const height = fontSize;

            ctx.canvas.width = width;
            ctx.canvas.height = height;

            // need to set font again after resizing canvas
            ctx.font = font;
            ctx.textBaseline = "top";

            ctx.fillStyle = color;
            ctx.fillText(name, 0, 0);

            var canvas = ctx.canvas;
            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            const labelMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
            });

            const root = new THREE.Object3D();
            root.position.x = xDim / 2 + width / 10;

            const label = new THREE.Mesh(new THREE.PlaneGeometry(height / 4, height / 4), labelMaterial);
            root.add(label);
            label.position.y = zDim + height / 8;
            label.position.z = yDim / 2 + 1;

            // if units are meters then 0.01 here makes size
            // of the label into centimeters.
            const labelBaseScale = 0.01;
            label.scale.x = canvas.width * labelBaseScale;
            label.scale.y = canvas.height * labelBaseScale;

            scene.add(root);

            renderer.domElement.style.display = "none";

            return root;
        }
    }
    render() {
        return <div id="gcodeView" ref={this.mount}></div>;
    }
}

export default Gcode;

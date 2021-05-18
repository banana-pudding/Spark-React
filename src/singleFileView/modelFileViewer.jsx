import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GCodeLoader } from "./res/customGcodeLoader";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import "./css/modelPreview.scss";

class ModelDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileID: props.fileID,
        };
        this.mount = React.createRef();
        this.controls = React.createRef();
    }

    updateDimensions = (renderer, camera) => {
        if (this.mount) {
            renderer.setSize(this.mount.current.clientWidth, this.mount.current.clientWidth);
            camera.aspect = this.mount.current.clientWidth / this.mount.current.clientWidth;
            camera.updateProjectionMatrix();
        }
    };

    componentDidMount() {
        /* -------------------------------------------------------------------------- */
        /*                                 Boilerplate                                */
        /* -------------------------------------------------------------------------- */

        /* ------------------- Create scene, camera, and renderer ------------------- */
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf7f7f7);

        let camera = new THREE.PerspectiveCamera(
            70,
            this.mount.current.clientWidth / this.mount.current.clientWidth,
            1,
            5000
        );

        camera.position.z = 240;
        camera.position.y = 200;

        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        /* ---------------------- Insert canvas and size to fit --------------------- */
        this.mount.current.appendChild(renderer.domElement);
        this.updateDimensions(renderer, camera);

        window.addEventListener("resize", () => {
            this.updateDimensions(renderer, camera);
        });

        /* --------------------------- Add orbit controls --------------------------- */
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.rotateSpeed = 2;
        controls.dampingFactor = 0.1;
        controls.enableZoom = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        /* -------------------------------------------------------------------------- */
        /*                                  UTILITIES                                 */
        /* -------------------------------------------------------------------------- */

        /* ----------------------- Add build volume with label ---------------------- */
        const addBuildVolume = (xDim, yDim, zDim, color, name) => {
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

            const canvas = ctx.canvas;
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
            return root;
        };

        /* -------------------------------------------------------------------------- */
        /*                              Add Base Objects                              */
        /* -------------------------------------------------------------------------- */

        /* ----------------------------- Buildplate grid ---------------------------- */
        const size = 500;
        const divisions = 50;
        const centerColor = 0xaaaaaa;
        const gridColor = 0xdddddd;
        const gridHelper = new THREE.GridHelper(size, divisions, centerColor, gridColor);
        gridHelper.position.set(0, -1, 0);
        scene.add(gridHelper);

        /* ----------------------- All possible build volumes ----------------------- */
        addBuildVolume(250, 210, 210, "hsl(50, 30%, 70%)", "Prusa");
        addBuildVolume(220, 220, 250, "hsl(150, 30%, 70%)", "Ender 3");
        addBuildVolume(229, 229, 229, "hsl(255, 30%, 70%)", "Poly 229");
        addBuildVolume(465, 229, 229, "hsl(195, 30%, 70%)", "Poly 465x Dual");
        addBuildVolume(350, 350, 400, "hsl(305, 30%, 70%)", "Ender 5 Plus");

        /* ----------------------------- Light the scene ---------------------------- */
        scene.add(new THREE.HemisphereLight(0xffffff, 0x7a7a7a, 0.87));

        const color = 0xffe6ee;
        const intensity = 0.3;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(100, 150, 200);
        scene.add(light);

        /* -------------------------------------------------------------------------- */
        /*                              Load the STL File                             */
        /* -------------------------------------------------------------------------- */

        const loadSTLFile = () => {
            return new Promise((resolve, reject) => {
                new STLLoader().load(
                    "/download/stl/" + this.state.fileID,
                    function (geometry) {
                        /* ----------------------------- Create material ---------------------------- */
                        let material = new THREE.MeshPhongMaterial({
                            color: 0xff73de,
                            specular: 0x4c4c4c,
                            shininess: 40,
                        });

                        /* ------------------- Mesh from geometry and add to scene ------------------ */
                        let mesh = new THREE.Mesh(geometry, material);
                        mesh.rotation.x = -Math.PI / 2;
                        scene.add(mesh);

                        /* ----------------------- Center model and look at it ---------------------- */

                        const middle = new THREE.Vector3();
                        const size = new THREE.Vector3();
                        geometry.computeBoundingBox();

                        geometry.boundingBox.getCenter(middle);
                        geometry.boundingBox.getSize(size);

                        mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, 0));
                        const maxDim = Math.max(size.x, size.y, size.z);

                        camera.position.z = maxDim + 80;
                        camera.position.y = maxDim + 100;
                        controls.target = middle;

                        resolve(mesh);
                    },
                    null,
                    function (err) {
                        reject(err);
                    }
                );
            });
        };

        /* -------------------------------------------------------------------------- */
        /*                             Load the GCODE File                            */
        /* -------------------------------------------------------------------------- */
        const loadGCODEFile = () => {
            return new Promise((resolve, reject) => {
                new GCodeLoader().load(
                    "/download/gcode/" + this.state.fileID,
                    function (object) {
                        const boundingBox = new THREE.Box3().setFromObject(object);
                        const size = boundingBox.getSize();
                        const middle = boundingBox.getCenter();

                        object.translateX(-middle.x);
                        object.translateY(middle.z);

                        scene.add(object);

                        resolve(object);
                    },
                    null,
                    function (err) {
                        reject(err);
                    }
                );
            });
        };

        const stlPromise = loadSTLFile();
        const gcodePromise = loadGCODEFile();

        var controller = new (function () {
            this.modelColor = 0xff73de;
            this.gcodeColor = 0xff00a8;
            this.gcodeOpacity = 0.03;
        })();

        function dec2hex(i) {
            var result = "0x000000";
            if (i >= 0 && i <= 15) {
                result = "0x00000" + i.toString(16);
            } else if (i >= 16 && i <= 255) {
                result = "0x0000" + i.toString(16);
            } else if (i >= 256 && i <= 4095) {
                result = "0x000" + i.toString(16);
            } else if (i >= 4096 && i <= 65535) {
                result = "0x00" + i.toString(16);
            } else if (i >= 65535 && i <= 1048575) {
                result = "0x0" + i.toString(16);
            } else if (i >= 1048575) {
                result = "0x" + i.toString(16);
            }
            if (result.length == 8) {
                return result;
            }
        }

        stlPromise.then((stlModel) => {
            var gui = new GUI({ autoPlace: false });
            this.controls.current.appendChild(gui.domElement);
            gui.add(stlModel, "visible").name("Show STL File");
            gui.addColor(controller, "modelColor", color).onChange(function () {
                stlModel.material.color.setHex(dec2hex(controller.modelColor));
            });

            gcodePromise.then((gcodeModel) => {
                gcodeModel.visible = false;
                console.log(gcodeModel);
                gui.add(gcodeModel, "visible").name("Show GCODE File");
                gui.addColor(controller, "gcodeColor").onChange(function () {
                    gcodeModel.children[0].material.color.setHex(dec2hex(controller.gcodeColor));
                });
                gui.add(controller, "gcodeOpacity", 0, 1).onChange(function () {
                    gcodeModel.children[0].material.opacity = controller.gcodeOpacity;
                });
            });
        });
    }

    render() {
        return (
            <div className="card shadow mb-3">
                <div id="model-controls" ref={this.controls}></div>
                <div id="canvas-wrapper" ref={this.mount} />
            </div>
        );
    }
}

export default ModelDisplay;

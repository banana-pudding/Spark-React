import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GCodeLoader } from "./res/customGcodeLoader";
import { RgbaColorPicker } from "react-colorful";
import { ToastContainer, toast } from "react-toastify";
import "./scss/modelPreview.scss";
import { Vector3 } from "three";

class ModelDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasSTL: false,
            hasGCODE: false,
            fileID: props.fileID,
            showSTL: true,
            stlColor: { r: 255, g: 115, b: 222, a: 1 },
            showGCODE: false,
            showGCODETravel: false,
            extrudeColor: { a: 0.04, b: 255, g: 38, r: 192 },
            travelColor: { r: 0, g: 170, b: 255, a: 0.02 },
            renderer: null,
            camera: null,
        };
        this.mount = React.createRef();
        this.controls = React.createRef();
        this.gcodeControls = React.createRef();
        this.gcodeModel = null;
        this.stlModel = null;
    }

    renderer = null;
    camera = null;

    updateDimensions = (renderer, camera) => {
        if (this.mount.current) {
            let dim = this.mount.current.clientWidth;
            renderer.setSize(dim, dim);
            camera.aspect = 1;
            camera.updateProjectionMatrix();
        }
    };

    resizeGo() {
        this.updateDimensions(this.renderer, this.camera);
    }

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

        this.renderer = renderer;
        this.camera = camera;

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
                            transparent: true,
                            opacity: 1,
                            depthTest: true,
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

                        geometry.boundingBox.getCenter(middle);
                        geometry.boundingBox.getSize(size);

                        camera.position.z = maxDim + 80;
                        camera.position.y = maxDim + 100;
                        controls.target = middle;
                        camera.lookAt(middle);

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

        stlPromise
            .then((stlModel) => {
                this.setState({
                    hasSTL: true,
                });
                this.stlModel = stlModel;
            })
            .catch(() => {
                toast.error("STL File Not Found", { position: "bottom-right" });
            });

        gcodePromise
            .then((gcodeModel) => {
                this.setState({
                    hasGCODE: true,
                });
                this.gcodeModel = gcodeModel;
                gcodeModel.children[0].visible = false;
                gcodeModel.children[1].visible = false;
            })
            .catch(() => {
                toast.warn("GCODE File Not Found", { position: "bottom-right" });
            });
    }

    componentDidUpdate() {
        this.updateDimensions(this.renderer, this.camera);
    }

    rgba2hexAndAlpha = (rgba) => {
        let r = rgba.r.toString(16);
        let g = rgba.g.toString(16);
        let b = rgba.b.toString(16);

        if (r.length == 1) r = "0" + r;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;

        return {
            hex: "0x" + r + g + b,
            alpha: rgba.a,
        };
    };

    render() {
        console.log(this.props);

        return (
            <div className="card shadow mb-3">
                <div id="canvas-wrapper" ref={this.mount} />
                <div className="card-body border-top">
                    <div className="row">
                        <div className="col">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="flexCheckDefault"
                                    checked={this.state.showSTL}
                                    onChange={() => {
                                        this.setState(
                                            {
                                                showSTL: !this.state.showSTL,
                                            },
                                            () => {
                                                this.stlModel.visible = this.state.showSTL;
                                            }
                                        );
                                    }}
                                />
                                <label className="form-check-label">STL File</label>
                            </div>
                            <RgbaColorPicker
                                color={this.state.stlColor}
                                onChange={(newColor) => {
                                    this.setState(
                                        {
                                            stlColor: newColor,
                                        },
                                        () => {
                                            let hexAlpha = this.rgba2hexAndAlpha(newColor);
                                            this.stlModel.material.color.setHex(hexAlpha.hex);
                                            this.stlModel.material.opacity = hexAlpha.alpha;

                                            if (hexAlpha.alpha < 1) {
                                                this.stlModel.material.depthTest = false;
                                            } else {
                                                this.stlModel.material.depthTest = true;
                                            }
                                        }
                                    );
                                }}
                            />
                        </div>
                        {this.state.hasGCODE && (
                            <React.Fragment>
                                <div className="col">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="flexCheckDefault"
                                            checked={this.state.showGCODE}
                                            onChange={() => {
                                                this.setState(
                                                    {
                                                        showGCODE: !this.state.showGCODE,
                                                    },
                                                    () => {
                                                        this.gcodeModel.children[0].visible = this.state.showGCODE;
                                                    }
                                                );
                                            }}
                                        />
                                        <label className="form-check-label">GCODE File</label>
                                    </div>
                                    <RgbaColorPicker
                                        color={this.state.extrudeColor}
                                        onChange={(newColor) => {
                                            this.setState(
                                                {
                                                    extrudeColor: newColor,
                                                },
                                                () => {
                                                    let hexAlpha = this.rgba2hexAndAlpha(newColor);
                                                    this.gcodeModel.children[0].material.color.setHex(hexAlpha.hex);
                                                    this.gcodeModel.children[0].material.opacity = hexAlpha.alpha;
                                                }
                                            );
                                        }}
                                    />
                                </div>
                                <div className="col">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="flexCheckDefault"
                                            checked={this.state.showGCODETravel}
                                            onChange={() => {
                                                this.setState(
                                                    {
                                                        showGCODETravel: !this.state.showGCODETravel,
                                                    },
                                                    () => {
                                                        this.gcodeModel.children[1].visible =
                                                            this.state.showGCODETravel;
                                                    }
                                                );
                                            }}
                                        />
                                        <label className="form-check-label">GCODE Travels</label>
                                    </div>
                                    <RgbaColorPicker
                                        color={this.state.travelColor}
                                        onChange={(newColor) => {
                                            this.setState(
                                                {
                                                    travelColor: newColor,
                                                },
                                                () => {
                                                    let hexAlpha = this.rgba2hexAndAlpha(newColor);
                                                    this.gcodeModel.children[1].material.color.setHex(hexAlpha.hex);
                                                    this.gcodeModel.children[1].material.opacity = hexAlpha.alpha;
                                                }
                                            );
                                        }}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default ModelDisplay;

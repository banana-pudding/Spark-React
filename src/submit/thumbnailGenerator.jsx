import React from "react";
import * as THREE from "three";
import { parse } from "./STLLoader";

const colors = [
    0x8c41e6, 0x3268e7, 0x009de6, 0x19b0b8, 0x1fc757, 0x8abf36, 0xffc107, 0xfaa200, 0xf54d3d, 0xff4d7f, 0xb94693,
];

class ModelDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.mount = React.createRef();
        this.state = {
            file: null,
            thumbnail: null,
        };
    }

    scene = null;
    camera = null;
    renderer = null;

    mesh = null;

    saveThumbnail = () => {
        var imgData, imgNode;

        try {
            var strMime = "image/jpeg";
            imgData = this.renderer.domElement.toDataURL(strMime);
            this.setState(
                {
                    thumbnail: imgData,
                },
                () => {
                    this.props.pushThumb(imgData);
                }
            );
            //saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
        } catch (e) {
            console.log(e);
            return;
        }
    };

    loadNewFile = () => {
        this.setState({
            file: this.props.file,
        });
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.mesh = null;
        }
        const loadSTLFile = () => {
            return new Promise(async (resolve, reject) => {
                let geometry = await parse(this.props.file);
                /* ----------------------------- Create material ---------------------------- */
                let material = new THREE.MeshPhongMaterial({
                    color: colors[Math.floor(Math.random() * 11)],
                    specular: 0xc4d6aa,
                    shininess: 40,
                    transparent: true,
                    opacity: 1,
                    depthTest: true,
                });

                /* ------------------- Mesh from geometry and add to scene ------------------ */
                this.mesh = new THREE.Mesh(geometry, material);
                this.scene.add(this.mesh);

                /* ----------------------- Center model and look at it ---------------------- */

                const middle = new THREE.Vector3();
                const size = new THREE.Vector3();
                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();

                const boundingBox = new THREE.Box3();

                geometry.boundingBox.getCenter(middle);
                geometry.boundingBox.getSize(size);

                this.mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z));

                // this.mesh.rotateX(-Math.PI / 2);
                this.mesh.rotateX(-Math.PI / 4);
                this.mesh.rotateZ(Math.PI / 9);

                geometry.boundingBox.getCenter(middle);
                geometry.boundingBox.getSize(size);
                const fov = this.camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(geometry.boundingSphere.radius / Math.sin(fov / 2));
                cameraZ *= 1; // zoom out a little so that objects don't fill the screen

                this.camera.position.z = cameraZ;

                this.camera.lookAt(middle);

                resolve(this.mesh);
            });
        };

        const stlPromise = loadSTLFile();

        stlPromise.then((stlModel) => {
            this.renderer.render(this.scene, this.camera);
            this.saveThumbnail();
        });
    };

    componentDidUpdate() {
        if (this.state.file != this.props.file) {
            this.loadNewFile();
        }
    }

    componentDidMount() {
        /* -------------------------------------------------------------------------- */
        /*                                 Boilerplate                                */
        /* -------------------------------------------------------------------------- */

        /* ------------------- Create scene, camera, and renderer ------------------- */
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf7f7f7);

        this.camera = new THREE.PerspectiveCamera(70, 1, 1, 5000);

        this.camera.position.z = 0;
        this.camera.position.y = 0;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        /* ---------------------- Insert canvas and size to fit --------------------- */
        this.mount.current.appendChild(this.renderer.domElement);

        this.renderer.setSize(500, 500);
        this.camera.aspect = 1;
        this.camera.updateProjectionMatrix();

        /* ----------------------------- Light the scene ---------------------------- */
        this.scene.add(new THREE.HemisphereLight(0xffffff, 0x7a7a7a, 0.87));

        const color = 0xffe6ee;
        const intensity = 0.3;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(100, 150, 200);
        this.scene.add(light);

        /* -------------------------------------------------------------------------- */
        /*                              Load the STL File                             */
        /* -------------------------------------------------------------------------- */
        this.loadNewFile();
    }

    render() {
        return (
            <div
                style={{
                    position: "fixed",
                    zIndex: "-99999999999",
                }}
                id="canvas-wrapper"
                ref={this.mount}
            />
        );
    }
}

export default ModelDisplay;

import React from "react";
import ReactDOM from "react-dom";
// import "@popperjs/core/dist/cjs/popper";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
//global css
import "./common/scss/global.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
//import "./common/scss/customBootstrap.scss";
//import "bootstrap/scss/bootstrap.scss";

//components
import App from "./app.js";

function Base() {
    return (
        <React.StrictMode>
            <div id="tint"></div>
            <div id="imagebg"> </div>
            <App />
        </React.StrictMode>
    );
}

ReactDOM.render(<Base />, document.getElementById("root"));

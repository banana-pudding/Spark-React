import React from "react";
import ReactDOM from "react-dom";

//global css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./common/global.scss";

//components
import App from "./router.js";

function Base() {
    return (
        <React.StrictMode>
            <div id="imagebg"> </div>
            <App />
        </React.StrictMode>
    );
}

ReactDOM.render(<Base />, document.getElementById("root"));

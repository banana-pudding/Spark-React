import React from "react";
import ReactDOM from "react-dom";

//global css
import "./common/global.scss";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap/dist/js/bootstrap.min.js";

//components
import App from "./app.js";

function Base() {
    return (
        <React.StrictMode>
            <div id="imagebg"> </div>
            <App />
        </React.StrictMode>
    );
}

ReactDOM.render(<Base />, document.getElementById("root"));

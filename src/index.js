import React from "react";
import ReactDOM from "react-dom";

//global css
import "bootstrap/dist/css/bootstrap.min.css";
import "./common/global.scss";

//utilities
import { Provider } from "./reducer";

//components
import Navigation from "./router.js";

function Base() {
    return (
        <React.StrictMode>
            <Provider>
                <div id="imagebg"> </div>
                <Navigation />
            </Provider>
        </React.StrictMode>
    );
}

ReactDOM.render(<Base />, document.getElementById("root"));

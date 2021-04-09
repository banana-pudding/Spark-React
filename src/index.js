import React, { useEffect, useContext, createContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//global css
import "bootstrap/dist/css/bootstrap.min.css";
import "./common/global.scss";

//utilities
import ProtectedRoute from "./common/protectedRoute";
import { Provider } from "./reducer";

//components
import NavBar from "./common/navBar";
import Landing from "./home/landing";
import Login from "./login/login";
import Profile from "./profile/profile";
import Footer from "./common/footer";

function Base() {
    return (
        <React.StrictMode>
            <Provider>
                <div id="imagebg"> </div>
                <Router>
                    <NavBar />
                    <Switch>
                        <Route path="/" exact={true} component={Landing} />
                        <Route path="/login" exact={true} component={Login} />
                        <ProtectedRoute path="/profile" exact={true} component={Profile} />
                    </Switch>
                    <Footer />
                </Router>
            </Provider>
        </React.StrictMode>
    );
}

ReactDOM.render(<Base />, document.getElementById("root"));

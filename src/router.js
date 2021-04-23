import React from "react";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import ProtectedRoute from "./common/protectedRoute";

import NavBar from "./common/navBar";
import Landing from "./home/landing";
import Login from "./login/login";
import Profile from "./profile/profile";
import SubmissionList from "./prints/submissionList";
import FilePreview from "./filePreview/filePreview";
import Footer from "./common/footer";

import { Context } from "./reducer";
function Navigator() {
    const [state, dispatch] = React.useContext(Context);
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact={true} component={Landing} />
                {/* <Route path="/login" exact={true} component={Login} /> */}
                <Route exact path="/login">
                    {state.user ? <Redirect to="/profile" /> : <Login />}
                </Route>
                <ProtectedRoute path="/profile" exact={true} component={Profile} />
                <ProtectedRoute path="/prints" component={SubmissionList} />
                <ProtectedRoute path="/files" component={FilePreview} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default Navigator;

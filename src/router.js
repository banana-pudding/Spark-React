import React from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import ProtectedRoute from "./common/protectedRoute";
import NavBar from "./common/navBar";
import Landing from "./home/landing";
import Login from "./login/login";
import Profile from "./profile/profile";
import Submit from "./submit/submit";
import SubmissionList from "./prints/submissionList";
import FilePreview from "./filePreview/filePreview";
import Footer from "./common/footer";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.updateLogin = this.updateLogin.bind(this);
        this.state = {
            user: localStorage.jwtToken ? jwt_decode(localStorage.jwtToken) : null,
        };
    }

    updateLogin(data) {
        console.log(data);
        if (data == null) {
            localStorage.removeItem("jwtToken");
            axios.defaults.headers.common["Authorization"] = null;
            this.setState({
                user: null,
            });
        } else {
            localStorage.setItem("jwtToken", data);
            axios.defaults.headers.common["Authorization"] = data;
            this.setState({
                user: jwt_decode(data),
            });
            console.log("update");
        }
    }

    render() {
        return (
            <Router>
                <div className="d-flex flex-column root-container">
                    <NavBar user={this.state.user} updateLogin={this.updateLogin.bind(this)} />
                    <Switch>
                        <Route path="/" exact={true} component={Landing} />
                        {/* <Route path="/login" exact={true} component={Login} /> */}
                        <Route exact path="/login">
                            {this.state.user ? (
                                <Redirect to="/profile" />
                            ) : (
                                <Login updateLogin={this.updateLogin.bind(this)} />
                            )}
                        </Route>
                        <ProtectedRoute path="/profile" exact={true} component={Profile} />
                        <ProtectedRoute path="/submit" exact={true} component={Submit} />
                        <ProtectedRoute path="/prints" component={SubmissionList} />
                        <ProtectedRoute path="/files" component={FilePreview} />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;

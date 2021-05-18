import React from "react";
import jwt_decode from "jwt-decode";
import axios from "./common/axiosConfig";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import ProtectedRoute from "./common/protectedRoute";
import NavBar from "./common/navBar";
import Landing from "./home/landing";
import Login from "./login/login";
import Profile from "./profile/profile";
import Submit from "./submit/submit";
import SubmissionList from "./prints/submissionList";
import FilePreview from "./singleFileView/filePreview";
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
        }
    }

    render() {
        return (
            <Router>
                <div className="d-flex flex-column root-container">
                    <NavBar user={this.state.user} updateLogin={this.updateLogin.bind(this)} />
                    <Switch>
                        <Route path="/" exact={true} component={Landing} />
                        <Route exact path="/submit">
                            <Submit />
                        </Route>

                        <Route exact path="/login">
                            {this.state.user ? (
                                <Redirect to="/profile" />
                            ) : (
                                <Login updateLogin={this.updateLogin.bind(this)} />
                            )}
                        </Route>
                        <ProtectedRoute exact path="/profile" user={this.state.user}>
                            <Profile user={this.state.user} />
                        </ProtectedRoute>

                        <ProtectedRoute exact path="/prints" user={this.state.user}>
                            <SubmissionList user={this.state.user} />
                        </ProtectedRoute>
                        <ProtectedRoute path="/files" user={this.state.user}>
                            <FilePreview user={this.state.user} />
                        </ProtectedRoute>
                    </Switch>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;

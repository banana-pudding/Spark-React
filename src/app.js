import React from "react";
import jwt_decode from "jwt-decode";
//import axios from "./common/axiosConfig";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import ProtectedRoute from "./common/protectedRoute";
import NavBar from "./common/navBar";
import Landing from "./home/landing";
import Login from "./login/login";
import Profile from "./profile/profile";
import Submit from "./submit/submit";
import PaymentComplete from "./paymentComplete/paymentComplete";
import SubmissionList from "./submissionList/submissionList";
import SubmissionView from "./publicSubmissionView/publicSubmissionView";
import FilePreview from "./singleFileView/filePreview";
import ManageJobs from "./printerJobs/printerJobs";
import PickupForm from "./pickupForm/pickupForm";
import Aggregation from "./aggregation/aggregation";
import Footer from "./common/footer";

import axios from "axios";

const axiosInstance = axios.create({});

/* -------------------------------------------------------------------------- */
/*               For every request, grab the jwt in localstorage              */
/* -------------------------------------------------------------------------- */
axiosInstance.interceptors.request.use(
    function (config) {
        config.headers.Authorization = localStorage.jwtToken;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

/* -------------------------------------------------------------------------- */
/*                         Remove jwt if user invalid                         */
/* -------------------------------------------------------------------------- */
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log("ERROR", error);
        toast.error(error.toString(), {
            position: "bottom-right",
        });

        if (error.response.status == 401) {
            localStorage.removeItem("jwtToken");
            axios.defaults.headers.common["Authorization"] = null;
            window.location.replace("/login");
        }

        return Promise.reject(error);
    }
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.updateLogin = this.updateLogin.bind(this);
        this.state = {
            user: localStorage.jwtToken ? jwt_decode(localStorage.jwtToken) : null,
            jwtValid: false,
        };
        this.updateUserFromDatabase = this.updateUserFromDatabase.bind(this);
    }

    componentDidMount() {
        //if logged in, double check the jwt is still valid
        if (this.state.user && !this.state.jwtValid) {
            axiosInstance.get("/users/validatejwt").then((res) => {
                this.setState(
                    {
                        jwtValid: true,
                    },
                    () => {
                        this.updateUserFromDatabase();
                    }
                );
            });
        }
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
            this.setState(
                {
                    user: jwt_decode(data),
                },
                () => {
                    this.updateUserFromDatabase();
                }
            );
        }
    }

    updateUserFromDatabase() {
        axiosInstance.get("/users/info/" + this.state.user.euid).then((res) => {
            this.setState({
                user: res.data.formattedUser,
            });
        });
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
                            <Profile
                                user={this.state.user}
                                updateUserFromDatabase={this.updateUserFromDatabase.bind(this)}
                            />
                        </ProtectedRoute>

                        <ProtectedRoute exact path="/prints" user={this.state.user}>
                            <SubmissionList user={this.state.user} />
                        </ProtectedRoute>
                        <ProtectedRoute path="/files" user={this.state.user}>
                            <FilePreview user={this.state.user} />
                        </ProtectedRoute>
                        <ProtectedRoute exact path="/printers" user={this.state.user}>
                            <ManageJobs user={this.state.user} />
                        </ProtectedRoute>
                        <Route exact path="/payment/complete">
                            <PaymentComplete />
                        </Route>
                        <Route path="/submission">
                            <SubmissionView />
                        </Route>
                        <Route path="/meta">
                            <Aggregation />
                        </Route>
                        <Route exact path="/pickup">
                            <PickupForm />
                        </Route>
                    </Switch>
                    <ToastContainer />
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;
export { axiosInstance };

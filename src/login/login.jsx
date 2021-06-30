import React from "react";
import axios from "../common/axiosConfig";
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }

    handleSubmit() {
        axios
            .post("/users/login", { username: this.state.username, password: this.state.password })
            .then((res) => {
                this.props.updateLogin(res.data.token);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="container mt-5" id="loginComponent">
                <div className="row">
                    <div className="col col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                        <div className="shadow card">
                            <div className="card-body">
                                <h1>
                                    <i className="bi bi-person-check"></i>
                                    Login
                                </h1>

                                <hr />

                                <form>
                                    <div className="mb-3">
                                        <label className="sr-only">EUID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            placeholder="EUID"
                                            value={this.state.username}
                                            onChange={(e) => {
                                                this.setState({
                                                    username: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="sr-only">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="Password"
                                            value={this.state.password}
                                            onChange={(e) => {
                                                this.setState({
                                                    password: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </form>
                                <button
                                    className="btn btn-lg btn-primary btn-block"
                                    onClick={this.handleSubmit.bind(this)}>
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;

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
                                    <svg
                                        className="bi bi-person"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM8 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
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

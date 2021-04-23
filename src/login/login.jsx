import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Context } from "../reducer";
import axios from "axios";

function LoginPage() {
    const [state, dispatch] = React.useContext(Context);

    var formValues = {
        username: "",
        password: "",
    };

    useEffect(() => {});

    const handleSubmit = () => {
        axios
            .post("/users/login", formValues)
            .then((res) => {
                dispatch({ type: "LOGIN", payload: res.data });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div class="container mt-5 custom col-sm-6 offset-sm-3" id="loginComponent">
            <div class="shadow card">
                <div class="card-body">
                    <h1>
                        <svg
                            class="bi bi-person"
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
                        <div class="mb-3">
                            <label class="sr-only">EUID</label>
                            <input
                                type="text"
                                class="form-control"
                                name="username"
                                placeholder="EUID"
                                onChange={(e) => {
                                    formValues.username = e.target.value;
                                }}
                            />
                        </div>
                        <div class="mb-3">
                            <label class="sr-only">Password</label>
                            <input
                                type="password"
                                class="form-control"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => {
                                    formValues.password = e.target.value;
                                }}
                            />
                        </div>
                    </form>
                    <button class="btn btn-lg btn-primary btn-block" onClick={handleSubmit}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

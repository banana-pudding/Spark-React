import { Link } from "react-router-dom";
import React, { useEffect, useContext, Component } from "react";
import { Context } from "../reducer";

function guestItems() {
    return (
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <Link to="/" className="nav-link">
                    Home
                </Link>
            </li>
            <li class="nav-item ">
                <Link to="/submit" className="nav-link">
                    Submit Print Request
                </Link>
            </li>
            <li class="nav-item">
                <Link to="/login" className="nav-link">
                    Login
                </Link>
            </li>
        </ul>
    );
}

function loggedInItems(state, dispatch) {
    return (
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <Link to="/" className="nav-link">
                    Home
                </Link>
            </li>
            <li class="nav-item ">
                <Link to="/submit" className="nav-link">
                    Submit Print Request
                </Link>
            </li>
            <li class="nav-item ">
                <Link to="/prints/new" className="nav-link">
                    Prints
                </Link>
            </li>

            <li class="nav-item">
                <Link to="/profile" className="nav-link">
                    Profile
                </Link>
            </li>

            <li class="nav-item ">
                <Link to="/meta" className="nav-link">
                    Analytics
                </Link>
            </li>

            <li class="nav-item ">
                <a
                    className="nav-link"
                    onClick={() => {
                        dispatch({ type: "LOGOUT", payload: null });
                    }}>
                    Logout
                </a>
            </li>
        </ul>
    );
}

function NavBar() {
    const [state, dispatch] = React.useContext(Context);

    let navItems = state.user ? loggedInItems(state, dispatch) : guestItems();

    return (
        <nav class="navbar navbar-expand-lg navbar-dark shadow">
            <Link to="/" className="navbar-brand ms-3">
                The Spark Makerspace
            </Link>

            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                {navItems}
            </div>
        </nav>
    );
}

export default NavBar;

import { Link } from "react-router-dom";
import React, { Component } from "react";

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    logout() {
        this.props.updateLogin(null);
    }

    navItems(hasUser) {
        if (hasUser) {
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
                        <Link to="/prints" className="nav-link">
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
                        <a className="nav-link" onClick={this.logout.bind(this)}>
                            Logout
                        </a>
                    </li>
                </ul>
            );
        } else {
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
    }

    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-dark shadow">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand ms-3">
                        The Spark Makerspace
                    </Link>

                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        {this.navItems(this.props.user)}
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;

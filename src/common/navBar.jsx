import { Link } from "react-router-dom";
import React, { Component } from "react";

class NavBar extends Component {
    logout() {
        this.props.updateLogin(null);
    }

    navItems(hasUser) {
        if (hasUser) {
            return (
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item ">
                        <Link to="/submit" className="nav-link">
                            Submit Print Request
                        </Link>
                    </li>
                    <li className="nav-item ">
                        <Link to="/prints" className="nav-link">
                            Submissions
                        </Link>
                    </li>

                    <li className="nav-item ">
                        <Link to="/printers" className="nav-link">
                            Printers
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/profile" className="nav-link">
                            Profile
                        </Link>
                    </li>

                    <li className="nav-item ">
                        <Link to="/meta" className="nav-link">
                            Analytics
                        </Link>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item ">
                        <Link to="/submit" className="nav-link">
                            Submit Print Request
                        </Link>
                    </li>
                </ul>
            );
        }
    }

    loginLogoutButton() {
        if (this.props.user) {
            return (
                <button className="btn btn-warning" onClick={this.logout.bind(this)}>
                    Logout
                </button>
            );
        } else {
            return (
                <Link to="/login" className="nav-link text-white-50">
                    Technician Login
                </Link>
            );
        }
    }

    render() {
        return (
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark shadow">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand ms-3">
                        The Spark Makerspace
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        {this.navItems(this.props.user)}
                    </div>

                    {this.loginLogoutButton()}
                </div>
            </nav>
        );
    }
}

export default NavBar;

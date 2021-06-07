import { Link } from "react-router-dom";
import React, { Component } from "react";
import { Collapse } from "bootstrap";

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.navCollapse = React.createRef();
    }

    componentDidMount() {
        this.navDropdown = new Collapse(this.navCollapse.current);
    }

    logout() {
        this.props.updateLogin(null);
    }

    toggleCollapse = () => {
        Collapse.getInstance(this.navCollapse.current).toggle();
    };

    render() {
        const constantItems = () => {
            return (
                <React.Fragment>
                    <div className="d-flex flex-row">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item ">
                            <Link to="/submit" className="nav-link">
                                Submit 3D Print
                            </Link>
                        </li>
                    </div>
                </React.Fragment>
            );
        };

        const loggedInItems = () => {
            if (this.props.user) {
                return (
                    <React.Fragment>
                        <div className="d-lg-flex flex-row">
                            <li className="nav-item ">
                                <Link to="/prints" className="nav-link">
                                    Submission Queue
                                </Link>
                            </li>

                            <li className="nav-item ">
                                <Link to="/printers" className="nav-link">
                                    Printer Dashboard
                                </Link>
                            </li>
                        </div>

                        <div className="d-lg-flex flex-row me-3">
                            <li className="nav-item">
                                <Link to="/meta" className="nav-link">
                                    Analytics
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">
                                    Logged in as {this.props.user.name} ({this.props.user.euid})
                                </Link>
                            </li>
                        </div>
                    </React.Fragment>
                );
            } else {
                return null;
            }
        };

        const loginLogout = () => {
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
        };

        return (
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-primary shadow spark-nav">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        The Spark Makerspace
                    </Link>

                    <button className="navbar-toggler" onClick={this.toggleCollapse} type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div ref={this.navCollapse} className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav flex-grow-1 justify-content-between">
                            {constantItems()}
                            {loggedInItems()}
                        </ul>
                        <div className="flex-shrink-0">{loginLogout()}</div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;

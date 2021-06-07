import logo from "./images/unt-logo-stacked-green.svg";
import { Component } from "react";

class Footer extends Component {
    render() {
        return (
            <footer className="bg-primary text-light spark-footer mt-auto" id="footerComponent">
                <div className="container pt-5 pb-3">
                    <div className="row">
                        <div className="col-6 col-lg-3 px-5">
                            <img className="footer-logo mb-5" src={logo} alt="UNT Logo" />
                        </div>
                        <div className="col-6 col-lg-3">
                            <span className="navbar-text">
                                <h5>Location</h5>
                                <p className="small">
                                    University of North Texas Libraries <br />
                                    1115 Union Circle #305190 <br />
                                    Denton, TX 76203-5017 <br />
                                    (940) 565-2411
                                </p>
                            </span>
                        </div>
                        <div className="col-6 col-lg-3">
                            <span className="navbar-text">
                                <h5>Contact</h5>
                                <p className="small">
                                    <a href="mailto:thespark@unt.edu" className="link-light">
                                        TheSpark@unt.edu
                                    </a>
                                    <br />
                                    (940) 369-5259
                                    <br />
                                    Willis Library 135 <br />
                                    Discovery Park M130 <br />
                                </p>
                            </span>
                        </div>
                        <div className="col-3 col-lg-3 ">
                            <span className="navbar-text">
                                <h5>Bug Report</h5>
                                <p className="small">
                                    Fill out the{" "}
                                    <a href="/bugreport" className="link-light">
                                        form
                                    </a>
                                </p>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;

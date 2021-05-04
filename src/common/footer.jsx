import logo from "./unt-logo-stacked-green.svg";
import { Component } from "react";

class Footer extends Component {
    render() {
        return (
            <footer class="navbar navbar-dark spark-footer mt-auto" id="footerComponent">
                <div class="container pb-1">
                    <div class="row w-100 px-5 pt-3 pb-1">
                        <div class="col-3 px-5 ">
                            <img class="footer-logo" src={logo} />
                        </div>
                        <div class="col-3">
                            <span class="navbar-text">
                                <h5 class="text-light">Location</h5>
                                <p class="small">
                                    University of North Texas Libraries <br />
                                    1115 Union Circle #305190 <br />
                                    Denton, TX 76203-5017 <br />
                                    (940) 565-2411
                                </p>
                            </span>
                        </div>
                        <div class="col-3">
                            <span class="navbar-text">
                                <h5 class="text-light">Contact</h5>
                                <p class="small">
                                    <a href="mailto:thespark@unt.edu">TheSpark@unt.edu</a>
                                    <br />
                                    (940) 369-5259
                                    <br />
                                    Willis Library 135 <br />
                                    Discovery Park M130 <br />
                                </p>
                            </span>
                        </div>
                        <div class="col-3 text-end">
                            <span class="navbar-text">
                                <h5 class="text-light">Bug Report</h5>
                                <p class="small">
                                    Fill out the <a href="/bugreport">form</a>
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

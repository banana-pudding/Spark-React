import React from "react";
import { withRouter } from "react-router";
import { axiosInstance } from "../app";

class SignaturePage extends React.Component {
    state = {
        status: "SHOW_PATRON", //"SHOW_TECH", "SHOW_END"
        hasError: false,
        patronName: "",
        euid: "",
        password: "",
        fileIDs: [],
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let query = decodeURIComponent(this.props.location.search.slice(7));
        let fileIDs = query.split(",");
        this.setState({ fileIDs: fileIDs });
    }

    handleSignature() {
        axiosInstance
            .post("/pickup/patron", {
                fileIDs: this.state.fileIDs,
                patronName: this.state.patronName,
            })
            .then((res) => {
                this.setState({
                    status: "SHOW_TECH",
                });
            });
    }

    handleTechLogin() {
        axios
            .post("/pickup/tech", {
                fileIDs: this.state.fileIDs,
                euid: this.state.euid,
                password: this.state.password,
            })
            .then((res) => {
                console.log(res.data);
                if (res.data.completed) {
                    this.setState({
                        status: "SHOW_END",
                    });
                } else {
                    this.setState({
                        status: "SHOW_TECH",
                        hasError: true,
                    });
                }
            });
    }

    render() {
        const showError = () => {
            if (this.state.hasError) {
                return <div className="alert alert-danger">That didn't work. Try again?</div>;
            } else {
                return null;
            }
        };
        const formBody = () => {
            switch (this.state.status) {
                case "SHOW_PATRON":
                    return (
                        <React.Fragment>
                            <p className="lead">
                                By entering your full name below, you confirm that your print has been completed and has
                                been printed per specifications of initial review.
                            </p>
                            <form className="d-flex">
                                <input
                                    class="form-control form-control-lg me-2"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={this.state.patronName}
                                    onChange={(e) => {
                                        this.setState({
                                            patronName: e.target.value,
                                        });
                                    }}
                                />
                                <button
                                    class="btn btn-lg btn-success"
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.handleSignature();
                                    }}>
                                    Sign
                                </button>
                            </form>
                        </React.Fragment>
                    );
                case "SHOW_TECH":
                    return (
                        <React.Fragment>
                            <p className="lead">Confirm your euid and password to complete this pickup.</p>
                            {showError()}
                            <form>
                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="euidInput"
                                        placeholder="EUID"
                                        value={this.state.euid}
                                        onChange={(e) => {
                                            this.setState({
                                                euid: e.target.value,
                                            });
                                        }}
                                    />
                                    <label for="euidInput">EUID</label>
                                </div>
                                <div className="form-floating">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passInput"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={(e) => {
                                            this.setState({
                                                password: e.target.value,
                                            });
                                        }}
                                    />
                                    <label for="passInput">Password</label>
                                </div>
                                <div className="d-grid mt-3">
                                    <button
                                        className="btn btn-lg btn-success"
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.handleTechLogin();
                                        }}>
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </React.Fragment>
                    );
                case "SHOW_END":
                    return (
                        <React.Fragment>
                            <p>Thanks! You can close this window now</p>
                        </React.Fragment>
                    );
                default:
                    break;
            }
        };

        return (
            <div className="container px-5 mt-5">
                <div className="row">
                    <div className="col col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                        <div className="card shadow">
                            <div className="card-body">{formBody()}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SignaturePage);

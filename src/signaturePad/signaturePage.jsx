import React from "react";
import axios from "../common/axiosConfig";

class SignaturePage extends React.Component {
    state = {
        status: "IDLE",
        patronName: null,
        fileIDs: [],
    };

    constructor(props) {
        super(props);
    }

    handleSignature() {
        axios.post("/pickup/patron", { fileIDs: this.state.fileIDs });
    }

    render() {
        return (
            <div className="container px-5 mt-5">
                <div className="row">
                    <div className="col col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <p className="lead">
                                    By entering your full name below, you confirm that your print has been completed and
                                    has been printed per specifications of initial review.
                                </p>
                                <form className="d-flex">
                                    <input
                                        class="form-control form-control-lg me-2"
                                        type="search"
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignaturePage;

import React from "react";
import { Modal } from "bootstrap";
import { axiosInstance } from "../app";

class PatronModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.state = {
            submission: null,
        };
    }

    componentDidMount() {
        this.modal = new Modal(this.modalRef.current);
        this.modalInstance = Modal.getInstance(this.modalRef.current);
    }

    openModal(submission) {
        this.setState(
            {
                submission: submission,
            },
            () => {
                this.modalInstance.show();
            }
        );
    }

    updatePatron() {
        axiosInstance.post("/submissions/update-patron", this.state.submission).then(() => {
            this.props.updatePage();
        });
    }

    render() {
        const modalBody = () => {
            if (this.state.submission) {
                return (
                    <div className="modal-content">
                        <div className="modal-header card-header">
                            <h5 className="modal-title">Editing Patron Details</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3">
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="First"
                                            value={this.state.submission.patron.fname}
                                            onChange={(e) => {
                                                let submission = this.state.submission;
                                                submission.patron.fname = e.target.value;
                                                this.setState({
                                                    submission: submission,
                                                });
                                            }}
                                        />
                                        <label>First Name</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Last"
                                            value={this.state.submission.patron.lname}
                                            onChange={(e) => {
                                                let submission = this.state.submission;
                                                submission.patron.lname = e.target.value;
                                                this.setState({
                                                    submission: submission,
                                                });
                                            }}
                                        />
                                        <label>Last Name</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    class="form-control"
                                    placeholder="name@example.com"
                                    value={this.state.submission.patron.email}
                                    onChange={(e) => {
                                        let submission = this.state.submission;
                                        submission.patron.email = e.target.value;
                                        this.setState({
                                            submission: submission,
                                        });
                                    }}
                                />
                                <label>Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="1234567890"
                                    value={this.state.submission.patron.phone}
                                    onChange={(e) => {
                                        let submission = this.state.submission;
                                        submission.patron.phone = e.target.value;
                                        this.setState({
                                            submission: submission,
                                        });
                                    }}
                                />
                                <label>Phone</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="test"
                                    class="form-control"
                                    placeholder="abc0123"
                                    value={this.state.submission.patron.euid}
                                    onChange={(e) => {
                                        let submission = this.state.submission;
                                        submission.patron.euid = e.target.value;
                                        this.setState({
                                            submission: submission,
                                        });
                                    }}
                                />
                                <label>EUID</label>
                            </div>
                            <div className="d-grid">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        this.updatePatron();
                                    }}>
                                    Update Information
                                </button>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        };

        return (
            <div ref={this.modalRef} className="modal fade" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal">{modalBody()}</div>
            </div>
        );
    }
}

export default PatronModal;

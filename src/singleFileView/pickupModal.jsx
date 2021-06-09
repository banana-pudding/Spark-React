import React from "react";
import { Modal } from "bootstrap";
var QRCode = require("qrcode.react");

class PickupModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();

        this.state = {
            euid: null,
            password: null,
            fileIDs: [],
        };
    }

    componentDidMount() {
        this.modalBS = new Modal(this.modalRef.current);
        this.modal = Modal.getInstance(this.modalRef.current);
    }

    openModal(fileIDs) {
        this.setState(
            {
                status: "CHOSING_LOCATION",
                fileIDs: fileIDs,
            },
            () => {
                this.modal.show();
            }
        );
    }

    finishPickup() {
        this.ws.close();
    }

    render() {
        const modalBody = () => {
            switch (this.state.status) {
                case "CHOSING_LOCATION":
                    return (
                        <React.Fragment>
                            <p>Which location are you at?</p>
                            <div className="row g-2">
                                <div className="col">
                                    <button
                                        className="btn btn-blue w-100"
                                        onClick={() => {
                                            this.setState(
                                                {
                                                    status: "WAITING_FOR_PATRON",
                                                    pickupLocation: "Willis Library",
                                                },
                                                () => {
                                                    this.startPickup("Willis Library");
                                                }
                                            );
                                        }}>
                                        Willis Library
                                    </button>
                                </div>
                                <div className="col">
                                    <button
                                        className="btn btn-purple w-100"
                                        onClick={() => {
                                            this.setState(
                                                {
                                                    status: "WAITING_FOR_PATRON",
                                                    pickupLocation: "Discovery Park",
                                                },
                                                () => {
                                                    this.startPickup("Discovery Park");
                                                }
                                            );
                                        }}>
                                        Discovery Park
                                    </button>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                case "SHOW_QR":
                    return (
                        <React.Fragment>
                            <p>test</p>
                            <QRCode value="http://facebook.github.io/react/" />
                        </React.Fragment>
                    );
                case "CONFIRMING_LOGIN":
                    return (
                        <form>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.euid}
                                    onChange={(e) => {
                                        this.setState({ euid: e.target.value });
                                    }}
                                    id="confirmEUID"
                                    placeholder="euid"
                                />
                                <label for="confirmEUID">EUID</label>
                            </div>
                            <div className="form-floating">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPass"
                                    value={this.state.password}
                                    onChange={(e) => {
                                        this.setState({ password: e.target.value });
                                    }}
                                    placeholder="Password"
                                />
                                <label for="confirmPass">Password</label>
                            </div>
                            <div className="d-grid">
                                <button
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.finishPickup();
                                    }}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="modal fade" tabIndex="-1" ref={this.modalRef}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">{modalBody()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PickupModal;

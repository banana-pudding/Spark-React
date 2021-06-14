import React from "react";
import { Modal } from "bootstrap";
import idImage from "../common/images/id.jpg";
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
                fileIDs: fileIDs,
            },
            () => {
                this.modal.show();
            }
        );

        console.log(fileIDs);
    }

    generateQRLink = () => {
        let link = "/pickup?files=";
        let query = encodeURIComponent(this.state.fileIDs);
        return link + query;
    };

    render() {
        return (
            <div className="modal fade" tabIndex="-1" ref={this.modalRef}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div
                            className="card-img-top d-flex align-items-center justify-content-center"
                            style={{ maxHeight: "20rem", overflow: "hidden" }}>
                            <img src={idImage} style={{ width: "100%", height: "auto" }}></img>
                        </div>
                        <div className="modal-body">
                            <p className="h1">Remember to check the patron's ID card!</p>
                            <p>
                                After confirming the patron's ID, scan this QR code on an iPad to begin the pickup
                                process. Once the patron has signed, please confirm your euid and password on the iPad
                                to complete the pickup.
                            </p>
                            <div className="row">
                                <div className="col-4">
                                    <QRCode
                                        value={"https://sparkorders.library.unt.edu" + this.generateQRLink()}
                                        renderAs="svg"
                                        size="100%"
                                    />
                                </div>
                                <div className="col d-flex flex-column justify-content-between">
                                    <div className="alert alert-purple" role="alert">
                                        <p className="fs-4 mb-0">
                                            Don't forget to <strong>confirm your euid and password</strong> on the iPad
                                            after the patron has signed!
                                        </p>
                                    </div>
                                    <p>
                                        Refresh this page after both parties have finished confirming pickup to see
                                        changes!
                                    </p>

                                    <p className="mb-0 text-muted">
                                        Generated pickup link is:{" "}
                                        <a href={this.generateQRLink()}>{this.generateQRLink()}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PickupModal;

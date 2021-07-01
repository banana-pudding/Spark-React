import React from "react";
import { axiosInstance } from "../app";
import FormattedDate from "../common/formattedDate";
import { Modal } from "bootstrap";

class DetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
    }

    state = {
        image: null,
        printer: null,
    };

    componentDidMount() {
        this.modalBS = new Modal(this.modalRef.current);
        this.modal = Modal.getInstance(this.modalRef.current);
    }

    setPrinter = (printer) => {
        this.setState(
            {
                printer: printer,
            },
            () => {
                this.modal.show();
            }
        );
    };

    handleSubmit = () => {
        const data = new FormData();
    };

    render() {
        const modalBody = () => {
            if (this.state.printer) {
                let printer = this.state.printer;
                return (
                    <React.Fragment>
                        <h5>Printer Details</h5>
                        <table className="table table-sm">
                            <tbody>
                                <tr>
                                    <th scope="row">Name</th>
                                    <td>{printer.name}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Model</th>
                                    <td>{printer.model}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Description</th>
                                    <td>{printer.description}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Location</th>
                                    <td>{printer.location}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Service Level</th>
                                    <td>{printer.serviceLevel == "FULL_SERVICE" ? "Full Service" : "Self Service"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Barcode</th>
                                    <td>{printer.barcode}</td>
                                </tr>
                            </tbody>
                        </table>
                    </React.Fragment>
                );
            } else {
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

export default DetailsModal;

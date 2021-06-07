import React from "react";
import axios from "../common/axiosConfig";
import FormattedDate from "../common/formattedDate";
import { useHistory } from "react-router-dom";
import { Modal } from "bootstrap";

class FinishModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
    }

    state = {
        printer: null,
        finalWeight: null,
        finalWeightValid: false,
        confirmLocation: null,
    };

    componentDidMount() {
        this.modalBS = new Modal(this.modalRef.current);
        this.modal = Modal.getInstance(this.modalRef.current);
    }

    setPrinter = (printer) => {
        this.setState(
            {
                printer: printer,
                confirmLocation: printer.location,
            },
            () => {
                this.modal.show();
            }
        );
    };

    handleSubmit = () => {
        if (this.state.finalWeightValid) {
            let history = useHistory();
            axios
                .post("/attempts/finish/" + this.state.printer.currentAttempt._id, {
                    finalWeight: this.state.finalWeight,
                    finalLocation: this.state.confirmLocation,
                })
                .then((res) => {
                    history.push("/printers");
                });
        }
    };

    render() {
        const modalBody = () => {
            if (this.state.printer) {
                let printer = this.state.printer;
                let attempt = this.state.printer.currentAttempt;
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col">
                                <h3>Attempt Details:</h3>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th scope="row">Attempt ID</th>
                                            <td>
                                                <strong>{attempt.prettyID}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Started At</th>
                                            <td>
                                                <strong>
                                                    <FormattedDate date={attempt.timestampStarted} />
                                                </strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Started By</th>
                                            <td>
                                                <strong>{attempt.startedByName}</strong> ({attempt.startedByEUID})
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Printer</th>
                                            <td>
                                                <strong>{attempt.printerName}</strong> @ {attempt.location}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Filament</th>
                                            <td>
                                                <strong>{attempt.rollID}</strong> @ {attempt.startWeight}g
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">All Files in Attempt ({attempt.fileIDs.length})</th>
                                            <td>
                                                {attempt.fileNames.map((name, index) => {
                                                    return <p className="mb-0">{name}</p>;
                                                })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col">
                                <h3 className="mb-3">Finished Printing?</h3>
                                <form className="needs-validation" noValidate={true}>
                                    <div className="row g-3">
                                        <div className="col">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="number"
                                                    className={
                                                        "form-control " +
                                                        (this.state.finalWeightValid ? "is-valid" : "is-invalid")
                                                    }
                                                    value={this.state.finalWeight}
                                                    onChange={(e) => {
                                                        let finalWeight = e.target.value;
                                                        if (finalWeight > attempt.startWeight || finalWeight < 100) {
                                                            this.setState({
                                                                finalWeight: finalWeight,
                                                                finalWeightValid: false,
                                                            });
                                                        } else {
                                                            this.setState({
                                                                finalWeight: finalWeight,
                                                                finalWeightValid: true,
                                                            });
                                                        }
                                                    }}
                                                    id="finalWeight"
                                                    placeholder="Final Roll Weight"
                                                />
                                                <label for="finalWeight">Final Roll Weight</label>
                                                <div className="valid-feedback">
                                                    Weight Change: {attempt.startWeight - this.state.finalWeight}g
                                                </div>
                                                <div className="invalid-feedback">
                                                    {this.state.finalWeight < 200
                                                        ? "Please include the weight of the empty spool!"
                                                        : "Must be less than the start weight!"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-floating">
                                                <select
                                                    className="form-select is-valid"
                                                    id="confirmLocation"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            confirmLocation: e.target.value,
                                                        });
                                                    }}>
                                                    <option
                                                        value="Willis Library"
                                                        selected={printer.location == "Willis Library"}>
                                                        Willis Library
                                                    </option>
                                                    <option
                                                        value="Discovery Park"
                                                        selected={printer.location == "Discovery Park"}>
                                                        Discovery Park
                                                    </option>
                                                </select>
                                                <label htmlFor="confirmLocation">Confirm Print Location</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div className="row g-3 mb-3">
                                    <div className="col">
                                        <button className="btn fs-3 fw-bold btn-green w-100">Succeeded</button>
                                    </div>
                                    <div className="col">
                                        <button className="btn fs-3 fw-bold btn-red w-100">Failed</button>
                                    </div>
                                </div>
                                <p className="small">
                                    Please make sure to double check the printed location before marking an attempt as a
                                    success! This information will be used when sending the patron email updates on
                                    whether their files are ready to be picked up or if they are in transit to their
                                    requested pickup location.
                                </p>
                                <p className="small">
                                    Pickup emails will be <strong>automatically</strong> sent to the patron when all
                                    files in their request have been marked as successfully printed <strong>AND</strong>{" "}
                                    are all at their requested pickup location! If some files are printed at another
                                    location, the patron will be notified when all files have arrived at the requested
                                    pickup location.
                                </p>
                            </div>
                        </div>
                    </React.Fragment>
                );
            } else {
                return null;
            }
        };

        return (
            <div className="modal fade" tabIndex="-1" ref={this.modalRef}>
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-body">{modalBody()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FinishModal;

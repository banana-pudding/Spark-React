import React from "react";
import axios from "../common/axiosConfig";
import { Modal } from "bootstrap";
import "./scss/modal.scss";

class StartJobModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFileIDs: [],
            selectedFileNames: [],
            selectedPrinterID: null,
            selectedPrinterName: null,
            rollID: null,
            initialWeight: 0,
        };
        this.modalRef = React.createRef();
    }

    componentDidMount() {
        this.modalBS = new Modal(this.modalRef.current);
        this.modal = Modal.getInstance(this.modalRef.current);
    }

    openModal = (selectedFileIDs, selectedFileNames, selectedPrinterID, selectedPrinterName) => {
        this.setState(
            {
                selectedFileIDs: selectedFileIDs,
                selectedFileNames: selectedFileNames,
                selectedPrinterID: selectedPrinterID,
                selectedPrinterName: selectedPrinterName,
            },
            () => {
                this.modal.show();
            }
        );
    };

    handleStartJob = () => {
        axios
            .post("/attempts/new", {
                fileIDs: this.state.selectedFileIDs,
                fileNames: this.state.selectedFileNames,
                printerID: this.state.selectedPrinterID,
                rollID: this.state.rollID,
                initialWeight: this.state.initialWeight,
            })
            .then((res) => {
                this.modal.hide();
                this.props.reloadPage();
            });
    };

    render() {
        return (
            <div className="modal fade" tabIndex="-1" ref={this.modalRef}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Begin Print Job</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-4">
                                    <ul className="list-group">
                                        <li className="list-group-item fw-bold list-group-item-secondary" key="header">
                                            <h5 className="mb-0">Printing on {this.state.selectedPrinterName}</h5>
                                        </li>
                                        {this.state.selectedFileNames.map((fileName, index) => {
                                            return (
                                                <li className="list-group-item" key={index}>
                                                    {fileName}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="col">
                                    <form>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="FS-PLA-1-001"
                                                value={this.state.rollID}
                                                onChange={(e) => {
                                                    this.setState({ rollID: e.target.value });
                                                }}
                                                required
                                            />
                                            <label>Filament Roll ID</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="1000"
                                                value={this.state.initialWeight}
                                                onChange={(e) => {
                                                    this.setState({ initialWeight: e.target.value });
                                                }}
                                                required
                                            />
                                            <label>Initial Roll Weight</label>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <button
                                                className="btn btn-lg btn-success"
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.handleStartJob();
                                                }}>
                                                Start Job
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StartJobModal;

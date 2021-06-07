import React from "react";
import axios from "../common/axiosConfig";
import { Modal } from "bootstrap";
import { withRouter } from "react-router-dom";

class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
    }

    state = {
        image: null,
        printer: null,
        makingNewPrinter: false,
        inputData: {
            name: null,
            shortName: null,
            model: null,
            location: null,
            serviceLevel: null,
            barcode: null,
        },
    };

    componentDidMount() {
        this.modalBS = new Modal(this.modalRef.current);
        this.modal = Modal.getInstance(this.modalRef.current);
    }

    setPrinter = (printer) => {
        this.setState(
            {
                makingNewPrinter: false,
                printer: printer,
                inputData: {
                    name: printer.name,
                    shortName: printer.shortName,
                    model: printer.model,
                    location: printer.location,
                    description: printer.description,
                    serviceLevel: printer.serviceLevel,
                    barcode: printer.barcode,
                },
            },
            () => {
                this.modal.show();
            }
        );
    };

    newPrinter = (location, serviceLevel) => {
        this.setState(
            {
                makingNewPrinter: true,
                inputData: {
                    name: "",
                    shortName: "",
                    model: "",
                    location: location,
                    description: "",
                    serviceLevel: serviceLevel,
                    barcode: "",
                },
            },
            () => {
                this.modal.show();
            }
        );
    };

    handleImageUpload = (e) => {
        var file = e.target.files[0];
        this.setState({
            image: file,
        });

        console.log(file);
    };

    handleSubmit = () => {
        const data = new FormData();
        let jsonObject = this.state.inputData;
        data.append("jsonData", JSON.stringify(jsonObject));
        data.append("files", this.state.image);

        if (this.state.makingNewPrinter) {
            console.log("new");
            axios.post("/printers/new", data).then((res) => {
                console.log("done");
                this.props.history.go(0);
            });
        } else {
            axios.post("/printers/update/" + this.state.printer._id, data).then((res) => {
                console.log("done");
                this.props.history.go(0);
            });
        }
    };

    handleDelete = () => {
        axios.post("/printers/delete/" + this.state.printer._id).then((res) => {
            console.log("done");
            this.props.history.go(0);
        });
    };

    render() {
        const modalBody = () => {
            if (this.state.printer || this.state.makingNewPrinter) {
                let inputData = this.state.inputData;
                return (
                    <div className="modal-content">
                        {/* <div className="modal-header">
                            <h4>Editing {this.state.printer.name}</h4>
                        </div> */}
                        <div className="modal-body">
                            <form>
                                <div className="row g-3">
                                    <div className="col">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="name"
                                                value={inputData.name}
                                                onChange={(e) => {
                                                    let newData = inputData;
                                                    newData.name = e.target.value;
                                                    this.setState({
                                                        inputData: newData,
                                                    });
                                                }}
                                            />
                                            <label>Name</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="model"
                                                value={inputData.model}
                                                onChange={(e) => {
                                                    let newData = inputData;
                                                    newData.model = e.target.value;
                                                    this.setState({
                                                        inputData: newData,
                                                    });
                                                }}
                                            />
                                            <label>Model</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="description"
                                                value={inputData.shortName}
                                                onChange={(e) => {
                                                    let newData = inputData;
                                                    newData.shortName = e.target.value;
                                                    this.setState({
                                                        inputData: newData,
                                                    });
                                                }}
                                            />
                                            <label>Short Name</label>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="name"
                                                value={inputData.description}
                                                onChange={(e) => {
                                                    let newData = inputData;
                                                    newData.description = e.target.value;
                                                    this.setState({
                                                        description: newData,
                                                    });
                                                }}
                                            />
                                            <label>Description</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col">
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select"
                                                onChange={(e) => {
                                                    let newData = inputData;
                                                    newData.location = e.target.value;
                                                    this.setState({
                                                        inputData: newData,
                                                    });
                                                }}>
                                                <option
                                                    value="Willis Library"
                                                    selected={inputData.location == "Willis Library"}>
                                                    Willis Library
                                                </option>
                                                <option
                                                    value="Discovery Park"
                                                    selected={inputData.location == "Discovery Park"}>
                                                    Discovery Park
                                                </option>
                                            </select>
                                            <label>Location</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select"
                                                onChange={(e) => {
                                                    let newData = inputData;
                                                    newData.serviceLevel = e.target.value;
                                                    this.setState({
                                                        inputData: newData,
                                                    });
                                                }}>
                                                <option
                                                    value="FULL_SERVICE"
                                                    selected={inputData.serviceLevel == "FULL_SERVICE"}>
                                                    Full Service
                                                </option>
                                                <option
                                                    value="SELF_SERVICE"
                                                    selected={inputData.serviceLevel == "SELF_SERVICE"}>
                                                    Self Service
                                                </option>
                                            </select>
                                            <label>Service Level</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <label htmlFor="formFile" className="col-3 col-form-label">
                                        Printer Icon:
                                    </label>
                                    <div className="col">
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="printerImage"
                                            onInput={(e) => {
                                                this.handleImageUpload(e);
                                            }}></input>
                                    </div>
                                </div>

                                <div className="d-grid mt-3">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                        onClick={() => {
                                            this.handleSubmit();
                                        }}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <hr />
                            <div className="d-grid mt-3">
                                <button
                                    className="btn btn-danger"
                                    type="submit"
                                    onClick={() => {
                                        this.handleDelete();
                                    }}>
                                    Delete Printer
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
            <div className="modal fade" tabIndex="-1" ref={this.modalRef}>
                <div className="modal-dialog modal-dialog-centered">{modalBody()}</div>
            </div>
        );
    }
}

export default withRouter(EditModal);

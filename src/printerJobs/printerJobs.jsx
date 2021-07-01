import React from "react";
import { axiosInstance } from "../app";
import FormattedDate from "../common/formattedDate";
import StartModal from "./startJobModal";
import EditModal from "./editPrinterModal";
import DetailsModal from "./detailsModal";
import FinishModal from "./finishJobModal";
import { withRouter } from "react-router-dom";

//import Ender5 from "../common/images/Ender-5-Plus-Hero.jpeg";

import "./scss/jobs.scss";

class ManageJobs extends React.Component {
    state = {
        willisFullService: [],
        willisSelfService: [],
        dpFullService: [],
        dpSelfService: [],
        submissions: [],
        selectedFileIDs: [],
        selectedFileNames: [],
        selectedPrinterID: null,
        selectedPrinterName: null,
        showLocation: "willis",
    };

    constructor(props) {
        super(props);
        this.editModal = React.createRef();
        this.detailsModal = React.createRef();
        this.startModal = React.createRef();
        this.finishModal = React.createRef();
        this.fetchPrinters();
        this.fetchReadyFiles();
        this.reloadPage = this.reloadPage.bind(this);
    }

    reloadPage = () => {
        console.log("here");
        this.props.history.go(0);
    };

    fetchPrinters = () => {
        this.setState({
            willisFullService: [],
            willisSelfService: [],
            dpFullService: [],
            dpSelfService: [],
        });
        axios
            .get("/printers/list")
            .then((res) => {
                var willisFullService = [],
                    willisSelfService = [],
                    dpFullService = [],
                    dpSelfService = [];
                for (var printer of res.data.printers) {
                    if (printer.serviceLevel == "FULL_SERVICE") {
                        if (printer.location == "Willis Library") {
                            willisFullService.push(printer);
                        } else {
                            dpFullService.push(printer);
                        }
                    } else {
                        if (printer.location == "Willis Library") {
                            willisSelfService.push(printer);
                        } else {
                            dpSelfService.push(printer);
                        }
                    }
                }
                this.setState({
                    willisFullService: willisFullService,
                    willisSelfService: willisSelfService,
                    dpFullService: dpFullService,
                    dpSelfService: dpSelfService,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    fetchReadyFiles = () => {
        this.setState({
            submissions: [],
        });

        axios
            .get("/submissions/ready-queue")
            .then((res) => {
                this.setState({
                    submissions: res.data.submissions,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    openNewPrinterModal = (location, serviceLevel) => {
        this.editModal.current.newPrinter(location, serviceLevel);
    };

    render() {
        const addButton = (location, serviceLevel) => {
            if (this.props.user.isAdmin) {
                return (
                    <button
                        className="btn btn-sm ms-3 btn-light border rounded-circle p-1 fs-5"
                        style={{ lineHeight: "1rem" }}
                        onClick={() => {
                            this.openNewPrinterModal(location, serviceLevel);
                        }}>
                        <i className="bi bi-plus-lg"></i>
                    </button>
                );
            } else {
                return null;
            }
        };

        const submissionList = () => {
            return (
                <div className="card mb-3 shadow">
                    <div className="card-body">
                        <h3 className="card-title mb-3">Step 1: Select Files</h3>
                        <p>
                            Select a group of files to begin printing. For multiple copies on one bed, select as many
                            copies as will be printed at once.
                        </p>
                        {this.state.submissions.map((submission, subIndex) => {
                            return (
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <p className="mb-0">
                                            <strong>
                                                {submission.patron.fname} {submission.patron.lname}
                                            </strong>
                                            {" - "}
                                            {submission.isForClass
                                                ? "Class Submission"
                                                : submission.isForDepartment
                                                ? "Departmental Submission"
                                                : "Personal Submission"}
                                        </p>
                                        <small className="text-muted">
                                            {submission.files[0].payment.paymentType.charAt(0) +
                                                submission.files[0].payment.paymentType.toLowerCase().slice(1) +
                                                " on "}
                                            <FormattedDate date={submission.payment.timestampPaid} />
                                        </small>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {submission.files.map((file, fileIndex) => {
                                            return (
                                                <li className="list-group-item p-0" key={fileIndex}>
                                                    <label
                                                        className="form-check-label w-100 py-2 px-3 d-flex flex-row"
                                                        htmlFor={file._id}>
                                                        <input
                                                            className="form-check-input me-2"
                                                            type="checkbox"
                                                            value=""
                                                            checked={this.state.selectedFileIDs.includes(file._id)}
                                                            onChange={() => {
                                                                let tempFileIDs = this.state.selectedFileIDs;
                                                                let tempFileNames = this.state.selectedFileNames;
                                                                const idIndex = tempFileIDs.indexOf(file._id);
                                                                if (idIndex > -1) {
                                                                    tempFileIDs.splice(idIndex, 1);
                                                                    tempFileNames.splice(idIndex, 1);
                                                                } else {
                                                                    tempFileIDs.push(file._id);
                                                                    tempFileNames.push(file.fileName);
                                                                }
                                                                this.setState({
                                                                    selectedFileIDs: tempFileIDs,
                                                                    selectedFileNames: tempFileNames,
                                                                });
                                                            }}
                                                            id={file._id}
                                                        />
                                                        <div className="d-flex flex-lg-grow-1 flex-row justify-content-between">
                                                            <span className="flex-shrink-1 overflow-hidden">
                                                                {file.fileName}
                                                            </span>
                                                            <span className="text-muted small">
                                                                {file.request.pickupLocation}
                                                            </span>
                                                        </div>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        };

        const printerActions = (printer) => {
            if (printer.status == "PRINTING") {
                let numFiles = printer.currentAttempt.fileNames.length;
                return (
                    <button
                        className="btn btn-light fw-bold w-100"
                        style={{ position: "relative" }}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            this.finishModal.current.setPrinter(printer);
                        }}>
                        {printer.currentAttempt.prettyID}
                        <div className="numfiles d-flex justify-content-center align-items-center rounded-pill bg-danger">
                            <span className="text-light">{numFiles}</span>
                        </div>
                    </button>
                );
            } else {
                let numSelected = this.state.selectedFileIDs.length;
                if (numSelected > 0) {
                    return (
                        <button
                            className="btn btn-lightgrey border w-100"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setState({
                                    selectedPrinterID: printer._id,
                                    selectedPrinterName: printer.name,
                                });
                                this.startModal.current.openModal(
                                    this.state.selectedFileIDs,
                                    this.state.selectedFileNames,
                                    printer._id,
                                    printer.name
                                );
                            }}>
                            Start Printing
                        </button>
                    );
                } else {
                    return <p className="mb-0 fake-button text-muted">Not Printing</p>;
                }
            }
        };

        const printerCards = (listName) => {
            return (
                <div className="row row-cols-2 g-2 mt-2">
                    {this.state[listName].map((printer, index) => {
                        return (
                            <div className="col">
                                <div className="printer-container">
                                    <button
                                        className={
                                            "btn text-start p-0 w-100 " +
                                            (printer.status == "PRINTING"
                                                ? " btn-lightblue progress-bar-striped progress-bar-animated"
                                                : " btn-light border")
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.detailsModal.current.setPrinter(printer);
                                        }}>
                                        <div className="row h-100 g-0">
                                            <div className="col-4">
                                                <div
                                                    className="h-100 overflow-hidden rounded-start"
                                                    style={{
                                                        backgroundImage: `url(printers/thumbnail/${printer._id})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center center",
                                                    }}></div>
                                            </div>
                                            <div className="col">
                                                <div className="card-body p-2">
                                                    <h5 className="card-title">{printer.name}</h5>
                                                    <h6 className="card-subtitle mb-2" style={{ opacity: 0.75 }}>
                                                        {printer.model}
                                                    </h6>
                                                    {printerActions(printer)}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    {this.props.user.isAdmin && (
                                        <div className="overlay-button">
                                            <button
                                                className={
                                                    "btn btn-sm rounded-circle" +
                                                    (printer.status == "PRINTING" ? " text-light" : "")
                                                }
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.editModal.current.setPrinter(printer);
                                                }}>
                                                <i className="bi bi-gear"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        };

        return (
            <div className="container-fluid mt-4 px-5 jobs-page">
                <div className="row mb-5">
                    <div className="col-3">{submissionList()}</div>
                    <div className="col-9">
                        <div className="card shadow">
                            <div className="card-body">
                                <h3>Step 2: Start Printing</h3>
                                <p>
                                    With files selected, click the "Start Printing" button on a printer. To view details
                                    about a printer and current running job, click anywhere on a printer to open the
                                    details menu.
                                </p>
                            </div>
                            <h4 className="card-header border-top">Willis Library</h4>
                            <div className="card-body">
                                <div className="row mb-3 g-5">
                                    <div className="col-xl-6">
                                        <h5>Full Service {addButton("Willis Library", "FULL_SERVICE")}</h5>
                                        {printerCards("willisFullService")}
                                    </div>
                                    <div className="col-xl-6">
                                        <h5>Self Service {addButton("Willis Library", "SELF_SERVICE")}</h5>
                                        {printerCards("willisSelfService")}
                                    </div>
                                </div>
                            </div>
                            <h4 className="card-header border-top">Discovery Park</h4>
                            <div className="card-body">
                                <div className="row mb-3 g-5">
                                    <div className="col-xl-6">
                                        <h5>Full Service {addButton("Discovery Park", "FULL_SERVICE")}</h5>
                                        {printerCards("dpFullService")}
                                    </div>
                                    <div className="col-xl-6">
                                        <h5>Self Service {addButton("Discovery Park", "SELF_SERVICE")}</h5>
                                        {printerCards("dpSelfService")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <StartModal ref={this.startModal} reloadPage={this.reloadPage.bind(this)} />
                <EditModal ref={this.editModal} reloadPage={this.reloadPage.bind(this)} />
                <DetailsModal ref={this.detailsModal} />
                <FinishModal ref={this.finishModal} reloadPage={this.reloadPage.bind(this)} />
            </div>
        );
    }
}

export default withRouter(ManageJobs);

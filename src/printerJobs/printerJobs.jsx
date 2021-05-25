import React from "react";
import axios from "../common/axiosConfig";
import { formatDate } from "../common/utils";
import "./css/jobs.scss";

class ManageJobs extends React.Component {
    state = {
        willisFullService: [],
        willisSelfService: [],
        dpFullService: [],
        dpSelfService: [],
        submissions: [],
        selectedFileIDs: [],
    };

    constructor(props) {
        super(props);
        this.fetchPrinters();
        this.fetchReadyFiles();
    }

    fetchPrinters = () => {
        this.setState({
            willisFullService: [],
            willisSelfService: [],
            dpFullService: [],
            dpSelfService: [],
        });
        axios
            .get("/printers")
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
            .post("/submissions/filter", {
                status: ["READY_TO_PRINT"],
                paymentType: ["PAID", "WAIVED", "UNPAID"],
                pickupLocation: ["Willis Library", "Discovery Park"],
                reviewLocation: ["Willis Library", "Discovery Park"],
                showPersonal: true,
                showClass: true,
                showInternal: true,
                showFullSubmission: false,
            })
            .then((res) => {
                this.setState({
                    submissions: res.data.submissions,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        const submissionList = () => {
            return (
                <div className="card mb-3 shadow">
                    <div className="card-body">
                        <h4 className="card-title mb-3">Select Files to Print</h4>
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
                                                " on " +
                                                formatDate(submission.timestampPaid)}
                                        </small>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {submission.files.map((file, fileIndex) => {
                                            return (
                                                <li className="list-group-item" key={fileIndex}>
                                                    <input
                                                        class="form-check-input me-2"
                                                        type="checkbox"
                                                        checked={this.state.selectedFileIDs.includes(file._id)}
                                                        onChange={() => {
                                                            let tempFileIDs = this.state.selectedFileIDs;

                                                            if (tempFileIDs.includes(file._id)) {
                                                                tempFileIDs = tempFileIDs.filter((e) => e != file._id);
                                                            } else {
                                                                tempFileIDs.push(file._id);
                                                            }

                                                            this.setState({
                                                                selectedFileIDs: tempFileIDs,
                                                            });
                                                        }}
                                                    />
                                                    {file.fileName}
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
        const printerList = (listName) => {
            return (
                <ul className="list-group">
                    {this.state[listName].map((printer, index) => {
                        return (
                            <li className="list-group-item">
                                <div className="d-flex w-100 justify-content-between">
                                    <h6 className="mb-1">
                                        {printer.name} <small className="text-muted">{" - " + printer.model}</small>
                                    </h6>
                                    <small className="text-muted">
                                        {printer.status.charAt(0) + printer.status.slice(1).toLowerCase()}
                                    </small>
                                </div>
                                <div className="d-grid gap-2 mt-2">
                                    <button
                                        className="btn btn-light"
                                        type="button"
                                        disabled={!this.state.selectedFileIDs.length && printer.status == "IDLE"}>
                                        Print Files Here
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            );
        };

        return (
            <div className="container-fluid mt-4 px-5 jobs-page">
                <div className="row">
                    <div className="col-3">{submissionList()}</div>
                    <div className="col">
                        <div className="card shadow mb-3">
                            <div className="card-body">
                                <h4>Willis Library</h4>
                                <div className="row">
                                    <div className="col">
                                        <h5 className="text-muted">Full-Service</h5>
                                        {printerList("willisFullService")}
                                    </div>
                                    <div className="col">
                                        <h5 className="text-muted">Self-Service</h5>
                                        {printerList("willisSelfService")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card shadow mb-3">
                            <div className="card-body">
                                <h4>Discovery Park</h4>
                                <div className="row">
                                    <div className="col">
                                        <h5 className="text-muted">Full-Service</h5>
                                        {printerList("dpFullService")}
                                    </div>
                                    <div className="col">
                                        <h5 className="text-muted">Self-Service</h5>
                                        {printerList("dpSelfService")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManageJobs;

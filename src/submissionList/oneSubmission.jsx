import React from "react";
import FormattedDate from "../common/formattedDate";
import StatusFlag from "./flags/statusFlag";
import axios from "../common/axiosConfig";
import { statusText } from "../common/utils";
import { withRouter } from "react-router-dom";

class SingleSubmission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            printPage: props.printPage,
        };
    }

    handleRequestPayment() {
        axios
            .post("/submissions/requestpayment/" + this.state.item._id)
            .then((res) => {
                this.props.history.go(0);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleWaive() {
        axios
            .post("/submissions/waive/" + this.state.item._id)
            .then((res) => {
                this.props.history.go(0);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleUndoWaive() {
        axios
            .post("/submissions/undowaive/" + this.state.item._id)
            .then((res) => {
                this.props.history.go(0);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleDeleteFile(fileID) {
        axios
            .post("/submissions/delete/file/" + fileID)
            .then((res) => {
                this.props.history.go(0);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        let submission = this.state.item;
        let submittedDate = new Date(submission.timestampSubmitted);
        let reviewDate = new Date(submission.timestampPaymentRequested);
        let paidDate = new Date(submission.timestampPaid);

        let totalMinutes = submission.sums.totalHours * 60 + submission.sums.totalMinutes;
        let finalHours = Math.floor(totalMinutes / 60);
        let finalMintes = totalMinutes % 60;

        const requestInfo = (file) => {
            if (file.request.material == "Any Material" && file.request.color == "Any Color") {
                return "Any Filament";
            } else {
                return (
                    (file.request.color == "Any Color" ? "Any" : file.request.color) +
                    " " +
                    (file.request.material == "Any Material" ? "Filament" : file.request.material)
                );
            }
        };

        const readyBorder = () => {
            if (submission.allFilesReviewed && reviewDate < new Date("1980")) {
                return " border-green border-2 bg-highlightgreen";
            } else {
                return null;
            }
        };

        return (
            <div className={"card shadow mb-3 " + readyBorder()} key={this.props.index}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12  col-xxl-custom-left">
                            <div className="row">
                                <div className="col-12 col-md-4 col-xxl-12">
                                    <h5 className="card-title mb-2">
                                        {submission.patron.fname + " " + submission.patron.lname}
                                    </h5>
                                    <h6 className="card-subtitle mb-3 text-muted">
                                        {submission.isForClass
                                            ? "Class Submission"
                                            : submission.isForDepartment
                                            ? "Departmental Submission"
                                            : "Personal Submission"}
                                    </h6>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4 col-xxl-12">
                                    {/* {submissionDetails()} */}
                                    {submission.isForClass && (
                                        <table className="table mb-0 table-sm table-borderless text-nowrap text-capitalize border-top border-bottom top-table">
                                            <tbody>
                                                <tr>
                                                    <td className="ps-0">{submission.projectType}</td>
                                                    <td>{submission.classCode}</td>
                                                </tr>
                                                <tr>
                                                    <td className="ps-0 text-muted" colSpan="2">
                                                        {submission.professor}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}
                                    {submission.isForDepartment && (
                                        <table className="table mb-0 table-sm table-borderless text-nowrap text-capitalize border-top border-bottom top-table">
                                            <tbody>
                                                <tr>
                                                    <td className="ps-0">{submission.department}</td>
                                                    <td>{submission.departmentProject}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}
                                    <table
                                        className={
                                            "table mb-2 table-sm table-borderless text-nowrap border-top border-bottom bottom-table " +
                                            (submission.isForClass || submission.isForDepartment
                                                ? "has-top-table"
                                                : "no-top-table")
                                        }>
                                        <tbody>
                                            <tr>
                                                <td className="ps-0 text-muted">Submitted</td>
                                                <td>
                                                    <FormattedDate date={submittedDate} />
                                                </td>
                                            </tr>
                                            {reviewDate > new Date("1980") && (
                                                <tr>
                                                    <td className="ps-0 text-muted">Reviewed</td>
                                                    <td>
                                                        <FormattedDate date={reviewDate} />
                                                    </td>
                                                </tr>
                                            )}
                                            {paidDate > new Date("1980") && (
                                                <tr>
                                                    <td className="ps-0 text-muted">Paid</td>
                                                    <td>
                                                        <FormattedDate date={paidDate} />
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-12 col-sm-6 col-md-4 col-xxl-12">
                                    <div className="d-grid gap-1 mt-2">
                                        {/* ------------------------- Request Payment Button ------------------------- */}
                                        {reviewDate < new Date("1980") && (
                                            <button
                                                type="button"
                                                className={
                                                    "btn " +
                                                    (submission.allFilesReviewed
                                                        ? "btn-primary"
                                                        : "btn-outline-primary ")
                                                }
                                                onClick={() => {
                                                    this.handleRequestPayment();
                                                }}
                                                disabled={!submission.allFilesReviewed}>
                                                <div className="d-flex flex-row">
                                                    <i className="bi bi-cash-coin"></i>
                                                    <span className="flex-grow-1 px-1">Request Payment</span>
                                                </div>
                                            </button>
                                        )}

                                        {/* -------------------------- Resend Payment -------------------------- */}
                                        {reviewDate > new Date("1980") && paidDate < new Date("1980") && (
                                            <React.Fragment>
                                                {/*  ------------------------ Admin only approve waive ------------------------  */}
                                                {this.props.user.isAdmin && submission.isPendingWaive && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-lime"
                                                        onClick={() => {
                                                            this.handleWaive();
                                                        }}>
                                                        <div className="d-flex flex-row">
                                                            <i className="bi bi-hand-thumbs-up-fill"></i>
                                                            <span className="flex-grow-1 px-1">Approve Waive</span>
                                                        </div>
                                                    </button>
                                                )}

                                                {/* ------------------- request/undo or accept/reject waive ------------------ */}
                                                <button
                                                    type="button"
                                                    className={
                                                        "btn " +
                                                        (submission.isPendingWaive
                                                            ? this.props.user.isAdmin
                                                                ? "btn-red"
                                                                : "btn-orange"
                                                            : this.props.user.isAdmin
                                                            ? "btn-lime"
                                                            : "btn-orange")
                                                    }
                                                    onClick={() => {
                                                        if (submission.isPendingWaive) {
                                                            this.handleUndoWaive();
                                                        } else {
                                                            this.handleWaive();
                                                        }
                                                    }}>
                                                    <div className="d-flex flex-row">
                                                        <i
                                                            className={
                                                                "bi " +
                                                                (submission.isPendingWaive
                                                                    ? this.props.user.isAdmin
                                                                        ? "bi-hand-thumbs-down-fill"
                                                                        : "bi-x-lg"
                                                                    : this.props.user.isAdmin
                                                                    ? "bi-cash-coin"
                                                                    : "bi-asterisk")
                                                            }></i>
                                                        <span className="flex-grow-1 px-1">
                                                            {submission.isPendingWaive
                                                                ? this.props.user.isAdmin
                                                                    ? "Reject Waive"
                                                                    : "Undo Waive Request"
                                                                : this.props.user.isAdmin
                                                                ? "Waive Payment"
                                                                : "Request Waive"}
                                                        </span>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-purple"
                                                    onClick={() => {
                                                        this.handleRequestPayment();
                                                    }}>
                                                    <div className="d-flex flex-row">
                                                        <i className="bi bi-envelope-open"></i>
                                                        <span className="flex-grow-1 px-1">Resend Payment Email</span>
                                                    </div>
                                                </button>
                                            </React.Fragment>
                                        )}
                                        {/* ------------------------ Download All Files Button ----------------------- */}
                                        <button type="button" className="btn btn-lightblue">
                                            <div className="d-flex flex-row">
                                                <i className="bi bi-file-earmark-zip"></i>
                                                <span className="flex-grow-1 px-1">Download All Files</span>
                                            </div>
                                        </button>

                                        {/* ------------------------- Pickup Full Submission ------------------------- */}
                                        <button type="button" className="btn btn-pink">
                                            <div className="d-flex flex-row">
                                                <i className="bi bi-person-check"></i>
                                                <span className="flex-grow-1 px-1">Pick Up All Files</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-xxl-custom-right">
                            <div className="card">
                                <table className="table table-hover mb-0">
                                    <thead className="card-header">
                                        <tr>
                                            <th style={{ width: "44%" }}>Filename</th>
                                            <th>Filament</th>
                                            <th>Volume</th>
                                            <th>Weight</th>
                                            <th>Time</th>
                                            <th>Pickup</th>
                                            <th style={{ width: "0%" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submission.files.map((file, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <a
                                                            className={
                                                                "text-decoration-none fw-bold me-2 " + statusText(file)
                                                            }
                                                            href={"/files/" + file._id}>
                                                            {file.fileName}
                                                        </a>
                                                        <StatusFlag file={file} />
                                                    </td>
                                                    <td className="text-nowrap text-capitalize">{requestInfo(file)}</td>
                                                    <td className="text-nowrap">
                                                        {file.review.calculatedVolumeCm} cm<sup>3</sup>
                                                    </td>
                                                    <td className="text-nowrap">{file.review.slicedGrams}g</td>
                                                    <td className="text-nowrap">
                                                        {file.review.slicedHours}h {file.review.slicedMinutes}m
                                                    </td>
                                                    <td className="text-nowrap">{file.request.pickupLocation}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-link text-danger p-0"
                                                            onClick={() => {
                                                                this.handleDeleteFile(file._id);
                                                            }}>
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="card-footer">
                                            <th scope="row">Totals</th>
                                            <td></td>
                                            <th scope="row" className="text-nowrap">
                                                {submission.sums.totalVolume.toFixed(2)} cm<sup>3</sup>
                                            </th>
                                            <th scope="row" className="text-nowrap">
                                                {submission.sums.totalWeight}g
                                            </th>
                                            <th scope="row" className="text-nowrap">
                                                {finalHours}h {finalMintes}m
                                            </th>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SingleSubmission);

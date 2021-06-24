import React from "react";
import "./scss/requestAndReview.scss";
// import StlImage from "../common/images/stl.png";
import StlImage from "./res/block.svg";
// import GcodeImage from "./res/sd.svg";
import GcodeImage from "./res/block.svg";
import FormattedDate from "../common/formattedDate";
import axios from "../common/axiosConfig";
import fileDownload from "js-file-download";

class RequestAndReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stlBlob: null,
            gcodeBlob: null,
        };
    }

    render() {
        let file = this.props.file;
        let submission = this.props.submission;

        const unsentWarning = () => {
            if (file.status == "REVIEWED") {
                return " border border-2 border-orange";
            } else {
                return null;
            }
        };

        const downloadSTL = () => {
            axios
                .get("/download/stl/" + this.props.file._id, {
                    responseType: "blob",
                })
                .then((res) => {
                    fileDownload(res.data, this.props.file.fileName);
                });
        };

        const downloadGCODE = () => {
            axios
                .get("/download/gcode/" + this.props.file._id, {
                    responseType: "blob",
                })
                .then((res) => {
                    fileDownload(res.data, this.props.file.review.gcodeName);
                });
        };

        const lastReviewTime = () => {
            if (file.status == "UNREVIEWED") {
                return "Not Reviewed Yet";
            } else {
                return <FormattedDate date={file.review.timestampReviewed} />;
            }
        };

        const paymentRequestedTime = () => {
            if (file.status == "REVIEWED" || file.status == "UNREVIEWED") {
                return "Not Requested Yet";
            } else {
                return <FormattedDate date={submission.paymentRequest.timestampPaymentRequested} />;
            }
        };

        return (
            <div className="card shadow mb-3">
                <div className="card-header bg-transparent">
                    <h5 className="mb-0">
                        {submission.patron.fname} {submission.patron.lname}
                    </h5>
                    <p className="text-muted small mb-2">
                        {submission.patron.email} - {submission.patron.phone} - {submission.patron.euid}
                    </p>
                </div>
                <div className="card-header">
                    <div className="row text-center">
                        <div className="col">
                            Submitted
                            <br />
                            <strong>
                                <FormattedDate date={submission.submissionDetails.timestampSubmitted} />
                            </strong>
                        </div>
                        <div className="col">
                            Last Review
                            <br />
                            <strong>{lastReviewTime()}</strong>
                        </div>
                        <div className="col">
                            Payment Requested
                            <br />
                            <strong>{paymentRequestedTime()}</strong>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-column">
                        <small className="text-muted">
                            <FormattedDate date={submission.submissionDetails.timestampSubmitted} />
                        </small>
                        <div className="grey-bubble mb-2">
                            <div className="d-flex flex-row align-items-center">
                                <div className="stl-label me-3">
                                    <img
                                        className="download-image link-primary stl-image"
                                        src={StlImage}
                                        alt="Download STL"
                                        onClick={() => {
                                            downloadSTL();
                                        }}
                                    />
                                </div>

                                <div>
                                    <div
                                        className="h4 mb-2 mt-1 link-lightblue text-break"
                                        onClick={() => {
                                            downloadSTL();
                                        }}>
                                        {file.fileName}
                                    </div>
                                    <div className="row">
                                        <div className="col-auto">
                                            <h5 className="mb-0 nowrap">{file.request.color}</h5>
                                            <small className="text-muted">Color</small>
                                        </div>
                                        <div className="col-auto">
                                            <h5 className="mb-0 nowrap">{file.request.material}</h5>
                                            <small className="text-muted">Material</small>
                                        </div>
                                        <div className="col-auto">
                                            <h5 className="mb-0 nowrap">{file.request.infill}</h5>
                                            <small className="text-muted">Infill</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="small text-muted pt-1">
                                {submission.patron.fname} {submission.patron.lname}
                            </div>
                        </div>
                        <div className="grey-bubble mb-2">
                            {file.request.notes || "No additional notes."}
                            <div className="small text-muted pt-1">
                                {submission.patron.fname} {submission.patron.lname}
                            </div>
                        </div>

                        {file.status !== "UNREVIEWED" && (
                            <React.Fragment>
                                <small className={"text-muted text-end "}>
                                    <FormattedDate date={file.review.timestampReviewed} />
                                </small>
                                <div className="d-flex flex-row justify-content-end align-items-center mb-2">
                                    <div>
                                        {file.status == "REVIEWED" && (
                                            <span>
                                                <i className="bi bi-exclamation-triangle-fill text-orange h1 mb-0 me-4"></i>
                                            </span>
                                        )}
                                    </div>
                                    <div className={"color-bubble " + unsentWarning()}>
                                        {file.review.patronNotes || "Technician left no response."}
                                        <div className="small text-muted pt-1">
                                            {file.review.reviewedByName} ({file.review.reviewedByEUID})
                                        </div>
                                    </div>
                                </div>

                                {file.review.descision == "Accepted" && (
                                    <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                                        <div>
                                            {file.status == "REVIEWED" && (
                                                <span>
                                                    <i className="bi bi-exclamation-triangle-fill text-orange h1 mb-0"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className={"color-bubble " + unsentWarning()}>
                                            <div className="d-flex flex-row align-items-center">
                                                <div className="gcode-label me-3">
                                                    <img
                                                        className="download-image link-primary gcode-image"
                                                        src={GcodeImage}
                                                        alt="Download GCODE"
                                                        onClick={() => {
                                                            downloadGCODE();
                                                        }}
                                                    />
                                                </div>

                                                {/* <h1 className="display-1 text-lightblue">
                                                    <i className="bi bi-sd-card"></i>
                                                </h1> */}
                                                <div>
                                                    <div
                                                        className="mb-2 mt-1 h4 link-lightblue text-break"
                                                        onClick={() => {
                                                            downloadGCODE();
                                                        }}>
                                                        {file.review.gcodeName}
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-auto">
                                                            <h5 className="mb-0 nowrap">{file.review.slicedPrinter}</h5>
                                                            <small className="text-muted">Printer</small>
                                                        </div>
                                                        <div className="col-auto">
                                                            <h5 className="mb-0 nowrap">
                                                                {file.review.slicedMaterial}
                                                            </h5>
                                                            <small className="text-muted">Material</small>
                                                        </div>
                                                        <div className="col-auto">
                                                            <h5 className="mb-0 nowrap">{file.review.slicedGrams}g</h5>
                                                            <small className="text-muted">Est. Weight</small>
                                                        </div>
                                                        <div className="col-auto">
                                                            <h5 className="mb-0 nowrap">
                                                                {file.review.slicedHours}h {file.review.slicedMinutes}m
                                                            </h5>
                                                            <small className="text-muted">Est. Time</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"small text-muted pt-1 "}>
                                                {file.review.reviewedByName} ({file.review.reviewedByEUID})
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default RequestAndReview;

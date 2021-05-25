import React from "react";
import "./css/requestAndReview.scss";
import StlImage from "./res/block.svg";
import GcodeImage from "./res/sd.svg";
import { formatDate } from "../common/utils";
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

        const reviewStyle = () => {
            if (new Date(file.review.timestampReviewed) > new Date("1980")) {
                return "";
            } else {
                return "d-none";
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

        return (
            <div className="card shadow mb-3">
                <div className="card-header bg-transparent">
                    <h5 className="mb-0">
                        {submission.patron.fname} {submission.patron.lname}
                    </h5>
                    <p className="text-muted small mb-2">
                        {submission.patron.email} - {submission.patron.phone} - {submission.patron.euid}
                    </p>
                    <p className="text-center mb-0 fw-bold">{formatDate(submission.timestampSubmitted)}</p>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-column">
                        <small className="text-muted">{formatDate(submission.timestampSubmitted)}</small>
                        <div className="grey-bubble">
                            <div className="d-flex flex-row align-items-center">
                                <img
                                    className="stl-image link-primary"
                                    src={StlImage}
                                    alt="Download STL"
                                    onClick={() => {
                                        downloadSTL();
                                    }}
                                />

                                <div>
                                    <div
                                        className="h4 mb-2 mt-1 link-primary text-break"
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
                        <div className="grey-bubble">
                            {file.request.notes || "No additional notes."}
                            <div className="small text-muted pt-1">
                                {submission.patron.fname} {submission.patron.lname}
                            </div>
                        </div>
                        <small className={"text-muted text-end " + reviewStyle()}>
                            {formatDate(file.review.timestampReviewed)}
                        </small>
                        <div className={"color-bubble " + reviewStyle()}>
                            {file.review.patronNotes || "Technician left no response."}
                            <div className="small text-end text-muted pt-1">{file.review.reviewedBy}</div>
                        </div>
                        <div className={"color-bubble " + reviewStyle()}>
                            <div className="d-flex flex-row align-items-center">
                                <img
                                    className="stl-image link-primary"
                                    src={GcodeImage}
                                    alt="Download GCODE"
                                    onClick={() => {
                                        downloadGCODE();
                                    }}
                                />
                                <div>
                                    <div
                                        className="mb-2 mt-1 h4 link-primary text-break"
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
                                            <h5 className="mb-0 nowrap">{file.review.slicedMaterial}</h5>
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
                            <div className={"small text-end text-muted pt-1 " + reviewStyle()}>
                                {file.review.reviewedBy}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RequestAndReview;

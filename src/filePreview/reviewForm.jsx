import React from "react";
import axios from "../common/axiosConfig";
import { parseGcode } from "./res/gcodeAnalyzer";
import "./css/review.css";

class ReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descision: props.file.review.decision || "Accepted",
            gcode: props.file.review.originalGcodeName || null,
            slicedHours: props.file.review.slicedHours || 0,
            slicedMinutes: props.file.review.slicedMinutes || 0,
            slicedGrams: props.file.review.slicedGrams || 0,
            slicedPrinter: props.file.review.slicedPrinter || "",
            slicedMaterial: props.file.review.slicedMaterial || "",
            patronNotes: props.file.review.patronNotes || "",
            internalNotes: "",
            reviewedBy: props.file.review.reviewedBy || "",
            timestampReviewed: props.file.review.timestampReviewed || null,
            parseResults: null,
        };

        this.handleDescisionChange = this.handleDescisionChange.bind(this);
        this.handleGcodeUpload = this.handleGcodeUpload.bind(this);
    }

    handleDescisionChange(e) {
        this.setState({
            descision: e.target.value,
        });
    }

    handleGcodeUpload(e) {
        var file = e.target.files[0];
        this.setState({
            gcode: file,
        });

        var fileReader = new FileReader();
        fileReader.onloadend = () => {
            var content = fileReader.result;
            var results = parseGcode(content);
            var printSeconds = results.printTime;
            var hours = Math.floor(printSeconds / 3600);
            printSeconds %= 3600;
            var minutes = Math.floor(printSeconds / 60);
            this.setState({
                parseResults: results,
                slicedGrams: Math.round(results.plaWeight),
                slicedHours: hours,
                slicedMinutes: minutes,
            });
        };
        fileReader.readAsText(file);
    }

    render() {
        const acceptedControls = () => {
            if (this.state.descision == "Accepted") {
                return (
                    <div>
                        <h5>Slicing Details</h5>
                        <p className="small text-muted">
                            GCODE must contain <strong>ONE copy</strong> of the requested file. Duration and weight will
                            be calulated automatically.
                        </p>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="file"
                                id="gcodeFile"
                                onChange={this.handleGcodeUpload}
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={this.state.slicedHours}
                                    onChange={(e) => {
                                        this.setState({
                                            slicedHours: e.target.value,
                                        });
                                    }}
                                />
                                <label className="small">Hours</label>
                            </div>
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={this.state.slicedMinutes}
                                    onChange={(e) => {
                                        this.setState({
                                            slicedMinutes: e.target.value,
                                        });
                                    }}
                                />
                                <label className="small">Minutes</label>
                            </div>
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={this.state.slicedGrams}
                                    onChange={(e) => {
                                        this.setState({
                                            slicedGrams: e.target.value,
                                        });
                                    }}
                                />
                                <label className="small">Weight</label>
                            </div>
                        </div>

                        <hr />
                    </div>
                );
            } else {
                return null;
            }
        };

        return (
            <div className="card shadow mb-3">
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <h5>Review Decision</h5>
                            <select
                                className="form-select"
                                value={this.state.descision}
                                onChange={this.handleDescisionChange}>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <hr />

                        {acceptedControls()}

                        <div className="mb-3">
                            <h5>Notes To Patron</h5>
                            <textarea
                                value={this.state.patronNotes}
                                className="form-control"
                                rows="3"
                                onChange={(e) => {
                                    this.setState({
                                        patronNotes: e.target.value,
                                    });
                                }}></textarea>
                        </div>

                        <div className="mb-3">
                            <h5>Internal Technician Notes</h5>
                            <textarea
                                value={this.state.internalNotes}
                                className="form-control"
                                rows="3"
                                onChange={(e) => {
                                    this.setState({
                                        internalNotes: e.target.value,
                                    });
                                }}></textarea>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ReviewForm;

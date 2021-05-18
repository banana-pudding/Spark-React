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
            timestampReviewed: props.file.review.timestampReviewed || null,
            parseResults: null,
        };

        this.handleDescisionChange = this.handleDescisionChange.bind(this);
        this.handleGcodeUpload = this.handleGcodeUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit() {
        let now = new Date();
        const data = new FormData();
        let jsonObject = {
            review: {
                descision: this.state.descision,
                timestampReviewed: now,
                patronNotes: this.state.patronNotes,
                slicedHours: this.state.slicedHours,
                slicedMinutes: this.state.slicedMinutes,
                slicedGrams: this.state.slicedGrams,
                slicedPrinter: this.state.slicedPrinter,
                slicedMaterial: this.state.slicedMaterial,
            },
            newInternalNote: {
                dateAdded: now,
                notes: this.state.internalNotes,
            },
        };
        data.append("jsonData", JSON.stringify(jsonObject));
        data.append("files", this.state.gcode);

        axios.post("/submissions/review/" + this.props.file._id, data).then((res) => {
            console.log("done");
            window.location.reload();
        });
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
                                required
                                onChange={this.handleGcodeUpload}
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    required
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
                                    required
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
                                    required
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

                        <div className="row">
                            <div className="col">
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={this.state.slicedPrinter}
                                    onChange={(e) => {
                                        this.setState({
                                            slicedPrinter: e.target.value,
                                        });
                                    }}
                                />
                                <label className="small">Printer</label>
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={this.state.slicedMaterial}
                                    onChange={(e) => {
                                        this.setState({
                                            slicedMaterial: e.target.value,
                                        });
                                    }}
                                />
                                <label className="small">Material</label>
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
                                required
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
                                required
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
                                required
                                className="form-control"
                                rows="3"
                                onChange={(e) => {
                                    this.setState({
                                        internalNotes: e.target.value,
                                    });
                                }}></textarea>
                        </div>

                        <button
                            className="btn btn-primary float-end"
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                this.handleSubmit();
                            }}>
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ReviewForm;

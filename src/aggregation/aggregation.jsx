import React from "react";
import { axiosInstance } from "../app";
import FormattedDate from "../common/formattedDate";
import DatePicker from "react-date-picker";

class Aggregation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attempts: [],
            filters: {
                started: {
                    before: null,
                    after: null,
                },
                ended: {
                    before: null,
                    after: null,
                },
            },
        };
    }

    updateAttempts = () => {
        axiosInstance.post("/attempts/filter", this.state.filters).then((res) => {
            this.setState({
                attempts: res.data.attempts,
                paidTotals: res.data.paidTotals,
                waivedTotals: res.data.waivedTotals,
            });
        });
    };

    componentDidMount() {
        this.updateAttempts();
    }

    handleDelete = (attemptID) => {
        axiosInstance.post("/attempts/delete/" + attemptID).then((res) => {
            this.updateAttempts();
        });
    };

    render() {
        console.log("render");
        const timeDiff = (start, end) => {
            // get total seconds between the times
            var delta = Math.abs(new Date(end) - new Date(start)) / 1000;

            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            var seconds = Math.round(delta % 60); // in theory the modulus is not required
            let out = "";
            if (days > 0) {
                out += `${days}d`;
            }
            if (hours > 0) {
                out += ` ${hours}h `;
            }
            out += `${minutes}m ${seconds}s`;
            return out;
        };

        const millisDiff = (millis) => {
            // get total seconds between the times
            var delta = millis / 1000;

            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            var hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            var minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            var seconds = Math.round(delta % 60); // in theory the modulus is not required
            let out = "";
            if (days > 0) {
                out += `${days}d`;
            }
            if (hours > 0) {
                out += ` ${hours}h `;
            }
            out += `${minutes}m ${seconds}s`;
            return out;
        };

        const dateFilter = (dateType) => {
            return (
                <>
                    <h5 className="mb-2">{dateType == "started" ? "Restrict Start Time" : "Restrict End Time"}</h5>
                    <div className="input-group">
                        <DatePicker
                            clearIcon={null}
                            calendarIcon={null}
                            className="form-control"
                            value={this.state.filters[dateType].after}
                            onChange={(value) => {
                                let temp = this.state.filters;
                                temp[dateType].after = value;
                                this.setState({
                                    filters: temp,
                                });
                            }}
                        />
                        <DatePicker
                            clearIcon={null}
                            calendarIcon={null}
                            className="form-control"
                            value={this.state.filters[dateType].before}
                            onChange={(value) => {
                                let temp = this.state.filters;
                                temp[dateType].before = value;
                                this.setState({
                                    filters: temp,
                                });
                            }}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <small className="text-muted">After (inclusive)</small>
                        <small className="text-muted">Before (inclusive)</small>
                    </div>
                </>
            );
        };

        return (
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-xs-12 col-xl-3">
                        {this.state.paidTotals && this.state.waivedTotals && (
                            <div className="card shadow mb-3">
                                <table className="table card-header">
                                    <thead className="card-header">
                                        <tr>
                                            <th colSpan="4" className="text-center border-bottom-0">
                                                <h4 className="mb-0">Total Sums</h4>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th>Paid</th>
                                            <th>Waived</th>
                                            <th>All</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Count</th>
                                            <td>{this.state.paidTotals.count} Attempts</td>
                                            <td>{this.state.waivedTotals.count} Attempts</td>
                                            <td>
                                                {this.state.paidTotals.count + this.state.waivedTotals.count} Attempts
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Price</th>

                                            <td>${this.state.paidTotals.price.toFixed(2)}</td>
                                            <td>${this.state.waivedTotals.price.toFixed(2)}</td>
                                            <td>
                                                $
                                                {(
                                                    this.state.waivedTotals.price + this.state.waivedTotals.price
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Filament</th>

                                            <td>{this.state.paidTotals.filament}g</td>
                                            <td>{this.state.waivedTotals.filament}g</td>
                                            <td>
                                                {this.state.waivedTotals.filament + this.state.waivedTotals.filament}g
                                            </td>
                                        </tr>

                                        <tr>
                                            <th scope="row">Duration</th>
                                            <td>{millisDiff(this.state.paidTotals.timeMillis)}</td>
                                            <td>{millisDiff(this.state.waivedTotals.timeMillis)}</td>
                                            <td>
                                                {millisDiff(
                                                    this.state.waivedTotals.timeMillis +
                                                        this.state.paidTotals.timeMillis
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="card shadow">
                            <div className="card-body">
                                {dateFilter("started")}
                                <hr />
                                {dateFilter("ended")}
                                <div className="d-grid mt-3">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            this.updateAttempts();
                                        }}>
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-xl-9">
                        <div className="card shadow mb-3">
                            <table className="table">
                                <thead className="card-header">
                                    <tr>
                                        <th colSpan="6" className="text-center border-bottom-0">
                                            <h4 className="mb-0">Individual Attempts</h4>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th>Time</th>
                                        <th>Filament Usage</th>
                                        <th>Total Price</th>
                                        <th>Submission(s)</th>
                                        <th>File(s)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.attempts.map((attempt, attemptIndex) => {
                                        let numFiles = attempt.submissions.reduce((accum, curr) => {
                                            return accum + curr.files.length;
                                        }, 0);

                                        return (
                                            <>
                                                {attempt.submissions.map((submission, submissionIndex) => {
                                                    return (
                                                        <>
                                                            {submission.files.map((file, fileIndex) => {
                                                                return (
                                                                    <tr
                                                                        className={
                                                                            (fileIndex + submissionIndex == 0
                                                                                ? "first-row "
                                                                                : "") +
                                                                            (attemptIndex % 2 ? "bg-shaded" : "")
                                                                        }>
                                                                        {submissionIndex + fileIndex == 0 && (
                                                                            <>
                                                                                <td
                                                                                    rowSpan={numFiles}
                                                                                    className="text-nowrap">
                                                                                    <span className="fw-bold">
                                                                                        {attempt.prettyID}
                                                                                    </span>
                                                                                    <span
                                                                                        className={
                                                                                            "badge ms-2 text-capitalize " +
                                                                                            (attempt.isFinished
                                                                                                ? attempt.isSuccess
                                                                                                    ? "bg-green"
                                                                                                    : "bg-red"
                                                                                                : "bg-lightblue")
                                                                                        }>
                                                                                        {attempt.isFinished
                                                                                            ? attempt.isSuccess
                                                                                                ? "Success"
                                                                                                : "Failure"
                                                                                            : "Printing"}
                                                                                    </span>
                                                                                    <br />
                                                                                    {attempt.printerName}
                                                                                    <br />
                                                                                    {attempt.location}
                                                                                </td>
                                                                                <td
                                                                                    rowSpan={numFiles}
                                                                                    className="text-nowrap">
                                                                                    <table>
                                                                                        {attempt.isFinished && (
                                                                                            <tr>
                                                                                                <td>Duration:</td>
                                                                                                <td className="text-end fw-bold">
                                                                                                    {timeDiff(
                                                                                                        attempt.timestampStarted,
                                                                                                        attempt.timestampEnded
                                                                                                    )}
                                                                                                </td>
                                                                                            </tr>
                                                                                        )}
                                                                                        <tr>
                                                                                            <td>Started</td>
                                                                                            <td className="text-end">
                                                                                                <FormattedDate
                                                                                                    date={
                                                                                                        attempt.timestampStarted
                                                                                                    }
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        {attempt.isFinished && (
                                                                                            <tr>
                                                                                                <td>Ended:</td>
                                                                                                <td className="text-end">
                                                                                                    <FormattedDate
                                                                                                        date={
                                                                                                            attempt.timestampEnded
                                                                                                        }
                                                                                                    />
                                                                                                </td>
                                                                                            </tr>
                                                                                        )}
                                                                                    </table>
                                                                                </td>
                                                                                <td
                                                                                    rowSpan={numFiles}
                                                                                    className="text-nowrap">
                                                                                    {attempt.isFinished && (
                                                                                        <>
                                                                                            <strong>
                                                                                                {attempt.startWeight -
                                                                                                    attempt.endWeight}
                                                                                                g
                                                                                            </strong>
                                                                                            <br />
                                                                                        </>
                                                                                    )}
                                                                                    {attempt.rollID}
                                                                                </td>
                                                                                <td rowSpan={numFiles}>
                                                                                    ${attempt.totalPrice.toFixed(2)}
                                                                                </td>
                                                                            </>
                                                                        )}
                                                                        {fileIndex == 0 && (
                                                                            <>
                                                                                <td
                                                                                    rowSpan={submission.files.length}
                                                                                    className="text-capitalize">
                                                                                    {submission.patron.fname}{" "}
                                                                                    {submission.patron.lname}{" "}
                                                                                    <span
                                                                                        className={
                                                                                            "badge ms-2 text-capitalize " +
                                                                                            (submission.files[0].payment
                                                                                                .paymentType == "PAID"
                                                                                                ? "bg-green"
                                                                                                : "bg-yellow")
                                                                                        }>
                                                                                        {submission.files[0].payment.paymentType.toLowerCase()}
                                                                                    </span>
                                                                                    <br />
                                                                                    <span className="h6 text-muted mb-0">
                                                                                        {submission.submissionDetails.submissionType
                                                                                            .toLowerCase()
                                                                                            .trim()}{" "}
                                                                                        Submission
                                                                                    </span>
                                                                                </td>
                                                                            </>
                                                                        )}
                                                                        <td>
                                                                            {file.fileName}
                                                                            <br />
                                                                            {file.review.slicedHours}h{" "}
                                                                            {file.review.slicedMinutes}m -{" "}
                                                                            {file.review.slicedGrams}g<br />$
                                                                            {(
                                                                                file.review.slicedHours +
                                                                                file.review.slicedMinutes / 60
                                                                            ).toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </>
                                                    );
                                                })}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Aggregation;

import React from "react";
import { axiosInstance } from "../app";
import FormattedDate from "../common/formattedDate";

class Aggregation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attempts: [],
        };
    }

    updateAttempts = () => {
        axiosInstance.post("/attempts/filter").then((res) => {
            console.log("got");
            this.setState({
                attempts: res.data,
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
        return (
            <div className="container-fluid mt-3">
                <div className="card shadow ">
                    <table className="table ">
                        <thead className="card-header">
                            <tr>
                                <th>Attempt</th>
                                <th>Printer</th>
                                <th>Started</th>
                                <th>Ended</th>
                                <th>Filament</th>

                                <th>Submission</th>

                                <th>File Name</th>
                                <th>Est. Time</th>
                                <th>Est. Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.attempts.map((attempt, index1) => {
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
                                                                    fileIndex + submissionIndex == 0 ? "first-row" : ""
                                                                }>
                                                                {submissionIndex + fileIndex == 0 && (
                                                                    <>
                                                                        <td rowSpan={numFiles}>
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
                                                                        </td>
                                                                        <td rowSpan={numFiles}>
                                                                            {attempt.printerName}
                                                                            <br />
                                                                            {attempt.location}
                                                                        </td>
                                                                        <td rowSpan={numFiles}>
                                                                            <FormattedDate
                                                                                date={attempt.timestampStarted}
                                                                            />
                                                                            <br />
                                                                            {attempt.startedByName} (
                                                                            {attempt.startedByEUID})
                                                                        </td>
                                                                        <td rowSpan={numFiles}>
                                                                            <FormattedDate
                                                                                date={attempt.timestampEnded}
                                                                            />
                                                                            <br />
                                                                            {attempt.finishedByName} (
                                                                            {attempt.finishedByEUID})
                                                                        </td>
                                                                        <td rowSpan={numFiles}>
                                                                            {timeDiff(
                                                                                attempt.timestampStarted,
                                                                                attempt.timestampEnded
                                                                            )}
                                                                            <br />
                                                                            {attempt.startWeight - attempt.endWeight}g -{" "}
                                                                            {attempt.rollID}
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
                                                                <td>{file.fileName}</td>
                                                                <td>
                                                                    {file.review.slicedHours}h{" "}
                                                                    {file.review.slicedMinutes}m
                                                                </td>
                                                                <td>{file.review.slicedGrams}g </td>
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
        );
    }
}

export default Aggregation;

import React from "react";
import { axiosInstance } from "../app";
import FormattedDate from "../common/formattedDate";
import { statusLabel, statusBG } from "../common/utils";

class SubmissionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submissionID: null,
            submission: null,
        };
    }

    componentDidMount() {
        var submissionID = window.location.pathname.split("/submission/")[1];
        axiosInstance.get("/submissions/public/" + submissionID).then((res) => {
            this.setState({
                submissionID: submissionID,
                submission: res.data,
            });
        });
    }

    render() {
        const submission = this.state.submission;

        const body = () => {
            if (this.state.submission) {
                let reviewDate = new Date(submission.paymentRequest.timestampPaymentRequested);
                let paidDate = new Date(submission.payment.timestampPaid);
                let pickupDate = new Date(submission.pickup.timestampPickupRequested);

                return (
                    <React.Fragment>
                        <div className="card shadow mb-3">
                            <div className="card-header">
                                <h3 className="mb-0">Submission Details</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <table className="table border-top">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Name</th>
                                                    <td>
                                                        {submission.patron.fname} {submission.patron.lname}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Email</th>
                                                    <td>{submission.patron.email}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Phone</th>
                                                    <td>{submission.patron.phone}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col">
                                        <table className="table border-top">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Submitted</th>
                                                    <td>
                                                        <FormattedDate
                                                            date={submission.submissionDetails.timestampSubmitted}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Payment Requested</th>
                                                    <td>
                                                        {reviewDate > new Date("1980") && (
                                                            <FormattedDate date={reviewDate} />
                                                        )}

                                                        {reviewDate < new Date("1980") && (
                                                            <span>Not Yet Requested</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Payment Received</th>
                                                    <td>
                                                        {paidDate > new Date("1980") && (
                                                            <FormattedDate date={paidDate} />
                                                        )}

                                                        {reviewDate < new Date("1980") && (
                                                            <span>Not Yet Requested</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Pickup Requested</th>
                                                    <td>
                                                        {pickupDate > new Date("1980") && (
                                                            <FormattedDate date={pickupDate} />
                                                        )}

                                                        {pickupDate < new Date("1980") && (
                                                            <span>Not Yet Requested</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow">
                            <div className="card-header">
                                <h3 className="mb-0">File Details</h3>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>Status</th>
                                            <th>Review Notes</th>
                                            <th>Reviewed On</th>
                                            <th>Requested Price</th>
                                            <th>Pickup Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submission.files.map((file, index) => {
                                            return (
                                                <tr>
                                                    <td className="fw-bold">{file.fileName}</td>
                                                    <td>
                                                        <span className={"badge me-2 " + statusBG(file)}>
                                                            {statusLabel(file)}
                                                        </span>
                                                    </td>
                                                    <td>{file.review.patronNotes}</td>
                                                    <td>
                                                        <FormattedDate date={file.review.timestampReviewed} />
                                                    </td>
                                                    <td>
                                                        $
                                                        {(
                                                            (file.review.slicedHours * 60 + file.review.slicedMinutes) /
                                                            60
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>{file.request.pickupLocation}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className="fw-bold">${submission.paymentRequest.requestedPrice}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>

                                {submission.currentQueue == "PAYMENT" && (
                                    <React.Fragment>
                                        <h5 className="text-primary">
                                            To pay for your submission, please click the link below:
                                        </h5>
                                        <a href={submission.payment.paymentURL}>{submission.payment.paymentURL}</a>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                );
            } else {
                return null;
            }
        };
        return <div className="container mt-3">{body()}</div>;
    }
}

export default SubmissionView;

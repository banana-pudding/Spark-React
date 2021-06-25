import React from "react";

class EditEmails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-0 fw-bold">Submission Recieved</p>
                                <p className="mb-0 small text-muted">
                                    Sent to the patron when their submission has been successfully uploaded.
                                </p>
                            </div>
                            <button className="btn btn-pink lh-1 p-2 rounded-circle">
                                <i className="bi bi-pencil-square lh-1"></i>
                            </button>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-0 fw-bold">Submission Reviewed (Payment Request)</p>
                                <p className="mb-0 small text-muted">
                                    Sent when all files have been reivewed. Includes the payment link.
                                </p>
                            </div>
                            <button className="btn btn-yellow lh-1 p-2 rounded-circle">
                                <i className="bi bi-pencil-square lh-1"></i>
                            </button>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-0 fw-bold">Payment Recieved</p>
                                <p className="mb-0 small text-muted">
                                    Sent when patron successfully pays for their prints. This is separate from the email
                                    reciept they will get from the payment portal!
                                </p>
                            </div>
                            <button className="btn btn-green lh-1 p-2 rounded-circle">
                                <i className="bi bi-pencil-square lh-1"></i>
                            </button>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-0 fw-bold">Payment Waived</p>
                                <p className="mb-0 small text-muted">
                                    Sent when an admin waives the fee for a submission. This does not prevent them from
                                    being able to still pay for their submission.
                                </p>
                            </div>
                            <button className="btn btn-lightblue lh-1 p-2 rounded-circle">
                                <i className="bi bi-pencil-square lh-1"></i>
                            </button>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-0 fw-bold">Ready For Pickup</p>
                                <p className="mb-0 small text-muted">
                                    Sent only when all files have been printed AND have been transported to the
                                    requested pickup location!
                                </p>
                            </div>
                            <button className="btn btn-purple lh-1 p-2 rounded-circle">
                                <i className="bi bi-pencil-square lh-1"></i>
                            </button>
                        </div>
                    </li>
                </ul>
            </React.Fragment>
        );
    }
}

export default EditEmails;

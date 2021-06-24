import React from "react";
import { formatDate } from "../common/utils";

class Patron extends React.Component {
    render() {
        let submission = this.props.submission;

        var classStyle = () => {
            return submission.isForClass ? "" : "d-none";
        };

        var internalStyle = () => {
            return submission.isForDepartment ? "" : "d-none";
        };

        return (
            <div className="card shadow mb-3">
                <table className="table mb-0">
                    <tbody>
                        <tr>
                            <th scope="row">Patron</th>
                            <td>
                                {submission.patron.fname} {submission.patron.lname}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Submitted</th>
                            <td>{formatDate(submission.submissionDetails.timestampSubmitted)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Email</th>
                            <td>{submission.patron.email}</td>
                        </tr>
                        <tr>
                            <th scope="row">Phone</th>
                            <td>{submission.patron.phone}</td>
                        </tr>
                        <tr>
                            <th scope="row">EUID</th>
                            <td>{submission.patron.euid}</td>
                        </tr>
                        <tr>
                            <th scope="row">Submission Type</th>
                            <td>
                                {submission.isForClass
                                    ? "Class Submission"
                                    : submission.isForDepartment
                                    ? "Internal Department"
                                    : "Personal Submission"}
                            </td>
                        </tr>
                        <tr className={classStyle()}>
                            <th scope="row">Class Code</th>
                            <td>{submission.submissionDetails.classDetails.classCode}</td>
                        </tr>
                        <tr className={classStyle()}>
                            <th scope="row">Professor</th>
                            <td>{submission.submissionDetails.classDetails.professor}</td>
                        </tr>
                        <tr className={classStyle()}>
                            <th scope="row">Project</th>
                            <td>{submission.submissionDetails.classDetails.project}</td>
                        </tr>
                        <tr className={internalStyle()}>
                            <th scope="row">Department</th>
                            <td>{submission.submissionDetails.internalDetails.department}</td>
                        </tr>
                        <tr className={internalStyle()}>
                            <th scope="row">Project</th>
                            <td>{submission.submissionDetails.internalDetails.departmentProject}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Patron;

import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Context } from "../reducer";

function FilePreview(props) {
    var { file, patron, submission } = props;
    console.log(file);
    console.log(patron);
    return (
        <div className="col">
            <ul className="list-group list-group-horizontal shadow">
                <li className="list-group-item flex-fill">
                    <div>
                        <h5 className="text-center">
                            Submitted: {new Date(file.timestampSubmitted).toLocaleDateString()}
                        </h5>
                        <table className="table table-sm">
                            <tbody>
                                <tr>
                                    <th scope="row">Name</th>
                                    <td>
                                        {patron.fname} {patron.lname}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Email</th>
                                    <td>{patron.email}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Phone</th>
                                    <td>{patron.phone}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Type</th>
                                    <td>
                                        {submission.isForClass
                                            ? "Class Submission"
                                            : submission.isForDepartment
                                            ? "Internal Submission"
                                            : "Personal Submission"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
                <li className="list-group-item flex-fill">Reviewed</li>
                <li className="list-group-item flex-fill">Payment Requested</li>
                <li className="list-group-item flex-fill">Paid</li>
                <li className="list-group-item flex-fill">Printed</li>
                <li className="list-group-item flex-fill">Picked Up</li>
            </ul>
        </div>
    );
}

export default FilePreview;

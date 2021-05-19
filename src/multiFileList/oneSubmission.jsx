import React from "react";

import { ReactComponent as DownloadIcon } from "../common/download.svg";
import Dropdown from "./fileDropdown";

class SingleSubmission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            printPage: props.printPage,
        };
    }

    render() {
        const zipButton = {
            border: "none",
            backgroundColor: "transparent",
        };

        const submittedRow = () => {
            return (
                <tr>
                    <td class="pl-0 text-muted">Submitted</td>
                    <td>{new Date(this.state.item.timestampSubmitted).toLocaleDateString()}</td>
                </tr>
            );
        };
        const reviewedRow = () => {
            if (this.state.printPage != "new") {
                return (
                    <tr>
                        <td class="pl-0 text-muted">Reviewed</td>
                        <td>{new Date(this.state.item.timestampPaymentRequested).toLocaleDateString()}</td>
                    </tr>
                );
            } else {
                return null;
            }
        };
        const paidRow = () => {
            if (this.state.printPage != "new" && this.state.printPage != "pendPay") {
                return (
                    <tr>
                        <td class="pl-0 text-muted">Paid</td>
                        <td>{new Date(this.state.item.timestampPaid).toLocaleDateString()}</td>
                    </tr>
                );
            } else {
                return null;
            }
        };

        return (
            <div className="card shadow mb-3" key={this.props.index}>
                <div className="card-header">
                    <h5 className="mb-0">
                        {this.state.item.patron.fname + " " + this.state.item.patron.lname}
                        <button
                            type="button"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Download all files in this submission"
                            className="p-0 ms-4"
                            style={zipButton}
                            id={this.state.item._id}>
                            <DownloadIcon />
                        </button>
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-auto">
                            <table class="table table-borderless table-sm">
                                <tbody>
                                    {submittedRow()}
                                    {reviewedRow()}
                                    {paidRow()}
                                </tbody>
                            </table>
                            {this.state.printPage == "newSub" && !this.state.item.allFilesReviewed && (
                                <button>no</button>
                            )}
                            {this.state.printPage == "newSub" && this.state.item.allFilesReviewed && (
                                <button>yes</button>
                            )}
                        </div>
                        <div class="col">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                        <th>Status</th>
                                        <th>Pickup Location</th>
                                        <th>More</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.item.files.map((file, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <a class="no font-weight-bold" href={"/files/" + file._id}>
                                                        {file.fileName}
                                                    </a>
                                                </td>
                                                <td>{file.status}</td>
                                                <td></td>
                                                <td>
                                                    <Dropdown file={file} submission={this.state.item} />
                                                </td>
                                            </tr>
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

export default SingleSubmission;

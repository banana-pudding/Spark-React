import React from "react";

import { ReactComponent as DownloadIcon } from "../common/download.svg";

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

        const copyDisplay = (num, offset) => {
            content = [];
            for (var i = 0; i < num; i++) {
                content.push(<span>{i + offset}</span>);
            }
            return conent;
        };

        return (
            <div className="card shadow mb-3">
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
                        <div class="col-2">
                            <table class="table table-borderless table-sm">
                                <tr>
                                    <td class="pl-0 text-muted">Submitted</td>
                                    <td>{new Date(this.state.item.timestampSubmitted).toLocaleDateString()}</td>
                                </tr>
                                {this.state.printPage != "newSub" && (
                                    <tr>
                                        <td class="pl-0 text-muted">Reviewed</td>
                                        <td>
                                            {new Date(this.state.item.timestampPaymentRequested).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )}

                                {this.state.printPage != "newSub" && this.state.printPage != "pendpay" && (
                                    <tr>
                                        <td class="pl-0 text-muted">Paid</td>
                                        <td>{new Date(this.state.item.timestampPaid).toLocaleDateString()}</td>
                                    </tr>
                                )}
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
                                        <th>Unprinted</th>
                                        <th>Printing</th>
                                        <th>In Transit</th>
                                        <th>Completed</th>
                                        <th>Picked Up</th>
                                        <th>More</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.item.files.map((file, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <a class="no font-weight-bold" href={"/files/" + file._id}>
                                                        {file.realFileName}
                                                    </a>
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
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

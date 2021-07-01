import React from "react";
import { axiosInstance } from "../app";

class Aggregation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attempts: [],
        };
    }

    componentDidMount() {
        axiosInstance.post("/attempts/filter").then((res) => {
            console.log("got");
            this.setState({
                attempts: res.data,
            });

            axiosInstance.get("/testerror");
        });
    }

    render() {
        return (
            <div className="container mt-3">
                <div className="card shadow">
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Attempt ID</th>
                                    <th>FileIDs</th>
                                    <th>Submisson Files</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.attempts.map((attempt, index) => {
                                    return (
                                        <tr>
                                            <td>{attempt._id}</td>
                                            <td>
                                                {attempt.fileIDs.map((fileID, index) => {
                                                    return (
                                                        <span>
                                                            {fileID}
                                                            <br />
                                                        </span>
                                                    );
                                                })}
                                            </td>
                                            <td>
                                                {attempt.submissions.map((submission, index) => {
                                                    return (
                                                        <span>
                                                            {submission.files.map((file, index) => {
                                                                return (
                                                                    <span>
                                                                        {file._id}
                                                                        <br />
                                                                    </span>
                                                                );
                                                            })}
                                                        </span>
                                                    );
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Aggregation;

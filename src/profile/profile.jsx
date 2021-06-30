import React from "react";
import AllUsers from "./adminSections/allUsers";
import EditEmails from "./adminSections/editEmails";
import axios from "../common/axiosConfig";
import fileDownload from "js-file-download";

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.user.name,
        };
    }

    handleSetName = () => {
        axios.post("/users/updatename", { euid: this.props.user.euid, name: this.state.name }).then((res) => {
            this.props.updateUserFromDatabase();
        });
    };

    render() {
        return (
            <div className="container mt-3">
                <div className="row row-cols-2 mb-3">
                    <div className="col">
                        <div className="card shadow h-100">
                            <div className="card-body">
                                <h3 className="mb-3">Your Account</h3>
                                <table className="table table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <th scope="row">EUID</th>
                                            <td>{this.props.user.euid}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Name</th>
                                            <td className="p-0 ps-2">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        value={this.state.name}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                name: e.target.value,
                                                            });
                                                        }}
                                                        className="form-control"
                                                        placeholder="Name"
                                                    />
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleSetName();
                                                        }}>
                                                        Change
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Account type</th>
                                            <td>{this.props.user.isAdmin ? "Administrator" : "Technician"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card shadow h-100">
                            <div className="card-body">
                                <h4>oof</h4>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.user.isAdmin && (
                    <div className="card shadow mb-3">
                        <div className="card-body">
                            <p className="card-title h3">Administrator Tools</p>
                            <hr />
                            <div className="row row-cols-3">
                                <div className="col">
                                    <h4>Users</h4>
                                    <p>
                                        For safety, you cannot demote your own account from administrator status. If you
                                        need to demote yourself, promote another user and have them demote you!
                                    </p>
                                    <AllUsers user={this.props.user} />
                                </div>
                                <div className="col">
                                    <h4>Emails</h4>
                                    <p>Edit the text in any of the following emails sent to patrons.</p>

                                    <EditEmails />
                                </div>
                                <div className="col">
                                    <h4>Database Tools</h4>
                                    <p>Export the current database in spreadsheet format.</p>
                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-pink"
                                            onClick={() => {
                                                axios
                                                    .get("/download/export/submissions", {
                                                        responseType: "blob",
                                                    })
                                                    .then((res) => {
                                                        fileDownload(res.data, "submissions.xlsx");
                                                    });
                                            }}>
                                            Export Submissions
                                        </button>
                                        <button
                                            className="btn btn-magenta"
                                            onClick={() => {
                                                axios
                                                    .get("/download/export/attempts", {
                                                        responseType: "blob",
                                                    })
                                                    .then((res) => {
                                                        fileDownload(res.data, "attempts.xlsx");
                                                    });
                                            }}>
                                            Export Attempts
                                        </button>
                                        <button
                                            className="btn btn-purple"
                                            onClick={() => {
                                                axios
                                                    .get("/download/export/printers", {
                                                        responseType: "blob",
                                                    })
                                                    .then((res) => {
                                                        fileDownload(res.data, "printers.xlsx");
                                                    });
                                            }}>
                                            Export Printers
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="card shadow mb-3">
                    <div className="card-body">
                        <p className="card-title display-5">Development Roadmap</p>
                        <p className="card-subtitle h4 text-muted">AKA: Things That Don't Work Yet</p>
                        <p>p.s. This list is not complete because there are so many things I haven't done yet.....</p>
                        <hr />
                        <div className="row">
                            <div className="col-4">
                                <p className="h5">Profiles/Admin Functions</p>
                                <p>The entire page, really...</p>
                                <ul>
                                    <li>
                                        <s>Change display name</s>
                                    </li>
                                    <li>
                                        <s>Promote/demote/delete users</s>
                                    </li>
                                    <li>Aggregate database</li>
                                    <li>Export database</li>
                                    <li>Edit emails</li>
                                </ul>
                            </div>
                            <div className="col-4">
                                <p className="h5">Submissions</p>
                                <ul>
                                    <li>Archive button does nothing</li>
                                    <li>Admins can delete files, but pending delete doesnt work yet</li>
                                    <li>Download all files does nothing</li>
                                </ul>
                            </div>
                            <div className="col-4">
                                <p className="h5">Printers/Attempts</p>
                                <ul>
                                    <li>Add/change barcode for self service printers</li>
                                    <li>View all attempts</li>
                                    <li>Aggregate attempts</li>
                                    <li>Printer dashboard is not size responsive</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfilePage;

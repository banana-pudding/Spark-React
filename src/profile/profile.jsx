import React from "react";

class ProfilePage extends React.Component {
    render() {
        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col"></div>
                </div>
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
                                    <li>Change display name</li>
                                    <li>Promote/demote/delete users</li>
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

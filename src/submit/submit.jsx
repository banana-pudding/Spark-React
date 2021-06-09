import React from "react";
import "./submit.css";
import SingleFile from "./singleFile";
import axios from "../common/axiosConfig";
import { withRouter } from "react-router-dom";
class SubmissionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            email: "",
            euid: "",
            phone: "",
            submissionType: "personal",
            classCode: "",
            professor: "",
            assignment: "",
            department: "",
            project: "",
            numFiles: 1,
            pickupLocation: "Willis Library",
            files: [
                {
                    file: null,
                    fileName: "",
                    material: "Any Material",
                    color: "Any Color",
                    copies: "1",
                    infill: "12.5",
                    notes: "",
                    //pickupLocation: "Willis Library",
                },
            ],
        };
    }

    canSubmit = () => {
        let checkStuff = {},
            checkFiles = [];
        checkStuff = Object.assign(checkStuff, this.state);
        checkFiles = checkStuff.files;

        delete checkStuff.files;
        delete checkStuff.euid;

        if (checkStuff.submissionType != "class") {
            delete checkStuff.classCode;
            delete checkStuff.professor;
            delete checkStuff.assignment;
        }

        if (checkStuff.submissionType != "internal") {
            delete checkStuff.department;
            delete checkStuff.project;
        }

        return (
            Object.values(checkStuff).every(Boolean) &&
            checkFiles.every((file) => {
                return file.file;
            })
        );
    };

    onSubmit() {
        if (this.canSubmit()) {
            const data = new FormData();
            let sendData = this.state;
            data.append("jsonData", JSON.stringify(sendData));
            for (var thisFile of this.state.files) {
                console.log(thisFile);
                if (thisFile) {
                    data.append("files", thisFile.file);
                }
            }
            axios
                .post("/submit", data)
                .then((res) => {
                    console.log("done");
                    this.props.history.push("/");
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }
    }

    updateSubFile(newState) {
        var tempFiles = this.state.files;

        tempFiles[newState.index] = {
            file: newState.file,
            fileName: newState.fileName,
            material: newState.material,
            color: newState.color,
            copies: newState.copies,
            infill: newState.infill,
            notes: newState.notes,
            pickupLocation: newState.pickupLocation,
        };

        this.setState({
            files: tempFiles,
        });
    }

    deleteFile(index) {
        console.log(index);
        if (index !== 0) {
            var newFiles = [];
            for (var i = 0; i < this.state.files.length; i++) {
                if (i !== index) {
                    newFiles.push(this.state.files[i]);
                }
            }
            this.setState({
                files: newFiles,
            });
        }
    }

    render() {
        const pickupInfo = () => {
            return (
                <React.Fragment>
                    <h3>Pickup Information</h3>
                    <div class="form-floating">
                        <select
                            class="form-select"
                            onChange={(e) => {
                                this.setState({ pickupLocation: e.target.value });
                            }}
                            id="pickupLocation">
                            <option value="Willis Library" selected={this.state.pickupLocation == "Willis Library"}>
                                Willis Library
                            </option>
                            <option value="Discovery Park" selected={this.state.pickupLocation == "Discovery Park"}>
                                Discovery Park
                            </option>
                        </select>
                        <label htmlFor="pickupLocation">Pickup Location</label>
                    </div>
                </React.Fragment>
            );
        };

        const submissionType = () => {
            return (
                <React.Fragment>
                    <h3>Submission Information</h3>
                    <p>
                        Please specify whether your submission is for a class or other educational purpose, for an
                        internal library project, or for personal use. More details for each of these can be found
                        below.
                    </p>
                    <ul className="nav nav-tabs nav-justified mb-3" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={(this.state.submissionType === "personal" ? "active " : "") + "nav-link"}
                                id="personal-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#personal"
                                type="button"
                                role="tab"
                                aria-controls="personal"
                                aria-selected={this.state.submissionType === "personal" ? "true" : "false"}
                                onClick={() => {
                                    this.setState({
                                        submissionType: "personal",
                                        classCode: "",
                                        professor: "",
                                        assignment: "",
                                        department: "",
                                        project: "",
                                    });
                                }}>
                                Personal
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={(this.state.submissionType === "class" ? "active " : "") + "nav-link"}
                                id="class-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#class"
                                type="button"
                                role="tab"
                                aria-controls="class"
                                aria-selected={this.state.submissionType === "class" ? "true" : "false"}
                                onClick={() => {
                                    this.setState({
                                        submissionType: "class",
                                        department: "",
                                        project: "",
                                    });
                                }}>
                                Class
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={(this.state.submissionType === "internal" ? "active " : "") + "nav-link"}
                                id="internal-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#internal"
                                type="button"
                                role="tab"
                                aria-controls="internal"
                                aria-selected={this.state.submissionType === "internal" ? "true" : "false"}
                                onClick={() => {
                                    this.setState({
                                        submissionType: "internal",
                                        classCode: "",
                                        professor: "",
                                        assignment: "",
                                    });
                                }}>
                                Internal
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div
                            className={this.state.submissionType === "personal" ? "show active " : "" + "tab-pane fade"}
                            id="personal"
                            role="tabpanel"
                            aria-labelledby="personal-tab">
                            <p>
                                If your submission is for personal use (not a class assignment or research tool) please
                                continue to uploading your files below! The standard pricing of $1 per hour of estimated
                                print time will apply. To estimate your own print time, try downloading the Cura slicing
                                software and slicing your files yourself using the default settings.
                            </p>
                        </div>
                        <div
                            className={this.state.submissionType == "class" ? "show active " : "" + "tab-pane fade"}
                            id="class"
                            role="tabpanel"
                            aria-labelledby="class-tab">
                            <div className="row">
                                <div className="col">
                                    <p>
                                        If your submission is for a class assignment or other education related purpose,
                                        please fill in the following details. If your submission is for research or
                                        other educational purposes not associated with a specific class, you can put
                                        "other" in the class code field.
                                    </p>
                                    <p>
                                        When printing for educational purposes, the standard price will be waived, but
                                        it may take a day or two to be processed. You will recieve updates by email for
                                        any changes to your submission's status.
                                    </p>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="className">Class Code</label>
                                        <input
                                            type="text"
                                            className={
                                                "form-control " + (this.state.classCode ? "is-valid" : "is-invalid")
                                            }
                                            id="className"
                                            name="classCode"
                                            placeholder="ABCD 1234 (or 'other' for special cases)"
                                            value={this.state.classCode}
                                            onChange={(e) => {
                                                this.setState({
                                                    classCode: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="professor">Professor</label>
                                        <input
                                            type="text"
                                            className={
                                                "form-control " + (this.state.professor ? "is-valid" : "is-invalid")
                                            }
                                            id="professor"
                                            name="professor"
                                            placeholder="Firstname Lastname"
                                            value={this.state.professor}
                                            onChange={(e) => {
                                                this.setState({
                                                    professor: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="projectType">Project Type</label>
                                        <input
                                            type="text"
                                            className={
                                                "form-control " + (this.state.assignment ? "is-valid" : "is-invalid")
                                            }
                                            id="projectType"
                                            name="projectType"
                                            placeholder="class assignment, research project, etc."
                                            value={this.state.assignment}
                                            onChange={(e) => {
                                                this.setState({
                                                    assignment: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={this.state.submissionType == "internal" ? "show active " : "" + "tab-pane fade"}
                            id="internal"
                            role="tabpanel"
                            aria-labelledby="internal-tab">
                            <div className="row">
                                <div className="col">
                                    <p>
                                        If your submission is for a library department, please specify the department
                                        and the project your submission is for in the following fields.
                                    </p>
                                    <p>
                                        When printing for a library department, the standard price will be waived, but
                                        it may take a day or two to be processed. You will recieve updates by email for
                                        any changes to your submission's status.
                                    </p>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="departmemt">Library Department</label>
                                        <input
                                            type="text"
                                            className={
                                                "form-control " + (this.state.department ? "is-valid" : "is-invalid")
                                            }
                                            id="department"
                                            name="department"
                                            placeholder="Media Library, External Relations, etc."
                                            value={this.state.department}
                                            onChange={(e) => {
                                                this.setState({
                                                    department: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="departmentProject">Project</label>
                                        <input
                                            type="text"
                                            className={
                                                "form-control " + (this.state.project ? "is-valid" : "is-invalid")
                                            }
                                            id="departmentProject"
                                            name="project"
                                            placeholder="What are you making?"
                                            value={this.state.project}
                                            onChange={(e) => {
                                                this.setState({
                                                    project: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        };

        const files = () => {
            return (
                <React.Fragment>
                    <h3>Print Files</h3>
                    <p>
                        Please upload the files you would like printed here. These files must be in stl format. Use the
                        extra fields to request specific print settings, or leave them unchanged for our default
                        settings. If any optional field is left blank, we will use our default settings.
                    </p>
                    {this.state.files.map((thisFile, index) => {
                        return (
                            <SingleFile
                                {...thisFile}
                                index={index}
                                lastIndex={this.state.files.length - 1}
                                updateSubFile={this.updateSubFile.bind(this)}
                                deleteFile={this.deleteFile.bind(this)}
                            />
                        );
                    })}
                    <div className="d-flex justify-content-center mb-4">
                        <button
                            type="button"
                            className="btn btn-success rounded-circle fs-3 p-0"
                            onClick={() => {
                                this.setState({
                                    files: [
                                        ...this.state.files,
                                        {
                                            fileName: "",
                                            material: "Any Material",
                                            color: "Any Color",
                                            copies: "1",
                                            infill: "12.5",
                                            notes: "",
                                            //pickupLocation: "Willis Library",
                                        },
                                    ],
                                });
                            }}>
                            <div
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: "3rem", height: "3rem" }}>
                                <span className="bi bi-plus-lg"></span>
                            </div>
                        </button>
                    </div>
                </React.Fragment>
            );
        };

        const patronInfo = () => {
            return (
                <React.Fragment>
                    <h3>Contact Informtion</h3>
                    <p>
                        Please provide your contact information below. The email you enter will be used for automated
                        email notifications, as well as for further communication if our staff needs more information to
                        complete your request.
                    </p>
                    <div className="input-group">
                        <input
                            type="text"
                            className={
                                "form-control top border-bottom-0 " + (this.state.fname ? "is-valid" : "is-invalid")
                            }
                            name="first"
                            placeholder="First name"
                            value={this.state.fname}
                            onChange={(e) => {
                                this.setState({
                                    fname: e.target.value,
                                });
                            }}
                            required
                        />
                        <input
                            type="text"
                            className={
                                "form-control top border-bottom-0 " + (this.state.lname ? "is-valid" : "is-invalid")
                            }
                            name="last"
                            placeholder="Last name"
                            value={this.state.lname}
                            onChange={(e) => {
                                this.setState({
                                    lname: e.target.value,
                                });
                            }}
                            required
                        />
                    </div>
                    <input
                        type="email"
                        className={"form-control inner " + (this.state.email ? "is-valid" : "is-invalid")}
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={(e) => {
                            this.setState({
                                email: e.target.value,
                            });
                        }}
                        required
                    />
                    <input
                        type="text"
                        className={
                            "form-control euid inner border-bottom-0 border-top-0 " +
                            (this.state.euid ? "is-valid" : "")
                        }
                        name="euid"
                        placeholder="EUID (students only, not required)"
                        value={this.state.euid}
                        onChange={(e) => {
                            this.setState({
                                euid: e.target.value,
                            });
                        }}
                    />
                    <input
                        type="tel"
                        className={"form-control bottom " + (this.state.phone ? "is-valid" : "is-invalid")}
                        name="phone"
                        placeholder="Phone Number"
                        value={this.state.phone}
                        onChange={(e) => {
                            this.setState({
                                phone: e.target.value,
                            });
                        }}
                    />
                </React.Fragment>
            );
        };

        return (
            <div className="container-xl mt-5">
                <div className="col-8 offset-2">
                    <div className="shadow card">
                        <div className="card-header">
                            <h1>New Submission</h1>
                        </div>
                        <div className="card-body">
                            <form
                                id="submission-form"
                                action="/submitprint"
                                method="POST"
                                enctype="multipart/form-data">
                                {patronInfo()}
                                <hr />
                                {pickupInfo()}
                                <hr />
                                {submissionType()}
                                <hr />
                                {files()}
                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.onSubmit();
                                        }}
                                        disabled={!this.canSubmit()}>
                                        {!this.canSubmit()
                                            ? "Please make sure to fill out all required fields!"
                                            : "Submit"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer">
                            <p>
                                Go <a href="/">home</a>?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SubmissionPage);

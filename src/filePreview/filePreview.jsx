import React from "react";
import axios from "../common/axiosConfig";
import Model from "./modelPreview";
import GcodePreview from "./gcodePreview";
import ModelDisplay from "./modelFileViewer";
import Patron from "./patron";
import RequestAndReview from "./requestAndReview";
import InternalNotes from "./internalNotes";
import ReviewForm from "./reviewForm";

class FilePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileID: props.fileID,
            file: null,
            submission: null,
        };
    }

    componentDidMount() {
        var fileID = window.location.pathname.split("/files/")[1];
        console.log(fileID);
        axios.get("/files/" + fileID).then((res) => {
            this.setState({
                fileID: fileID,
                file: res.data.file,
                submission: res.data.submission,
            });
        });
    }

    render() {
        if (this.state.submission && this.state.file) {
            return (
                <div className="container-fluid px-5 mt-5">
                    <div className="row mb-3">
                        <div className="col-4">
                            <Patron submission={this.state.submission} />
                            <ModelDisplay fileID={window.location.pathname.split("/files/")[1]} />
                            {/* <div className="card mb-3 shadow">
                                <div className="card-header">
                                    <ul className="nav nav-tabs card-header-tabs" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                type="button"
                                                role="tab"
                                                ref={(ref) => (this.modeltab = ref)}
                                                onClick={(e) => {
                                                    this.model.firstChild.firstChild.style.display = "block";
                                                    this.gcode.firstChild.firstChild.style.display = "none";
                                                    e.target.classList.add("active");
                                                    this.gcodetab.classList.remove("active");
                                                }}>
                                                STL
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                type="button"
                                                role="tab"
                                                ref={(ref) => (this.gcodetab = ref)}
                                                onClick={(e) => {
                                                    this.model.firstChild.firstChild.style.display = "none";
                                                    this.gcode.firstChild.firstChild.style.display = "block";
                                                    e.target.classList.add("active");
                                                    this.modeltab.classList.remove("active");
                                                }}>
                                                GCODE
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div ref={(ref) => (this.model = ref)}>
                                    <Model fileID={window.location.pathname.split("/files/")[1]} />
                                </div>
                                <div ref={(ref) => (this.gcode = ref)}>
                                    <GcodePreview fileID={window.location.pathname.split("/files/")[1]} />
                                </div>
                            </div> */}
                        </div>
                        <div className="col-4">
                            <RequestAndReview submission={this.state.submission} file={this.state.file} />
                            <InternalNotes submission={this.state.submission} file={this.state.file} />
                        </div>
                        <div className="col-4">
                            <ReviewForm submission={this.state.submission} file={this.state.file} />
                        </div>
                    </div>
                    <div className="row"></div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default FilePreview;

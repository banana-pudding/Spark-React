import React from "react";
import axios from "../common/axiosConfig";
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
        axios.get("/submissions/onefile/" + fileID).then((res) => {
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

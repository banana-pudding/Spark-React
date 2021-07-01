import React from "react";
import { axiosInstance } from "../app";
import ModelDisplay from "./modelFileViewer";
import RequestAndReview from "./requestAndReview";
import InternalNotes from "./internalNotes";
import ReviewForm from "./reviewForm";
import FileStatus from "./fileStatus";

class FilePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileID: props.fileID,
            file: props.file,
            submission: props.submission,
        };
        this.renderer = React.createRef();
    }

    componentDidMount() {
        var fileID = window.location.pathname.split("/files/")[1];
        axiosInstance.get("/submissions/onefile/" + fileID).then((res) => {
            this.setState({
                fileID: fileID,
                file: res.data.file,
                submission: res.data.submission,
            });
        });
    }

    resizePreview() {
        this.renderer.current.resizeGo();
    }

    render() {
        let submission = this.state.submission;
        let file = this.state.file;

        const reviewForm = () => {
            if (file.status === "UNREVIEWED" || file.status === "REVIEWED") {
                return <ReviewForm submission={submission} file={file} />;
            } else {
                return null;
            }
        };
        if (this.state.submission && this.state.file) {
            return (
                <div className="container-fluid px-5 mt-3 single-file-view">
                    <div className="row mb-3">
                        <div className="col-lg-6 col-xl-4">
                            {/* <ModelDisplay fileID={window.location.pathname.split("/files/")[1]} /> */}
                            <ModelDisplay fileID={file._id} ref={this.renderer} />
                        </div>
                        <div className="col-lg-6 col-xl-4">
                            <RequestAndReview submission={submission} file={file} />
                            {file.status == "UNREVIEWED" && (
                                <InternalNotes submission={submission} file={file} user={this.props.user} />
                            )}
                        </div>
                        <div className="col-xl-4">
                            {file.status != "UNREVIEWED" && file.status != "REVIEWED" && (
                                <React.Fragment>
                                    <FileStatus submission={submission} file={file} user={this.props.user} />
                                    <InternalNotes submission={submission} file={file} user={this.props.user} />
                                </React.Fragment>
                            )}
                            {file.status == "REVIEWED" && (
                                <InternalNotes submission={submission} file={file} user={this.props.user} />
                            )}
                            {reviewForm()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default FilePreview;

import React from "react";
import axios from "../common/axiosConfig";
import ModelDisplay from "./modelFileViewer";
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
        const reviewForm = () => {
            if (this.state.file.status === "UNREVIEWED" || this.state.file.status === "REVIEWED") {
                return <ReviewForm submission={this.state.submission} file={this.state.file} />;
            } else {
                return null;
            }
        };

        if (this.state.submission && this.state.file) {
            return (
                <div className="container-fluid px-5 mt-5 single-file-view">
                    <div className="row mb-3">
                        <div className="col-4">
                            {/* <Patron submission={this.state.submission} /> */}
                            <ModelDisplay fileID={window.location.pathname.split("/files/")[1]} />
                        </div>
                        <div className="col-4">
                            <RequestAndReview submission={this.state.submission} file={this.state.file} />
                            {(this.state.file.status === "UNREVIEWED" || this.state.file.status === "REVIEWED") && (
                                <InternalNotes
                                    submission={this.state.submission}
                                    file={this.state.file}
                                    user={this.props.user}
                                />
                            )}
                        </div>
                        <div className="col-4">
                            {this.state.file.status !== "UNREVIEWED" && this.state.file.status !== "REVIEWED" && (
                                <InternalNotes
                                    submission={this.state.submission}
                                    file={this.state.file}
                                    user={this.props.user}
                                />
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

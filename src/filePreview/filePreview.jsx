import React from "react";
import axios from "axios";

import Timeline from "./fileTimeline";

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
        return (
            <div className="container-fluid px-5 mt-5">
                <div className="row mb-3">
                    <p>boo</p>
                </div>
                <div className="row"></div>
            </div>
        );
    }
}

export default FilePreview;

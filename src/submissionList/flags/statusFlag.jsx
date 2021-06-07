import React from "react";
import { statusLabel, statusBG } from "../../common/utils";

class StatusFlag extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let file = this.props.file;

        return <span className={"badge me-2 " + statusBG(file)}>{statusLabel(file)}</span>;
    }
}

export default StatusFlag;

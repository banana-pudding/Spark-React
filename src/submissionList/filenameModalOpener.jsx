import React from "react";
import { statusText } from "../common/utils";
import DetailsModal from "./detailsModal";
import StatusFlag from "./flags/statusFlag";

class Opener extends React.Component {
    constructor(props) {
        super(props);
        this.detailsModal = React.createRef();
    }

    render() {
        return (
            <React.Fragment>
                <div className="d-inline-flex align-items-center">
                    <a
                        className={"text-decoration-none h5 m-0 me-2 " + statusText(this.props.file)}
                        onClick={() => {
                            this.detailsModal.current.setFile(this.props.file, this.props.submission);
                        }}>
                        {this.props.file.fileName}
                    </a>
                    <StatusFlag file={this.props.file} />
                </div>

                <DetailsModal
                    ref={this.detailsModal}
                    submission={this.props.submission}
                    file={this.props.file}
                    user={this.props.user}
                />
            </React.Fragment>
        );
    }
}

export default Opener;

import React from "react";
import DetailsPage from "../singleFileView/filePreview";
import { Modal } from "bootstrap";

class DetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.detailRef = React.createRef();
    }

    state = {
        renderMe: false,
    };

    componentDidMount() {
        this.modalBS = new Modal(this.modalRef.current);
        this.modal = Modal.getInstance(this.modalRef.current);
        this.modalRef.current.addEventListener("hidden.bs.modal", () => {
            this.setState({
                renderMe: false,
            });
        });

        this.modalRef.current.addEventListener("shown.bs.modal", () => {
            if (this.detailRef.current) {
                this.detailRef.current.resizePreview();
            }
        });
    }

    setFile = (file, submission) => {
        this.setState(
            {
                file: file,
                submission: submission,
                renderMe: true,
            },
            () => {
                this.modal.show();
            }
        );
    };

    render() {
        const modalBody = () => {
            if (this.state.file && this.state.submission && this.state.renderMe) {
                let file = this.state.file;
                let submission = this.state.submission;
                return (
                    <DetailsPage
                        ref={this.detailRef}
                        file={file}
                        submission={submission}
                        user={this.props.user}
                        ready={this.state.ready}
                    />
                );
            } else {
                return null;
            }
        };

        return (
            <div className="modal fade" tabIndex="-1" ref={this.modalRef}>
                <div className="modal-dialog fullscreen-modal my-0">
                    <div className="modal-content bg-transparent border-0">
                        <div className="modal-header border-0 pb-0">
                            <button
                                type="button"
                                className="btn btn-light btn-lg ms-auto rounded-circle"
                                style={{
                                    lineHeight: 1.8,
                                }}
                                onClick={() => {
                                    this.modal.hide();
                                }}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">{modalBody()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailsModal;

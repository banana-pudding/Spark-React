import React from "react";
import { Modal } from "bootstrap";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { axiosInstance } from "../../app";

class EditorModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.state = {
            editorState: EditorState.createEmpty(),
            templateName: null,
            subject: null,
            bodyText: null,
        };
    }

    componentDidMount() {
        this.modal = new Modal(this.modalRef.current);
        this.modalInstance = Modal.getInstance(this.modalRef.current);
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    showModal(email) {
        axiosInstance.get("/emails/get/" + email).then((res) => {
            const blocksFromHtml = htmlToDraft(res.data.email.bodyText);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            this.setState(
                {
                    templateName: res.data.email.templateName,
                    subject: res.data.email.subject,
                    bodyText: res.data.email.bodyText,
                    editorState: editorState,
                },
                () => {
                    this.modalInstance.show();
                }
            );
        });
    }

    updateEmail() {
        let html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        axios
            .post("/emails/update/" + this.state.templateName, {
                bodyText: html,
                subject: this.state.subject,
            })
            .then((res) => {
                this.modalInstance.hide();
            });
    }

    render() {
        const { editorState } = this.state;
        const template = () => {
            switch (this.state.templateName) {
                case "submissionRecieved":
                    return "Submission Recieved";
                case "submissionReviewed":
                    return "Submission Reviewed (Request Payment)";
                case "paymentRecieved":
                    return "Payment Recieved";
                case "paymentWaived":
                    return "Payment Waived";
                case "readyForPickup":
                    return "Submission Ready For Pickup";
                default:
                    return "Error???";
            }
        };

        return (
            <div ref={this.modalRef} className="modal fade" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header card-header">
                            <h5 className="modal-title">Editing Email: {template()}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-floating">
                                <input
                                    type="email"
                                    className="form-control mb-3"
                                    id="subjectEditor"
                                    placeholder="Email Subject"
                                    value={this.state.subject}
                                    onChange={(e) => {
                                        this.setState({
                                            subject: e.target.value,
                                        });
                                    }}
                                />
                                <label for="subjectEditor">Email Subject</label>
                            </div>
                            <Editor
                                editorState={editorState}
                                wrapperClassName="demo-wrapper"
                                editorClassName="demo-editor"
                                onEditorStateChange={this.onEditorStateChange}
                            />
                        </div>
                        <div className="modal-footer card-footer">
                            <div className="d-flex align-items-start">
                                <p className="mb-0">
                                    Each email will have the submission detail page link automatically appended when
                                    sent to the patron, so don't worry about adding it here. In addition, when a
                                    submission requires payment, the submission detail page linked in each email will
                                    provide the payment link to the patron.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-midgrey flex-shrink-0 ms-2"
                                    data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary flex-shrink-0 ms-2"
                                    onClick={() => {
                                        this.updateEmail();
                                    }}>
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditorModal;

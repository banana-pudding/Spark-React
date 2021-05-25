import React from "react";
import { formatDate } from "../common/utils";
import axios from "../common/axiosConfig";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/internalNotes.scss";

class InternalNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            note: "",
        };
    }

    appendNote = () => {
        axios.post("/submissions/addnote/" + this.props.file._id, this.state).then((res) => {
            window.location.reload();
        });
    };

    bubbleColor = (currentEUID) => {
        if (this.props.user.euid == currentEUID) {
            return "color-bubble";
        } else {
            return "grey-bubble";
        }
    };

    render() {
        let techNotes = this.props.file.review.internalNotes;

        const noNotes = () => {
            if (this.props.file.review.internalNotes.length < 1) {
                return <p className="text-muted text-center mt-3">No Internal Notes! Add some below...</p>;
            } else {
                return null;
            }
        };

        return (
            <div className="card shadow mb-3 internal-notes">
                <div className="card-header bg-transparent">
                    <h5 className="mb-0">Spark Technician Chat</h5>
                    <p className="text-muted small mb-2">woohoo</p>
                    <p className="text-center mb-0 fw-bold">wow</p>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-column">
                        {noNotes()}
                        {techNotes.map((note) => {
                            return (
                                <div className={this.bubbleColor(note.techEUID)}>
                                    <div>{note.notes}</div>
                                    <small className="text-muted">
                                        {note.techName} ({note.techEUID}) - {formatDate(note.dateAdded)}
                                    </small>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                    <div className="d-flex flex-row align-items-start">
                        <textarea
                            className="form-control"
                            rows="1"
                            value={this.state.note}
                            onChange={(e) => {
                                this.setState({
                                    note: e.target.value,
                                });
                            }}></textarea>
                        <button
                            className="btn btn-primary rounded-circle send-button ms-2"
                            onClick={() => {
                                this.appendNote();
                            }}>
                            <i class="bi bi-cursor-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default InternalNotes;

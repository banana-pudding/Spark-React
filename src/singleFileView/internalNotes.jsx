import React from "react";
import FormattedDate from "../common/formattedDate";
import { axiosInstance } from "../app";
//import "bootstrap-icons/font/bootstrap-icons.css";
import "./scss/internalNotes.scss";
import { withRouter } from "react-router-dom";

class InternalNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            note: "",
        };
    }

    appendNote = () => {
        axiosInstance.post("/submissions/addnote/" + this.props.file._id, this.state).then((res) => {
            this.props.history.go(0);
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
                    <h5 className="mb-0">Spark Technician Notes</h5>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-column">
                        {noNotes()}
                        {techNotes.map((note) => {
                            return (
                                <div className={this.bubbleColor(note.techEUID) + " mb-2"}>
                                    <div>{note.notes}</div>
                                    <small className="text-muted">
                                        {note.techName} ({note.techEUID}) - <FormattedDate date={note.dateAdded} />
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
                            className="btn rounded-circle send-button ms-2 p-0 fs-1 text-primary"
                            onClick={() => {
                                this.appendNote();
                            }}>
                            <i className="bi-telegram"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(InternalNotes);

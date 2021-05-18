import React from "react";
import { formatDate } from "../common/utils";

class InternalNotes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let techNotes = this.props.file.review.internalNotes;
        return (
            <div className="card shadow mb-3">
                <div className="card-header">Internal Notes</div>
                <div className="card-body">
                    <div className="d-flex flex-column">
                        {techNotes.map((note) => {
                            return (
                                <div className="grey-bubble">
                                    <div>{note.notes}</div>
                                    <small className="text-muted">
                                        {note.techName} - {formatDate(note.dateAdded)}
                                    </small>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default InternalNotes;

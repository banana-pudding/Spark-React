import React from "react";
import { Link, withRouter } from "react-router-dom";
import FormattedDate from "../../common/formattedDate";
import { axiosInstance } from "../../app";

class TransitCard extends React.Component {
    constructor(props) {
        super(props);
    }

    markFileArrived = () => {
        let fileIDs = [];
        fileIDs.push(this.props.file._id);
        axiosInstance.post("/submissions/arrived", { fileIDs: fileIDs }).then((res) => {
            this.props.history.go(0);
        });
    };

    render() {
        let attempt = this.props.attempt;
        let file = this.props.file;
        return (
            <React.Fragment>
                <p className="h4">In transit to: {file.request.pickupLocation}</p>
                <div className="d-grid">
                    <button
                        className="btn btn-purple mb-2"
                        onClick={() => {
                            this.markFileArrived();
                        }}>
                        Arrived at Pickup Location?
                    </button>
                    <p>
                        The patron will only be notified once <strong>all</strong> files have arrived at the requested
                        pickup location.
                    </p>
                </div>
                <h5 className="text-muted">Attempt ID: {attempt.prettyID}</h5>
                <table className="table">
                    <tbody>
                        <tr>
                            <th scope="row" className="text-muted">
                                Started At
                            </th>
                            <td>
                                <strong>
                                    <FormattedDate date={attempt.timestampStarted} />
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" className="text-muted">
                                Started By
                            </th>
                            <td>
                                <strong>{attempt.startedByName}</strong> ({attempt.startedByEUID})
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" className="text-muted">
                                Printer
                            </th>
                            <td>
                                <strong>{attempt.printerName}</strong> @ {attempt.location}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" className="text-muted">
                                Filament
                            </th>
                            <td>
                                <strong>{attempt.rollID}</strong> @ {attempt.startWeight}g
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" className="text-muted">
                                All Files in Attempt ({attempt.fileIDs.length})
                            </th>
                            <td>
                                {attempt.fileNames.map((name, index) => {
                                    return <p className="mb-0">{name}</p>;
                                })}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

export default withRouter(TransitCard);

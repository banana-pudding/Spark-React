import React, { useState } from "react";
import { usePopper } from "react-popper";
import FormattedDate from "../common/formattedDate";

const Balloon = (props) => {
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [isPop, togglePop] = useState(false);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "left",
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 8],
                },
            },
            {
                name: "flip",
                options: {
                    fallbackPlacements: ["right"],
                },
            },
        ],
    });

    const buttonClasses = () => {
        if (isPop) {
            return "text-red user-select-none";
        } else {
            return "text-primary user-select-none";
        }
    };

    const popClasses = () => {
        if (isPop) {
            return "visible card shadow showpop";
        } else {
            return "invisible";
        }
    };
    const innerTableStyle = () => {
        return "table mb-0 innertable";
    };

    const content = () => {
        let file = props.file;
        switch (props.item) {
            case "request":
                return (
                    <table className={innerTableStyle()}>
                        <thead>
                            <tr className="card-header">
                                <th colSpan="2">Request Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Material</th>
                                <td>{file.request.material}</td>
                            </tr>
                            <tr>
                                <th scope="row">Color</th>
                                <td>{file.request.color}</td>
                            </tr>
                            <tr>
                                <th scope="row">Infill</th>
                                <td>{file.request.infill}%</td>
                            </tr>
                            <tr>
                                <th scope="row">Notes</th>
                                <td>{file.request.notes || "Patron left no notes."}</td>
                            </tr>
                            <tr>
                                <th scope="row">Pickup Location</th>
                                <td>{file.request.pickupLocation}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            case "review":
                return (
                    <table className={innerTableStyle()}>
                        <thead className="card-header">
                            <tr>
                                <th colSpan="2">Review Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">File Volume</th>
                                <td>
                                    {file.review.calculatedVolumeCm}cm
                                    <sup>3</sup>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Print Time</th>
                                <td>
                                    {file.review.slicedHours}h {file.review.slicedMinutes}m
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Estimated Weight</th>
                                <td>{file.review.slicedGrams}g</td>
                            </tr>
                            <tr>
                                <th scope="row">Notes</th>
                                <td>{file.review.patronNotes || "Technician left no notes."}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            case "print":
                return (
                    <table className={innerTableStyle()}>
                        <thead className="card-header">
                            <tr>
                                <th colSpan="2">Print Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Total Attempts</th>
                                <td>{file.printing.attemptIDs.length}</td>
                            </tr>
                            <tr>
                                <th scope="row">Failed Attempts</th>
                                <td>{file.printing.failedAttempts}</td>
                            </tr>
                            {file.lastAttempt && (
                                <React.Fragment>
                                    <tr>
                                        <th scope="row">Attempt ID</th>
                                        <td>{file.lastAttempt.prettyID}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Printer</th>
                                        <td>{file.lastAttempt.printerName}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Location</th>
                                        <td>{file.lastAttempt.location}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Started</th>
                                        <td>
                                            <FormattedDate date={file.lastAttempt.timestampStarted} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Finished</th>
                                        <td>
                                            <FormattedDate date={file.lastAttempt.timestampEnded} />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )}
                        </tbody>
                    </table>
                );
            default:
                break;
        }
    };

    const label = () => {
        if (isPop) {
            return <i className="bi bi-box-arrow-in-down-right"></i>;
        } else {
            return <i className="bi bi-box-arrow-up-right"></i>;
        }
    };

    return (
        <>
            <span
                className={buttonClasses()}
                ref={setReferenceElement}
                onClick={(e) => {
                    togglePop(!isPop);
                }}>
                {label()}
            </span>

            <div ref={setPopperElement} className={popClasses()} style={styles.popper} {...attributes.popper}>
                {content()}
            </div>
        </>
    );
};

export default Balloon;

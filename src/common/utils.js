import React from "react";
export const formatDate = (date) => {
    var jsDate = new Date(date);
    let time = jsDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
    return (
        jsDate.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
        }) +
        " • " +
        time.slice(0, -2) +
        (time.slice(-2, -1).toLowerCase() == "a" ? "☀" : "🌙")
    );
};

export const statusLabel = (file) => {
    switch (file.status) {
        case "UNREVIEWED":
            return "Unreviewed";
        case "REVIEWED":
            if (file.review.descision == "Accepted") {
                return "Accepted";
            } else {
                return "Rejected";
            }
        case "PENDING_PAYMENT":
            if (file.payment.isPendingWaive) {
                return "Pending Waive";
            } else {
                return "Pending Payment";
            }
        case "READY_TO_PRINT":
            return "Ready to Print";
        case "PRINTING":
            return "Printing";
        case "IN_TRANSIT":
            return "In Transit";
        case "WAITING_FOR_PICKUP":
            return "Waiting for Pickup";
        case "PICKED_UP":
            return "Picked Up";
        case "REJECTED":
            return "Rejected";
        case "STALE_ON_PAYMENT":
            return "Never Paid";
        case "REPOSESSED":
            return "Never Picked Up";
        case "LOST_IN_TRANSIT":
            return "Lost in Transit";
        default:
            return file.status;
    }
};

export const statusColor = (file) => {
    switch (file.status) {
        case "UNREVIEWED":
            return "magenta";
        case "REVIEWED":
            if (file.review.descision == "Accepted") {
                return "lime";
            } else {
                return "red";
            }
        case "PENDING_PAYMENT":
            if (file.payment.isPendingWaive) {
                return "teal";
            } else {
                return "pink";
            }
        case "READY_TO_PRINT":
            return "orange";
        case "PRINTING":
            return "green";
        case "IN_TRANSIT":
            return "teal";
        case "WAITING_FOR_PICKUP":
            return "blue";
        case "PICKED_UP":
            return "purple";
        case "REJECTED":
            return "red";
        case "STALE_ON_PAYMENT":
            return "purple";
        case "REPOSESSED":
            return "purple";
        case "LOST_IN_TRANSIT":
            return "magenta";
        default:
            return "magenta";
    }
};

export const statusBG = (file) => {
    return "bg-" + statusColor(file);
};

export const statusText = (file) => {
    return "text-" + statusColor(file);
};

export const statusBadge = (status) => {
    switch (status) {
        case "UNREVIEWED":
            return <span className="badge rounded bg-magenta">Unreviewed</span>;
        case "REVIEWED":
            return (
                <React.Fragment>
                    <span className="ms-auto badge rounded bg-lime">Accepted</span>
                    <span className="ms-1 badge rounded bg-red">Rejected</span>
                </React.Fragment>
            );
        case "PENDING_PAYMENT":
            return <span className="badge rounded bg-pink">Pending Payment</span>;
        case "READY_TO_PRINT":
            return <span className="badge rounded bg-orange">Ready to Print</span>;
        case "PRINTING":
            return <span className="badge rounded bg-green">Printing</span>;
        case "IN_TRANSIT":
            return <span className="badge rounded bg-teal">In Transit</span>;
        case "WAITING_FOR_PICKUP":
            return <span className="badge rounded bg-blue">Waiting for Pickup</span>;
        case "PICKED_UP":
            return <span className="badge rounded bg-purple">Picked Up</span>;
        case "REJECTED":
            return <span className="badge rounded bg-red">Rejected</span>;
        default:
            return null;
    }
};

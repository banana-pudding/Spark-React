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
                return "orange";
            } else {
                return "teal";
            }
        case "READY_TO_PRINT":
            return "blue";
        case "PRINTING":
            return "green";
        case "IN_TRANSIT":
            return "bg-magenta";
        case "PICKED_UP":
            return "blue";
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

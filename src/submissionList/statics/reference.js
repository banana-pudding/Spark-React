import { statusToggleColor } from "../../common/utils";
export const defaultState = () => {
    return {
        selectedQueue: "New Submissions",
        filters: {
            status: [
                "UNREVIEWED",
                "REVIEWED",
                // "PENDING_PAYMENT",
                // "READY_TO_PRINT",
                // "PRINTING",
                // "IN_TRANSIT",
                // "WAITING_FOR_PICKUP",
                // "PICKED_UP",
                // "REJECTED",
                // "STALE_ON_PAYMENT",
                // "REPOSESSED",
                // "LOST_IN_TRANSIT",
            ],
            submittedBefore: null,
            submittedAfter: null,
            reviewedBefore: null,
            reviewedAfter: null,
            paidBefore: null,
            paidAfter: null,
            printedBefore: null,
            printedAfter: null,
            pickedupBefore: null,
            pickedupAfter: null,
            paymentType: ["PAID", "WAIVED", "UNPAID"],
            pickupLocation: ["Willis Library", "Discovery Park"],
            printedLocation: ["Willis Library", "Discovery Park"],
            waitingLocation: ["Willis Library", "Discovery Park"],
            showPersonal: true,
            showClass: true,
            showInternal: true,
            showFullSubmission: false,
            showUnarchived: true,
            showArchived: false,
            searchQuery: "",
            currentPage: 1,
        },
        submissions: [],
        totalCount: 0,
        filterTab: "Queues",
    };
};

export const statusList = [
    {
        name: "UNREVIEWED",
        label: "Unreviewed",
    },
    {
        name: "REVIEWED",
        label: "Reviewed",
    },
    {
        name: "PENDING_PAYMENT",
        label: "Pending Payment",
    },
    {
        name: "READY_TO_PRINT",
        label: "Ready to Print",
    },
    {
        name: "PRINTING",
        label: "Printing",
    },
    {
        name: "IN_TRANSIT",
        label: "In Transit",
    },
    {
        name: "WAITING_FOR_PICKUP",
        label: "Waiting for Pickup",
    },
    {
        name: "PICKED_UP",
        label: "Picked Up",
    },
    {
        name: "REJECTED",
        label: "Rejected",
    },
    {
        name: "STALE_ON_PAYMENT",
        label: "Never Paid",
    },
    {
        name: "LOST_IN_TRANSIT",
        label: "Lost in Transit",
    },
    {
        name: "REPOSESSED",
        label: "Never Picked Up",
    },
];

export const dateList = [
    {
        name: "submitted",
        label: "Submitted",
        before: "submittedBefore",
        after: "submittedAfter",
    },
    {
        name: "reviewed",
        label: "Reviewed",

        before: "reviewedBefore",
        after: "reviewedAfter",
    },
    {
        name: "paid",
        label: "Paid",

        before: "paidBefore",
        after: "paidAfter",
    },
    {
        name: "printed",
        label: "Printed",

        before: "printedBefore",
        after: "printedAfter",
    },
    {
        name: "pickedup",
        label: "Picked Up",

        before: "pickedupBefore",
        after: "pickedupAfter",
    },
];

export const typeList = [
    {
        name: "showPersonal",
        label: "Show Personal Submissions",
        color: "lightblue",
    },
    {
        name: "showClass",
        label: "Show Class Submissions",
        color: "purple",
    },
    {
        name: "showInternal",
        label: "Show Internal Submissions",
        color: "orange",
    },
    {
        name: "showUnarchived",
        label: "Show Unarchived Submissions",
        color: "green",
    },
    {
        name: "showArchived",
        label: "Show Archived Submissions",
        color: "midgrey",
    },
];

export const filterTabList = ["Queues", "Statuses", "Dates", "Locations", "Types"];

export const queueFilters = [
    {
        name: "New Submissions",
        color: statusToggleColor("UNREVIEWED"),
        status: ["UNREVIEWED", "REVIEWED"],
    },
    {
        name: "Pending Payment",
        color: statusToggleColor("PENDING_PAYMENT"),
        status: ["PENDING_PAYMENT"],
    },
    {
        name: "Ready to Print",
        color: statusToggleColor("READY_TO_PRINT"),
        status: ["READY_TO_PRINT"],
    },
    {
        name: "Printing",
        color: statusToggleColor("PRINTING"),
        status: ["PRINTING"],
    },
    {
        name: "In Transit",
        color: statusToggleColor("IN_TRANSIT"),
        status: ["IN_TRANSIT"],
    },
    {
        name: "Waiting for Pickup",
        color: statusToggleColor("WAITING_FOR_PICKUP"),
        status: ["WAITING_FOR_PICKUP"],
    },
    {
        name: "Completed",
        color: statusToggleColor("PICKED_UP"),
        status: ["PICKED_UP"],
    },
    {
        name: "Reposessed",
        color: statusToggleColor("REPOSESSED"),
        status: ["REPOSESSED"],
    },
    {
        name: "Rejected",
        color: statusToggleColor("REJECTED"),
        status: ["REJECTED"],
    },

    {
        name: "All",
        color: "lightblue",
        status: [
            "UNREVIEWED",
            "REVIEWED",
            "PENDING_PAYMENT",
            "READY_TO_PRINT",
            "PRINTING",
            "IN_TRANSIT",
            "WAITING_FOR_PICKUP",
            "PICKED_UP",
            "REJECTED",
            "STALE_ON_PAYMENT",
            "REPOSESSED",
            "LOST_IN_TRANSIT",
        ],
    },
];

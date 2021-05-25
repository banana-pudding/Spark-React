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
        name: "REPOSESSED",
        label: "Never Picked Up",
    },
    {
        name: "LOST_IN_TRANSIT",
        label: "Lost in Transit",
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

export const defaultState = {
    needsUpdate: false,
    filters: {
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
        reviewLocation: ["Willis Library", "Discovery Park"],
        showPersonal: true,
        showClass: true,
        showInternal: true,
        showFullSubmission: false,
    },
    submissions: [],
};

export const queueFilters = [
    {
        name: "New Submissions",
        status: ["UNREVIEWED", "REVIEWED"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Pending Payment",
        status: ["PENDING_PAYMENT"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Ready to Print",
        status: ["READY_TO_PRINT"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Ready to Print (Willis)",
        status: ["READY_TO_PRINT"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library"],
    },
    {
        name: "Ready to Print (DP)",
        status: ["READY_TO_PRINT"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Discovery Park"],
    },
    {
        name: "Printing",
        status: ["PRINTING"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "In Transit",
        status: ["IN_TRANSIT"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Ready for Pickup",
        status: ["WAITING_FOR_PICKUP"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Ready for Pickup (Willis)",
        status: ["WAITING_FOR_PICKUP"],
        pickupLocation: ["Willis Library"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Ready for Pickup (DP)",
        status: ["WAITING_FOR_PICKUP"],
        pickupLocation: ["Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Rejected",
        status: ["REJECTED"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
    {
        name: "Reposessed",
        status: ["REPOSESSED"],
        pickupLocation: ["Willis Library", "Discovery Park"],
        reviewLocation: ["Willis Library", "Discovery Park"],
    },
];

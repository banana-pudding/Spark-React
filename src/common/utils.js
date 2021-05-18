export const formatDate = (date) => {
    var jsDate = new Date(date);
    return (
        jsDate.toLocaleDateString("en-US") +
        " @ " +
        jsDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        })
    );
};

import React from "react";

class FormattedShortDate extends React.Component {
    render() {
        let jsDate = new Date(this.props.date);
        let dateText = jsDate.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
        });
        return <span>{dateText}</span>;
    }
}

export default FormattedShortDate;

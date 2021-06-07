import React from "react";

class FormattedDate extends React.Component {
    render() {
        let jsDate = new Date(this.props.date);
        let time = jsDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
        let dateText =
            jsDate.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "2-digit",
            }) +
            " ᛫ " +
            time.slice(0, -3);
        let symbol = time.slice(-2, -1).toLowerCase() == "a" ? "☀" : "🌙";
        return (
            <span>
                {dateText}
                <span style={{ fontSize: "0.7em" }}>{" " + time.slice(-2)}</span>
            </span>
        );
    }
}

export default FormattedDate;

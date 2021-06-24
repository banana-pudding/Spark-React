import React from "react";
import { statusList } from "../statics/reference";
import { statusToggleColor } from "../../common/utils";

class StatusToggles extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ul className="list-group list-group-flush">
                {statusList.map((status, index) => {
                    return (
                        <li className="list-group-item p-0 d-flex" key={index}>
                            <label className="w-100 py-2 px-3 d-flex" htmlFor={status.name}>
                                <input
                                    className="tgl tgl-ios"
                                    type="checkbox"
                                    value=""
                                    checked={this.props.selectedStatuses.includes(status.name)}
                                    onChange={() => {
                                        this.props.toggleStatus(status.name);
                                    }}
                                    id={status.name}
                                />
                                <div class={"tgl-btn me-2 tgl-" + statusToggleColor(status.name)}></div>
                                <span>{status.label}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default StatusToggles;

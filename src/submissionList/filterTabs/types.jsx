import React from "react";
import { typeList } from "../statics/reference";

class TypeToggles extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ul className="list-group list-group-flush">
                {typeList.map((type, index) => {
                    return (
                        <li className="list-group-item p-0 d-flex" key={index}>
                            <label className="w-100 py-2 px-3 d-flex" htmlFor={type.name}>
                                <input
                                    className="tgl tgl-ios"
                                    type="checkbox"
                                    value=""
                                    checked={this.props.filters[type.name]}
                                    onChange={() => {
                                        this.props.toggleType(type.name);
                                    }}
                                    id={type.name}
                                />
                                <div class={"tgl-btn me-2 tgl-" + type.color}></div>
                                <span>{type.label}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default TypeToggles;

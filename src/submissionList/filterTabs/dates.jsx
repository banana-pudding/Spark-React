import React from "react";
import { dateList } from "../statics/reference";
import DatePicker from "react-date-picker";

class DateFilters extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ul className="list-group list-group-flush border-0">
                {dateList.map((dateType, index) => {
                    return (
                        <li className="list-group-item py-3" key={index}>
                            <h6 className="mb-2">{`Date ${dateType.label}:`}</h6>
                            <div className="input-group">
                                <DatePicker
                                    clearIcon={null}
                                    calendarIcon={null}
                                    className="form-control"
                                    value={this.props.filters[dateType.after]}
                                    onChange={(value) => {
                                        this.props.setDateFilter(dateType.after, value);
                                    }}
                                />
                                <DatePicker
                                    clearIcon={null}
                                    calendarIcon={null}
                                    className="form-control"
                                    value={this.props.filters[dateType.before]}
                                    onChange={(value) => {
                                        this.props.setDateFilter(dateType.before, value);
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-between">
                                <small className="text-muted">After (inclusive)</small>
                                <small className="text-muted">Before (inclusive)</small>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default DateFilters;

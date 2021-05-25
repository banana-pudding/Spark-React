import React from "react";
import axios from "../common/axiosConfig";
import SingleSubmission from "./oneSubmission";
import DatePicker from "react-date-picker";
import { statusList, dateList, defaultState, queueFilters } from "./statics/reference";
import "./css/submissionList.scss";

class SubmissionList extends React.Component {
    constructor(props) {
        super(props);
        this.setQueue(queueFilters[0]);
    }

    statusList = statusList;
    dateList = dateList;
    queueFilters = queueFilters;
    state = defaultState;

    fetchPrints = () => {
        this.setState({
            submissions: [],
        });

        axios
            .post("/submissions/filter", this.state.filters)
            .then((res) => {
                this.setState({
                    submissions: res.data.submissions,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    toggleStatus = (statusID) => {
        let tempFilters = this.state.filters;
        let tempStatusFilters = this.state.filters.status;

        if (tempStatusFilters.includes(statusID)) {
            tempStatusFilters = tempStatusFilters.filter((e) => e != statusID);
        } else {
            tempStatusFilters.push(statusID);
        }

        delete tempFilters.status;
        tempFilters.status = tempStatusFilters;

        this.setState({
            filters: tempFilters,
        });
    };

    setDateFilter = (dateField, newValue) => {
        let tempFilters = this.state.filters;
        tempFilters[dateField] = newValue;
        this.setState({
            filters: tempFilters,
        });
    };

    setQueue = (queueItem) => {
        let tempState = defaultState;
        let tempFilters = tempState.filters;

        tempFilters.status = queueItem.status;
        tempFilters.reviewLocation = queueItem.reviewLocation;
        tempFilters.pickupLocation = queueItem.pickupLocation;

        tempState.filters = tempFilters;

        this.setState(tempState);
        this.fetchPrints();
    };

    render() {
        return (
            <div className="container-fluid mt-4 px-5 submission-container">
                <div className="row">
                    <div className="col-3">
                        <form>
                            <div className="accordion shadow mb-3" id="filter-accordian">
                                <div className="accordion-item">
                                    <div className="accordion-header">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#queue-collapse"
                                            aria-expanded="true"
                                            aria-controls="queue-collapse">
                                            <h5 className="mb-0">Queues</h5>
                                        </button>
                                    </div>
                                    <div
                                        id="queue-collapse"
                                        className="accordion-collapse collapse show"
                                        data-bs-parent="#filter-accordian">
                                        <ul className="list-group list-group-flush mb-3">
                                            {this.queueFilters.map((queueItem, index) => {
                                                return (
                                                    <button
                                                        className="list-group-item list-group-item-action"
                                                        type="button"
                                                        onClick={(e) => {
                                                            this.setQueue(queueItem);
                                                        }}
                                                        key={index}>
                                                        {queueItem.name}
                                                    </button>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <div className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#status-collapse"
                                            aria-expanded="false"
                                            aria-controls="status-collapse">
                                            <h5 className="mb-0">Advanced</h5>
                                        </button>
                                    </div>
                                    <div
                                        id="status-collapse"
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#filter-accordian">
                                        <div className="accordion-body">
                                            <button
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={() => {
                                                    this.fetchPrints();
                                                }}>
                                                Update Results
                                            </button>
                                        </div>
                                        <ul className="list-group list-group-flush mb-3">
                                            {this.statusList.map((status, index) => {
                                                return (
                                                    <li className="list-group-item" key={index}>
                                                        <li className="form-check mb-0">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value=""
                                                                checked={this.state.filters.status.includes(
                                                                    status.name
                                                                )}
                                                                onChange={() => {
                                                                    this.toggleStatus(status.name);
                                                                }}
                                                                id={status.name}
                                                            />
                                                            <label
                                                                className="form-check-label w-100"
                                                                for="flexCheckDefault">
                                                                {status.label}
                                                            </label>
                                                        </li>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        <div className="accordion-body">
                                            {this.dateList.map((dateType, index) => {
                                                const divider = () => {
                                                    if (index != 0) {
                                                        return <hr />;
                                                    }
                                                };
                                                return (
                                                    <div>
                                                        {divider()}
                                                        <h6 className="mb-2">{`Date ${dateType.label}`}</h6>
                                                        <div className="row">
                                                            <div className="col">
                                                                <DatePicker
                                                                    className="form-control"
                                                                    value={this.state.filters[dateType.after]}
                                                                    onChange={(value) => {
                                                                        this.setDateFilter(dateType.after, value);
                                                                    }}
                                                                />
                                                                <small className="text-muted">On or after</small>
                                                            </div>
                                                            <div className="col">
                                                                <DatePicker
                                                                    className="form-control"
                                                                    value={this.state.filters[dateType.before]}
                                                                    onChange={(value) => {
                                                                        this.setDateFilter(dateType.before, value);
                                                                    }}
                                                                />
                                                                <small className="text-muted">Before or on</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col">
                        {this.state.submissions.map((item, index) => {
                            return <SingleSubmission item={item} key={index} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default SubmissionList;

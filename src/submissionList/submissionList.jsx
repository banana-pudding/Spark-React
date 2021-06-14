import React from "react";
import axios from "../common/axiosConfig";
import SingleSubmission from "./oneSubmission";
import DatePicker from "react-date-picker";
import { statusList, dateList, defaultState, queueFilters } from "./statics/reference";
import "./scss/submissionList.scss";
import { withRouter } from "react-router-dom";
import { statusBadge } from "../common/utils";

class SubmissionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount() {
        console.log("mount");
        this.props.history.listen((location, action) => {
            console.log("listen history");
            if (action === "POP") {
                console.log("history pop");
                this.setStateFromQuery();
            }
        });

        if (this.props.location.search) {
            this.setStateFromQuery();
        } else {
            this.setQueue(queueFilters[0]);
        }
    }

    fetchPrints = () => {
        this.setState({ submissions: [] });
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

    setStateFromQuery = () => {
        console.log("statefromwyuet");
        let parseFilter = {
            selectedQueue: defaultState.selectedQueue,
            filters: defaultState.filters,
        };
        try {
            parseFilter = JSON.parse(decodeURIComponent(this.props.location.search.slice(1)));
        } catch (err) {
            console.log(err);
        } finally {
            this.setState(
                {
                    submissions: [],
                    selectedQueue: parseFilter.selectedQueue,
                    filters: parseFilter.filters,
                },
                () => {
                    this.fetchPrints();
                }
            );
        }
    };

    updatePrintsCustom = () => {
        console.log("update custom");
        this.setState({ selectedQueue: null }, () => {
            this.updateHistory();
        });
    };

    toggleStatus = (statusID) => {
        console.log("toggle status");
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
        console.log("setqueue");
        let tempState = defaultState;
        let tempFilters = tempState.filters;

        tempFilters.status = queueItem.status;
        tempFilters.reviewLocation = queueItem.reviewLocation;
        tempFilters.pickupLocation = queueItem.pickupLocation;

        tempState.filters = tempFilters;
        tempState.selectedQueue = queueItem.name;

        this.setState(tempState, () => {
            this.updateHistory();
        });
    };

    updateHistory = () => {
        console.log("updatehistory");
        let query = {
            selectedQueue: this.state.selectedQueue,
            filters: this.state.filters,
        };

        this.props.history.push({
            pathname: "/prints",
            search: "?" + encodeURIComponent(JSON.stringify(query)),
        });

        this.fetchPrints();
    };

    render() {
        return (
            <div className="container-fluid mt-4 px-5 submission-container">
                <div className="row">
                    <div className=" col-lg-3">
                        <form>
                            <div className="card shadow mb-3">
                                <div className="card-header">
                                    <p className="h4 mb-0">Queues</p>
                                </div>
                                <div>
                                    <ul className="list-group list-group-flush mb-0">
                                        {queueFilters.map((queueItem, index) => {
                                            return (
                                                <button
                                                    className={
                                                        "list-group-item list-group-item-action " +
                                                        (queueItem.name == this.state.selectedQueue ? "active" : "")
                                                    }
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
                            <div className="card shadow mb-3">
                                <div className="card-header">
                                    <div className="d-flex justify-content-between  align-items-center">
                                        <p className="h4 mb-0">Advanced Filters</p>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => {
                                                this.updatePrintsCustom();
                                            }}>
                                            Update Results
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <ul className="list-group list-group-flush mb-3 border-top border-bottom">
                                        {statusList.map((status, index) => {
                                            return (
                                                <li className="list-group-item p-0" key={index}>
                                                    <label
                                                        className="form-check-label w-100 py-2 px-3 d-flex"
                                                        htmlFor={status.name}>
                                                        <input
                                                            className="form-check-input me-2"
                                                            type="checkbox"
                                                            value=""
                                                            checked={this.state.filters.status.includes(status.name)}
                                                            onChange={() => {
                                                                this.toggleStatus(status.name);
                                                            }}
                                                            id={status.name}
                                                        />
                                                        <span className="d-inline-flex w-100 justify-content-between align-items-center">
                                                            {status.label} {statusBadge(status.name)}
                                                        </span>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <ul className="list-group list-group-flush border-top">
                                        {dateList.map((dateType, index) => {
                                            return (
                                                <li className="list-group-item py-3" key={index}>
                                                    <h6 className="mb-2">{`Date ${dateType.label}:`}</h6>
                                                    <div className="input-group">
                                                        <DatePicker
                                                            clearIcon={null}
                                                            calendarIcon={null}
                                                            className="form-control"
                                                            value={this.state.filters[dateType.after]}
                                                            onChange={(value) => {
                                                                this.setDateFilter(dateType.after, value);
                                                            }}
                                                        />
                                                        <DatePicker
                                                            clearIcon={null}
                                                            calendarIcon={null}
                                                            className="form-control"
                                                            value={this.state.filters[dateType.before]}
                                                            onChange={(value) => {
                                                                this.setDateFilter(dateType.before, value);
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
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className=" col-lg-9">
                        {this.state.submissions.length == 0 && (
                            <div className="alert alert-red shadow">
                                <div className="d-flex justify-content-between">
                                    <i className="h1 mb-0 bi bi-exclamation-circle-fill"></i>
                                    <p className="h1 mb-0">No matching results!</p>
                                    <i className="h1 mb-0 bi bi-exclamation-circle-fill"></i>
                                </div>
                            </div>
                        )}

                        {this.state.submissions.map((item, index) => {
                            return <SingleSubmission item={item} key={index} user={this.props.user} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SubmissionList);

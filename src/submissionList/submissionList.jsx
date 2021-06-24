import React from "react";
import axios from "../common/axiosConfig";
import SingleSubmission from "./oneSubmission";

import { defaultState, queueFilters, filterTabList, dateList, typeList } from "./statics/reference";
import "./scss/submissionList.scss";
import { withRouter } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import QueueList from "./filterTabs/queues";
import StatusList from "./filterTabs/statuses";
import DateFilters from "./filterTabs/dates";
import LocationFitlers from "./filterTabs/locations";
import TypeFilters from "./filterTabs/types";

class SubmissionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultState();

        this.setQueue = this.setQueue.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.toggleType = this.toggleType.bind(this);
        this.setDateFilter = this.setDateFilter.bind(this);
        this.setPickupLocation = this.setPickupLocation.bind(this);
        this.setPrintedLocation = this.setPrintedLocation.bind(this);
        this.setWaitingLocation = this.setWaitingLocation.bind(this);
    }

    componentDidMount() {
        this.props.history.listen((location, action) => {
            if (action === "POP") {
                this.setStateFromQuery();
            }
        });

        if (this.props.location.search) {
            this.setStateFromQuery();
        } else {
            this.setQueue(queueFilters[0]);
        }

        console.log(this.state);
    }

    fetchPrints = () => {
        this.setState({ submissions: [] });
        axios
            .post("/submissions/filter", this.state.filters)
            .then((res) => {
                this.setState({
                    submissions: res.data.submissions,
                    totalCount: res.data.totalCount,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    setStateFromQuery = () => {
        let parseFilter = {
            selectedQueue: defaultState().selectedQueue,
            filters: defaultState().filters,
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
        this.setState({ selectedQueue: null }, () => {
            this.updateHistory();
        });
    };

    resetFilters = () => {
        this.setState(
            {
                filters: defaultState().filters,
                selectedQueue: defaultState().selectedQueue,
            },
            () => {
                this.updateHistory();
            }
        );
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

    toggleType = (type) => {
        let tempFilters = this.state.filters;

        tempFilters[type] = !tempFilters[type];

        console.log(tempFilters[type]);

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
        let tempState = defaultState();
        let tempFilters = tempState.filters;

        tempFilters.status = queueItem.status;
        tempFilters.pickupLocation = defaultState().filters.pickupLocation;
        tempFilters.printedLocation = defaultState().filters.printedLocation;
        tempFilters.waitingLocation = defaultState().filters.waitingLocation;

        tempState.filters = tempFilters;
        tempState.selectedQueue = queueItem.name;

        this.setState(tempState, () => {
            this.updateHistory();
        });
    };

    setPickupLocation = (newLocation) => {
        let tempState = this.state;
        let tempFilters = tempState.filters;

        let newPickup = [];

        if (newLocation == "both") {
            newPickup = ["Willis Library", "Discovery Park"];
        } else {
            newPickup.push(newLocation);
        }

        tempFilters.pickupLocation = newPickup;

        tempState.filters = tempFilters;

        this.setState({ filters: tempFilters });
    };

    setPrintedLocation = (newLocation) => {
        console.log(newLocation);
        let tempState = this.state;
        let tempFilters = tempState.filters;

        let newPrinted = [];

        if (newLocation == "both") {
            newPrinted = ["Willis Library", "Discovery Park"];
        } else {
            newPrinted.push(newLocation);
        }

        tempFilters.printedLocation = newPrinted;

        tempState.filters = tempFilters;

        this.setState({ filters: tempFilters });
    };

    setWaitingLocation = (newLocation) => {
        let tempState = this.state;
        let tempFilters = tempState.filters;

        let newWaiting = [];

        if (newLocation == "both") {
            newWaiting = ["Willis Library", "Discovery Park"];
        } else {
            newWaiting.push(newLocation);
        }

        tempFilters.waitingLocation = newWaiting;

        tempState.filters = tempFilters;

        this.setState({ filters: tempFilters });
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

    setPage = (pageNum) => {
        let temp = this.state.filters;
        temp.currentPage = pageNum;
        this.setState(
            {
                filters: temp,
            },
            () => {
                this.updateHistory();
            }
        );
    };

    render() {
        const pageButtons = () => {
            let numPages = Math.floor(this.state.totalCount / 10);
            let lastPage = numPages + 1;
            let currentPage = this.state.filters.currentPage;
            let pagePadding = 2;
            let leftPad = currentPage - pagePadding;
            let rightPad = currentPage + pagePadding + 1;
            let rangeWithDots = [];
            let lastIndex;

            for (let i = 1; i <= lastPage; i++) {
                if (i == 1 || i == lastPage || (i >= leftPad && i < rightPad)) {
                    if (lastIndex) {
                        if (i - lastIndex === 2) {
                            rangeWithDots.push(lastIndex + 1);
                        } else if (i - lastIndex !== 1) {
                            rangeWithDots.push("...");
                        }
                    }
                    rangeWithDots.push(i);
                    lastIndex = i;
                }
            }

            return (
                <div className="d-flex">
                    <button
                        className="btn bg-white text-primary border me-2"
                        onClick={(e) => {
                            this.setPage(1);
                        }}>
                        <i className="bi bi-chevron-double-left"></i>
                    </button>

                    <div className="btn-group" role="group">
                        {rangeWithDots.map((pageNum, index) => {
                            return (
                                <button
                                    onClick={(e) => {
                                        if (pageNum != "...") {
                                            this.setPage(pageNum);
                                        }
                                    }}
                                    className={
                                        "btn border " +
                                        (this.state.filters.currentPage == pageNum
                                            ? "btn-primary border-primary"
                                            : "bg-white text-primary")
                                    }>
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className="btn bg-white text-primary border ms-2"
                        onClick={(e) => {
                            this.setPage(lastPage);
                        }}>
                        <i className="bi bi-chevron-double-right"></i>
                    </button>
                </div>
            );
        };

        const filterTab = () => {
            switch (this.state.filterTab) {
                case "Queues":
                    return <QueueList setQueue={this.setQueue.bind(this)} selectedQueue={this.state.selectedQueue} />;
                case "Statuses":
                    return (
                        <StatusList
                            toggleStatus={this.toggleStatus.bind(this)}
                            selectedStatuses={this.state.filters.status}
                        />
                    );
                case "Dates":
                    return <DateFilters setDateFilter={this.setDateFilter.bind(this)} filters={this.state.filters} />;
                case "Locations":
                    return (
                        <LocationFitlers
                            setPickupLocation={this.setPickupLocation.bind(this)}
                            setPrintedLocation={this.setPrintedLocation.bind(this)}
                            setWaitingLocation={this.setWaitingLocation.bind(this)}
                            filters={this.state.filters}
                        />
                    );
                case "Types":
                    return <TypeFilters filters={this.state.filters} toggleType={this.toggleType.bind(this)} />;
                default:
                    return null;
            }
        };

        const filterTabBadge = (tab) => {
            let badge = (
                <div
                    className="position-absolute text-warning bg-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                        top: "0.1rem",
                        right: "0.1rem",
                        height: "1.3rem",
                        width: "1.3rem",
                        zIndex: 999999,
                    }}>
                    <i className="bi bi-exclamation-circle-fill"></i>
                </div>
            );

            switch (tab) {
                case "Queues":
                    return null;
                case "Statuses":
                    return null;
                case "Dates":
                    for (let thisDate of dateList) {
                        if (this.state.filters[thisDate.before] != defaultState().filters[thisDate.before]) {
                            return badge;
                        } else if (this.state.filters[thisDate.after] != defaultState().filters[thisDate.after]) {
                            return badge;
                        }
                    }
                    return null;
                case "Locations":
                    if (
                        this.state.filters.pickupLocation.length +
                            this.state.filters.waitingLocation.length +
                            this.state.filters.printedLocation.length !=
                        6
                    ) {
                        return badge;
                    } else {
                        return null;
                    }
                case "Types":
                    for (let thisType of typeList) {
                        if (this.state.filters[thisType.name] != defaultState().filters[thisType.name]) {
                            return badge;
                        }
                    }
                    return null;
                default:
                    return null;
            }
        };

        const filterHelp = () => {
            switch (this.state.filterTab) {
                case "Queues":
                    return "Default queues for quick access! Filters are applied automatically. All locations are included by default.";
                case "Statuses":
                    return "Include only files matching of the selected statuses. Click the button to apply new filters.";
                case "Dates":
                    return "All dates are inclusive; empty dates have no effect. Click the button to apply new filters.";
                case "Locations":
                    return (
                        <React.Fragment>
                            <p className="mb-1">
                                Selecting a printed location filter excludes all files which have not had at least one
                                print attempt, even if your selected statuses do not!
                            </p>
                            <br />
                            <span>
                                Selecting a waiting for pickup location excludes all files which are not waiting for
                                pickup, even if your selected statuses do not!
                            </span>
                        </React.Fragment>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="container-fluid mt-4 px-5 submission-container">
                <div className="row">
                    <div className="col-lg-3 ">
                        <SimpleBar
                            className="card shadow mb-3 sticky-filters position-sticky"
                            style={{ maxHeight: "90vh" }}>
                            <nav className="nav nav-pills nav-justified bg-light rounded-top">
                                {filterTabList.map((tab, index) => {
                                    return (
                                        <li className="nav-item">
                                            <button
                                                className={
                                                    "nav-link position-relative border-bottom " +
                                                    (this.state.filterTab == tab ? "active" : "")
                                                }
                                                style={{
                                                    flexBasis: "25%",
                                                    borderBottomLeftRadius: 0,
                                                    borderBottomRightRadius: 0,
                                                    boxShadow: "none",
                                                }}
                                                onClick={() => {
                                                    if (this.state.filterTab != tab) {
                                                        this.setState({
                                                            filterTab: tab,
                                                        });
                                                    }
                                                }}>
                                                {tab}
                                                {filterTabBadge(tab)}
                                            </button>
                                        </li>
                                    );
                                })}
                            </nav>
                            <div className="card-body border-bottom">
                                <div className="row g-1">
                                    <div className="col">
                                        <button
                                            className="btn btn-warning w-100"
                                            type="button"
                                            onClick={() => {
                                                this.resetFilters();
                                            }}>
                                            <div className="d-flex flex-row align-items-center">
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                                <span className="flex-grow-1 px-1">Reset Filters</span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="col">
                                        <button
                                            className="btn btn-primary w-100"
                                            type="button"
                                            onClick={() => {
                                                this.updatePrintsCustom();
                                            }}
                                            disabled={this.state.filterTab == "Queues"}>
                                            <div className="d-flex flex-row align-items-center">
                                                <i className="bi bi-check2"></i>
                                                <span className="flex-grow-1 px-1">Apply Changes</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {filterTab()}
                            <div className="card-body border-top">
                                <p className="mb-0 text-muted small">{filterHelp()}</p>
                            </div>
                        </SimpleBar>
                    </div>
                    <div className=" col-lg-9">
                        <div className="card shadow mb-3">
                            <div className="card-header border-bottom-0 rounded-bottom p-2">
                                <div className="d-flex">
                                    <form className="d-flex flex-grow-1 me-5">
                                        <div className="input-group">
                                            <input
                                                value={this.state.filters.searchQuery}
                                                type="text"
                                                className="form-control"
                                                placeholder="Search for patrons or files!"
                                                onChange={(e) => {
                                                    let temp = this.state.filters;
                                                    temp.searchQuery = e.target.value;
                                                    this.setState({
                                                        filters: temp,
                                                    });
                                                }}
                                            />
                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.updateHistory();
                                                }}>
                                                <i className="bi bi-search"></i>
                                            </button>
                                        </div>
                                    </form>
                                    <div className="flex-grow-0 flex-shrink-0">{pageButtons()}</div>
                                </div>
                            </div>
                        </div>

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

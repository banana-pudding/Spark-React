import React from "react";
import { queueFilters } from "../statics/reference";

class QueueList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ul className="list-group list-group-flush mb-0">
                {queueFilters.map((queueItem, index) => {
                    return (
                        <React.Fragment>
                            <button
                                className={
                                    "list-group-item list-group-item-action p-0 border-0 " +
                                    (queueItem.name == this.props.selectedQueue
                                        ? "text-light bg-" + queueItem.color
                                        : "")
                                }
                                type="button"
                                onClick={(e) => {
                                    this.props.setQueue(queueItem);
                                }}
                                key={index}>
                                <div className="d-flex align-items-stretch">
                                    <div style={{ width: "0.2rem" }} className={"bg-" + queueItem.color}></div>
                                    <p
                                        className={
                                            "h6 m-0 lh-2 px-2 flex-grow-1 " +
                                            (index != queueFilters.length - 1
                                                ? "border-bottom " +
                                                  (queueItem.name == this.props.selectedQueue
                                                      ? "border-" + queueItem.color
                                                      : "")
                                                : "")
                                        }
                                        style={{
                                            paddingTop: "0.75rem",
                                            paddingBottom: "0.75rem",
                                        }}>
                                        {queueItem.name}
                                    </p>
                                </div>
                            </button>
                        </React.Fragment>
                    );
                })}
            </ul>
        );
    }
}

export default QueueList;

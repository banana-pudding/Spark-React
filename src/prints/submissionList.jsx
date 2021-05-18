import React from "react";
import axios from "../common/axiosConfig";
import SingleSubmission from "./oneSubmission";

class SubmissionList extends React.Component {
    state = {
        status: "UNREVIEWED",
        printingLocation: "Both",
        pickupLocation: "Both",
        selectedItem: "new",
        submissions: [],
    };

    constructor(props) {
        super(props);

        this.fetchPrints("UNREVIEWED", "Both", "Both");
    }

    fetchPrints(status, printingLocation, pickupLocation, e) {
        var selectedItem = "new";
        if (e) {
            selectedItem = e.target.getAttribute("pagename");
        }
        this.setState({
            submissions: [],
            selectedItem: selectedItem,
        });

        axios
            .post("/prints", {
                status: status,
                printingLocation: printingLocation,
                pickupLocation: pickupLocation,
            })
            .then((res) => {
                this.setState({
                    status: status,
                    printingLocation: printingLocation,
                    pickupLocation: pickupLocation,
                    submissions: res.data.submissions,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="container-fluid mt-4 px-5">
                <div className="row">
                    <div className="col-auto">
                        <div className="list-group shadow">
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "new" ? "active" : "")
                                }
                                pagename="new"
                                onClick={(e) => this.fetchPrints("UNREVIEWED", "Both", "Both", e)}>
                                New Submissions
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "pendpay" ? "active" : "")
                                }
                                pagename="pendpay"
                                onClick={(e) => this.fetchPrints("PENDING_PAYMENT", "Both", "Both", e)}>
                                Pending Payment
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "ready" ? "active" : "")
                                }
                                pagename="ready"
                                onClick={(e) => this.fetchPrints("READY_TO_PRINT", "Both", "Both", e)}>
                                Ready to Print
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "readywillis" ? "active" : "")
                                }
                                pagename="readywillis"
                                onClick={(e) => this.fetchPrints("READY_TO_PRINT", "Willis Library", "Both", e)}>
                                Ready to Print (Willis)
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "readydp" ? "active" : "")
                                }
                                pagename="readydp"
                                onClick={(e) => this.fetchPrints("READY_TO_PRINT", "Discovery Park", "Both", e)}>
                                Ready to Print (DP)
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "printing" ? "active" : "")
                                }
                                pagename="printing"
                                onClick={(e) => this.fetchPrints("PRINTING", "Both", "Both", e)}>
                                Printing
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "printingwillis" ? "active" : "")
                                }
                                pagename="printingwillis"
                                onClick={(e) => this.fetchPrints("PRINTING", "Willis Library", "Both", e)}>
                                Printing (Willis)
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "printingdp" ? "active" : "")
                                }
                                pagename="printingdp"
                                onClick={(e) => this.fetchPrints("PRINTING", "Discovery Park", "Both", e)}>
                                Printing (DP)
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "intransit" ? "active" : "")
                                }
                                pagename="intransit"
                                onClick={(e) => this.fetchPrints("IN_TRANSIT", "Both", "Both", e)}>
                                In Transit
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "waiting" ? "active" : "")
                                }
                                pagename="waiting"
                                onClick={(e) => this.fetchPrints("WAITING_FOR_PICKUP", "Both", "Both", e)}>
                                Waiting for Pickup
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "waitingwillis" ? "active" : "")
                                }
                                pagename="waitingwillis"
                                onClick={(e) => this.fetchPrints("WAITING_FOR_PICKUP", "Both", "Willis Library", e)}>
                                Waiting for Pickup (Willis)
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "waitingdp" ? "active" : "")
                                }
                                pagename="waitingdp"
                                onClick={(e) => this.fetchPrints("WAITING_FOR_PICKUP", "Both", "Discovery Park", e)}>
                                Waiting for Pickup (DP)
                            </button>
                            <button
                                className={
                                    "list-group-item list-group-item-action " +
                                    (this.state.selectedItem == "stalepickup" ? "active" : "")
                                }
                                pagename="stalepickup"
                                onClick={(e) => this.fetchPrints("STALE_ON_PICKUP", "Both", "Both", e)}>
                                Stale on Pickup
                            </button>
                        </div>
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

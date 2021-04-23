import React from "react";

class PrintNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printPage: props.printPage,
        };
    }

    render() {
        return (
            <div className="list-group shadow">
                <a
                    href="/prints/new"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "new" ? "active" : "")
                    }>
                    New Submissions
                </a>
                <a
                    href="/prints/pendpay"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "pendpay" ? "active" : "")
                    }>
                    Pending Payment
                </a>
                <a
                    href="/prints/ready"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "ready" ? "active" : "")
                    }>
                    Ready To Print
                </a>
                <a
                    href="/prints/readywillis"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "readywillis" ? "active" : "")
                    }>
                    Ready To Print Willis
                </a>
                <a
                    href="/prints/readydp"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "readydp" ? "active" : "")
                    }>
                    Ready To Print DP
                </a>
                <a
                    href="/prints/printing"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "printing" ? "active" : "")
                    }>
                    Printing
                </a>
                <a
                    href="/prints/printingwillis"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "printingwillis" ? "active" : "")
                    }>
                    Printing Willis
                </a>
                <a
                    href="/prints/printingdp"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "printingdp" ? "active" : "")
                    }>
                    Printing DP
                </a>
                <a
                    href="/prints/intransit"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "intransit" ? "active" : "")
                    }>
                    In Transit
                </a>
                <a
                    href="/prints/pickup"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "pickup" ? "active" : "")
                    }>
                    Waiting for Pickup
                </a>
                <a
                    href="/prints/pickupwillis"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "pickupwillis" ? "active" : "")
                    }>
                    Waiting for Pickup Willis
                </a>
                <a
                    href="/prints/pickupdp"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "pickupdp" ? "active" : "")
                    }>
                    Waiting for Pickup DP
                </a>
                <a
                    href="/prints/completed"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "completed" ? "active" : "")
                    }>
                    Completed
                </a>
                <a
                    href="/prints/rejected"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "rejected" ? "active" : "")
                    }>
                    Rejected
                </a>
                <a
                    href="/prints/pendpaystale"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "pendpaystale" ? "active" : "")
                    }>
                    Stale on Payment
                </a>
                <a
                    href="/prints/pickupstale"
                    className={
                        "list-group-item list-group-item-action " +
                        (this.state.printPage == "pickupstale" ? "active" : "")
                    }>
                    Stale on Pickup
                </a>
                <a
                    href="/prints/all"
                    className={
                        "list-group-item list-group-item-action " + (this.state.printPage == "all" ? "active" : "")
                    }>
                    All
                </a>
            </div>
        );
    }
}

export default PrintNav;

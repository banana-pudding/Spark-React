import React from "react";

const leftCol = 6;
const rightCol = 6;

class LocationFilters extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render() {
        let selectedPickup =
            this.props.filters.pickupLocation.length == 1 ? this.props.filters.pickupLocation[0] : "both";
        let selectedPrinted =
            this.props.filters.printedLocation.length == 1 ? this.props.filters.printedLocation[0] : "both";
        let selectedWaiting =
            this.props.filters.waitingLocation.length == 1 ? this.props.filters.waitingLocation[0] : "both";

        console.log(selectedPrinted);
        return (
            <div className="card-body">
                <div className="row mb-3">
                    <label className={`col-sm-${leftCol} col-form-label h6`} htmlFor="pickupSelector">
                        Requested Pickup:
                    </label>
                    <div className={`col-sm-${rightCol}`}>
                        <select
                            className="form-select"
                            id="pickupSelector"
                            value={selectedPickup}
                            onChange={(e) => {
                                this.props.setPickupLocation(e.target.value);
                            }}>
                            <option value="both">Unfiltered</option>
                            <option value="Willis Library">Willis Library</option>
                            <option value="Discovery Park">Discovery Park</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className={`col-sm-${leftCol} col-form-label h6`} htmlFor="pickupSelector">
                        Last Attempted Print:
                    </label>
                    <div className={`col-sm-${rightCol}`}>
                        <select
                            className="form-select"
                            id="pickupSelector"
                            value={selectedPrinted}
                            onChange={(e) => {
                                this.props.setPrintedLocation(e.target.value);
                            }}>
                            <option value="both">Unfiltered</option>
                            <option value="Willis Library">Willis Library</option>
                            <option value="Discovery Park">Discovery Park</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <label className={`col-sm-${leftCol} col-form-label h6`} htmlFor="waitingSelector">
                        Waiting for Pickup:
                    </label>
                    <div className={`col-sm-${rightCol}`}>
                        <select
                            className="form-select"
                            id="waitingSelector"
                            value={selectedWaiting}
                            onChange={(e) => {
                                this.props.setWaitingLocation(e.target.value);
                            }}>
                            <option value="both">Unfiltered</option>
                            <option value="Willis Library">Willis Library</option>
                            <option value="Discovery Park">Discovery Park</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export default LocationFilters;

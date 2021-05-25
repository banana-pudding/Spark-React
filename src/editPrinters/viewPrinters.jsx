import React from "react";
import axios from "../common/axiosConfig";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/allPrinters.scss";

class PrintersPage extends React.Component {
    state = {
        willisFullService: [],
        willisSelfService: [],
        dpFullService: [],
        dpSelfService: [],
        willisFullServiceNew: {
            model: "",
            name: "",
            description: "",
            serviceLevel: "FULL_SERVICE",
            location: "Willis Library",
        },
        willisSelfServiceNew: {
            model: "",
            name: "",
            barcode: "",
            description: "",
            serviceLevel: "SELF_SERVICE",
            location: "Willis Library",
        },
        dpFullServiceNew: {
            model: "",
            name: "",
            barcode: "",
            description: "",
            serviceLevel: "FULL_SERVICE",
            location: "Discovery Park",
        },
        dpSelfServiceNew: {
            model: "",
            name: "",
            barcode: "",
            description: "",
            serviceLevel: "SELF_SERVICE",
            location: "Discovery Park",
        },
    };

    constructor(props) {
        super(props);

        this.fetchPrinters();
    }

    updateNewPrinter = (e, field) => {
        let prevPrinter = this.state.newPrinter;

        prevPrinter[field] = e.target.value;

        this.setState({
            newPrinter: prevPrinter,
        });
    };

    updateNewPrinterInfo = (list, field, newValue) => {
        let tempState = this.state;
        let tempList = this.state[list];

        tempList[field] = newValue;
        tempState[list] = tempList;

        this.setState(tempState);
    };

    handleAddNewPrinter = (objectToSend) => {
        axios.post("/printers/new", this.state[objectToSend]).then((res) => {
            window.location.reload();
        });
    };

    updateExistingPrinterInfo = (list, index, field, newValue) => {
        let tempState = this.state;
        let tempList = this.state[list];
        let tempPrinter = tempList[index];

        tempPrinter[field] = newValue;
        tempList[index] = tempPrinter;
        tempState[list] = tempList;

        this.setState(tempState);
    };

    handleUpdatePrinter = (list, index) => {
        console.log("here");
        let printerData = this.state[list][index];

        axios.post(`/printers/update/${printerData._id}`, printerData).then((res) => {
            window.location.reload();
        });
    };

    fetchPrinters = () => {
        this.setState({
            willisFullService: [],
            willisSelfService: [],
            dpFullService: [],
            dpSelfService: [],
        });
        axios
            .get("/printers")
            .then((res) => {
                var willisFullService = [],
                    willisSelfService = [],
                    dpFullService = [],
                    dpSelfService = [];
                for (var printer of res.data.printers) {
                    if (printer.serviceLevel == "FULL_SERVICE") {
                        if (printer.location == "Willis Library") {
                            willisFullService.push(printer);
                        } else {
                            dpFullService.push(printer);
                        }
                    } else {
                        if (printer.location == "Willis Library") {
                            willisSelfService.push(printer);
                        } else {
                            dpSelfService.push(printer);
                        }
                    }
                }
                this.setState({
                    willisFullService: willisFullService,
                    willisSelfService: willisSelfService,
                    dpFullService: dpFullService,
                    dpSelfService: dpSelfService,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    printerList = (listName, columns) => {
        return (
            <table className="table mb-0">
                <thead>
                    <tr>
                        {columns.map((title, index) => {
                            return <th scope="col">{title.charAt(0).toUpperCase() + title.slice(1)}</th>;
                        })}
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state[listName].map((printer, index) => {
                        return (
                            <tr className="existing">
                                {columns.map((title, colIndex) => {
                                    return (
                                        <td>
                                            <input
                                                type="text"
                                                className={"form-control " + (title == "name" ? "fw-bold" : "")}
                                                name="name"
                                                value={printer[title]}
                                                onChange={(e) => {
                                                    this.updateExistingPrinterInfo(
                                                        listName,
                                                        index,
                                                        title,
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </td>
                                    );
                                })}
                                <td>
                                    <div className="btn-group" role="group">
                                        <button
                                            type="button"
                                            className="btn text-primary table-button"
                                            onClick={() => {
                                                this.handleUpdatePrinter(listName, index);
                                            }}>
                                            <i className="bi bi-check-square-fill"></i>
                                        </button>
                                        <button type="button" className="btn text-danger table-button">
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        {columns.map((title, colIndex) => {
                            return (
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state[`${listName}New`][title]}
                                        onChange={(e) => {
                                            this.updateNewPrinterInfo(`${listName}New`, title, e.target.value);
                                        }}
                                    />
                                </td>
                            );
                        })}

                        <td>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    this.handleAddNewPrinter(`${listName}New`);
                                }}>
                                Add
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    };

    render() {
        return (
            <div className="container-fluid mt-4 px-5 printer-page">
                <div className="row">
                    <div className="col">
                        <div className="card shadow mb-3">
                            <div className="card-header">
                                <h4 className="mb-0">Willis Library Full Service Printers</h4>
                            </div>

                            {this.printerList("willisFullService", ["name", "model", "description"])}
                        </div>

                        <div className="card shadow mb-3">
                            <div className="card-header">
                                <h4 className="mb-0">Willis Library Self Service Printers</h4>
                            </div>
                            {this.printerList("willisSelfService", ["name", "model", "barcode"])}
                        </div>
                    </div>
                    <div className="col">
                        <div className="card shadow mb-3">
                            <div className="card-header">
                                <h4 className="mb-0">Discovery Park Full Service Printers</h4>
                            </div>
                            {this.printerList("dpFullService", ["name", "model", "description"])}
                        </div>

                        <div className="card shadow mb-3">
                            <div className="card-header">
                                <h4 className="mb-0">Discovery Park Self Service Printers</h4>
                            </div>
                            {this.printerList("dpSelfService", ["name", "model", "barcode"])}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrintersPage;

import React from "react";
import axios from "../common/axiosConfig";

class PrintersPage extends React.Component {
    state = {
        willisFullService: [],
        willisSelfService: [],
        dpFullService: [],
        dpSelfService: [],
    };

    constructor(props) {
        super(props);

        this.fetchPrinters();
    }

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

    render() {
        return (
            <div className="container-fluid mt-4 px-5">
                <div className="row"></div>
            </div>
        );
    }
}

export default PrintersPage;

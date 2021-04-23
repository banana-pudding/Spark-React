import React from "react";
import axios from "axios";

import PrintNavigation from "./printNavigation";
import SingleSubmission from "./oneSubmission";

class SubmissionList extends React.Component {
    constructor(props) {
        super(props);
        var printPage = window.location.pathname.split("/prints/")[1];
        this.state = {
            printPage: printPage,
            submissions: [],
        };
    }

    componentDidMount() {
        var printPage = window.location.pathname.split("/prints/")[1];
        axios
            .get("/prints/" + this.state.printPage)
            .then((res) => {
                this.setState({
                    printPage: printPage,
                    submissions: res.data.submissions,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="container-fluid mt-4 px-5">
                <div className="row">
                    <div className="col-auto">
                        <PrintNavigation printPage={this.state.printPage} />
                    </div>
                    <div className="col">
                        {this.state.submissions.map((item, index) => {
                            return <SingleSubmission item={item} printPage={this.state.printPage} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default SubmissionList;

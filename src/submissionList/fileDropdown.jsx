import React from "react";
import axios from "../common/axiosConfig";
import { Dropdown } from "bootstrap/dist/js/bootstrap";
import { withRouter } from "react-router-dom";

class FileDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.dropper = React.createRef();
    }

    handleDelete() {
        axios
            .post("/submissions/delete/file/" + this.props.file._id)
            .then((res) => {
                this.props.history.go(0);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleRequestPayment() {
        axios
            .post("/submissions/requestpayment/" + this.props.submission._id)
            .then((res) => {
                this.props.history.go(0);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleWaive() {
        axios
            .post("/submissions/waive/" + this.props.submission._id)
            .then((res) => {
                this.props.history.go(0);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        var dropdown = new Dropdown(this.dropper.current);
    }

    render() {
        return (
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    ref={this.dropper}
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    More
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <a
                            className="dropdown-item"
                            href=""
                            onClick={() => {
                                this.handleDelete();
                            }}>
                            Delete
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            href=""
                            onClick={() => {
                                this.handleRequestPayment();
                            }}>
                            Request Payment
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            href=""
                            onClick={() => {
                                this.handleWaive();
                            }}>
                            Waive Payment
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default withRouter(FileDropdown);

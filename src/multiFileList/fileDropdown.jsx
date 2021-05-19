import React from "react";
import axios from "../common/axiosConfig";

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    handleDelete() {
        axios
            .post("/submissions/delete/file/" + this.props.file._id)
            .then((res) => {
                console.log("done");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleRequestPayment() {
        axios
            .post("/submissions/requestpayment/" + this.props.submission._id)
            .then((res) => {
                console.log("done");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleWaive() {
        axios
            .post("/submissions/waive/" + this.props.submission._id)
            .then((res) => {
                console.log("done");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Dropdown button
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => {
                                this.handleDelete();
                            }}>
                            Delete
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => {
                                this.handleRequestPayment();
                            }}>
                            Request Payment
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
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

export default Dropdown;

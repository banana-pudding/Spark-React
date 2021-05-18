import React from "react";
import axios from "../common/axiosConfig";

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    handleDelete() {
        axios
            .post("/prints/delete/file/" + this.props.file._id)
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
                </ul>
            </div>
        );
    }
}

export default Dropdown;

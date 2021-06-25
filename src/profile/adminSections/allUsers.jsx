import React from "react";
import axios from "../../common/axiosConfig";

class AllUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            changedIDs: [],
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = () => {
        axios.get("/users/list").then((res) => {
            this.setState({
                users: res.data.users,
            });
        });
    };

    handleSubmit = () => {
        axios.post("/users/update", this.state).then((res) => {
            this.fetchUsers();
        });
    };

    render() {
        return (
            <React.Fragment>
                <table className="table">
                    <thead>
                        <tr>
                            <th>EUID</th>
                            <th>Name</th>
                            <th style={{ minWidth: "8rem" }}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map((user, index) => {
                            return (
                                <tr>
                                    <td className="align-middle">{user.local.euid}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.name}
                                            onChange={(e) => {
                                                let users = this.state.users;
                                                users[index].name = e.target.value;
                                                this.setState({
                                                    users: users,
                                                    changedIDs: [user._id, ...this.state.changedIDs],
                                                });
                                            }}></input>
                                    </td>
                                    <td className="align-middle nowrap">
                                        <div className="d-flex">
                                            <i
                                                className={
                                                    "me-2 bi " +
                                                    (user.isSuperAdmin
                                                        ? "bi-star-fill text-bsyellow"
                                                        : "bi-star text-midgrey")
                                                }></i>
                                            {user.isSuperAdmin ? "Admin" : "Tech"}
                                            <button
                                                className="btn text-primary rounded-circle lh-1 p-1 ms-auto"
                                                onClick={(e) => {
                                                    let users = this.state.users;
                                                    users[index].isSuperAdmin = !users[index].isSuperAdmin;
                                                    this.setState({
                                                        users: users,
                                                        changedIDs: [user._id, ...this.state.changedIDs],
                                                    });
                                                }}
                                                disabled={user.local.euid == this.props.user.euid}>
                                                <i className="bi bi-arrow-repeat"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="d-grid">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            this.handleSubmit();
                        }}>
                        Save Changes
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default AllUsers;

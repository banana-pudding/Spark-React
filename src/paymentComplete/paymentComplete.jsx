import React from "react";
import FormattedDate from "../common/formattedDate";
import axios from "../common/axiosConfig";
import { withRouter } from "react-router-dom";

class PaymentComplete extends React.Component {
    state = {
        isChecked: false,
        isValid: false,
        date: new Date(),
        amount: 0,
    };

    constructor(props) {
        super(props);
    }

    verifyPayment = () => {
        axios.post("/payment/complete" + this.props.location.search).then((res) => {
            if (res.data.isValid) {
                this.setState({
                    isChecked: true,
                    isValid: true,
                    submission: res.data.paidSubmission,
                    amount: res.data.amountPaid,
                    date: res.data.datePaid,
                });
            } else {
                this.setState({
                    isChecked: true,
                    isValid: false,
                });
            }
        });
    };

    componentDidMount() {
        if (!this.state.isChecked) {
            this.verifyPayment();
        }
    }

    render() {
        return (
            <div className="container mt-4 px-5">
                <div className="row">
                    <div className="col-6 offset-3">
                        <div className="card shadow">
                            <div className="card-body">
                                <h1>Thank You!</h1>
                                <p className="lead">Your payment has been completed</p>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Transaction Date</th>
                                            <th>Amount Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <FormattedDate date={this.state.date} />
                                            </td>
                                            <td>${this.state.amount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(PaymentComplete);

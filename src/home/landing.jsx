import "./landing.css";

import React from "react";

class Landing extends React.Component {
    render() {
        return (
            <div className="container mt-5 px-5">
                <div className="row">
                    <div className="col">
                        <div className="card shadow mb-4">
                            <div className="row g-0">
                                <div className="col-md-5 image-col"></div>
                                <div className="col-md-7">
                                    <div className="card-body">
                                        <h4 className="card-title">3D Printing</h4>
                                        <p className="card-text">
                                            Welcome to The Spark Makerspace 3D printing services! This queue is for full
                                            service print submissions. Full service within The Spark generally costs
                                            $1.00 per print hour and includes:
                                        </p>
                                        <ul>
                                            <li>3D model quality review</li>
                                            <li>Material(s) assessment</li>
                                            <li>Machine setup</li>
                                            <li>Quality control monitoring</li>
                                            <li>
                                                Print Options
                                                <ul>
                                                    <li>Material selection options</li>
                                                    <li>Print bed upgrade</li>
                                                    <li>Dual color prints*</li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <p className="card-text">
                                            Please visit
                                            <a href="https://guides.library.unt.edu/spark">The Spark</a>
                                            website for more information about the 3D printers we have in our
                                            collection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                <h4 className="card-title">Submission Process</h4>
                                <ul>
                                    <li>
                                        Complete Contact information- All communication is via email, please confirm
                                        that the email you include is one you check regularly
                                    </li>
                                    <li>
                                        Select the appropriate tab: Personal, Class, or Internal
                                        <ul>
                                            <li>Personal- the print is for personal use</li>
                                            <li>
                                                Class- Print is for an assignment in a class, to have the fee waived
                                                submission must include professor full name and class number
                                            </li>
                                            <li>Internal- print is for a UNT Library department</li>
                                        </ul>
                                    </li>

                                    <li>
                                        Upload your .stl file(s)
                                        <ul>
                                            <li>
                                                Upload files separately; use the ‘add a file’ or ‘remove a file’ button
                                                as needed
                                            </li>
                                            <li>
                                                3D models are printed using standard slicing settings unless otherwise
                                                noted
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card shadow">
                            <div className="card-body">
                                <p>
                                    The Spark is not allowed to make changes to submitted files, so please verify the
                                    print files meet your desired expectations before submitting. 3D prints often
                                    require supports in order to print,
                                    <a
                                        href="https://blogs.library.unt.edu/spark/2021/03/03/support-on-3d-prints/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-auth="NotApplicable">
                                        please go to our blog for more information
                                    </a>
                                    . Also note, The Spark does not do any post processing of 3D prints.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card mb-4 shadow">
                            <div className="card-body">
                                <h4 className="card-title">Expectations:</h4>
                                <ul>
                                    <li>Timeline</li>
                                    <ul>
                                        <li>
                                            Submission reviewed in 2-3
                                            <a href="https://calendar.library.unt.edu/">Spark business days</a>*
                                        </li>
                                        <li>
                                            Approved Submissions are printed within 7-10
                                            <a href="https://calendar.library.unt.edu/">Spark business days</a>
                                            of payment being received**
                                        </li>
                                        <li>
                                            The Spark can not guarantee turnaround times of less than 10
                                            <a href="https://calendar.library.unt.edu/">Spark business days</a>*
                                        </li>
                                        <li>
                                            The Spark Team will make every effort to meet and exceed turn-around times,
                                            although timelines can vary based on a number of factors including:
                                            <ul>
                                                <li>Print time(s)</li>
                                                <li>Queue volume</li>
                                                <li>Staff and machine capacity</li>
                                                <li>Semester events</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </ul>
                            </div>
                        </div>
                        <div className="card shadow">
                            <div className="card-body">
                                <p className="card-text">
                                    *Please let us know if you are not receiving communications within the standard
                                    timelines above
                                </p>
                                <p className="card-text">
                                    **Approval email will include the link to the payment portal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Landing;

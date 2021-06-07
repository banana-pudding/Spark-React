import React from "react";
class SingleFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            file: null,
            fileName: null,
            material: props.material,
            color: props.color,
            infill: props.infill,
            copies: props.copies,
            notes: props.notes,
            pickupLocation: props.pickupLocation,
        };
    }

    render() {
        function addSeparator(index, lastIndex) {
            if (index != lastIndex) {
                return <hr />;
            } else {
                return null;
            }
        }

        return (
            <div className="mb-4">
                <form className="form mb-4">
                    <div className="row">
                        <div className="col">
                            <input
                                className={"form-control mb-3 " + (this.state.file ? "is-valid" : "is-invalid")}
                                type="file"
                                onChange={(e) => {
                                    var tempState = this.state;
                                    tempState.file = e.target.files[0];
                                    tempState.fileName = e.target.files[0].name;
                                    this.props.updateSubFile(tempState);
                                }}
                            />
                        </div>
                        <div className="col col-sm-auto">
                            <div
                                className="btn btn-danger"
                                onClick={() => {
                                    this.props.deleteFile(this.state.index);
                                }}>
                                Delete
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-sm-2">
                            <input type="text" readonly className="form-control-plaintext" value="Material" />
                            <input type="text" readonly className="form-control-plaintext" value="Color" />
                            <input type="text" readonly className="form-control-plaintext" value="Infill (%)" />
                            <input type="text" readonly className="form-control-plaintext" value="Copies" />
                            <input type="text" readonly className="form-control-plaintext" value="Notes" />
                        </div>
                        <div className="col">
                            <input
                                className="form-control rounded-0 rounded-top border-bottom-0"
                                type="text"
                                value={this.state.material}
                                onChange={(e) => {
                                    var tempState = this.state;
                                    tempState.material = e.target.value;
                                    this.props.updateSubFile(tempState);
                                }}
                            />
                            <input
                                className="form-control rounded-0 border-bottom-0"
                                type="text"
                                value={this.state.color}
                                onChange={(e) => {
                                    var tempState = this.state;
                                    tempState.color = e.target.value;
                                    this.props.updateSubFile(tempState);
                                }}
                            />
                            <input
                                className="form-control rounded-0 border-bottom-0"
                                type="number"
                                min="5"
                                max="50"
                                value={this.state.infill}
                                onChange={(e) => {
                                    var tempState = this.state;
                                    tempState.infill = e.target.value;
                                    this.props.updateSubFile(tempState);
                                }}
                            />
                            <input
                                className="form-control rounded-0 border-bottom-0"
                                type="number"
                                value={this.state.copies}
                                min="1"
                                max="10"
                                onChange={(e) => {
                                    var tempState = this.state;
                                    tempState.copies = e.target.value;
                                    this.props.updateSubFile(tempState);
                                }}
                            />
                            <input
                                className="form-control rounded-0 rounded-bottom"
                                type="text"
                                placeholder="Add any extra details you want us to know here!"
                                value={this.state.notes}
                                onChange={(e) => {
                                    var tempState = this.state;
                                    tempState.notes = e.target.value;
                                    this.props.updateSubFile(tempState);
                                }}
                            />
                        </div>
                    </div>
                </form>

                {addSeparator(this.props.index, this.props.lastIndex)}
            </div>
        );
    }
}

export default SingleFile;

import React from "react";
import Thumbnailer from "./thumbnailGenerator";
import { ToastContainer, toast } from "react-toastify";
class SingleFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            file: null,
            filedata: null,
            thumbdata: null,
            fileName: null,
            copyGroupID: props.copyGroupID,
            material: props.material,
            color: props.color,
            infill: props.infill,
            copies: props.copies,
            notes: props.notes,
            pickupLocation: props.pickupLocation,
        };
        this.recieveThumbnail = this.recieveThumbnail.bind(this);
    }

    handleFileChosen = (file) => {};

    recieveThumbnail = (thumbdata) => {
        var tempState = this.state;
        tempState.thumbdata = thumbdata;
        this.props.updateSubFile(tempState);
    };

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
                {this.state.filedata && <Thumbnailer file={this.state.filedata} pushThumb={this.recieveThumbnail} />}

                <div className="row">
                    <div className="col">
                        <input
                            className={"form-control mb-3 " + (this.state.file ? "is-valid" : "is-invalid")}
                            type="file"
                            accept=".stl"
                            onChange={(e) => {
                                let file = e.target.files[0];
                                if (file.name.slice(-3).toLowerCase() !== "stl") {
                                    toast.error("File must be in STL format!", { position: "bottom-right" });
                                    e.target.value = null;
                                } else {
                                    let fileReader = new FileReader();
                                    fileReader.onloadend = () => {
                                        this.setState({ filedata: fileReader.result });
                                    };

                                    fileReader.readAsArrayBuffer(file);

                                    var tempState = this.state;
                                    tempState.file = file;
                                    tempState.fileName = file.name;
                                    this.props.updateSubFile(tempState);
                                }
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
                        <input type="text" readOnly className="form-control-plaintext" value="Material" />
                        <input type="text" readOnly className="form-control-plaintext" value="Color" />
                        <input type="text" readOnly className="form-control-plaintext" value="Infill (%)" />
                        <input type="text" readOnly className="form-control-plaintext" value="Copies" />
                        <input type="text" readOnly className="form-control-plaintext" value="Notes" />
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
                {addSeparator(this.props.index, this.props.lastIndex)}
            </div>
        );
    }
}

export default SingleFile;

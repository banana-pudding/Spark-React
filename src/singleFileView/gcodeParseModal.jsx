import React from "react";
import spinner from "../common/loading.gif";

const ParseModal = React.forwardRef((props, ref) => (
    <div className="modal fade" id="gcodeParseModal" tabindex="-1" ref={ref}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-body">
                    <h2>Parsing GCODE...</h2>
                    <p>This may take a minute if the file is large</p>
                    <img className="w-100" src={spinner} alt="loading..." />
                </div>
            </div>
        </div>
    </div>
));

export default ParseModal;

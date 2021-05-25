/**
 * GCODE text into estimated filament usage
 */
export const parseGcode = (data) => {
    return new Promise((resolve, reject) => {
        let extractedFilament = "";
        let extractedPrinter = "";
        var z_heights = {};
        var model = [];
        var max = {
            x: undefined,
            y: undefined,
            z: undefined,
            speed: undefined,
            volSpeed: undefined,
            extrSpeed: undefined,
        };
        var min = {
            x: undefined,
            y: undefined,
            z: undefined,
            speed: undefined,
            volSpeed: undefined,
            extrSpeed: undefined,
        };
        var modelSize = { x: undefined, y: undefined, z: undefined };
        var filamentByLayer = {};
        var filamentByExtruder = {};
        var totalFilament = 0;
        var printTime = 0;
        var layerHeight = 0;
        var layerCnt = 0;
        var extrusionSpeedsByLayer = {};
        var printTimeByLayer = {};
        var speeds = { extrude: [], retract: [], move: [] };
        var speedsByLayer = { extrude: {}, retract: {}, move: {} };
        var volSpeeds = [];
        var volSpeedsByLayer = {};
        var extrusionSpeeds = [];
        var gcode = data.split(/\n/);
        var argChar, numSlice;
        var model = [];
        var sendLayer = undefined;
        var sendLayerZ = 0;
        var sendMultiLayer = [];
        var sendMultiLayerZ = [];
        var lastSend = 0;
        var reg = new RegExp(/^(?:G0|G1)\s/i);
        var j,
            layer = 0,
            extrude = false,
            prevRetract = { e: 0, a: 0, b: 0, c: 0 },
            retract = 0,
            x,
            y,
            z = 0,
            f,
            prevZ = 0,
            prevX,
            prevY,
            lastF = 4000,
            prev_extrude = { a: undefined, b: undefined, c: undefined, e: undefined, abs: undefined },
            extrudeRelative = false,
            volPerMM,
            extruder;
        var dcExtrude = false;
        var assumeNonDC = false;

        for (var i = 0; i < gcode.length; i++) {
            x = undefined;
            y = undefined;
            z = undefined;
            volPerMM = undefined;
            retract = 0;

            extrude = false;
            extruder = null;
            prev_extrude["abs"] = 0;
            let line = gcode[i];
            gcode[i] = gcode[i].split(/[\(;]/)[0];

            if (reg.test(gcode[i])) {
                var args = gcode[i].split(/\s/);
                for (j = 0; j < args.length; j++) {
                    switch ((argChar = args[j].charAt(0).toLowerCase())) {
                        case "x":
                            x = args[j].slice(1);
                            break;
                        case "y":
                            y = args[j].slice(1);
                            break;
                        case "z":
                            z = args[j].slice(1);
                            z = Number(z);
                            if (z == prevZ) continue;
                            if (z_heights.hasOwnProperty(z)) {
                                layer = z_heights[z];
                            } else {
                                layer = model.length;
                                z_heights[z] = layer;
                            }
                            sendLayer = layer;
                            sendLayerZ = z;
                            prevZ = z;
                            break;
                        case "e":
                        case "a":
                        case "b":
                        case "c":
                            assumeNonDC = true;
                            extruder = argChar;
                            numSlice = parseFloat(args[j].slice(1)).toFixed(6);

                            if (!extrudeRelative) {
                                // absolute extrusion positioning
                                prev_extrude["abs"] = parseFloat(numSlice) - parseFloat(prev_extrude[argChar]);
                            } else {
                                prev_extrude["abs"] = parseFloat(numSlice);
                            }
                            extrude = prev_extrude["abs"] > 0;
                            if (prev_extrude["abs"] < 0) {
                                prevRetract[extruder] = -1;
                                retract = -1;
                            } else if (prev_extrude["abs"] == 0) {
                                retract = 0;
                            } else if (prev_extrude["abs"] > 0 && prevRetract[extruder] < 0) {
                                prevRetract[extruder] = 0;
                                retract = 1;
                            } else {
                                retract = 0;
                            }
                            prev_extrude[argChar] = numSlice;

                            break;
                        case "f":
                            numSlice = args[j].slice(1);
                            lastF = numSlice;
                            break;
                        default:
                            break;
                    }
                }
                if (dcExtrude && !assumeNonDC) {
                    extrude = true;
                    prev_extrude["abs"] = Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y));
                }
                if (extrude && retract == 0) {
                    volPerMM = Number(
                        prev_extrude["abs"] / Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y))
                    );
                }
                if (!model[layer]) model[layer] = [];
                model[layer][model[layer].length] = {
                    x: Number(x),
                    y: Number(y),
                    z: Number(z),
                    extrude: extrude,
                    retract: Number(retract),
                    noMove: false,
                    extrusion: extrude || retract ? Number(prev_extrude["abs"]) : 0,
                    extruder: extruder,
                    prevX: Number(prevX),
                    prevY: Number(prevY),
                    prevZ: Number(prevZ),
                    speed: Number(lastF),
                    gcodeLine: Number(i),
                    volPerMM: typeof volPerMM === "undefined" ? -1 : volPerMM,
                };
                if (typeof x !== "undefined") prevX = x;
                if (typeof y !== "undefined") prevY = y;
            } else if (gcode[i].match(/^(?:M82)/i)) {
                extrudeRelative = false;
            } else if (gcode[i].match(/^(?:G91)/i)) {
                extrudeRelative = true;
            } else if (gcode[i].match(/^(?:G90)/i)) {
                extrudeRelative = false;
            } else if (gcode[i].match(/^(?:M83)/i)) {
                extrudeRelative = true;
            } else if (gcode[i].match(/^(?:M101)/i)) {
                dcExtrude = true;
            } else if (gcode[i].match(/^(?:M103)/i)) {
                dcExtrude = false;
            } else if (gcode[i].match(/^(?:G92)/i)) {
                var args = gcode[i].split(/\s/);
                for (j = 0; j < args.length; j++) {
                    switch ((argChar = args[j].charAt(0).toLowerCase())) {
                        case "x":
                            x = args[j].slice(1);
                            break;
                        case "y":
                            y = args[j].slice(1);
                            break;
                        case "z":
                            z = args[j].slice(1);
                            prevZ = z;
                            break;
                        case "e":
                        case "a":
                        case "b":
                        case "c":
                            numSlice = parseFloat(args[j].slice(1)).toFixed(3);
                            extruder = argChar;
                            if (!extrudeRelative) prev_extrude[argChar] = 0;
                            else {
                                prev_extrude[argChar] = numSlice;
                            }
                            break;
                        default:
                            break;
                    }
                }
                if (!model[layer]) model[layer] = [];
                if (typeof x !== "undefined" || typeof y !== "undefined" || typeof z !== "undefined")
                    model[layer][model[layer].length] = {
                        x: parseFloat(x),
                        y: parseFloat(y),
                        z: parseFloat(z),
                        extrude: extrude,
                        retract: parseFloat(retract),
                        noMove: true,
                        extrusion: 0,
                        extruder: extruder,
                        prevX: parseFloat(prevX),
                        prevY: parseFloat(prevY),
                        prevZ: parseFloat(prevZ),
                        speed: parseFloat(lastF),
                        gcodeLine: parseFloat(i),
                    };
            } else if (gcode[i].match(/^(?:G28)/i)) {
                var args = gcode[i].split(/\s/);
                for (j = 0; j < args.length; j++) {
                    switch ((argChar = args[j].charAt(0).toLowerCase())) {
                        case "x":
                            x = args[j].slice(1);
                            break;
                        case "y":
                            y = args[j].slice(1);
                            break;
                        case "z":
                            z = args[j].slice(1);
                            z = Number(z);
                            if (z === prevZ) continue;
                            sendLayer = layer;
                            sendLayerZ = z; //}
                            if (z_heights.hasOwnProperty(z)) {
                                layer = z_heights[z];
                            } else {
                                layer = model.length;
                                z_heights[z] = layer;
                            }
                            prevZ = z;
                            break;
                        default:
                            break;
                    }
                }
                if (args.length == 1) {
                    //need to init values to default here
                }
                if (layer == 0 && typeof z === "undefined") {
                    z = 0;
                    if (z_heights.hasOwnProperty(z)) {
                        layer = z_heights[z];
                    } else {
                        layer = model.length;
                        z_heights[z] = layer;
                    }
                    prevZ = z;
                }

                if (!model[layer]) model[layer] = [];
                model[layer][model[layer].length] = {
                    x: Number(x),
                    y: Number(y),
                    z: Number(z),
                    extrude: extrude,
                    retract: Number(retract),
                    noMove: false,
                    extrusion: extrude || retract ? Number(prev_extrude["abs"]) : 0,
                    extruder: extruder,
                    prevX: Number(prevX),
                    prevY: Number(prevY),
                    prevZ: Number(prevZ),
                    speed: Number(lastF),
                    gcodeLine: Number(i),
                };
            }
            if (typeof sendLayer !== "undefined") {
                if (i - lastSend > gcode.length * 0.02 && sendMultiLayer.length != 0) {
                    lastSend = i;
                    //sendMultiLayerToParent(sendMultiLayer, sendMultiLayerZ, (i / gcode.length) * 100);
                    sendMultiLayer = [];
                    sendMultiLayerZ = [];
                }
                sendMultiLayer[sendMultiLayer.length] = sendLayer;
                sendMultiLayerZ[sendMultiLayerZ.length] = sendLayerZ;
                sendLayer = undefined;
                sendLayerZ = undefined;
            }

            if (line.includes("filament_type = ")) {
                extractedFilament = line.split("filament_type = ")[1];
            }

            if (line.includes("material_name = ")) {
                extractedFilament = line.split("material_name = ")[1];
            }

            if (line.includes("printer_model = ")) {
                extractedPrinter = line.split("printer_model = ")[1];
            }

            if (line.includes("printer_name = ")) {
                extractedPrinter = line.split("printer_name = ")[1];
            }
        }
        var i, j;
        var x_ok = false,
            y_ok = false;
        var cmds;
        var tmp1 = 0,
            tmp2 = 0;
        var speedIndex = 0;
        var type;
        var printTimeAdd = 0;
        //        var moveTime=0;
        // Clean up data from previous model
        speedsByLayer = { extrude: {}, retract: {}, move: {} };
        volSpeedsByLayer = {};
        extrusionSpeedsByLayer = {};

        for (i = 0; i < model.length; i++) {
            cmds = model[i];
            if (!cmds) continue;
            for (j = 0; j < cmds.length; j++) {
                x_ok = false;
                y_ok = false;
                if (
                    typeof cmds[j].x !== "undefined" &&
                    typeof cmds[j].prevX !== "undefined" &&
                    typeof cmds[j].extrude !== "undefined" &&
                    cmds[j].extrude &&
                    !isNaN(cmds[j].x)
                ) {
                    max.x = parseFloat(max.x) > parseFloat(cmds[j].x) ? parseFloat(max.x) : parseFloat(cmds[j].x);
                    max.x =
                        parseFloat(max.x) > parseFloat(cmds[j].prevX) ? parseFloat(max.x) : parseFloat(cmds[j].prevX);
                    min.x = parseFloat(min.x) < parseFloat(cmds[j].x) ? parseFloat(min.x) : parseFloat(cmds[j].x);
                    min.x =
                        parseFloat(min.x) < parseFloat(cmds[j].prevX) ? parseFloat(min.x) : parseFloat(cmds[j].prevX);
                    x_ok = true;
                }

                if (
                    typeof cmds[j].y !== "undefined" &&
                    typeof cmds[j].prevY !== "undefined" &&
                    typeof cmds[j].extrude !== "undefined" &&
                    cmds[j].extrude &&
                    !isNaN(cmds[j].y)
                ) {
                    max.y = parseFloat(max.y) > parseFloat(cmds[j].y) ? parseFloat(max.y) : parseFloat(cmds[j].y);
                    max.y =
                        parseFloat(max.y) > parseFloat(cmds[j].prevY) ? parseFloat(max.y) : parseFloat(cmds[j].prevY);
                    min.y = parseFloat(min.y) < parseFloat(cmds[j].y) ? parseFloat(min.y) : parseFloat(cmds[j].y);
                    min.y =
                        parseFloat(min.y) < parseFloat(cmds[j].prevY) ? parseFloat(min.y) : parseFloat(cmds[j].prevY);
                    y_ok = true;
                }

                if (
                    typeof cmds[j].prevZ !== "undefined" &&
                    typeof cmds[j].extrude !== "undefined" &&
                    cmds[j].extrude &&
                    !isNaN(cmds[j].prevZ)
                ) {
                    max.z =
                        parseFloat(max.z) > parseFloat(cmds[j].prevZ) ? parseFloat(max.z) : parseFloat(cmds[j].prevZ);
                    min.z =
                        parseFloat(min.z) < parseFloat(cmds[j].prevZ) ? parseFloat(min.z) : parseFloat(cmds[j].prevZ);
                }

                if ((typeof cmds[j].extrude !== "undefined" && cmds[j].extrude == true) || cmds[j].retract != 0) {
                    totalFilament += cmds[j].extrusion;
                    if (!filamentByLayer[cmds[j].prevZ]) filamentByLayer[cmds[j].prevZ] = 0;
                    filamentByLayer[cmds[j].prevZ] += cmds[j].extrusion;
                    if (cmds[j].extruder != null) {
                        if (!filamentByExtruder[cmds[j].extruder]) filamentByExtruder[cmds[j].extruder] = 0;
                        filamentByExtruder[cmds[j].extruder] += cmds[j].extrusion;
                    }
                }

                if (x_ok && y_ok) {
                    printTimeAdd =
                        Math.sqrt(
                            Math.pow(parseFloat(cmds[j].x) - parseFloat(cmds[j].prevX), 2) +
                                Math.pow(parseFloat(cmds[j].y) - parseFloat(cmds[j].prevY), 2)
                        ) /
                        (cmds[j].speed / 60);
                } else if (cmds[j].retract === 0 && cmds[j].extrusion !== 0) {
                    tmp1 =
                        Math.sqrt(
                            Math.pow(parseFloat(cmds[j].x) - parseFloat(cmds[j].prevX), 2) +
                                Math.pow(parseFloat(cmds[j].y) - parseFloat(cmds[j].prevY), 2)
                        ) /
                        (cmds[j].speed / 60);
                    tmp2 = Math.abs(parseFloat(cmds[j].extrusion) / (cmds[j].speed / 60));
                    printTimeAdd = tmp1 >= tmp2 ? tmp1 : tmp2;
                } else if (cmds[j].retract !== 0) {
                    printTimeAdd = Math.abs(parseFloat(cmds[j].extrusion) / (cmds[j].speed / 60));
                }

                printTime += printTimeAdd;
                if (typeof printTimeByLayer[cmds[j].prevZ] === "undefined") {
                    printTimeByLayer[cmds[j].prevZ] = 0;
                }
                printTimeByLayer[cmds[j].prevZ] += printTimeAdd;

                if (cmds[j].extrude && cmds[j].retract === 0) {
                    type = "extrude";
                } else if (cmds[j].retract !== 0) {
                    type = "retract";
                } else if (!cmds[j].extrude && cmds[j].retract === 0) {
                    type = "move";
                } else {
                    type = "unknown";
                }
                speedIndex = speeds[type].indexOf(cmds[j].speed);
                if (speedIndex === -1) {
                    speeds[type].push(cmds[j].speed);
                    speedIndex = speeds[type].indexOf(cmds[j].speed);
                }
                if (typeof speedsByLayer[type][cmds[j].prevZ] === "undefined") {
                    speedsByLayer[type][cmds[j].prevZ] = [];
                }
                if (speedsByLayer[type][cmds[j].prevZ].indexOf(cmds[j].speed) === -1) {
                    speedsByLayer[type][cmds[j].prevZ][speedIndex] = cmds[j].speed;
                }

                if (cmds[j].extrude && cmds[j].retract === 0 && x_ok && y_ok) {
                    // we are extruding
                    max.speed =
                        parseFloat(max.speed) > parseFloat(cmds[j].speed)
                            ? parseFloat(max.speed)
                            : parseFloat(cmds[j].speed);
                    min.speed =
                        parseFloat(min.speed) < parseFloat(cmds[j].speed)
                            ? parseFloat(min.speed)
                            : parseFloat(cmds[j].speed);

                    var volPerMM = parseFloat(cmds[j].volPerMM);
                    max.volSpeed = parseFloat(max.volSpeed) > volPerMM ? parseFloat(max.volSpeed) : volPerMM;
                    min.volSpeed = parseFloat(min.volSpeed) < volPerMM ? parseFloat(min.volSpeed) : volPerMM;
                    volPerMM = volPerMM.toFixed(3);

                    var volIndex = volSpeeds.indexOf(volPerMM);
                    if (volIndex === -1) {
                        volSpeeds.push(volPerMM);
                        volIndex = volSpeeds.indexOf(volPerMM);
                    }
                    if (typeof volSpeedsByLayer[cmds[j].prevZ] === "undefined") {
                        volSpeedsByLayer[cmds[j].prevZ] = [];
                    }
                    if (volSpeedsByLayer[cmds[j].prevZ].indexOf(volPerMM) === -1) {
                        volSpeedsByLayer[cmds[j].prevZ][volIndex] = volPerMM;
                    }

                    var extrusionSpeed = cmds[j].volPerMM * (cmds[j].speed / 60);
                    extrusionSpeed = parseFloat(extrusionSpeed);
                    max.extrSpeed =
                        parseFloat(max.extrSpeed) > extrusionSpeed ? parseFloat(max.extrSpeed) : extrusionSpeed;
                    min.extrSpeed =
                        parseFloat(min.extrSpeed) < extrusionSpeed ? parseFloat(min.extrSpeed) : extrusionSpeed;
                    extrusionSpeed = extrusionSpeed.toFixed(3);
                    var volIndex = extrusionSpeeds.indexOf(extrusionSpeed);
                    if (volIndex === -1) {
                        extrusionSpeeds.push(extrusionSpeed);
                        volIndex = extrusionSpeeds.indexOf(extrusionSpeed);
                    }
                    if (typeof extrusionSpeedsByLayer[cmds[j].prevZ] === "undefined") {
                        extrusionSpeedsByLayer[cmds[j].prevZ] = [];
                    }
                    if (extrusionSpeedsByLayer[cmds[j].prevZ].indexOf(extrusionSpeed) === -1) {
                        extrusionSpeedsByLayer[cmds[j].prevZ][volIndex] = extrusionSpeed;
                    }
                }
            }
        }

        modelSize.x = Math.abs(max.x - min.x);
        modelSize.y = Math.abs(max.y - min.y);
        modelSize.z = Math.abs(max.z - min.z);
        layerHeight = (max.z - min.z) / (layerCnt - 1);

        if (max.speed == min.speed) {
            max.speed = min.speed + 1.0;
        }
        if (max.volSpeed == min.volSpeed) {
            max.volSpeed = min.volSpeed + 1.0;
        }
        if (max.extrSpeed == min.extrSpeed) {
            max.extrSpeed = min.extrSpeed + 1.0;
        }

        var layerTotal = model.length;
        var plaWeight = (((((1.24 * 3.141 * 1.75) / 10) * 1.75) / 10 / 4) * totalFilament) / 10;
        var absWeight = (((((1.04 * 3.141 * 1.75) / 10) * 1.75) / 10 / 4) * totalFilament) / 10;

        var results = {
            totalFilament: totalFilament,
            plaWeight: plaWeight,
            absWeight: absWeight,
            printTime: printTime,
            modelSize: modelSize,
            numLayers: layerTotal,
            extractedFilament: extractedFilament,
            extractedPrinter: extractedPrinter,
        };

        resolve(results);
    });
};

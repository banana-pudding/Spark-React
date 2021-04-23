import React from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            const decoded = jwt_decode(action.payload.token);
            localStorage.setItem("jwtToken", action.payload.token);
            axios.defaults.headers.common["Authorization"] = action.payload.token;
            return {
                ...state,
                user: decoded,
            };
        case "LOGOUT":
            localStorage.removeItem("jwtToken");
            return {
                ...state,
                user: null,
            };

        default:
            return state;
    }
};

const initialState = {
    user: localStorage.jwtToken ? jwt_decode(localStorage.jwtToken) : null,
};

export const Context = React.createContext({
    state: initialState,
    dispatch: () => null,
});

export const Provider = ({ children }) => {
    if (localStorage.jwtToken) {
        axios.defaults.headers.common["Authorization"] = localStorage.jwtToken;
    }
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
};

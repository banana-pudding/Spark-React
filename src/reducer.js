import React from "react";

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
            };

        default:
            return state;
    }
};

const initialState = {
    user: null,
    submissions: [],
};

export const Context = React.createContext({
    state: initialState,
    dispatch: () => null,
});

export const Provider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
};

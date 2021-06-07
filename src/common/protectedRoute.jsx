import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
    return <Route {...rest} render={({ location }) => (rest.user ? children : <Redirect to="/login" />)} />;
}

export default PrivateRoute;

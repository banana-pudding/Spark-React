import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
    console.log(rest);
    return <Route {...rest} render={({ location }) => (rest.user ? children : <Redirect to="/login" />)} />;
}

export default PrivateRoute;

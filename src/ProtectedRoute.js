import {withRouter,HashRouter, Route, Switch,Redirect} from 'react-router-dom';
import React, { Component } from 'react';
const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
    return (
        <Route
            path={path}
            {...rest}
            render={(props) => {
                return localStorage.getItem('token') ? (
                    <Comp {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {
                                from: props.location
                                // error: "You need to login first!",
                            },
                        }}
                    />
                );
            }}
        />
    );
};
export default withRouter(ProtectedRoute);
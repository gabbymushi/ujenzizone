import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import ProtectedRoute from './ProtectedRoute';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});
const AdminDefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout/AdminDefaultLayout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./components/Login/Login'),
  loading
});

const Register = Loadable({
  loader: () => import('./components/Members/Register'),
  loading
});
function SystemRoutes() {
  if (JSON.parse(localStorage.getItem('member')).user_type === "user") {
    return (
      <Route path="/" name="Dashboard" component={DefaultLayout} />
    );
  } else if (JSON.parse(localStorage.getItem('member')).user_type === "admin") {
    return (
      <Route path="/" name="Admin Dashboard"
        component={AdminDefaultLayout} />
    );
  } else {
    return (<Route path="/login" exact component={Login} />)
  }
}
class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <ProtectedRoute path="/" component={SystemRoutes} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;

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
  loader: () => import('./containers/AdminDefaultLayout'),
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

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});
function SystemRoutes() {
  // return (<Route path="/" name="Home" component={DefaultLayout} />)
  if (localStorage.getItem('user_type')=== "user") {
      return (
          <Route path="/" name="Dashboard" component={DefaultLayout}/>
      );
  } else if (localStorage.getItem('user_type')=== "admin") {
      return (
          <Route path="/" name="Admin Dashboard"
                 component={AdminDefaultLayout}/>
      );
  }else{
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
            {/* <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} /> */}
            <ProtectedRoute path="/"  component={SystemRoutes} />
          </Switch>
      </HashRouter>
    );
  }
}

export default App;

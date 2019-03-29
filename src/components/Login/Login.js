import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
//import {withRouter,HashRouter, Route, Switch,Redirect} from 'react-router-dom';
import API from '../../utils/API'
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: '',
      password: ''

    }
  }
  handleUserName = (e) => {
    this.setState({ user_name: e.target.value });
  }
  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let credentials = {
      user_name: this.state.user_name,
      password: this.state.password
    }
    API.post('auth/login', credentials).then((response) => {
      console.log('👉 Returned data:', response);
      // this.setState({
      //     user_name: '',
      //     password: ''
      // });
      const token = response.data.token;
                // const userType = response.data.user.user_type;
                //const userInfo = response.data.user;
                // const userInfo = response.data.user_info
                localStorage.setItem('token',token);
                // localStorage.setItem('user_type',userType);
                // localStorage.setItem('userInfo',JSON.stringify(userInfo));
                // console.log('emp',localStorage.getItem('userInfo'))
                // console.log('raw',userInfo)
                // if(userType=="member"){
                //     const group_id = response.data.user.group_id;
                //     localStorage.setItem('group_id',group_id);
                // }else if(userType=="manager"){
                //     const organization_id = response.data.user_info.organization_id;
                //     localStorage.setItem('organization_id',organization_id);
                // }
                //console.log('mmmmh',JSON.parse(localStorage.getItem('userInfo')).email);
                // console.log('mimi sasaa',localStorage.getItem('user_type'));
                //let path = `/`;
                //this.props.history.push(path);
                this.setState({ redirectToReferrer: true })
    }).catch((error) => {
      //console.log(error.request);
      console.log(`😱 Axios request failed: ${error}`);
    });
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
        return (
            <Redirect isLogin={redirectToReferrer}  to={from} />
        )
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={this.handleUserName}
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          onChange={this.handlePassword}
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;

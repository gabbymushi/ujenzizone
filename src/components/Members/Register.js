import React, { Component } from 'react';
import API from '../../utils/API';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      gender: '',
      email: '',
      password: ''

    }
  }
  handleFirstName = (e) => {
    this.setState({ first_name: e.target.value });
  }
  handleLastName = (e) => {
    this.setState({ last_name: e.target.value });
  }

  handleEmail = (e) => {
    this.setState({ email: e.target.value });
  }
  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }
  handleUsername = (e) => {
    this.setState({ user_name: e.target.value });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let member = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      gender: 'Male',
      email: this.state.email,
      password: this.state.password
    }
     API.post('auth/register', member).then((response) => {
     // console.log(response);
     console.log('👉 Returned data:', response);
      this.setState({
          first_name: '',
      //     user_name: '',
          last_name: '',
      //     gender: '',
      //     email: '',
      //     password: '',
      
      });
  }).catch((error) => {
      //console.log(error.request);
      console.log(`😱 Axios request failed: ${error}`);
  });
    
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.handleSubmit} action="" method="POST">
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.handleFirstName}
                        value={this.state.first_name}
                        type="text"
                        placeholder="First Name"
                        autoComplete="first_name" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.handleLastName}
                        value={this.state.last_name}
                        type="text"
                        placeholder="Last Name"
                        autoComplete="last_name" />
                    </InputGroup>
                    {/* <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.handleUsername}
                        value={this.state.user_name}
                        type="text"
                        placeholder="Username"
                        autoComplete="user_name" />
                    </InputGroup> */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.handleEmail}
                        value={this.state.email}
                        type="email"
                        placeholder="Email"
                        autoComplete="email" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.handlePassword}
                        value={this.state.password}
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Repeat password" autoComplete="new-password" />
                    </InputGroup>
                    <Button color="success" block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;

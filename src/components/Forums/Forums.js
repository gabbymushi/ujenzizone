import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input } from 'reactstrap';

//import SystemParameters from '../../SystemParameters';
import API from '../../utils/API';
//let apiBaseUrl = SystemParameters.apiBaseUrl;
class ForumRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    render() {
        const forum = this.props.forum;
        const index = this.props.key;
        // const groupLink = `#/registerUser/${group.group_id}`;
        const groupLink = `#/registerUser/${forum._id}`;
        const getBadge = (status) => {
            return status === 'Active' ? 'success' :
                status === 'Inactive' ? 'secondary' :
                    status === 'Pending' ? 'warning' :
                        status === 'Banned' ? 'danger' :
                            'primary'
        }
        return (
            <tr key={forum._id.toString()}>
                <th scope="row"><a href={groupLink}>{index + 1}</a></th>
                <td>{forum.forum_name}</td>
                <td>{forum.description}</td>
                {/* <td>{group.created_at}</td>
                <td><Badge href={groupLink} color={getBadge('Active')}>Active</Badge></td> */}
                <td>
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                            Action
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Action</DropdownItem>
                            <DropdownItem tag="a" href={groupLink}>Add Member</DropdownItem>
                            <DropdownItem>Add Member</DropdownItem>
                            <DropdownItem>Add Member</DropdownItem>
                        </DropdownMenu>
                    </Dropdown></td>
            </tr>
        )
    }
}
class Forums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            value: '',
            forums: [],
            primary: false,
            forum_name: "",
            description: "",
            dropdownOpen: false
        };
        this.togglePrimary = this.togglePrimary.bind(this);
    }
    togglePrimary() {
        this.setState({
            primary: !this.state.primary,
        });
    }

    handleForumName = (e) => {
        this.setState({ forum_name: e.target.value });
    }
    handleDescription = (e) => {
        this.setState({ description: e.target.value });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let forum = {
            forum_name: this.state.forum_name,
            description: this.state.description
        }
        API.post('forums/', forum).then((response) => {
            // console.log(response);
            console.log('👉 Returned data:', response);
            this.setState({
                forum_name: '',
                description: ''

            });
            this.getForums();
        }).catch((error) => {
            //console.log(error.request);
            console.log(`😱 Axios request failed: ${error}`);
        });

    }

    componentDidMount() {
        this.getForums();
    }
    getForums() {

        let uri = 'forums/';
        API.get(uri).then(response => {
            this.setState({
                forums: response.data
            });
            console.log(this.state.forums);
        }).catch((error) => {
            console.log(error)
        });
    }
    render() {

        //const userList = usersData.filter((user) => user.id < 10)
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Forums <small
                                    className="text-muted"></small>
                                <div className="card-header-actions">
                                    <Button color="primary" onClick={this.togglePrimary} className="mr-1">Add Forum</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {this.state.forums.length > 1 ?
                                    <div>
                                        <Table responsive hover>
                                            <thead>
                                                <tr>
                                                    <th scope="col">SN</th>
                                                    <th scope="col">Forum Name</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.forums.map((forum, index) =>
                                                    <ForumRow key={index} forum={forum} />
                                                )}
                                            </tbody>
                                        </Table>
                                    </div> : <p>No forum found</p>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                    className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.togglePrimary}>Add Forum</ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="text-input">Forum Name</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    onChange={this.handleForumName}
                                    value={this.state.forum_name}
                                    type="text" id="text-input"
                                    name="ledger" placeholder="Forum Name"
                                    required />
                                {/*<FormText color="muted">This is a help text</FormText>*/}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="textarea-input">Description</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    onChange={this.handleDescription}
                                    value={this.state.description}
                                    type="textarea"
                                    name="textarea-input"
                                    id="textarea-input" rows="9"
                                    placeholder="Description..." />
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.togglePrimary}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>

        )
    }
}

export default Forums;

import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input } from 'reactstrap';

//import SystemParameters from '../../SystemParameters';
import API from '../../utils/API';
//let apiBaseUrl = SystemParameters.apiBaseUrl;
class GroupRow extends Component {
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
        const group = this.props.group;
        // const groupLink = `#/registerUser/${group.group_id}`;
        const groupLink = `#/registerUser/${group.group_id}`;
        const getBadge = (status) => {
            return status === 'Active' ? 'success' :
                status === 'Inactive' ? 'secondary' :
                    status === 'Pending' ? 'warning' :
                        status === 'Banned' ? 'danger' :
                            'primary'
        }
        return (
            <tr key={group.group_id.toString()}>
                <th scope="row"><a href={groupLink}>{group.group_id}</a></th>
                <td><a href={groupLink}>{group.group_name}</a></td>
                <td>30</td>
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
            </tr >
        )
    }
}
class GroupManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            value: '',
            groups: [],
            primary: false,
            group_name: "",
            max_member: "",
            min_member: "",
            dropdownOpen: false
        };
        this.togglePrimary = this.togglePrimary.bind(this);
        this.handleGroupName = this.handleGroupName.bind(this);
        this.handleMaxMembers = this.handleMaxMembers.bind(this);
        this.handleMinMembers = this.handleMinMembers.bind(this);
        this.saveData = this.saveData.bind(this);
    }
    togglePrimary() {
        this.setState({
            primary: !this.state.primary,
        });
    }

    handleGroupName(e) {
        this.setState({ group_name: e.target.value });
    }

    handleMaxMembers(e) {
        this.setState({ max_member: e.target.value });
    }
    handleMinMembers(e) {
        this.setState({ min_member: e.target.value });
    }
    saveData(e) {
        e.preventDefault();
        const data = {
            group_name: this.state.group_name,
            max_member: this.state.max_member,
            min_member: this.state.min_member,
            organization_id: localStorage.getItem('organization_id'),
        }
        let token = localStorage.getItem('token');
        const headers = {
            //'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

        let url ='/add_group';
        API.post(url, data, { headers: headers }).then((response) => {
            console.log(response.data);
            this.setState({
                group_name: '',
                max_member: '',
                min_member: '',
            });
            this.getGroups();
        }).catch((error) => {
            console.log(error.request);
        });

    }

    componentDidMount() {
        this.getGroups();
    }
    getGroups() {
        let token = localStorage.getItem('token');
        let organization_id = localStorage.getItem('organization_id');
        let uri = '/get_groups/' + organization_id;
        API.get(uri, {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(response => {
            this.setState({
                groups: response.data
            });
            console.log(this.state.groups);
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
                                        {this.state.groups.map((group, index) =>
                                            <GroupRow key={index} group={group} />
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                    className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.togglePrimary}>Add Group</ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="text-input">Group Name</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    onChange={this.handleGroupName}
                                    value={this.state.group_name}
                                    type="text" id="text-input"
                                    name="ledger" placeholder="Group Name"
                                    required />
                                {/*<FormText color="muted">This is a help text</FormText>*/}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="text-input">Max Members</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    onChange={this.handleMaxMembers}
                                    value={this.state.max_member}
                                    type="number" id="text-input"
                                    name="ledger" placeholder="Max Members"
                                    required />
                                {/*<FormText color="muted">This is a help text</FormText>*/}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="text-input">Min Members</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    onChange={this.handleMinMembers}
                                    value={this.state.min_member}
                                    type="number" id="text-input"
                                    name="ledger" placeholder="Min Members"
                                    required />
                                {/*<FormText color="muted">This is a help text</FormText>*/}
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.saveData}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.togglePrimary}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>

        )
    }
}

export default GroupManagement;

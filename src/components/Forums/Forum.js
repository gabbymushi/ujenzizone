import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input, Row, TabContent, TabPane } from 'reactstrap';
import API from '../../utils/API';
class Home extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            title: '',
            body: '',
            threads: [],
            activeTab: 1,
            modal: false,
            primary: false,
            dropdownOpen: false
        };
        this.togglePrimary = this.togglePrimary.bind(this);
    }
    togglePrimary() {
        this.setState({
            primary: !this.state.primary,
        });
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    componentDidMount() {
        this.getForums();
    }
    getForums() {

        let uri = 'threads/';
        API.get(uri).then(response => {
            this.setState({
                threads: response.data
            });
            console.log(this.state.forums);
        }).catch((error) => {
            console.log(error)
        });
    }
    handleTitle = (e) => {
        this.setState({ title: e.target.value });
    }
    handleBody = (e) => {
        this.setState({ body: e.target.value });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let forum_id = this.props.match.params.id;
        let thread = {
            title: this.state.title,
            body: this.state.body,
            forum_id: forum_id
        }
        console.log('👉 Returned data:', thread);
        API.post('threads/', thread).then((response) => {
            // console.log(response);
            console.log('👉 Returned data:', response);
            // this.setState({
            //     title: '',
            //     body: ''

            // });
            this.getForums();
        }).catch((error) => {
            //console.log(error.request);
            console.log(`😱 Axios request failed: ${error}`);
        });

    }
    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col sm="12" xl="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i><small
                                    className="text-muted"> </small>
                                <strong>UJENZI WA NYUMBA BORA.</strong>
                                <div className="card-header-actions">
                                    <Button color="primary" onClick={this.togglePrimary} className="mr-1"> <i className="fa fa-comment"></i> Post Topic</Button>
                                </div>
                                <small> </small>
                            </CardHeader>
                            {/* <CardBody>
              Jisnsi ya kuzuia nyumba isipauke rangi
              </CardBody> */}
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" xl="9">
                        {this.state.threads.map((thread, index) =>
                            <Card key={index}>
                                <CardHeader>
                                    <i className="fa fa-comment"></i><strong><a href="#/login">{thread.title}.</a></strong>
                                    <small> </small>
                                </CardHeader>
                                <CardBody>
                                    {thread.body} <a href="#/login"> more..</a>
                                </CardBody>
                            </Card>
                        )
                        }
                    </Col>
                </Row>
                <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                    className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.togglePrimary}>Post Topic</ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="text-input">Title</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    onChange={this.handleTitle}
                                    value={this.state.title}
                                    type="text" id="text-input"
                                    name="ledger" placeholder="Title"
                                    required />
                                {/*<FormText color="muted">This is a help text</FormText>*/}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="textarea-input">Body</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    onChange={this.handleBody}
                                    value={this.state.body}
                                    type="textarea"
                                    name="textarea-input"
                                    id="textarea-input" rows="9"
                                    placeholder="Write your topic..." />
                            </Col>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.togglePrimary}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Home;

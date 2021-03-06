import React, { Component } from "react";
import {
  PaginationLink,
  PaginationItem,
  Pagination,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input,
  Row
} from "reactstrap";
import API from "../../utils/API";
class Home extends Component {
  constructor(props) {
    super(props);
    this.forum_id = this.props.match.params.id;
    this.toggle = this.toggle.bind(this);
    this.state = {
      title: "",
      body: "",
      file: "",
      threads: [],
      activeTab: 1,
      modal: false,
      primary: false,
      dropdownOpen: false,
      currentPage: 1,
      threadsPerPage: 2,
      totalThreads: ""
    };
    this.togglePrimary = this.togglePrimary.bind(this);
  }
  togglePrimary() {
    this.setState({
      primary: !this.state.primary
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
    const { threadsPerPage, currentPage } = this.state;
    // console.log("currentPage", e.target.id);
    const indexOfLastThread = currentPage * threadsPerPage;
    const indexOfFirstThread = indexOfLastThread - threadsPerPage;
    this.getThreads(indexOfFirstThread);

  }
  getThreads(offset) {
    let uri = "threads/" + this.forum_id + "/offset/" + offset;
    API.get(uri)
      .then(response => {
        // console.log('offese',response)
        this.setState({
          threads: response.data.threads,
          totalThreads: response.data.totalThreads
        });
        console.log(this.state.threads);
        return;
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleTitle = e => {
    this.setState({ title: e.target.value });
  };
  handleBody = e => {
    this.setState({ body: e.target.value });
  };
  handleUpload = e => {
    console.log(e.target.files)
    this.setState({ file: e.target.files });
  };
  handleSubmit = e => {
    e.preventDefault();
    const data = new FormData();
    for (var i = 0; i < this.state.file.length; i++) {
      data.append('file', this.state.file[i]);
    }
    data.append('title', this.state.title);
    data.append('body', this.state.body);
    data.append('forum_id', this.forum_id);
    data.append('member_id', JSON.parse(localStorage.getItem("member")).member_id);
    API.post("threads/", data)
      .then(response => {
        console.log(response);
        //console.log("👉 Returned data:", response);
        this.setState({
          title: '',
          body: '',
          file: ''

        });
        const { threadsPerPage, currentPage } = this.state;
        const indexOfLastThread = currentPage * threadsPerPage;
        const indexOfFirstThread = indexOfLastThread - threadsPerPage;
        this.getThreads(indexOfFirstThread);
      })
      .catch(error => {
        //console.log(error.request);
        console.log(`😱 Axios request failed: ${error}`);
      });
  };
  handlePagination = e => {
    this.setState({
      currentPage: Number(e.target.id)
    });
    const { threadsPerPage } = this.state;
    // console.log("currentPage", e.target.id);
    const indexOfLastThread = e.target.id * threadsPerPage;
    const indexOfFirstThread = indexOfLastThread - threadsPerPage;
    this.getThreads(indexOfFirstThread);
  };
  render() {
    const { totalThreads, threadsPerPage } = this.state;
    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalThreads / threadsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col sm="12" xl="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" />
                <small className="text-muted"> </small>
                <strong>
                  {this.state.threads[0] &&
                    this.state.threads[0].forum.forum_name}
                  .
                </strong>
                <div className="card-header-actions">
                  <Button
                    color="primary"
                    onClick={this.togglePrimary}
                    className="mr-1"
                  >
                    {" "}
                    <i className="fa fa-comment" /> Post Topic
                  </Button>
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
            {this.state.threads.map((thread, index) => (
              <Card key={index}>
                <CardHeader>
                  <i className="fa fa-comment" />
                  <strong>
                    <a
                      href={`#/threads/${this.props.match.params.id}/${
                        thread.thread_id
                        }`}
                    >
                      {thread.title}.
                    </a>
                  </strong>
                  <small> </small>
                </CardHeader>
                <CardBody>
                  {thread.body}{" "}
                  <a
                    href={`#/threads/${this.props.match.params.id}/${
                      thread.thread_id
                      }`}
                  >
                    {" "}
                    more..
                  </a>
                </CardBody>
              </Card>
            ))}
            <Pagination>
              <PaginationItem key="prev">
                <PaginationLink
                  //   id={currentPage - 1}
                  onClick={this.handlePagination}
                  previous
                  tag="button"
                />
              </PaginationItem>
              {pageNumbers.map(number => {
                return (
                  <PaginationItem key={number}>
                    <PaginationLink
                      tag="button"
                      id={number}
                      onClick={this.handlePagination}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem key="next">
                <PaginationLink
                  //   id={currentPage + 1}
                  onClick={this.handlePagination}
                  next
                  tag="button"
                />
              </PaginationItem>
            </Pagination>
          </Col>
        </Row>
        <Modal
          isOpen={this.state.primary}
          toggle={this.togglePrimary}
          className={"modal-primary " + this.props.className}
        >
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
                  type="text"
                  id="text-input"
                  name="ledger"
                  placeholder="Title"
                  required
                />
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
                  id="textarea-input"
                  rows="9"
                  placeholder="Write your topic..."
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="text-input">Upload</Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  multiple
                  onChange={this.handleUpload}
                  type="file"
                  id="text-input"
                  name="file"
                  required
                />
                {/*<FormText color="muted">This is a help text</FormText>*/}
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={this.togglePrimary}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Home;

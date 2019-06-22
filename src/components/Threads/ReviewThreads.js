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
class ReviewThreads extends Component {
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
    this.getPendingThreads(indexOfFirstThread);

  }
  getPendingThreads(offset) {
    let uri = "threads/pending/" + offset;
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
                 Pending Threads
                </strong>
                <div className="card-header-actions">
           
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
                  <div className="card-header-actions">
                  <Button
                    color="danger"

                    onClick={this.togglePrimary}
                    className="mr-1"
                  >
                    {" "}
                    <i className="fa fa-remove" /> Delete
                  </Button>
                  <Button
                    color="success"
                    onClick={this.togglePrimary}
                    className="mr-1"
                  >
                    {" "}
                    <i className="fa fa-check" /> Approve
                  </Button>
                </div>
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
      </div>
    );
  }
}

export default ReviewThreads;

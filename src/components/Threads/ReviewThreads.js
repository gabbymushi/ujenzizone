import React, { Component } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Carousel,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  Col,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import socketIOClient from "socket.io-client";
import API from "../../utils/API";
var socket;
class ReviewThread extends Component {
  constructor(props) {
    super(props);
    this.thread_id = this.props.match.params.thread;
    this.items = [];
    this.state = {
      endpoint: "http://localhost:4000/",
      activeIndex: 0,
      thread: '',
      comments: [],
      comment: "",
      currentPage: 1,
      commentsPerPage: 2,
      totalComments: ""
    };
    socket = socketIOClient(this.state.endpoint);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }
  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === this.items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({
      activeIndex: nextIndex
    });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? this.items.length - 1
        : this.state.activeIndex - 1;
    this.setState({
      activeIndex: nextIndex
    });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({
      activeIndex: newIndex
    });
  }

  handleComment = e => {
    this.setState({ comment: e.target.value });
  };
  handlePagination = e => {
    this.setState({
      currentPage: Number(e.target.id)
    });
    const { commentsPerPage } = this.state;
    console.log("currentPage", e.target.id);
    const indexOfLastComment = e.target.id * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    socket.emit("initial_comments", {
      thread_id: this.thread_id,
      offset: indexOfFirstComment
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    let comment = {
      comment: this.state.comment,
      thread_id: this.thread_id,
      member_id: JSON.parse(localStorage.getItem("member")).member_id
    };
    socket.emit("saveComment", comment);
    this.setState({
      comment: ""
    });
  
  };
  getComments = data => {
    console.log(data);
    this.setState({
      comments: data.comments,
      totalComments: data.totalComments
    });
  };
  changeData = () => {
    const { currentPage, commentsPerPage } = this.state;
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    socket.emit("initial_comments", {
      thread_id: this.thread_id,
      offset: indexOfFirstComment
    });
  };
  componentDidMount() {
    this.getThread();
    // this.getComments();
    const { currentPage, commentsPerPage } = this.state;
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    socket.emit("initial_comments", {
      thread_id: this.thread_id,
      offset: indexOfFirstComment
    });
    socket.on("getComments", this.getComments);
    socket.on("changeData", this.changeData);
  }
  componentWillUnmount() {
    socket.off("getComments");
    socket.off("changeData");
  }
  getThread() {
    let uri = "threads/" + this.thread_id;
    API.get(uri)
      .then(response => {
        this.setState({
          thread: response.data
        });
        // console.log(this.state.thread);
        response.data.file.forEach(file => {
          const item = {
            src: "http://localhost:4000/uploads/" + file.file_name,
            altText: "Slide 1",
            caption: "Slide 1"
          };
          this.items.push(item);
        });
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const {
      activeIndex,
      comments,
      currentPage,
      totalComments,
      commentsPerPage
    } = this.state;
    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalComments / commentsPerPage); i++) {
      pageNumbers.push(i);
    }
    const slides2 = this.items.map(item => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <img style={{height:'700px',width:'600px'}} className="d-block w-100" src={item.src} alt={item.altText} />
          <CarouselCaption
            captionText={item.caption}
            captionHeader={item.caption}
          />
        </CarouselItem>
      );
    });

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" xl="8">
            <Card>
              <CardHeader>
                {/* <i className="fa fa-align-justify" /> */}
                <strong>
                  {" "}
                  {typeof this.state.thread.member!=="undefined" ? (
                    <p>
                      {" "}
                      Posted by {this.state.thread.member.first_name}:{" "}
                      {this.state.thread.title}
                    </p>
                  ) : (
                    <p>Loading..</p>
                  )}
                </strong>
              </CardHeader>
              <CardBody>
                <Carousel
                  activeIndex={activeIndex}
                  next={this.next}
                  previous={this.previous}
                >
                  <CarouselIndicators
                    items={this.items}
                    activeIndex={activeIndex}
                    onClickHandler={this.goToIndex}
                  />
                  {slides2}
                  <CarouselControl
                    direction="prev"
                    directionText="Previous"
                    onClickHandler={this.previous}
                  />
                  <CarouselControl
                    direction="next"
                    directionText="Next"
                    onClickHandler={this.next}
                  />
                </Carousel>
                {typeof this.state.thread.body!=="undefined" ? (
                  <p> {this.state.thread.body}</p>
                ) : (
                  <p>Loading..</p>
                )}
                {comments.length > 0 ? (
                  // <p> {this.state.comments[0].comment} </p>
                  comments.map((comment, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <i className="fa fa-comment" />
                        <strong>
                          <a
                            href={`#/threads/${this.props.match.params.id}/${
                              comment.member_id
                            }`}
                          >
                            {comment.member.first_name}.
                          </a>
                        </strong>
                        <small> </small>
                      </CardHeader>
                      <CardBody>{comment.comment}</CardBody>
                    </Card>
                  ))
                ) : (
                  <p>No comments yet</p>
                )}{" "}
                <Pagination>
                  <PaginationItem key="prev">
                    <PaginationLink
                      id={currentPage - 1}
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
                      id={currentPage + 1}
                      onClick={this.handlePagination}
                      next
                      tag="button"
                    />
                  </PaginationItem>
                </Pagination>
                <Input
                  onChange={this.handleComment}
                  value={this.state.comment}
                  type="textarea"
                  name="textarea-input"
                  id="textarea-input"
                  rows="9"
                  placeholder="Write your comment..."
                />
                <Button color="primary" onClick={this.handleSubmit}>
                  {" "}
                  Comment{" "}
                </Button>{" "}
              </CardBody>{" "}
            </Card>{" "}
          </Col>{" "}
        </Row>{" "}
      </div>
    );
  }
}

export default ReviewThread;

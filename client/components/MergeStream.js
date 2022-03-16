import axios from "axios";
import React from "react";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input1: "",
      input2: "",
      output: "",
    };

    this.generateStreamKey = this.generateStreamKey.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getStreamKey();
  }

  generateStreamKey(e) {
    axios.post("/settings/stream_key").then((res) => {
      this.setState({
        stream_key: res.data.stream_key,
      });
    });
  }

  getStreamKey() {
    axios.get("/settings/stream_key").then((res) => {
      this.setState({
        stream_key: res.data.stream_key,
      });
    });
  }

  handleChange1(event) {
    this.setState({ input1: event.target.value });
  }

  handleChange2(event) {
    this.setState({ input2: event.target.value });
  }

  handleChange3(event) {
    this.setState({ output: event.target.value });
  }

  handleSubmit(event) {
    console.log(event);
    const { input1, input2, output } = this.state;
    axios.post("/streams/merge", { input1, input2, output }).then((res) => {});
  }

  render() {
    return (
      <React.Fragment>
        <div className='container mt-5'>
          <h4>Merge 2 streams</h4>
          <hr className='my-4' />

          <div className='col-xs-12 col-sm-12 col-md-8 col-lg-6'>
            <div className='row'>
              Input 1:
              <input
                type='text'
                value={this.state.input1}
                placeholder={"rtmp://127.0.0.1:1935/live/B1zr10Cb9"}
                onChange={this.handleChange1}
              />
            </div>
            <div className='row'>
              Input 2:
              <input
                type='text'
                value={this.state.input2}
                placeholder={"rtmp://127.0.0.1:1935/live/B1zr10Cb9"}
                onChange={this.handleChange2}
              />
            </div>
            <div className='row'>
              Output:
              <input
                style={{ backgdroudColor: "red" }}
                type='text'
                value={this.state.output}
                placeholder={"rtmp://127.0.0.1:1935/live/B1zr10Cb9"}
                onChange={this.handleChange3}
              />
            </div>
            <div className='row'>
              <button className='btn btn-dark mt-2' onClick={this.handleSubmit}>
                MERGE
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

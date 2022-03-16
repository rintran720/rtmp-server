import React from "react";
import { Route, Router } from "react-router-dom";
import LiveStreams from "./LiveStreams";
import MergeStream from "./MergeStream";
import Navbar from "./Navbar";
import Settings from "./Settings";
import VideoPlayer from "./VideoPlayer";

const customHistory = require("history").createBrowserHistory();

export default class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={customHistory}>
        <div>
          <Navbar />
          <Route
            exact
            path='/'
            render={(props) => <LiveStreams {...props} />}
          />

          <Route
            exact
            path='/stream/:username'
            render={(props) => <VideoPlayer {...props} />}
          />

          <Route
            exact
            path='/settings'
            render={(props) => <Settings {...props} />}
          />

          <Route
            exact
            path='/merge'
            render={(props) => <MergeStream {...props} />}
          />
        </div>
      </Router>
    );
  }
}

// @flow
import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { thunk } from "../results";

import { setValue } from "./reducer";

const connected = connect(
  state => ({
    value: state.commandBar.value
  }),
  dispatch => bindActionCreators({ setValue, run: thunk.run }, dispatch)
);

class CommandBar extends Component {
  constructor(props) {
    super(props);
    this.historyEl = createRef();
    this.state = {
      history: [],
      cursor: 0
    };
  }

  push(value) {
    let history = this.state.history.concat([value]);
    let cursor = history.length;
    this.setState({ history, cursor });
  }

  back() {
    const cursor =
      (this.state.cursor + (this.state.history.length - 1)) %
      this.state.history.length;
    this.props.setValue(this.state.history[cursor]);
    this.setState({ cursor });
  }

  forward() {
    const cursor = ((this.state.cursor + 1) % this.state.history.length) + 1;
    this.props.setValue(this.state.history[cursor] || "");
    this.setState({
      cursor
    });
  }

  handleEnter(e) {
    e.preventDefault();
    this.props.run(this.props.value);
    this.push(this.props.value);
    this.props.setValue("");
    setTimeout(() => {
      let node = this.historyEl.current;
      if (node) {
        node.scrollTo(0, node.scrollHeight);
      }
    }, 10);
  }

  handleUp(e) {
    e.preventDefault();
    this.back();
  }

  handleDown(e) {
    e.preventDefault();
    this.forward();
  }

  handleKeyDown = e => {
    switch (e.key) {
      case "Enter":
        return this.handleEnter(e);
      case "ArrowUp":
        return this.handleUp(e);
      case "ArrowDown":
        return this.handleDown(e);
      default:
        return;
    }
  };

  render() {
    return (
      <div>
        <div style={{ height: "1rem", overflowY: "auto", margin: '.2rem' }} ref={this.historyEl}>
          {this.state.history.map((item, i) => (
            <p
              key={i}
              style={{
                color: this.state.cursor === i ? "blue" : "unset",
                margin: 0,
                padding: 0
              }}
            >
              {item}
            </p>
          ))}
        </div>
        <input
          value={this.props.value}
          onChange={e => this.props.setValue(e.target.value)}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    );
  }
}

CommandBar = connected(CommandBar);

export default CommandBar;
export { default as reducer } from "./reducer";

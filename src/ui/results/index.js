// @jsx jsx
import React, { Component, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import * as thunk from "./thunk";
import { resultsList } from "./selector";
import { jsx, css } from "@emotion/core";
import { markdown } from "markdown";
import moment from "moment";
import Highlight from "react-highlight";
import "../../common/github.css";
import MonacoEditor from "react-monaco-editor";

function Markdown({ data }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(data) }}></div>
  );
}

function FileList({ data }) {
  return (
    <ul css={FileList.root}>
      {data.map(({ text, type }, i) => (
        <li key={i}>
          <span css={{ color: type === "d" ? "blue" : "red" }}>{type}</span>{" "}
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

FileList.type = css`
  color: "";
`;

FileList.root = css`
  list-style: none;
  margin: 0;
  padding: 0;
  & > li:nth-of-type(odd) {
    background-color: #ebebeb;
  }
`;

function File({ data, editable }) {
  const root = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const { width } = root.current.getBoundingClientRect();
    setWidth(width);
  }, []);

  const saveFile = (e) => {
    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      alert("saving");
    }
  }

  if (/(text|txt)/.test(data.type)) {
    return <pre css={File.root}>{data.content}</pre>;
  } else {
    return (
      <div css={File.root} ref={root} onKeyDown={saveFile}>
        <MonacoEditor
          width={width}
          height="600"
          options={{
            readOnly: !editable
          }}
          language={data.type}
          theme="vs-dark"
          value={data.content}
        />
      </div>
    );
  }
}

File.root = css`
  margin: 0;
  padding: 0;
  overflow-x: auto;
`;

function Flags({ flags }) {
  let output = [];
  for (const flag in flags) {
    if (flag.length === 1) {
      output.push(`-${flag} ${flags[flag]}`);
    } else {
      output.push(`--${flag}=${flags[flag]}`);
    }
  }

  return output.join(" ");
}

function Payload({ payload }) {
  const { command, flags, arguments: args } = payload;
  return (
    <span>
      <span css={{ textDecoration: "underline", color: "yellow" }}>
        {command}
      </span>{" "}
      <span css={{ color: "green" }}>{args}</span>
      <Flags flags={flags} />
    </span>
  );
}

function Directory({ directory }) {
  return <span css={{ color: "cyan" }}>{directory}</span>;
}

function Result({ result }) {
  const [hidden, setHidden] = useState(false);
  let node = null;
  switch (result.type) {
    case "fileList":
      node = <FileList data={result.data} />;
      break;
    case "file":
    case "edit":
      // TODO: Figure out a better way
      node = <File data={result.data} editable={result.type == "edit"} />;
      break;
    case "markdown":
      node = <Markdown data={result.data} />;
      break;
    default:
      break;
  }

  return (
    <div css={Result.root}>
      <div css={Result.header} onDoubleClick={() => setHidden(!hidden)}>
        <p>
          <Directory directory={result.context.currentDirectory} />{" "}
          <Payload payload={result.payload} />
        </p>
        <p css={{ textAlign: "right" }}>{moment(result.time).format()}</p>
      </div>
      <div css={Result.content}>{hidden || node}</div>
    </div>
  );
}

Result.header = css`
  display: flex;
  flex-direction: row;
  background: #333f;
  color: white;
  padding: 1rem;
  & > p {
    flex: 1;
    margin: 0;
  }

  & > p:last-child {
    text-align: right;
  }
`;

Result.content = css`
  background: white;
`;

Result.root = css`
  padding: 1rem;
  border: 1px solid black;
  margin: 1rem;
  background: #eee;
`;

class ResultsList extends Component {
  render() {
    const { results } = this.props;
    return (
      <div>
        {results.map(result => (
          <Result key={result.id} result={result} />
        ))}
      </div>
    );
  }
}

ResultsList = connect(state => ({
  results: resultsList(state)
}))(ResultsList);

export { ResultsList };

export { default as reducer } from "./reducer";
export { thunk };

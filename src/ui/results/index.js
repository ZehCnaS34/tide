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
import MonacoEditor from 'react-monaco-editor';


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

function File({ data }) {
  const root = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const { width } = root.current.getBoundingClientRect();
    setWidth(width);
  }, []);

  if (/(text|txt)/.test(data.type)) {
    return <pre css={File.root}>{data.content}</pre>;
  } else {
    return (
      <div css={File.root} ref={root}>
        <MonacoEditor
          width={width}
          height="600"
          options={{
            readOnly: true
          }}
          language={data.type}
          theme="vs-dark"
          value={data.content}/>
      </div>
    );
  }
}

File.root = css`
  margin: 0;
  padding: 0;
  overflow-x: auto;
`;

function Result({ result }) {
  const [hidden, setHidden] = useState(false);
  let node = null;
  switch (result.type) {
    case "fileList":
      node = <FileList data={result.data} />;
      break;
    case "file":
      // TODO: Figure out a better way
      node = <File data={result.data} />;
      break;
    case "markdown":
      node = <Markdown data={result.data} />;
      break;
    default:
      break;
  }

  return (
    <div css={Result.root} onDoubleClick={() => setHidden(!hidden)}>
      <div css={Result.header}>
        <p>payload: {JSON.stringify(result.payload)}</p>
        <p>Dir: {result.context.currentDirectory}</p>
        <p>Time: {moment(result.time).format()}</p>
      </div>
      <div css={Result.content}>{hidden || node}</div>
    </div>
  );
}

Result.header = css`
  background: #333f;
  color: white;
  padding: 1rem;
  & > p {
    margin: 0;
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

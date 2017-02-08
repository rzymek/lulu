import * as React from 'react';
import './App.css';
import { parse } from "./parser";

class App extends React.Component<{}, { text: string }> {
  constructor() {
    super();
    this.state = {
      text: ''
    }
  }
  render() {
    return <div>
      <textarea style={{width:'48%'}} rows={30}
        onChange={e => this.setState({ text: e.target.value })}>
      </textarea>
      <pre style={{width:'48%', float:'right'}}>
        {JSON.stringify(parse(this.state.text), null, 2)}
      </pre>
    </div>
  }
}

export default App;

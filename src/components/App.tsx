import * as _ from 'lodash';
import * as React from 'react';
import * as tabOverride from 'taboverride';
import { DB } from '../DB';
import { TimeSheet, TSError } from '../parser';
import './App.css';
import { Results } from './Results';
import { TSInput } from './TSInput';
import { FileSelector } from './FileSelector';

export class App extends React.Component<{}, {
  publishing: boolean,
  error: any,
  filename: string
  files: string[],
  loggedIn: boolean,
  value: any[],
}> {
  private db = new DB();
  private input: TSInput;
  private publishedText = '';

  private persist = _.debounce(
    value => this.db.write(value),
    1000,
    { leading: true },
  );

  constructor() {
    super();
    this.state = {
      publishing: false,
      error: undefined,
      filename: 'default',
      files: [],
      loggedIn: false,
      value: [],
    };
  }

  public render() {
    return <div>
      <FileSelector values={this.state.files}
        value={this.state.filename}
        onChange={this.openFile.bind(this)} />
      <button onClick={this.newFile.bind(this)}>+</button>
      <TSInput
        ref={input => this.input = input}
        style={{
          backgroundColor: this.getStatusColor(),
          width: '100%',
        }}
        onChange={this.handleChange.bind(this)}
        onError={this.handleError.bind(this)} />
      <Results value={this.state.value} />
      <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
    </div>;
  }

  public componentDidMount() {
    tabOverride.set(this.input);

    this.db.login()
      .then(() => {
        this.setState({ loggedIn: true });
        this.db.subscribeToFiles(files => this.setState({files}))
        this.openFile(this.state.filename);
      });
  }

  private newFile() {
    const filename = prompt('Enter filename');
    if (_.isEmpty(filename)) {
      return;
    }
    this.openFile(filename)
  }

  private openFile(filename: string) {
    this.setState({
      filename
    });
    this.db.subscribe(filename, (value: string) => {
      this.publishedText = value;
      this.input.setText(value);
    });
  }

  private handleChange(text: string, value: TimeSheet[]) {
    const publish = text !== this.publishedText;
    console.log(publish, text,value);
    this.setState({
      publishing: publish,
      value,
      error: undefined,
    });
    if(!publish){
      return;
    }
    this.persist(text)
      .then(() => {
        this.setState({ publishing: false });
        this.publishedText = text;
      });
  }

  private handleError(error: TSError) {
    this.setState({
      value: [],
      error,
    });
  }

  private getStatusColor() {
    if (this.state.error !== undefined) {
      return '#ffdddd';
    } else if (!this.state.loggedIn) {
      return '#dddddd';
    } else if (this.state.publishing) {
      return '#f1f442';
    } else {
      return '#ddffdd';
    }
  }
}

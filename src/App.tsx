import * as React from 'react';
import * as firebase from "firebase";
import * as _ from "lodash";
import './App.css';
import { Results } from "./Results";
import { parse } from "./parser";
import * as tabOverride from "taboverride";


class App extends React.Component<{}, {
  value: any[],
  error: any,
  loggedIn?: boolean
}> {
  persist: (value: string) => void;
  user: firebase.UserInfo = undefined;

  constructor() {
    super();
    this.state = {
      value: [],
      error: undefined,
      loggedIn: false
    }
    this.persist = _.debounce(value => {
      firebase.database().ref(`date/${this.user.uid}`).set({ value });
    }, 1000);
  }

  updateState(value) {
    const loggedIn = (this.user !== undefined);
    try {
      this.setState({
        value: parse(value),
        error: undefined,
        loggedIn
      })
    } catch (error) {
      this.setState({
        value: [],
        error,
        loggedIn
      })
    }
  }

  componentDidMount() {
    tabOverride.set(this.refs['textarea']);

    // recalculate now()
    setInterval(this.forceUpdate.bind(this), 10 * 1000);

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        firebase.database().ref(`date/${this.user.uid}`).once('value').then(snapshot => {
          const entry = snapshot.val();
          if (entry) {
            const textarea: any = this.refs['textarea'];
            textarea.value = entry.value
            this.updateState(entry.value);
          }
        })
      } else {
        firebase.auth().signInWithRedirect(provider);
      }
    });
  }

  handleChange(e) {
    const {value} = e.target;
    this.updateState(value);
    this.persist(value);
  }

  getStatusColor() {
    console.log(this.state.error)
    if (this.state.error !== undefined) {
      return '#ffdddd';
    } else if (this.state.loggedIn) {
      return '#ddffdd';
    } else {
      return '#dddddd';
    }
  }

  render() {
    return <div>
      <textarea rows={20}
        ref="textarea"
        style={{
          width: '100%',
          backgroundColor: this.getStatusColor()
        }}
        onChange={this.handleChange.bind(this)}>
      </textarea>
      <Results value={this.state.value} />
      <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
    </div>;
  }
}

export default App;

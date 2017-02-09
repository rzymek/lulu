import * as React from 'react';
import './App.css';
import { Results } from "./Results";
import * as debounce from "lodash.debounce";
import * as firebase from "firebase";

class App extends React.Component<{}, { value: string }> {
  updateState: (value: string) => void;
  persist: (value: string) => void;
  user: firebase.UserInfo = undefined;

  constructor() {
    super();
    this.state = {
      value: localStorage.getItem('value')
    }
    this.updateState = debounce(value => this.setState({ value }), 100);
    this.persist = debounce(value => {
      localStorage.setItem("value", value);
      firebase.database().ref(`date/${this.user.uid}`).set({ value });
    }, 1000);
  }

  componentDidMount() {
    setInterval(this.forceUpdate.bind(this), 10 * 1000);

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        firebase.database().ref(`date/${this.user.uid}`).once('value').then(snapshot => {
          const entry = snapshot.val();
          if (entry) {
            const textarea:any = this.refs['textarea'];
            textarea.value = entry.value
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
  render() {
    return <div>
      <textarea rows={20}
        ref="textarea"
        style={{ width: '100%' }}
        defaultValue={this.state.value}
        onChange={this.handleChange.bind(this)}>
      </textarea>
      <Results value={this.state.value} />
    </div>;
  }
}

export default App;

import * as firebase from 'firebase';
import * as uuid from 'uuid/v4';

const UUID = uuid();

export class DB<V> {
  private user: firebase.UserInfo = undefined;

  public login(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return new Promise((resolve) =>
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          resolve(user);
        } else {
          firebase.auth().signInWithRedirect(provider);
        }
      }),
    );
  }

  public subscribe(callback: (value: V) => void) {
    firebase.database().ref(`timesheets/${this.user.uid}`).on('value', snapshot => {
      const entry = snapshot.val();
      if (entry && entry.UUID !== UUID) {
        callback(entry.value);
      }
    });
  }

  public write(value: V): firebase.Promise<any> {
    return firebase.database()
      .ref(`timesheets/${this.user.uid}`)
      .set({ value, UUID });
  }
}

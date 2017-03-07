import * as firebase from 'firebase';
import * as uuid from 'uuid/v4';
import * as _ from "lodash";

const UUID = uuid();

interface FileList {
  [key: string]: string
}

export class DB {
  private user: firebase.UserInfo = undefined;
  private currentRef: firebase.database.Reference = {
    off: _.noop,
  } as firebase.database.Reference;
  private filename: string;

  private backup = _.debounce((value:string, filename:string) => {
    firebase.database()
      .ref(`backups/${this.user.uid}/${filename}`)
      .push({ value, timestamp: new Date().toISOString() })
  }, 10*1000);

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

  public subscribeToFiles(callback: (files: string[]) => void) {
    firebase.database().ref(`files/${this.user.uid}`).on('value', snapshot => {
      const entry = snapshot.val();
      callback(_.values(entry));
    });
  }

  public subscribe(filename: string, callback: (value: string) => void) {
    this.currentRef.off();

    firebase.database().ref(`files/${this.user.uid}`).once('value', snapshot => {
      const files = snapshot.val() as FileList;
      const {ref} = snapshot;
      if (!_(files).values().includes(filename)) {
        ref.push(filename);
      }
    });

    this.currentRef = firebase.database().ref(`timesheets/${this.user.uid}/${filename}`);
    this.currentRef.on('value', snapshot => {
      const entry = snapshot.val();
      const filenameSwitch = this.filename !== filename;
      this.filename = filename;
      if (entry == null) {
        callback('');
      }
      if (entry && (entry.UUID !== UUID || filenameSwitch)) {
        callback(entry.value);
      }
    });
  }

  public write(value: string): firebase.Promise<any> {
    if (_.isNil(this.filename)) {
      return;
    }
    return firebase.database()
      .ref(`timesheets/${this.user.uid}/${this.filename}`)
      .set({ value, UUID })
      .then(() => this.backup(value, this.filename));
  }
}

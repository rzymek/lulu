import { DatabaseReference, getDatabase, ref, push, get, onValue, off, set } from 'firebase/database';
import { UserInfo, getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

const UUID = uuid();

interface FileList {
  [key: string]: string;
}

const database = getDatabase();
const auth = getAuth();

export class DB {
  private user: UserInfo | undefined = undefined;
  private currentRef: DatabaseReference | undefined;
  private filename: string | undefined;

  private backup = _.debounce((value: string, filename: string) => {
    push(ref(database, `${this.user?.uid}/backups/${filename}`),
      { value, timestamp: new Date().toISOString() });
  }, 10 * 1000);

  public login(): Promise<UserInfo> {
    const provider = new GoogleAuthProvider();
    return new Promise((resolve) =>
      auth.onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          resolve(user);
        } else {
          signInWithRedirect(auth, provider);
        }
      }),
    );
  }

  public async getLastOpenedFile(): Promise<string> {
    const snapshot = await get(ref(database, `${this.user?.uid}/openFile`));
    return snapshot.val();
  }

  public subscribeToFiles(callback: (files: string[]) => void) {
    onValue(ref(database, `${this.user?.uid}/files`), snapshot => {
      const entry = snapshot.val();
      callback(_.values(entry));
    });
  }

  public subscribe(filename: string, callback: (value: string) => void) {
    if(this.currentRef) {
      off(this.currentRef);
    }

    get(ref(database, `${this.user?.uid}/files`)).then(snapshot => {
      const files = snapshot.val() as FileList;
      const { ref } = snapshot;
      if (!_(files).values().includes(filename)) {
        push(ref, filename);
      }
    });

    set(ref(database, `${this.user?.uid}/openFile`), filename);

    this.currentRef = ref(database, `${this.user?.uid}/timesheets/${filename}`);
    onValue(this.currentRef, snapshot => {
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

  public async write(value: string): Promise<undefined> {
    if (_.isNil(this.filename)) {
      return;
    }
    await set(ref(database, `${this.user?.uid}/timesheets/${this.filename}`), { value, UUID });
    this.backup(value, this.filename);
  }
}

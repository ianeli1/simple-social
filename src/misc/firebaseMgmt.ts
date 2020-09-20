import * as firebase from "firebase";
import * as r from "./reference";

const firebaseConfig = {
  apiKey: "AIzaSyCiwj-nzguZRKw4nQMM6i9zRKG9TW_1rAM",
  authDomain: "simplesocial-98fa5.firebaseapp.com",
  databaseURL: "https://simplesocial-98fa5.firebaseio.com",
  projectId: "simplesocial-98fa5",
  storageBucket: "simplesocial-98fa5.appspot.com",
  messagingSenderId: "1069126706712",
  appId: "1:1069126706712:web:a9256b9fa418c103a3456d",
  measurementId: "G-VRG6R615LE",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

declare global {
  interface Window {
    firestore: any;
  }
}

window.firestore = db.collection("globalPosts");

export function startAuthListener(callback: (user: r.User | null) => void) {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const currentUser = new User(user.uid);
      callback(await currentUser.getData());
    } else {
      callback(null);
    }
  });
}

export function signOut() {
  firebase.auth().signOut();
}

export async function createNewUser(
  email: string,
  password: string,
  user: Omit<r.User, "userId">,
  icon: File | null,
  progressCallback?: (percentage: number) => void
) {
  try {
    const userC = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    let iconUrl = "";
    if (icon) {
      let k: firebase.storage.UploadTaskSnapshot = await new Promise( //TODO: add progress callback
        (resolve, reject) => {
          let task = firebase
            .storage()
            .ref("pfp/" + String(Date.now()) + "." + icon.name.split(".").pop())
            .put(icon);
          task.on(
            "state_changed",
            function progress(snapshot) {
              if (progressCallback) {
                progressCallback(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
              }
            },
            function error(err) {
              reject(err);
              console.log(err);
            },
            function complete() {
              resolve(task);
            }
          );
        }
      );
      iconUrl = await k.ref.getDownloadURL();
    }

    if (userC.user) {
      const userObj = new User(userC.user.uid);
      return (await iconUrl)
        ? userObj.create({ ...user, icon: iconUrl })
        : userObj.create(user);
    } else {
      return false;
    }
  } catch (e) {
    firebase.auth().signOut();
    console.log("An error ocurred while creating an user:", e);
    return false;
  }
}

export async function login(email: string, password: string) {
  try {
    const userC = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return userC.user ? true : false;
  } catch (e) {
    firebase.auth().signOut();
    console.log("An error ocurred while logging in:", e);
    return false;
  }
}

async function asyncForEach(
  array: Array<any>,
  callback: (element: any, index: number, array: Array<any>) => void
) {
  for (let index = 0, j = array.length; index < j; index++) {
    await callback(array[index], index, array);
  }
}

export class Feed {
  userId: string;
  ref: firebase.firestore.CollectionReference;
  user: User;
  posts: r.Feed;
  users: {
    [key: string]: r.User;
  };
  constructor(userId: string) {
    this.userId = userId;
    this.ref = db.collection("globalPosts");
    this.user = new User(userId);
    this.posts = {};
    this.users = {};
  }

  async getData(): Promise<r.ReduxPacket> {
    await this.user.getData();
    console.log({ feed: this.user.feed });
    await asyncForEach(this.user.feed, async (postId: string) => {
      const post = new Post(postId);
      this.posts[postId] = await post.getData();
      console.log("Post:" + postId, this.posts[postId]);
      const userId = this.posts[postId].userId;
      const user = new User(userId);
      this.users[userId] = await user.getData();
    }); /*
    this.user.feed.forEach(async (postId: string) => {
      const post = new Post(postId);
      this.posts[postId] = await post.getData();
      const userId = this.posts[postId].userId;
      const user = new User(userId);
      this.users[userId] = await user.getData();
    });*/
    return {
      users: this.users,
      posts: this.posts,
    };
  }
}

export class User {
  ref: firebase.firestore.DocumentReference;
  userId: string;
  name: string;
  desc: string;
  friends: string[];
  feed: string[];
  posts: string[];
  icon: string | null;
  constructor(userId: string) {
    this.userId = userId;
    this.ref = db.collection("users").doc(userId);
    this.name = "";
    this.desc = "";
    this.posts = [];
    this.friends = [];
    this.feed = [];
    this.icon = null;
  }

  async create(user: Omit<r.User, "userId">): Promise<boolean> {
    try {
      const newProfile = {
        ...user,
        icon: user.icon ? user.icon : "_noIcon_", //TODO: firestore can save null values
        userId: this.userId,
        friends: [],
        posts: [],
      };
      await this.ref.set(newProfile);
      return true;
    } catch (e) {
      console.log("An error ocurred while saving the user's data", e);
      return false;
    }
  }

  async getData(): Promise<r.User> {
    try {
      const data = await this.ref.get();
      if (data.exists) {
        const doc = data.data();
        this.name = await ((doc && doc.name) || "");
        this.desc = await ((doc && doc.desc) || "");
        this.friends = await ((doc && doc.friends) || []);
        this.feed = await ((doc && doc.feed) || []);
        this.icon =
          (await (doc && doc.icon == "_noIcon_" ? null : doc && doc.icon)) ||
          null;
        this.posts = (await (doc && doc.posts)) || [];
      }
    } catch (e) {
      console.log("Error getting user", e);
    }
    const obj = {
      userId: this.userId,
      name: this.name,
      desc: this.desc,
      icon: this.icon,
    };
    return obj;
  }
}

export class Post {
  postId: string;
  ref: firebase.firestore.DocumentReference;
  content: string;
  timestamp: Date;
  userId: string;
  constructor(postId?: string) {
    if (postId) {
      this.postId = postId;
    } else {
      this.postId = String(Date.now());
    }

    this.ref = db.collection("globalPosts").doc(postId);
    this.content = "";
    this.userId = "";
    this.timestamp = new Date();
  }

  async create(
    post: r.Post,
    file?: File,
    progressCallback?: (percentage: number) => void
  ) {
    //TODO: add progress callback
    try {
      if (file) {
        let k: firebase.storage.UploadTaskSnapshot = await new Promise(
          (resolve, reject) => {
            let task = firebase
              .storage()
              .ref(
                "img/" + String(Date.now()) + "." + file.name.split(".").pop()
              )
              .put(file);
            task.on(
              "state_changed",
              function progress(snapshot) {
                if (progressCallback) {
                  progressCallback(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                }
              },
              function error(err) {
                reject(err);
                console.log("An error ocurred while uploading this image", err);
              },
              function complete() {
                resolve(task);
              }
            );
          }
        );
        await this.ref.set({
          ...post,
          image: await k.ref.getDownloadURL(),
        });
      } else {
        await this.ref.set(post);
      }
      return true;
    } catch (e) {
      console.log("An error ocurred while creating this post", e);
      return false;
    }
  }

  async getData(): Promise<r.Post> {
    try {
      const data = await this.ref.get();
      if (data.exists) {
        const doc = data.data();
        this.userId = (await (doc && doc.userId)) || "";
        this.content = (await (doc && doc.content)) || "";
        this.timestamp = (await (doc && doc.timestamp).toDate()) || new Date();
      } else {
        throw new Error("I couldn't find the post:" + this.postId);
      }
    } catch (e) {
      console.log("An error ocurred while retrieving a post", e);
    }
    return {
      userId: this.userId,
      content: this.content,
      timestamp: this.timestamp,
    };
  }
}

export class Profile {
  userId: string;
  user: User;
  data: r.User;
  friends: { [key: string]: r.User };
  posts: r.Feed;
  constructor(userId: string) {
    this.userId = userId;
    this.user = new User(userId);
    this.data = {
      userId: this.userId,
      name: "",
      desc: "",
      icon: null,
    };
    this.friends = {};
    this.posts = {};
  }

  async getData(): Promise<r.ReduxPacket> {
    this.data = await this.user.getData();
    /*
    this.user.friends.forEach(async (userId: string) => {
      const user = new User(userId);
      this.friends[userId] = await user.getData();
    });*/
    await asyncForEach(this.user.friends, async (userId: string) => {
      const user = new User(userId);
      this.friends[userId] = await user.getData();
    });
    /*
    this.user.posts.forEach(async (postId: string) => {
      const post = new Post(postId);
      this.posts[postId] = await post.getData();
    });*/
    await asyncForEach(this.user.posts, async (postId: string) => {
      const post = new Post(postId);
      this.posts[postId] = await post.getData();
    });
    return {
      profile: {
        data: this.data,
        friends: this.user.friends,
        posts: this.user.posts,
      },
      users: this.friends,
      posts: this.posts,
    };
  }
}

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
  constructor(postId: string) {
    this.postId = postId;
    this.ref = db.collection("globalPosts").doc(postId);
    this.content = "";
    this.userId = "";
    this.timestamp = new Date();
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

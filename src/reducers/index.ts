import * as r from "../misc/reference";
import { combineReducers } from "redux";

const INITIAL_STATE_TEST: r.State = {
  currentUser: {
    userId: "0",
    name: "UserName",
    desc: "This should be the user's description",
    icon: null,
  },
  currentProfile: {
    data: {
      userId: "2",
      name: "UserName 2",
      desc: "User description :)",
      icon: null,
    },
    friends: ["0", "1", "2"],
    posts: ["0", "2"],
  },
  feed: {
    "0": {
      userId: "2",
      content: "My first post!",
      timestamp: new Date(1596952800000),
    },
    "2": {
      userId: "2",
      content: "My first post!",
      timestamp: new Date(1596952800000),
    },
    "3": {
      userId: "2",
      content: "My first post!",
      timestamp: new Date(1596952800000),
    },
    "4": {
      userId: "2",
      content: "My first post!",
      timestamp: new Date(1596952800000),
    },
  },
  users: {
    "0": {
      userId: "0",
      name: "Cool Person",
      desc: "This should be the user's description",
      icon: null,
    },
    "1": {
      userId: "0",
      name: "User Name",
      desc: "This should be the user's description",
      icon: null,
    },
    "2": {
      userId: "0",
      name: "El úsúáríó con un nombre muy largo",
      desc: "This should be the user's description",
      icon: null,
    },
  },
  ref: {},
};

const INITIAL_STATE: r.State = {
  currentUser: null,
  currentProfile: null,
  feed: null,
  users: {},
  ref: {},
};

function data(state = INITIAL_STATE, action: r.Action): r.State {
  switch (action.type) {
    case r.ACT.SET_USER_INFO:
      if (action.user) {
        return { ...state, currentUser: action.user };
      } else return state;
    case r.ACT.ADD_REF:
      if (action.post && action.id) {
        return {
          ...state,
          ref: { ...state.ref, [action.id]: action.post },
        };
      } else return state;

    case r.ACT.ADD_USER:
      if (action.user && action.id) {
        return {
          ...state,
          users: { ...state.users, [action.id]: action.user },
        };
      } else return state;

    case r.ACT.SET_PROFILE:
      if (action.profile) {
        return { ...state, currentProfile: action.profile };
      } else return state;
    case r.ACT.SET_FEED:
      if (action.feed) {
        return { ...state, feed: action.feed };
      } else return state;

    case r.ACT.NULL_USER:
      return { ...state, users: {} };
    /**
     * Cleans the currentProfile object
     */
    case r.ACT.NULL_PROFILE:
      return { ...state, currentProfile: null };

    /**
     * Cleans the Feed object
     */
    case r.ACT.NULL_FEED:
      return { ...state, feed: null };

    case r.ACT.ADD_USERS:
      if (action.users) {
        console.log("ADD USERS!", Object.keys(action.users).length);
        const newUsers = { ...state.users, ...action.users };
        return { ...state, users: newUsers };
      }
      return state;
    default:
      return { ...state };
  }
}

function lastAction(state: r.Action | null = null, action: r.Action) {
  return action;
}

export default combineReducers({
  data,
  lastAction,
});

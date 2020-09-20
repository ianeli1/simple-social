import * as r from "../misc/reference";
import { Profile, Feed, startAuthListener, Post } from "../misc/firebaseMgmt";

export const setCurrentUser = (user: r.User | null): r.Action => ({
  type: r.ACT.SET_USER_INFO,
  user: user || undefined,
});

export const addRef = (post: r.Post, id: string) => ({
  type: r.ACT.ADD_REF,
  id,
  post,
});

export const addUser = (user: r.User, id: string) => ({
  type: r.ACT.ADD_USER,
  id,
  user,
});

export const addUsers = (users: { [key: string]: r.User }) => ({
  type: r.ACT.ADD_USERS,
  users,
});

export const setProfile = (profile: r.Profile) => ({
  type: r.ACT.SET_PROFILE,
  profile,
});

export const setFeed = (feed: r.Feed) => ({
  type: r.ACT.SET_FEED,
  feed: feed,
});

export const clearFeed = () => ({
  type: r.ACT.NULL_FEED,
});

export const clearUsers = () => ({
  type: r.ACT.NULL_USER,
});

export const clearProfile = () => ({
  type: r.ACT.NULL_PROFILE,
});

export const getProfile = function (profileId: string): r.AppThunk {
  return async (dispatch) => {
    dispatch(clearProfile());
    const profile = new Profile(profileId);
    profile.getData().then((reduxPacket) => {
      reduxPacket.profile && dispatch(setProfile(reduxPacket.profile));
      dispatch(addUsers(reduxPacket.users));
      dispatch(setFeed(reduxPacket.posts));
    });
    /* ASYNC IS A FUCKING NIGHTMARE, FIX THIS MESS
    console.log("ACTION: Got this from Firebase", JSON.stringify(data));
    console.log("ACTION: updating store...");
    data.profile && dispatch(setProfile(data.profile));
    dispatch(addUsers(data.users));
    dispatch(setFeed(data.posts));*/
  };
};

export const getFeed = (): r.AppThunk => async (dispatch, getStore) => {
  dispatch(clearFeed());
  const id = getStore().data.currentUser?.userId;
  if (id) {
    const feed = new Feed(id);
    feed.getData().then((reduxPacket) => {
      dispatch(addUsers(reduxPacket.users));
      dispatch(setFeed(reduxPacket.posts));
    });
  }
};

export const getCurrentUser = (): r.AppThunk => async (dispatch) => {
  dispatch(setCurrentUser(null));
  startAuthListener((user) => dispatch(setCurrentUser(user)));
};

export const sendPost = (
  post: r.Post,
  file?: File,
  progressCallback?: (percentage: number) => void
): r.AppThunk => async (dispatch) => {
  const postO = new Post();
  const result = await postO.create(post, file, progressCallback);
  if (result) {
    dispatch(getFeed());
  }
};

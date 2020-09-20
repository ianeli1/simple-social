/*
Requirements for this app:
1 - Users will have their own profile page
2 - Users will be able to make new posts
3 - Posts will be able to contain text, images and other people's posts
4 - Users will be able to friend/unfriend other users
5 - The news section will display the most recent posts from an user's friends
6 - Users will be able to like, comment and share other people's posts
7 - Users will be able to use the webapp on mobile and on PC
8 - [For last] Users will be able to privately message each other in real-time
9 - [Optional] The app will suggest potential friends to the user based on the friends they have
10- [Optional] Users will be able to edit their posts
11 - Each user will have the option to upload a profile picture

Constraints:
- Only Firebase services (Cloud Firestore, Cloud Functions, Realtime Database, Hosting and Storage) can be used.

Requirements Specifications:
1: Each user will have their own database entry
    1.1: Each user will have their own ID, it will be randomly generated using firebase's auto generated ID (firestoreReference.add({}))
2: The post's metadata will be stored in Firestore
    2.1: Each post will have a postID assigned to it
    2.2: The postID will be used to identify the post *everywhere*
    2.3: The postID will be the result of taking the current timestamp, adding 2 random numbers, and converting the result
     into base 64 (NOT Base64), taking into account Firebase's limitations
3: The post's metadata can contain a reference to an image stored on Storage and/or another user's post
    3.1: Posts can only contain 1 image and 1 reference to another post
    3.2: The image will be stored using the filename: {postID}+"."+{file's extension}
    3.3: The image can only be in JPEG, JPG, PNG and GIF format (other formats may be added in the future)
    3.4: The image's download URL will be made available in the post metadata, we will asume that Firebase will host that image there forever
    3.5: The external post reference will trigger a search for said post in the database, giving the OP a chance to delete it (TBI)
4: Sending a friend request to another user will store it in that user's database entry so that it is easier to manage
    4.1: This WILL be managed by Cloud Functions as it represents a security risk (moreso to get some practice)
5: Using Cloud Functions, every time an user posts something, a Cloud Function will append that post to each of the user's friends' News stack
    5.1: The stack size will be infinite
    5.2: The app will only retrieve the first 15 (?) posts from the stack
    5.3: The stack will *always* be ordered by timestamp
    5.4: When a user friends another user, each user's stack will be updated
    5.5: The app will create a new post in "globalPosts", the Cloud Function will make sure it is delivered where needed (incluiding the OP's profile)
6: Comments, posts and likes will be stored in the same "post" entry
    6.1: This is only a TEMPORARY solution and it's meant to simplify the process of development
7: If the app detects that a widescreen is being used, it will render the sidebars, otherwise it will hide them under a button
8: Implement Realtime Database alongside Firestore, listen to new messages
9: Use a recommendation engine built on the Cloud Functions, update the potential friends list for each users each time they friend another user
10: Nightmare
11: At the registration page, the user will be asked for an image
    11.1: If the image is provided it is uploaded to users/"userId"/icon.extension
    11.2: The download URL will be then saved in the User's data
    11.3: if the user doesn't provide an image, the value will be left as null

*/

import { Profile } from "../containers/profile";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

/**
 * How the cloud firestore data will be distributed
users {
    "userID": { //Profile object
        name: "duh",
        desc: "User's description idk",
        feed: [
            "globalPosts/MessageReference",
            "globalPosts/MessageReference",
            "globalPosts/MessageReference",
        ],
        friends: [
            "users/UserReference", //make a .once call for each one of these
            "users/UserReference",
            "users/UserReference",
        ],
        posts: { //Feed object, subcollection
            "postId" : { //Post object
                userId: "userId",
                content: "post content, can be literally whatever",
                ref?: "postId" //make a .once call 
                image?: imageURL
            }
        },
        
    }
}

globalPosts { //Feed object, idk if will ever be used by the app, debug mode?
    "postId": { //Post object
        user: users/"userId", //cool Firestore reference
        content: "post content, can be literally whatever",
        ref?: "postId" //make a .once call 
        image?: imageURL
        timestamp: "1029410240"
    }
}



 */

export interface Feed {
  [key: string]: Post;
}

export interface Post {
  userId: string;
  content: string;
  timestamp: Date;
  ref?: Post; //The app should manage converting the postID into a post
  image?: string;
}

export interface User {
  userId: string;
  name: string;
  desc: string;
  icon: string | null;
}

export interface Profile {
  data: User;
  friends: string[];
  posts: string[];
}

export enum ACT {
  /**
   * @param action.user
   * The current user's basic information
   */
  SET_USER_INFO = 0,

  /**
   * @param action.post
   * The referenced post
   * @param action.id
   * The post's id
   */
  ADD_REF = 1,

  /**
   * @param action.user
   * The user to be added
   * @param action.id
   * The id of the user
   */
  ADD_USER = 2,

  /**
   * @param action.profile
   * The profile duh
   *
   */
  SET_PROFILE = 3,

  /**
   * @param action.feed
   * The feed bruh
   */
  SET_FEED = 4,

  /**
   * Cleans the user object
   */
  NULL_USER = 5,

  /**
   * Cleans the currentProfile object
   */
  NULL_PROFILE = 6,

  /**
   * Cleans the Feed object
   */
  NULL_FEED = 7,

  /**
   * @param action.users
   * The object users to be appended to the current state
   */
  ADD_USERS = 8,
}

export interface Action {
  type: number;
  id?: string;
  profile?: Profile;
  user?: User;
  post?: Post;
  feed?: Feed;
  users?: {
    [key: string]: User;
  };
}

export interface State {
  currentUser: User | null;
  currentProfile: Profile | null; //used for the Profile site
  feed: Feed | null; //used for the News Feed
  users: {
    //stores any basic user info needed to display the page
    [key: string]: User;
  };
  ref: Feed; //stores any ref that may be used
}

export interface ReduxPacket {
  profile?: Profile;
  users: {
    [key: string]: User;
  };
  posts: Feed;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  { data: State },
  unknown,
  Action
>;

export type AppDispatch = ThunkDispatch<{ data: State }, unknown, Action>;

---
id: app-initialization
title: App Initialization
---

Here we cover the scenario in which user opens a fresh [url](https://events-easy.firebaseapp.com/) for our website.

Two scenarios may arise :

- First time users loads our app or Returning users that had logged out of their previous session(we consider them as **logged out** users)
- Returning users who didn't logged out of their previous session(we consider them as **logged in** users)

![app_init_mock](https://user-images.githubusercontent.com/25122604/109288769-517da080-784b-11eb-8420-2429a8d90459.png)

## Returning users

### Logged in users

Here when the logged in users(that had not logged out from the previous session) they will be **auto logged in** to our website. We persist the login of the users for a better user experience.

### Persisting Login

We use browser storage for persisting the login. Here is good news for you all, firebase has got us covered here. We don't need to do anything. It automatically stores our `user` in `Indexed DB` from when we can perform some action and **auto-sign in** the user.

When the app loads we manually dispatch an action `verifyAuth()` from our `configStore.js`.

`configStore.js`

```javascript
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { verifyAuth } from './actions/authActions';
import { createBrowserHistory } from 'history';

import rootReducer from './reducers/rootReducer';

export const history = createBrowserHistory();

const configStore = () => {
  const store = createStore(
    rootReducer(history),
    composeWithDevTools(applyMiddleware(thunk))
  );
  store.dispatch(verifyAuth());
  return store;
};

export default configStore;
```

Below is our `verifyAuth()` action

```javascript
export const verifyAuth = () => {
  return (dispatch) => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(signInUser(user));
        const profileRef = getUserProfile(user.uid);
        profileRef.onSnapshot((snapshot) => {
          dispatch(listenToCurrentUserProfile(dataFromSnapshot(snapshot)));
          dispatch({ type: APP_LOADED });
        });
      } else {
        dispatch(signOutUser());
        dispatch({ type: APP_LOADED });
      }
    });
  };
};
```

From `verifyAuth()` we then dispatch `signInUser` action with the `user` stored(in the Indexed DB)as `currentUser`(we only store relevant details from `user` ) in the **redux store** and also update `authenticated` to `true` in the store.

Our `auth` state in our **redux store** looks like this :

```javascript
  auth: {
    authenticated: true,
    currentUser: {
      email: 'david@test.com',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701',
      uid: 'k5afYEVFyYcL8nv1lq0Ryn9AiKT2',
      displayName: 'David',
      providerId: 'password'
    },
    prevLocation: null,
    currentLocation: {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'zrn85d'
    }
  }
```

Also if you noticed we dispatched another event `listenToCurrentUserProfile` and we update `currentUserProfile` property in our state of the redux store.

Our `profile` state in our **redux store**

```javascript
  profile: {
    currentUserProfile: {
      createdAt: '2021-02-08T13:54:11.725Z',
      followingCount: 2,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701',
      description: 'Hi, I\'m David. Seems you were in a hurry and are lazy like me. Don\'t worry, I have got you covered. Explore my ready to go profile and start experimenting.',
      displayName: 'David',
      followerCount: 1,
      email: 'david@test.com',
      id: 'k5afYEVFyYcL8nv1lq0Ryn9AiKT2'
    },
    selectedUserProfile: null,
    photos: [],
    profileEvents: [],
    followers: [],
    followings: [],
    followingUser: false
  }
}
```

### Logged out Users

For logged out users no data is present in the `Indexed DB`(cleared when user **logs out**). Thus **auto login** won't pe possible here.

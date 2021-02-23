---
id: firebase
title: Firebase
---

We'll be using [Firebase](https://firebase.google.com/) to manage our entire backend.
Firebase provides a ready to go backend. It provides many useful services but the services we're interested are `Firestore`, `Storage`, `Hosting`.

:::note

To keep our project clean and organized we'll create two separated file`firebaseService.js` and `firestoreService.js` each containing their respective functions

:::

## Adding Firebase to our Project

### Installation

We first install firebase SDK

```javascript
npm install firebase
```

### Create Configuration File

We include only **specific Firebase products** to our project to reduce our bundle size and also for efficiency. We'll name this file `firebase.js`

```javascript
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: 'Auth domain goes here',
  projectId: 'projectid',
  storageBucket: 'project.appspot.com',
  messagingSenderId: '1545415545458',
  appId: '1:1014412122028:web:aesdf5d4sef4sdfs5',
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
```

## Authentication with Firebase

Firebase makes authentication easy by providing methods for various platforms. We just need to call them to access them.

### Sign up new users

```javascript
export const registerInFirebase = async (creds) => {
  const result = await firebase
    .auth()
    .createUserWithEmailAndPassword(creds.email, creds.password);
  await result.user.updateProfile({
    displayName: creds.displayName,
  });
  return await setUserProfileData(result.user);
};
```

> createUserWithEmailAndPassword() returns **userCredentials**. By using **updateProfile()** which is yet another method that firebase provides we are updating the user's displayName as shown above.
> **setUserProfileData()** is a function defined in `firestoreService.js` file which basically is creating a document in firestore with user credentials. Don't worry we'll look on how firestore works shortly.

### Sign in existing users

```javascript
export const signInWithEmail = (creds) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(creds.email, creds.password);
};
```

The above function returns a promise so you need to **await** it in the **try catch** block from where you're calling this function.

> The above function will go in `firebaseService.js` file.

### Social Sign in

```javascript
export const socialLogin = async (selectedProvider) => {
  let provider;
  if (selectedProvider === 'facebook') {
    provider = new firebase.auth.FacebookAuthProvider();
  }
  if (selectedProvider === 'google') {
    provider = new firebase.auth.GoogleAuthProvider();
  }
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    //optimization step, if the user is visiting for the first time
    if (result.additionalUserInfo.isNewUser) {
      await setUserProfileData(result.user);
    }
  } catch (error) {
    toast.error(error.message);
  }
};
```

> Here we first create an instance of the Google or Facebook provider object. Then, to be able to sign in with a pop-up window we call **signInWithPopup**

### Sign out user

```javascript
export const signOutFirebase = () => {
  return firebase.auth().signOut();
};
```

> Simply call **signOut** method to sign out the logged in user.

## Useful Resources

- To read more about firebase Auth visit : [firebase.auth](https://firebase.google.com/docs/reference/js/firebase.auth)

- [User Credential](https://firebase.google.com/docs/reference/js/firebase.auth#usercredential) are returned when signing in/up:

- User Credential Contains : [User](https://firebase.google.com/docs/reference/js/firebase.User) + [Auth Credentials](https://firebase.google.com/docs/reference/js/firebase.auth.AuthCredential) + [Additional User Info](https://firebase.google.com/docs/reference/js/firebase.auth#additionaluserinfo)

:::important

All the firebase functions mentioned above returns a promise. Don't forget to handle them accordingly.

:::

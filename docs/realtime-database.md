---
id: realtime-database
title: Realtime Database
---

The **Firebase Realtime Database** is a cloud-hosted database. Data is stored as JSON and synchronized in realtime to every connected client. When you build cross-platform apps with Android, iOS, and JavaScript SDKs, all of the clients share one Realtime Database instance and automatically receive updates with the newest data.

In our project we'll be using **Firebase Realtime Database** for our `EventDetailedChat.jsx` component.

## Add Data

We add data to **rtdb** using `push()`. It becomes a node in the existing JSON structure with an associated key that is automatically generated for us when we use `push()`.

```javascript
export const addEventChatComment = (eventId, values) => {
  const user = firebase.auth().currentUser;
  const newComment = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
    text: values.comment,
    date: Date.now(),
    parentId: values.parentId,
  };
  return firebase.database().ref(`chat/${eventId}`).push(newComment);
};
```

## Read Data

Now we maintain `firebaseService.js` for firebase related logic.
To read data from a particular location

```javascript
export const getEventChatRef = (eventId) => {
  return firebase.database().ref(`chat/${eventId}`).orderByKey();
};
```

We get the chat reference and use it in our `EventDetailedChat.jsx`

```javascript
useEffect(() => {
  getEventChatRef(eventId).on('value', (snapshot) => {
    if (!snapshot.exists()) return;
    //console.log(snapshot.val());
    //Object is returned from the firebase and we want to store it as an array in our redux store
    dispatch(
      listenToEventChat(firebaseObjectToArray(snapshot.val()).reverse())
    );
  });
  return () => {
    dispatch({ type: CLEAR_COMMENTS });
    getEventChatRef().off();
  };
}, [eventId, dispatch]);
```

We dispatch an action `listenToEventChat` that stores our `comments` as an array in our **redux store**.

> Here `on()` method **Listens for data changes at a particular location.**
> We use `value` event to **read a static snapshot** of the contents at a given path.
> `off()` removes all the listeners at a particular location.

:::note
The purpose of this article was to show the basic functionality that can be performed with our Firebase Realtime Database. <br/>
A more detailed explaination about the chat component will be given in the [Exploring Events](exploring-event/#event-chat) section.
:::

## Useful Resources

- [Firebase docs](https://firebase.google.com/docs/database/web/start)

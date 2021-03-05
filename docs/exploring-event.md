---
id: exploring-event
title: Exploring Event
---

In this section we explore events i.e we route to **`/events/:id`**. This `route` renders our `EventDetailed.jsx` component.

## Event Detailed Page

When we select any event for more details we route to **/`events/:id`** our `EventDetailedPage.jsx` component get rendered. Our `listenToEventFromFirstore` runs that fetches the `selected event`. We then dispatch an action `LISTEN_TO_SELECTED_EVENT` that's responsible of storing the fetched `selected event` in our **redux store**. The component finally renders our `selected event` to the screen.

> `selected event` state in our **redux store** will be over-ridden according to the event we select.

## Join/Cancel Event

We **join** event by clicking on **join button** which fires `addUserAttendance` function that updates the attendance of the user.

```javascript
export const addUserAttendance = (event) => {
  const user = firebase.auth().currentUser;
  return db
    .collection('events')
    .doc(event.id)
    .update({
      attendees: firebase.firestore.FieldValue.arrayUnion({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
      attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
    });
};
```

A user can also **cancel** his/her attendance by clicking on **Cancel My Place** button which fires `cancelUserAttendance` that filters out the attendees.

```javascript
export const cancelUserAttendance = async (event) => {
  const user = firebase.auth().currentUser;
  try {
    const eventDoc = await db.collection('events').doc(event.id).get();
    return db
      .collection('events')
      .doc(event.id)
      .update({
        attendeeIds: firebase.firestore.FieldValue.arrayRemove(user.uid),
        attendees: eventDoc
          .data()
          .attendees.filter((attendee) => attendee.id !== user.uid),
      });
  } catch (error) {
    throw error;
  }
};
```

## Event Chat

`EventDetailedPage.jsx` component renders `EventDetailedChat.jsx` component.

The Chat component uses **Firebase Realtime Database**

> Remember when we said we'll be using both the databases, now is the time.

We earlier looked at **addding** and **reading** data from Firebase RTDB [here](realtime-database).

Let's explain complete **workflow** of the `EventDetailedChat.jsx` component.

### Adding Chats

`EventDetailedChat.jsx` in turn loads `EventDetailedChatForm.jsx`.
We type our comment in the form that passes our entered value to `addEventChatComment`
which then adds our comment to the firebase RTDB.

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

### Fetching Chats

`EventDetailedChat.jsx` is a subcomponent of `EventDetailedPage.jsx`. When the chat component gets rendered, either the chats are present for a particular event or the chat is empty in our database.

Our `useEffect` runs in our `EventDetailedChat.jsx` component

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

It then fetches and gets the comments stored in our **RTDB**,

```javascript
export const getEventChatRef = (eventId) => {
  return firebase.database().ref(`chat/${eventId}`).orderByKey();
};
```

We call `getEventChatRef` from the `useEffect` which returns a reference of our chats stored and we then check if the `snapshot` exists(i.e chats are present) then we take out the data as `snapshot.val()` but this data is of **JSON** type and we want to store it as an array in our **redux store**. Thus, we call another function `firebaseObjectToArray` which converts from JSON to our required array.

```javascript
export const firebaseObjectToArray = (snapshot) => {
  if (snapshot) {
    return Object.entries(snapshot).map((e) =>
      Object.assign({}, e[1], { id: e[0] })
    );
  }
};
```

We then perform a `reverse()` operation on this array to always maintain the latest comment at top. After the fetching and conversion is done we then store are comments array in our **redux store** by dispatching `listentoEventChat` and render them accordingly.

:::note
We also need to make sure we **clear** the comments from our **redux store**. This is done to not render and mix up the comments from other event. To fix this we dispatch `CLEAR_COMMENTS` in our cleanup function of `useEffect` and **turn off** the listener once we have rendered the comments by `getEventChatRef().off()`.
:::

## Final state in Redux Store

Below is our final event state in our **redux store**

```javascript
  event: {
    events: [
      { ... , ... }
    ],
    comments: [
      {
        date: 1613200634853,
        displayName: 'Clark',
        parentId: '-MTPEF_palKoxwhXa2wa',
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
        text: 'It would be a fun event. 🔥 🔥',
        uid: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
        id: '-MTPF2BAJrYzUHZYHOMJ'
      },
      {
        date: 1613200427599,
        displayName: 'Tarun Singh',
        parentId: 0,
        photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GhEWVW4Nd5Jucim0LA27X74EvKk_cLDD9oChDCUrA=s96-c',
        text: 'Yooo..I\'m attending this.',
        uid: 'bhYdOtMcIJXm8O6qPDga2XJDbjo1',
        id: '-MTPEF_palKoxwhXa2wa'
      },
      {
        date: 1613199243667,
        displayName: 'Clark',
        parentId: '-MTP9VVdGbUGBA7P4ojj',
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
        text: 'Sure it is! See you there.',
        uid: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
        id: '-MTP9jXthMquEM4r00CJ'
      },
      {
        date: 1613199182077,
        displayName: 'David',
        parentId: 0,
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701',
        text: 'How Exciting!!',
        uid: 'k5afYEVFyYcL8nv1lq0Ryn9AiKT2',
        id: '-MTP9VVdGbUGBA7P4ojj'
      }
    ],
    moreEvents: true,
    selectedEvent: {
      description: 'Clark\'s Test Description',
      category: 'drinks',
      hostedBy: 'Clark',
      hostPhotoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
      attendeeIds: [
        'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
        'bhYdOtMcIJXm8O6qPDga2XJDbjo1',
        'kFe6MYvJNugJMB8CE0mGBPPXp5r1',
        'k5afYEVFyYcL8nv1lq0Ryn9AiKT2'
      ],
      hostUid: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
      venue: 'Clark\'s Venue',
      city: 'Clark\'s City',
      date: '2021-02-27T07:00:00.000Z',
      title: 'Clark\'s Test Event',
      attendees: [
        {
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
          id: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
          displayName: 'Clark'
        },
        {
          displayName: 'Tarun Singh',
          id: 'bhYdOtMcIJXm8O6qPDga2XJDbjo1',
          photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GhEWVW4Nd5Jucim0LA27X74EvKk_cLDD9oChDCUrA=s96-c'
        },
        {
          id: 'kFe6MYvJNugJMB8CE0mGBPPXp5r1',
          displayName: 'Steven',
          photoURL: null
        },
        {
          id: 'k5afYEVFyYcL8nv1lq0Ryn9AiKT2',
          displayName: 'David',
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701'
        }
      ],
      id: 'wtIAungLBmpDCvFp5aA0'
    },
    lastVisible: { ... },
    filter: 'all',
    startDate: '2021-02-27T05:51:20.227Z',
    retainState: true
  }
```

## Useful Resources

- [Firebase docs](https://firebase.google.com/docs/database/web/read-and-write)

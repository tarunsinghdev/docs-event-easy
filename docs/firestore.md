---
id: firestore
title: Firestore
---

Cloud Firestore follows NoSQL model, in which you store data in documents that contain fields mapping to values. These documents are stored in collections, which are containers for your documents that you can use to organize your data and build queries. Documents support many different data types, from simple strings and numbers, to complex, nested objects. You can also create subcollections within documents and build hierarchical data structures that scale as your database grows.

## Intiliaze Cloud Firestore

```javascript
const db = firebase.firestore();
```

## Add data

```javascript
export const addEventToFirestore = (event) => {
  const user = firebase.auth().currentUser;
  return db.collection('events').add({
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL || null,
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }),
    attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
  });
};
```

> Here Cloud Firestore creates collection and document implicitly the first time we add to the document. It returns a promise which should be handled accordingly. Also, if needed it returns document reference and **docRef.id** can be extracted for that particular document.

## Read data

```javascript
export const updateUserProfilePhoto = async (downloadURL, filename) => {
  const user = firebase.auth().currentUser;
  const userDocRef = db.collection('users').doc(user.uid);
  try {
    const userDoc = await userDocRef.get();
    if (!userDoc.data().photoURL) {
      await db.collection('users').doc(user.uid).update({
        photoURL: downloadURL,
      });
      await user.updateProfile({
        photoURL: downloadURL,
      });
    }
    return await db.collection('users').doc(user.uid).collection('photos').add({
      name: filename,
      url: downloadURL,
    });
  } catch (error) {
    throw error;
  }
};
```

> You can use **get()** method to retrieve a document or even an entire collection.

## Update elements in an array

If your document contains an array field, you can use `arrayUnion()` and `arrayRemove()` to add and remove elements. `arrayUnion()` adds elements to an array but only elements not already present. `arrayRemove()` removes all instances of each given element.

```javascript
export const addEventToFirestore = (event) => {
  const user = firebase.auth().currentUser;
  return db.collection('events').add({
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL || null,
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }),
    attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
  });
};
```

## Perform simple and compound queries

```javascript
export const fetchEventsFromFirestore = (
  filter,
  startDate,
  limit,
  lastDocSnapshot = null
) => {
  const user = firebase.auth().currentUser;
  let eventsRef = db
    .collection('events')
    .orderBy('date')
    .startAfter(lastDocSnapshot)
    .limit(limit);
  switch (filter) {
    case 'isGoing':
      return eventsRef
        .where('attendeeIds', 'array-contains', user.uid)
        .where('date', '>=', startDate);
    case 'isHost':
      return eventsRef
        .where('hostUid', '==', user.uid)
        .where('date', '>=', startDate);
    default:
      return eventsRef.where('date', '>=', startDate);
  }
};
```

> Here we fetch events from firestore(more detail in the next section) according to the filter provided. We fetch all the documents which satisfies our paricular queries.

## Order and Limit data

```javascript
export const getUserEventsQuery = (activeTab, userUid) => {
  let eventsRef = db.collection('events');
  const today = new Date();
  switch (activeTab) {
    case 1: //past events
      return eventsRef
        .where('attendeeIds', 'array-contains', userUid)
        .where('date', '<=', today)
        .orderBy('date', 'desc');
    case 2: //hosting
      return eventsRef.where('hostUid', '==', userUid).orderBy('date');
    default:
      return eventsRef
        .where('attendeeIds', 'array-contains', userUid)
        .where('date', '>=', today)
        .orderBy('date');
  }
};
```

```javascript
citiesRef.orderBy('name').limit(3);
```

> By default, a query retrieves all documents that satisfy the query in ascending order by document ID. You can specify the sort order for your data using orderBy(), and you can limit the number of documents retrieved using limit().

## Paginate data with query cursors

Query cursors define the start and end points for a query, allowing you to:

- Return a subset of the data.
- Paginate query results.

Paginate queries by combining query cursors with the limit() method. For example, use the last document in a batch as the start of a cursor for the next batch.

```javascript
export const fetchEventsFromFirestore = (
  filter,
  startDate,
  limit,
  lastDocSnapshot = null
) => {
  const user = firebase.auth().currentUser;
  let eventsRef = db
    .collection('events')
    .orderBy('date')
    .startAfter(lastDocSnapshot)
    .limit(limit);
  switch (filter) {
    case 'isGoing':
      return eventsRef
        .where('attendeeIds', 'array-contains', user.uid)
        .where('date', '>=', startDate);
    case 'isHost':
      return eventsRef
        .where('hostUid', '==', user.uid)
        .where('date', '>=', startDate);
    default:
      return eventsRef.where('date', '>=', startDate);
  }
};
```

## Useful Resources

:::important
It is recommended for this section to visit **[firestore docs](https://firebase.google.com/docs/firestore)** once.<br/>
Also, checkout **[Usage and limits](https://firebase.google.com/docs/firestore/quotas)** for firestore.
:::

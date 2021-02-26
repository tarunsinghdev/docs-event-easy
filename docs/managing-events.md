---
id: managing-events
title: Managing events
---

In this section we'll see how we can add events to our backend.
:::note
Before moving on, coming from the previous section we can do a small optimization. When we move to other routes from our **`/events`** page and come back to it again we don't want it to fetch events from firestore again and again.For this we dispatch an action **`RETAIN_STATE`** after we fetch events the first time. It holds either **`true`** or **`false`** depending on whether the routes has changed or not.
This will ensure we do not fetch the events again and we fetch them only once.
:::

## Creating an event

When we route to `/createEvent`, `CLEAR_SELECTED_EVENT` is dispatched by the `useEffect` in the `EventForm` component.
This is done so to clear the input fields in the form which can be present if we earlier had visited `/manage/:id` route to update the `selectedEvent`.

> The routes `/createEvent` and `/manage/:id` both takes us to `EventForm` component.

```javascript
 case CLEAR_SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: null,
      }
```

## Adding event to Firestore

When we fill the **Event Form** and hit submit the details are passed to `addEventsToFirestore` function located in `firestoreService.js`.

It then adds that event to firestore with some manually added properties.

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

## Updating event in Firestore

Updating event is simple. When we plan to update an event hosted by us we go to **`/manage/:id`** route.

We then update details in the event form and hit submit. The details are then passed to `updateEventInFirestore` located in `firestoreService.js` which then simply update the details in our backend.

```javascript
export const updateEventInFirestore = (event) => {
  return db.collection('events').doc(event.id).update(event);
};
```

> Please don't confuse with `event.id` property. Though when we were adding event to firestore we did not add any `id` propety. However when we select a hosted event to be managed we update `selected event` in our **redux store** using the below `useFirestoreDoc` custom hook when our `Event Detailed Page` loads.

`EventDetailedPage.jsx`

```javascript
useFirestoreDoc({
  query: () => listenToEventFromFirestore(match.params.id),
  data: (event) => dispatch(listenToSelectedEvent(event)),
  deps: [match.params.id, dispatch],
});
```

Also not the usage of [Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) below.

```javascript
const initialValues = selectedEvent ?? {
  title: '',
  category: '',
  description: '',
  city: '',
  venue: '',
  date: '',
};
```

## Usefull Resources

- [Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
- If you find something unclear or unable to visualize components you can always find **pictorial representation** of the components [here](scaffolding/#rough-sketch)

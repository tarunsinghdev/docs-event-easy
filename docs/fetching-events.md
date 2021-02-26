---
id: fetching-events
title: Fetching Events
---

When visit the events page we fetch the events from the firestore.
Let's us see how the events are fetched in detail.

## Workflow

When the `EventDashboard` page loads `useEffect` runs and `fetchEvents` action is dispatched to which `filter`,`startDate`, `limit` is passed. The `fetchEvents` action in turn dispatches `fetchEventsFromFirestore`

`fetchEventsFromFirestore` returns us the snapshot of all the docs with the condition set as follows and limit set to `2` in our case :

- **filter set to`all`** : events greater than `startDate` will be fetched.
- **filter set to `isGoing`** : events greater than `startDate` and to which the **logged in** user is going(by matching `attendeeIds` with `user.id`) will be fetched.
- **filter set to `isHost`** : event that **logged in** user is hosting(by comparing `hostId` with `user.id`) and events greater than the `startDate` will be fetched.

The snapshot of all the documents returned by `fetchEventsFromFirestore`(`2` docs in our case) are then used to calculate `lastVisible`, `moreEvents` and `events`.

```javascript
const lastVisible = snapshot.docs[snapshot.docs.length - 1];
const moreEvents = snapshot.docs.length >= limit;
const events = snapshot.docs.map((doc) => dataFromSnapshot(doc));
```

> This all is done for **pagination**. More on it [here](firestore.md/#paginate-data-with-query-cursors)

Another action `FETCH_EVENTS` is dispatched that set the **redux state** as

```javascript
    case FETCH_EVENTS:
      return {
        ...state,
        events: [...state.events, ...payload.events],
        moreEvents: payload.moreEvents,
        lastVisible: payload.lastVisible,
      };
```

Detailed state below :

```javascript
  event: {
    events: [
      {
        hostUid: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
        hostPhotoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
        venue: 'Clark\'s Venue',
        city: 'Clark\'s City',
        category: 'drinks',
        title: 'Clark\'s Test Event',
        attendees: [
          {
            displayName: 'Clark',
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
            id: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2'
          },
          {
            photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GhEWVW4Nd5Jucim0LA27X74EvKk_cLDD9oChDCUrA=s96-c',
            id: 'bhYdOtMcIJXm8O6qPDga2XJDbjo1',
            displayName: 'Tarun Singh'
          },
          {
            displayName: 'Steven',
            photoURL: null,
            id: 'kFe6MYvJNugJMB8CE0mGBPPXp5r1'
          },
          {
            id: 'k5afYEVFyYcL8nv1lq0Ryn9AiKT2',
            displayName: 'David',
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701'
          }
        ],
        hostedBy: 'Clark',
        description: 'Clark\'s Test Description',
        attendeeIds: [
          'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
          'bhYdOtMcIJXm8O6qPDga2XJDbjo1',
          'kFe6MYvJNugJMB8CE0mGBPPXp5r1',
          'k5afYEVFyYcL8nv1lq0Ryn9AiKT2'
        ],
        date: '2021-02-27T07:00:00.000Z',
        id: 'wtIAungLBmpDCvFp5aA0'
      },
    ],
    comments: [],
    moreEvents: true,
    selectedEvent: null,
    lastVisible: { ... },
    filter: 'all',
    startDate: '2021-02-26T15:47:30.632Z',
    retainState: false
  },
```

The fetched events are then passed to `EventList` component and then to `EventListItem` which renders the events to the screen.

## Useful Resources

- If you find something unclear or unable to visualize components you can always find **pictorial representation** of the components [here](scaffolding/#rough-sketch)

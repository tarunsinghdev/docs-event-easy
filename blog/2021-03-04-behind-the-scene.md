---
slug: behind-the-scene
title: Event Easy - The Behind the Scene
author: Tarun Singh
author_title: Freelance Web Developer
author_url: https://github.com/tarunsinghdev
author_image_url: https://avatars.githubusercontent.com/u/25122604?s=60&v=4
tags: [web development, project, blog]
---

export const Highlight = ({children, color}) => ( <span style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}>{children}</span> );

✨️
**_Learning things and implementing them is the real deal_.** I was aware of the fact and with the new concepts I learned, I wanted to have a final grasp on my newly equipped skills. What's better than implementing the skills and bringing your ideas to life. I took this as a challenge and continued.

<!--truncate-->

## 💡 The idea

Four hours straight into thinking, I was running out of ideas. Problem was that I wanted my project to sound unique and that it should be helpful to the people around me. I was always fascinated by how social media worked. But there were already many projects built in this domain. I knew that it would be a great learning experience so I sat for yet another hour to improvize the thought. The previous day I was watching a **React conference** and I was amazed by the knowledge those people possessed. And voila... I had my idea, what if I build a website focussed on events. The event's website where people could come together **join and host** events. It sounded unique and I was confirmed with the idea.

## 🛠️ Getting further

With the basic idea confirmed now it was time to make the website feature-rich. I was getting ready with my idea on paper. Though the idea sounded good to me, there was something extra I could add to it. How about if the user can **chat** about the events with other users and **filter** the events to which they are hosting or attending.

With the skills in my bag, I was confident that I can implement the features. I penned down my complete idea on paper and got started.

## 🌧 The Challenges

_It is rightly said you learn by building projects and I could experience the process._<br/>
Until now I was only concerned with adding and retrieving data from firebase. But it was now time for a step ahead and I came across my first **major challenge**.

### 1. Challenge - Join/Cancel Events

Adding user sign up to events functionality:

- Join events
- Cancel attendance

With the Firebase database design I had, collection of **users** and **events** at the root level.
A user can attend as many events and an event can have as many attendees. I was clear with this. Now the **challenge** was to design a **relationship** between the two collections so that I could filter the events a user is attending.

Searching online for a while landed me to <Highlight color="#25c2a0">**Firestore queries**</Highlight>. Since firebase is a NoSQL database quering it was different from the SQL world.

### Solution

The solution of setting the **firestore relationship**, in this case, I came with was creating an attendance array in the events docs. Each time user clicked the `Join event` button, the user gets added to the attendance array in the events docs.

Since in firebase, we can only query simple arrays of strings so I cannot set up a query on my attendance array which was an array of objects. For this, I created another array at the same location but this time the array consists of only attendee ids.

Now I was able to query and check which user is attending a particular event. And the events can be **filtered** accordingly.

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

> An array can be a maximum of 20,000 rows and a document can be 1MB in size.

Adding user attendance :

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

Cancelling user attendance :

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

### 2. Challenge - Follow/Unfollow Users

I encountered yet another challenge. The challenge was again to design the database but this time for the **follow/unfollow** functionality.<br/>

The main task was that if I visited another user profile I should see if I was following(in that case I should see the `Unfollow` option) and if I'm not(I should see the `Follow` option) like a simple follow/unfollow switch. But it was indeed challenging.

### Solution

![image](https://user-images.githubusercontent.com/25122604/110154059-ce8bb580-7e09-11eb-915c-83be4d13d311.png)

I decided to create another collection **following** apart from **events** and **users** I already had. Now if the user clicks the `Follow` button **two** documents get created in **following** collection. One was of the user I followed and the other was of mine.

In my following collection document, I had two more collections `userFollowers` and `userFollowings` that contain the document of the user details(displayName, photoURL, and uid).

So now if the user `follows`, two documents get created and the user who is `following` gets his details added in the `userFollowers` of the other user.

As you can see the complexity involved in explaining, it took me time to design and think of such a design. But at last, I succeeded.

Also I was introduced with <Highlight color="#25c2a0">**Firestore Batches**</Highlight> that basically rolls back the changes if any of the actions fails. I was performing four different actions for a follow action(can be seen below).

```javascript
export const getFollowingDoc = (profileId) => {
  const userUid = firebase.auth().currentUser.uid;
  return db
    .collection('following')
    .doc(userUid)
    .collection('userFollowing')
    .doc(profileId)
    .get();
};
```

```javascript
export const followUser = async (profile) => {
  //Here profile is selectedUserProfile
  const user = firebase.auth().currentUser;
  const batch = db.batch();
  try {
    batch.set(
      //add the user details(the user who gets followed) under 'userFollowing`
      db
        .collection('following')
        .doc(user.uid)
        .collection('userFollowing')
        .doc(profile.id),
      {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        uid: profile.id,
      }
    );
    batch.set(
      //just the opposite, add the user details(the user who is                     following) under 'userFollowers'
      db
        .collection('following')
        .doc(profile.id)
        .collection('userFollowers')
        .doc(user.uid),
      {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }
    );
    batch.update(db.collection('users').doc(user.uid), {
      followingCount: firebase.firestore.FieldValue.increment(1),
    });
    batch.update(db.collection('users').doc(profile.id), {
      followerCount: firebase.firestore.FieldValue.increment(1),
    });
    return await batch.commit();
  } catch (error) {
    throw error;
  }
};
```

## ✨️ Conclusion

I managed to bring my idea to life. With so much learning involved in the process, I'm satisfied how it came out.<br/>
I believe in learning together with the community. I write about the things I learned and applied. You can find more blogs [here](https://tarunsingh.hashnode.dev/)

⚡️ Happy Learning.

## Demo

- **See live** : https://events-easy.firebaseapp.com/
- **Github Repo** : https://github.com/tarunsinghdev/event-easy

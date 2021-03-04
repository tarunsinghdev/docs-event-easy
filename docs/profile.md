---
id: profile
title: Profile
---

In this article, we look into the workflow of what happens when a user visits his/her **own profile** or visits **other user profile**.

## Profile Page

### Profile Header

The `currentUserProfile` which was stored during **app initialization** in the **redux store** is passed to the `ProfileHeader.jsx` component which renders the **profile photo**, **displayName**, **followerCount** and **followingCount**.

### Profile Content

Renders fours tabs:`<AboutTab />` , `<PhotosTab />`, `<EventsTab />` and `<FollowingTab />`.

#### About Tab

`ProfileContent.jsx` component passes `profile` and `currentUser` to the `<AboutTab>` component.

A user can edit his/her **about** section using `edit` option visible. This option is not visible to other users looking into your profile and vice-versa.

#### PhotosTab

We fetch photos of the user from firestore.

```javascript
useFirestoreCollection({
  query: () => getUserPhotos(profile.id),
  data: (photos) => dispatch(listenToUserPhotos(photos)),
  deps: [profile.id, dispatch],
});
```

```javascript
export const getUserPhotos = (userUid) => {
  return db.collection('users').doc(userUid).collection('photos');
};
```

We then dispatch `listenToUserPhotos` which saves our fetched photos in our **redux store**.

A user can **upload** and **set profile photo**.

- **Uploading photo :**
  When user clicks on `Add Photo` button in **Photos Tab**, `<PhotoWidgetComponent />` renders and user needs to go through 3 steps. <br />
  Uploading photos involves three steps:

  - **Step 1 Add Photo :** A `<PhotoWidgetDropzone /`> renders. We use [react-dropzone](https://react-dropzone.js.org/). As the name suggest we drag and drop or simply select our photo from our local system. On selecting it then saves our selected file in a located state name `file`.
  - **Step 2 Resize :** A `<PhotoWidgetCropper />` renders. We use [react-cropper](https://github.com/react-cropper/react-cropper). We crop the image and save the cropped image in our local state named `image`.
  - **Step 3 Preview & Upload :** We are shown the preview of the selected image and we have two options to **upload** or **cancel** the process.<br/>

    On clicking upload:

    ```javascript
    const handleUploadImage = () => {
      setLoading(true);
      const filename = cuid() + '.' + getFileExtension(files[0].name);
      const uploadTask = uploadToFirebaseStorage(image, filename);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload Task is ', progress + '%done');
        },
        (error) => {
          toast.error(error.messages);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              updateUserProfilePhoto(downloadURL, filename).then(() => {
                setLoading(false);
                handleCancelCrop();
                setEditMode(false);
              });
            })
            .catch((error) => {
              toast.error(error.message);
              setLoading(false);
            });
        }
      );
    };
    ```

    ```javascript
    export const uploadToFirebaseStorage = (file, filename) => {
      const user = firebase.auth().currentUser;
      const storageRef = firebase.storage().ref();
      return storageRef.child(`${user.uid}/user_images/${filename}`).put(file);
    };
    ```

    > After upload completes, we get a download url from firebase storage by `getDownloadUrl()`. We then update user profile photo in the **firestore**, **currentUser** and **photo collection**.

    On clicking cancel, we reset the process

    ```javascript
    const handleCancelCrop = () => {
      setFiles([]);
      setImage(null);
    };
    ```

- **Setting profile photo :** Setting a photo requires updation of photoURL at various fields. These are **events**, **attendees** and **userFollowing** docs and also updating **currentUser**.

```javascript
export async function setMainPhoto(photo) {
  const user = firebase.auth().currentUser;
  const today = new Date();
  const eventDocQuery = db
    .collection('events')
    .where('attendeeIds', 'array-contains', user.uid)
    .where('date', '>=', today);
  const userFollowingRef = db
    .collection('following')
    .doc(user.uid)
    .collection('userFollowing');

  const batch = db.batch();

  batch.update(db.collection('users').doc(user.uid), {
    photoURL: photo.url,
  });

  try {
    const eventsQuerySnap = await eventDocQuery.get();
    for (let i = 0; i < eventsQuerySnap.docs.length; i++) {
      let eventDoc = eventsQuerySnap.docs[i];
      if (eventDoc.data().hostUid === user.uid) {
        batch.update(eventsQuerySnap.docs[i].ref, {
          hostPhotoURL: photo.url,
        });
      }
      batch.update(eventsQuerySnap.docs[i].ref, {
        attendees: eventDoc.data().attendees.filter((attendee) => {
          if (attendee.id === user.uid) {
            attendee.photoURL = photo.url;
          }
          return attendee;
        }),
      });
    }
    const userFollowingSnap = await userFollowingRef.get();
    userFollowingSnap.docs.forEach((docRef) => {
      let followingDocRef = db
        .collection('following')
        .doc(docRef.id)
        .collection('userFollowers')
        .doc(user.uid);
      batch.update(followingDocRef, {
        photoURL: photo.url,
      });
    });

    await batch.commit();

    return await user.updateProfile({
      photoURL: photo.url,
    });
  } catch (error) {
    throw error;
  }
}

export const deletePhotoFromCollection = (photoId) => {
  const userUid = firebase.auth().currentUser.uid;
  return db
    .collection('users')
    .doc(userUid)
    .collection('photos')
    .doc(photoId)
    .delete();
};
```

#### Events Tab

TO DO

#### Following Tab

TO DO

## Final Redux state

```javascript
{
  profile: {
    currentUserProfile: {
      description: 'Hi, I\'m David. Seems you were in a hurry and are lazy like me. Don\'t worry, I have got you covered. Explore my ready to go profile and start experimenting.',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701',
      followingCount: 2,
      email: 'david@test.com',
      displayName: 'David',
      followerCount: 1,
      createdAt: '2021-02-08T13:54:11.725Z',
      id: 'k5afYEVFyYcL8nv1lq0Ryn9AiKT2'
    },
    selectedUserProfile: null,
    photos: [
      {
        name: 'ckl0jwqkf0000246251mjeb5s.jpg',
        url: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701',
        id: 'cFxdWn1ScYb3NtF6YXUd'
      },
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0to43400012465c3fgsgvf.jpg?alt=media&token=d7af66d8-067f-41dc-92e7-f2d3a58e8172',
        name: 'ckl0to43400012465c3fgsgvf.jpg',
        id: 'ufCSiz4ptIg2toH1X3s8'
      }
    ],
    profileEvents: [
      {
        title: 'Brunch on Saturday',
        category: 'food',
        hostPhotoURL: null,
        date: '2021-03-06T06:00:00.000Z',
        hostUid: 'kFe6MYvJNugJMB8CE0mGBPPXp5r1',
        attendees: [
          {
            displayName: 'Steven',
            photoURL: null,
            id: 'kFe6MYvJNugJMB8CE0mGBPPXp5r1'
          },
          {
            id: 'k5afYEVFyYcL8nv1lq0Ryn9AiKT2',
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/k5afYEVFyYcL8nv1lq0Ryn9AiKT2%2Fuser_images%2Fckl0jwqkf0000246251mjeb5s.jpg?alt=media&token=f1faa75e-0eca-41df-9f1d-cfd84ad14701',
            displayName: 'David'
          }
        ],
        city: 'Orlando',
        venue: 'City PUB  861 North Orange Avenue  Orlando, FL 32801, United States ',
        attendeeIds: [
          'kFe6MYvJNugJMB8CE0mGBPPXp5r1',
          'k5afYEVFyYcL8nv1lq0Ryn9AiKT2'
        ],
        id: 'cSc3ftoPqShHRqXnIXAc',
        hostedBy: 'Steven',
        description: 'A Brunch on Saturday... is your Saturday Brunch Day Party.  The only place in the city on a Saturday where you can eat, drink, chill, and party in the daytime!'
      },
     ...
     ...
    ],
    followers: [
      {
        uid: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
        displayName: 'Clark',
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
        id: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2'
      }
    ],
    followings: [
      {
        uid: 'bhYdOtMcIJXm8O6qPDga2XJDbjo1',
        displayName: 'Tarun Singh',
        photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GhEWVW4Nd5Jucim0LA27X74EvKk_cLDD9oChDCUrA=s96-c',
        id: 'bhYdOtMcIJXm8O6qPDga2XJDbjo1'
      },
      {
        uid: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2',
        displayName: 'Clark',
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/events-easy.appspot.com/o/yyGvnLVyU9ZhWwc22kZvkp4XQvp2%2Fuser_images%2Fckl1uknxp0000246211dfg2q9.jpg?alt=media&token=b68b93b9-23b9-4da5-8f01-bac48d6aa2a9',
        id: 'yyGvnLVyU9ZhWwc22kZvkp4XQvp2'
      }
    ],
    followingUser: false
  }
}
```

## Useful Resources

- [Firebase Storage docs](https://firebase.google.com/docs/storage/web/start)
- [react-dropzone](https://react-dropzone.js.org/)
- [react-cropper](https://github.com/react-cropper/react-cropper)

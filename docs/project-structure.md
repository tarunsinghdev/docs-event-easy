---
id: project-structure
title: Project Structure
---

Let's begin with Project Structure.

It depends on an individual choice of how they structure their projects.
However, in this project, we'll be splitting our app into two main folders `app` and `features` under the `src` folder.<br/>

For the assets like images, logo, etc. We'll put them into the `public` folder.<br/>
We'll use a global CSS file `styles.css`(located in `src/app/layout`) and we store our `index.js` file in our `src` folder.
<br/>

```
src
┣ app/
┣ features/
┣ index.js
┣ reportWebVitals.js
┗ setupTests.js
```

## Complete Structure

### public folder

```
public/
┣ assets/
┃ ┣ categoryImages/
┃ ┃ ┣ culture.jpg
┃ ┃ ┣ drinks.jpg
┃ ┃ ┣ film.jpg
┃ ┃ ┣ food.jpg
┃ ┃ ┣ music.jpg
┃ ┃ ┗ travel.jpg
┃ ┣ logo.png
┃ ┗ user.png
┣ android-chrome-192x192.png
┣ android-chrome-512x512.png
┣ apple-touch-icon.png
┣ favicon-16x16.png
┣ favicon-32x32.png
┣ favicon.ico
┣ index.html
┣ manifest.json
┗ robots.txt
```

### src folder

```
src/
┣ app/
┃ ┣ api/
┃ ┃ ┗ categoryOptions.js
┃ ┣ common/
┃ ┃ ┣ errors/
┃ ┃ ┃ ┗ ErrorComponent.jsx
┃ ┃ ┣ form/
┃ ┃ ┃ ┣ MyDateInput.jsx
┃ ┃ ┃ ┣ MySelectInput.jsx
┃ ┃ ┃ ┣ MyTextArea.jsx
┃ ┃ ┃ ┗ MyTextInput.jsx
┃ ┃ ┣ modals/
┃ ┃ ┃ ┣ ModalManager.jsx
┃ ┃ ┃ ┗ ModalWrapper.jsx
┃ ┃ ┣ photos/
┃ ┃ ┃ ┣ PhotoUploadWidget.jsx
┃ ┃ ┃ ┣ PhotoWidgetCropper.jsx
┃ ┃ ┃ ┗ PhotoWidgetDropzone.jsx
┃ ┃ ┗ util/
┃ ┃   ┗ util.js
┃ ┣ config/
┃ ┃ ┗ firebase.js
┃ ┣ firestore/
┃ ┃ ┣ firebaseService.js
┃ ┃ ┗ firestoreService.js
┃ ┣ hooks/
┃ ┃ ┣ useFirestoreCollection.js
┃ ┃ ┗ useFirestoreDoc.js
┃ ┗ layout/
┃   ┣ App.jsx
┃   ┣ LoadingComponent.jsx
┃   ┣ PrivateRoute.jsx
┃   ┣ ScrollToTop.jsx
┃   ┗ styles.css
┣ features/
┃ ┣ auth/
┃ ┃ ┣ AccountPage.jsx
┃ ┃ ┣ LoginInForm.jsx
┃ ┃ ┣ RegisterForm.jsx
┃ ┃ ┣ SocialLogin.jsx
┃ ┃ ┗ UnauthModal.jsx
┃ ┣ events/
┃ ┃ ┣ eventDashboard/
┃ ┃ ┃ ┣ EventDashboard.jsx
┃ ┃ ┃ ┣ EventFilters.jsx
┃ ┃ ┃ ┣ EventList.jsx
┃ ┃ ┃ ┣ EventListAttendee.jsx
┃ ┃ ┃ ┣ EventListItem.jsx
┃ ┃ ┃ ┗ EventListItemPlaceholder.jsx
┃ ┃ ┣ eventDetailed/
┃ ┃ ┃ ┣ EventDetailedChat.jsx
┃ ┃ ┃ ┣ EventDetailedChatForm.jsx
┃ ┃ ┃ ┣ EventDetailedHeader.jsx
┃ ┃ ┃ ┣ EventDetailedInfo.jsx
┃ ┃ ┃ ┣ EventDetailedPage.jsx
┃ ┃ ┃ ┗ EventDetailedSidebar.jsx
┃ ┃ ┗ eventForm/
┃ ┃   ┗ EventForm.jsx
┃ ┣ home/
┃ ┃ ┗ HomePage.jsx
┃ ┣ nav/
┃ ┃ ┣ NavBar.jsx
┃ ┃ ┣ SignedIn.jsx
┃ ┃ ┗ SignedOut.jsx
┃ ┣ profiles/
┃ ┃ ┗ profilePage/
┃ ┃   ┣ AboutTab.jsx
┃ ┃   ┣ EventsTab.jsx
┃ ┃   ┣ FollowingTab.jsx
┃ ┃   ┣ PhotosTab.jsx
┃ ┃   ┣ ProfileCard.jsx
┃ ┃   ┣ ProfileContent.jsx
┃ ┃   ┣ ProfileForm.jsx
┃ ┃   ┣ ProfileHeader.jsx
┃ ┃   ┗ ProfilePage.jsx
┃ ┗ store/
┃   ┣ actions/
┃ ┃ ┃ ┣ actionTypes.js
┃ ┃ ┃ ┣ authActions.js
┃ ┃ ┃ ┣ eventActions.js
┃ ┃ ┃ ┗ profileActions.js
┃   ┣ reducers/
┃ ┃ ┃ ┣ asyncReducer.js
┃ ┃ ┃ ┣ authReducer.js
┃ ┃ ┃ ┣ eventReducer.js
┃ ┃ ┃ ┣ modalReducer.js
┃ ┃ ┃ ┣ profileReducer.js
┃ ┃ ┃ ┗ rootReducer.js
┃   ┗ configStore.js
┣ index.js
┣ reportWebVitals.js
┗ setupTests.js
```

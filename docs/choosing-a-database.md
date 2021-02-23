---
id: choosing-a-database
title: Choosing a database
---

Firebase offers two cloud-based, client-accessible database solutions that support realtime data syncing:<br/>

- **Cloud Firestore** is Firebase's newest database for mobile app development. It builds on the successes of the Realtime Database with a new, more intuitive data model. Cloud Firestore also features richer, faster queries and scales further than the Realtime Database.<br/>
- **Realtime Database** is Firebase's original database. It's an efficient, low-latency solution for mobile apps that require synced states across clients in realtime.

:::note
We'll be using both the databases in our app but it is good to know the difference between the two. The event chat functionality of our app will be taken care of by **RTDB** and the rest of the functionality by **firestore**.
:::

:::tip
It is recommended that you go through beautifully written **[docs](https://firebase.google.com/docs/database/rtdb-vs-firestore)** to know the differences between RTDB and firestore.
:::

---
id: hot-module-replacement
title: Hot Module Replacement
---

We'll be using HMR in our project which is a general practice to include in the project nowadays for better efficiency.<br/>

Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload. This can significantly speed up development in a few ways:

- Retain application state which is lost during a full reload.
- Save valuable development time by only updating what's changed.
- Instantly update the browser when modifications are made to CSS/JS in the source code, which is almost comparable to changing styles directly in the browser's dev tools

You don't need to install any plugin by yourself. `Create-React-App` comes pre-configured. You need to make few changes to your `index.js` file to **enable HMR**.

```javascript
if (module.hot) {
  module.hot.accepts('path/to/your/root/App', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
  });
}
```

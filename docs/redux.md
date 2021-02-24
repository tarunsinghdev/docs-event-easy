---
id: redux
title: Redux
---

In this project we'll be using Redux extensively for our **state-management**.<br/>
As the Redux docs says, `Redux is a predictable state container for JavaScript apps`.<br/>

While working with Redux there are few key principles to consider :

- State is a immutable object.
- You never mutate application state, you always return a new, modified one.
- All state changes are initiated through actions (they contain desired changes details)
- Reducers take current state, action and produce a new state.

We can observe the **preditable nature** of Redux. The changes flow one way only <br/>
state -> action -> reducer -> state -> action -> reducer -> state ...

> You can use Redux together with React, or with any other view library. It is tiny (2kB, including dependencies), but has a large ecosystem of addons available.

## When To Use Redux ?

Redux is more useful when:

- You have large amounts of application state that are needed in many places in the app.
- The app state is updated frequently over time.
- The logic to update that state may be complex.
- The app has a medium or large-sized codebase, and might be worked on by many people

## Installation

We'll need **Redux** - a standalone library and **React-Redux** - which lets our React components to interact with Redux store.

```javascript
npm install redux react-redux
```

### Redux DevTools Extension

. The [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) allows you to debug your applications effectively, including using powerful techniques like **"time-travel debugging"**.

1. **For Chrome**
   - from [Chrome Web Store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
2. **For Firefox**

   - from [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

   After installing the extension to your browser install npm package as below <br/>

   ```javascript
   npm install --save redux-devtools-extension
   ```

## Enhancers

Redux stores are customized using something called a store enhancer. A store enhancer is like a special version of `createStore` that adds another layer wrapping around the original Redux store.

```javascript
const store = createStore(rootReducer, storeEnhancer);
```

## Middleware

Redux uses a special kind of addon called middleware to let us customize the dispatch function.<br/>
**Redux middleware provides a third-party extension point between dispatching an action, and the moment it reaches the reducer.** People use Redux middleware for logging, crash reporting, talking to an asynchronous API, routing, and more.<br/>
Redux middleware are actually implemented on top of a very special store enhancer that comes built in with Redux, called `applyMiddleware`.

> Unlike a reducer, middleware can have side effects inside, including timeouts and other async logic.

In this project, we'll be using **Redux-Thunk** for managing our async logic. <br/>
Simply install the npm package as below :

```javascript
npm install redux-thunk
```

## Configuring the Store

We create a folder called `store` in our working directory that will take care of all our redux related logic(actions, reducers). We store all our actions in `actions` folder and reducers in `reducer` folder.

### Root Reducer

**Every Redux store has a single root reducer function.** However, we can split our reducer logic into multiple reducer functions and later combine them with `combineReducer` provided by `redux`. This splitting provides an easy way for developers to manage reducer functions.

We create a separate file under `src/features/store/reducers/rootReducer.js`

```javascript
import { combineReducers } from 'redux';

import asyncReducer from './asyncReducer';
import authReducer from './authReducer';
import eventReducer from './eventReducer';
import modalReducer from './modalReducer';
import profileReducer from './profileReducer';
import { connectRouter } from 'connected-react-router';

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    event: eventReducer,
    modals: modalReducer,
    auth: authReducer,
    async: asyncReducer,
    profile: profileReducer,
  });

export default rootReducer;
```

Out of the familiar things there is `connected-react-router` which we have not discussed yet.

#### Connected React Router

This package helps us connect our route to redux store. By doing this we keep track of the previous location of the user and take back to it when needed.

First things first, install the npm package as below

```javascript
npm install connected-react-router
```

History, we do get part of the `react-router-dom` but isn't directly installed in our packages.<br/>

```javascript
npm install @history@4.10.1
```

> Usage and Setup steps can be found **[here](https://github.com/supasate/connected-react-router)**

### Creating Store

We create our store in separate file `configStore.js`

```javascript
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { verifyAuth } from './actions/authActions';
import { createBrowserHistory } from 'history';

import rootReducer from './reducers/rootReducer';

export const history = createBrowserHistory();

const configStore = () => {
  const store = createStore(
    rootReducer(history),
    composeWithDevTools(applyMiddleware(thunk))
  );
  store.dispatch(verifyAuth());
  return store;
};

export default configStore;
```

> Here we create our store with `createStore`, configure our app to use `redux devtools` and to the enhancer `applyMiddleware` we pass our middleware `thunk` for managing our async logic.

### Connecting our app

`index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-calendar/dist/Calendar.css';
import './app/layout/styles.css';
import App from './app/layout/App';
import { Provider } from 'react-redux';
import configStore, { history } from './features/store/configStore';
import ScrollToTop from './app/layout/ScrollToTop';
import { ConnectedRouter } from 'connected-react-router';

const store = configStore();

const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ScrollToTop />
        <App />
      </ConnectedRouter>
    </Provider>,
    rootEl
  );
}

if (module.hot) {
  module.hot.accept('./app/layout/App', function () {
    setTimeout(render);
  });
}

render();
```

> Here we complete our final stage of setting up **Redux**

:::note
Please ignore the functions not related to redux, they will be dealt separately.
:::

### Useful Resources

- More on [React-Redux](https://react-redux.js.org/introduction/quick-start)

  > The above docs uses `mapStateToProps` and `mapDispatchToProps` which is a traditional practice.<br/>
  > We'll be using new **hooks API**, `useSelector()` and `useDispatch()` provided by `react-redux` itself.
  > **They recommend using React-Redux hooks API which can be found [here](https://react-redux.js.org/api/hooks)**

- More on [Redux](https://redux.js.org/introduction/getting-started)
- More on [Connected React Router](https://github.com/supasate/connected-react-router)

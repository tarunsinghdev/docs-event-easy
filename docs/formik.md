---
id: formik
title: Formik
---

Form are one the most important component of a website. We use **formik** in our project to handle our forms.<br/>

Formik is a small library that helps you with the 3 most annoying parts:

1. Getting values in and out of form state
2. Validation and error messages
3. Handling form submission

## Without Formik

React uses **controlled components** to implement forms.

Below we see how we handle **multiple inputs**

> _An input form element whose value is controlled by React in this way is called a **“controlled component”**_.

```javascript
  handleChange = (event)=>{
      this.setState({
          [event.target.name] : event.target.value
      })
  }
  // ...
  <input
   name = "thing"
   onChange = {this.handleChange}
   value = {this.state.thing}
  />
  <input
    name = "other"
    onChange = {this.handleChange}
    value = {this.state.other}
  />
```

This allows us to store the form state in our app and share with other components, if needed.**This is all what we can do with React.**

React leaves rest of the work upto us, to manage Error Messages, Validation, Testing, etc. It's okay as React is just the "view".

## Installation

```javascript
  npm install formik
```

You are free to write your own **validation** logic. Formik recommends using [Yup](https://github.com/jquense/yup).

We'll also be using **Yup** library for our validation logic.

```javascript
  npm install yup
```

## Usage

With Formik, you can and should build reusable input primitive components that you can share around your application.

In our project we create these sharable input component inside `form folder` located at `src/app/common/form/`

`MyTextInput.jsx`

```javascript
import { useField } from 'formik';
import React from 'react';
import { FormField, Label } from 'semantic-ui-react';

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormField error={meta.touched && !!meta.error}>
      <label>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </FormField>
  );
};

export default MyTextInput;
```

> `useField()` returns `[formik.getFieldProps(), formik.getFieldMeta()]`
> which we can spread on `<input>`. We can use field `meta` to show an error
> message if the field is invalid and it has been touched (i.e. visited)

`useField()` will implicitly grab the respective `onChange`, `onBlur`, `value` props and pass them to the element.

:::tip
It is recommended that you go through the well documented tutorial on [Formik docs](https://formik.org/docs/tutorial)
:::

#### Using our shareable input component

Below is our code snippet taken from `AccountPage.jsx` file.

```javascript
<Formik
  initialValues={{ newPassword1: '', newPassword2: '' }}
  validationSchema={Yup.object({
    newPassword1: Yup.string().required('Password is required'),
    newPassword2: Yup.string().oneOf(
      [Yup.ref('newPassword1'), null],
      'Password do not match'
    ),
  })}
  onSubmit={async (values, { setSubmitting, setErrors }) => {
    try {
      await updateUserPassword(values);
    } catch (error) {
      setErrors({ auth: error.message });
    } finally {
      setSubmitting(false);
    }
  }}
>
  {({ errors, isSubmitting, isValid, dirty }) => (
    <Form className="ui form">
      <MyTextInput
        name="newPassword1"
        type="password"
        placeholder="New Password"
      />
      <MyTextInput
        name="newPassword2"
        type="password"
        placeholder="Confirm Password"
      />
      {errors.auth && (
        <Label
          basic
          color="red"
          style={{ marginBottom: 10 }}
          content={errors.auth}
        />
      )}
      <Button
        style={{ display: 'block' }}
        type="submit"
        disabled={!isValid || isSubmitting || !dirty}
        loading={isSubmitting}
        size="large"
        positive
        content="Update password"
      />
    </Form>
  )}
</Formik>
```

Let's discuss the unfamiliar thinks in the above code one by one.

Following are the [render props](https://reactjs.org/docs/render-props.html_) passed by `<Formik />` component,

> A render prop is a function prop that a component uses to know what to render.

- **`isValid` : boolean**

  Returns `true` if there are no `errors` (i.e the `errors` object is empty) and `false` otherwise.

- **`isSubmitting` : boolean**

  Returns `true` if submission is in progress and `false` otherwise.

- **`dirty` : boolean**

  Returns `true` if values are not deeply equal from initial values, `false` otherwise.

## Useful Resources

- [Forms in React](https://reactjs.org/docs/forms.html)
- [Formik docs](https://formik.org/docs/tutorial)
- [Render Props](https://reactjs.org/docs/render-props.html)
- [Blog](https://blog.logrocket.com/react-reference-guide-render-props/) on render props

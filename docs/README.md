# Checkout Profile

This app contains a Profile Form, and a Profile Preview component, used in the checkout to
update the information inside the `orderForm`.

![image](https://user-images.githubusercontent.com/10223856/77474172-65c44c80-6df5-11ea-9709-88c163dcaeef.png)

## Usage

To use this app, first include it in your `manifest.json` dependencies.

```json
{
  "dependencies": {
    "vtex.checkout-profile": "0.x"
  }
}
```

> If your are using TypeScript, you may also want to run `vtex setup` after the step above

Then, you can import the component and use it

```jsx
import React from 'react'
import { ProfilePreview, ProfileForm } from 'vtex.checkout-profile'

const Form = ({ isPreviewMode = false }) => {
  if (isPreviewMode) {
    return (
      <ProfilePreview />
    )
  }

  return (
    // no need to pass in any props, as the component
    // uses all information provided by the `order-manager` app.
    <ProfileForm />
  )
}
```

Note that you need to have `OrderFormProvider` from `vtex.order-manager` app somewhere above this 
component in your tree.

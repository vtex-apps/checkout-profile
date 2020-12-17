📢 Use this project, [contribute](https://github.com/vtex-apps/checkout-profile) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Checkout Profile

> :warning: *Although ready to be installed, the Checkout Profile app is currently an **open-beta project**. Bear in mind that due to that status, you can expect an accelerated state of evolution.*

The Checkout Profile app provides a profile form component to be used on the checkout page to
update user information in the `orderForm` JSON.

## Configuration 

🚧 To be defined.

## Customization

🚧 To be defined.

<!-- DOCS-IGNORE:start -->
## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
<!-- DOCS-IGNORE:end -->

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

> If you are using TypeScript, you may also want to run `vtex setup` after the step above

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

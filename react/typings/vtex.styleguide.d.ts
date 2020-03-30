/* eslint-disable import/order */

import * as Styleguide from 'vtex.styleguide'

declare module 'vtex.styleguide' {
  import React from 'react'

  export const Input: React.FC

  export const Checkbox: React.FC

  export const Button: React.FC

  export const Dropdown: React.FC

  export const IconEdit: React.FC
}

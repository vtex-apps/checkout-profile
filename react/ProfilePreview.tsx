import React from 'react'
import { OrderForm } from 'vtex.order-manager'

const ProfilePreview: React.FC = () => {
  const { orderForm } = OrderForm.useOrderForm()

  if (!orderForm.clientProfileData) {
    return null
  }

  const {
    clientProfileData: { firstName, lastName, email },
  } = orderForm

  const fullName = firstName && lastName && `${firstName} ${lastName}`

  return (
    <div className="flex flex-column c-on-base">
      {fullName && <span className="db mb4 lh-title">{fullName}</span>}
      <span className="db lh-title">{email}</span>
    </div>
  )
}

export default ProfilePreview

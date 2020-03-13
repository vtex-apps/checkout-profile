import React from 'react'
import { OrderForm } from 'vtex.order-manager'

const ProfilePreview: React.FC = () => {
  const { orderForm } = OrderForm.useOrderForm()

  if (!orderForm.clientProfileData) {
    return null
  }

  return (
    <div className="flex flex-column">
      <span className="c-base lh-title">
        {orderForm.clientProfileData.firstName}{' '}
        {orderForm.clientProfileData.lastName} <br />
        {orderForm.clientProfileData.email}
      </span>
    </div>
  )
}

export default ProfilePreview

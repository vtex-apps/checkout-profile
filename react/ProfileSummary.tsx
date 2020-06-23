import React from 'react'
import { OrderForm } from 'vtex.order-manager'
import { FormattedMessage } from 'react-intl'
import { ButtonPlain } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

const ProfileSummary: React.FC = () => {
  const { rootPath = '' } = useRuntime()
  const { orderForm } = OrderForm.useOrderForm()

  if (!orderForm.clientProfileData) {
    return null
  }

  const {
    clientProfileData: { firstName, lastName, email },
  } = orderForm

  const fullName = firstName && lastName && `${firstName} ${lastName}`

  return (
    <div className="flex flex-column c-muted-1">
      <div className="mb4 lh-title flex items-center">
        {fullName && <span>{fullName}</span>}{' '}
        {(!orderForm.canEditData || orderForm.loggedIn) && (
          <div className="ml4">
            <ButtonPlain
              href={`${rootPath}/checkout/changeToAnonymousUser/${orderForm.id}`}
            >
              <FormattedMessage id="store/checkout-profile-logout-label" />
            </ButtonPlain>
          </div>
        )}
      </div>
      <span className="db lh-title">{email}</span>
    </div>
  )
}

export default ProfileSummary

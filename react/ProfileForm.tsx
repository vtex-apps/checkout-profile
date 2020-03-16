import React, { useState, useCallback, useRef, useReducer } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { OrderForm } from 'vtex.order-manager'
import {
  Input,
  Checkbox,
  Button,
  ButtonPlain,
  IconEdit,
  Dropdown,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import { PHONE_COUNTRY_CODES } from './modules/countries'

const DOCUMENT_OPTIONS = [
  {
    value: 'cpf',
    label: 'CPF',
  },
]

const PHONE_OPTIONS = PHONE_COUNTRY_CODES.map(
  ({ countryCode, countryISO3 }) => ({
    label: `+${countryCode}`,
    value: countryISO3,
  })
)

const messages = defineMessages({
  emailInfo: {
    id: 'store/checkout-profile-email-info',
  },
  firstNameLabel: {
    id: 'store/checkout-profile-first-name-label',
  },
  lastNameLabel: {
    id: 'store/checkout-profile-last-name-label',
  },
  phoneLabel: {
    id: 'store/checkout-profile-phone-label',
  },
  documentLabel: {
    id: 'store/checkout-profile-document-label',
  },
  saveInfoLabel: {
    id: 'store/checkout-profile-save-info-label',
  },
  newsletterOptinLabel: {
    id: 'store/checkout-profile-newsletter-optin-label',
  },
  continueButtonLabel: {
    id: 'store/checkout-profile-continue-button-label',
  },
})

interface ProfileState {
  firstName: string
  lastName: string
  phoneCode: string
  phoneNumber: string
  documentType: string
  document: string
}

type ProfileAction = { [field in keyof ProfileState]?: string }

const profileReducer = (
  profile: ProfileState,
  action: ProfileAction
): ProfileState => {
  return { ...profile, ...action }
}

const ProfileForm: React.FC = () => {
  const { orderForm } = OrderForm.useOrderForm()
  const { navigate } = useRuntime()
  const intl = useIntl()

  const [persistInfo, setPersistInfo] = useState(false)
  const [optinNewsletter, setOptinNewsletter] = useState(false)

  const [profileData, setProfileData] = useReducer<
    React.Reducer<ProfileState, ProfileAction>
  >(profileReducer, {
    firstName: orderForm.clientProfileData?.firstName ?? '',
    lastName: orderForm.clientProfileData?.lastName ?? '',
    phoneCode: 'BRA',
    phoneNumber: orderForm.clientProfileData?.phone ?? '',
    documentType: 'cpf',
    document: orderForm.clientProfileData?.document ?? '',
  })

  const email = useRef(orderForm.clientProfileData?.email)

  const handleEditEmail = useCallback(() => {
    navigate({ page: 'store.checkout.identification' })
  }, [navigate])

  const handlePersistInfoChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setPersistInfo(evt.target.checked)
  }

  const handleOptinNewsletterChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setOptinNewsletter(evt.target.checked)
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setProfileData({
      [evt.target.name]: evt.target.value,
    })
  }

  return (
    <>
      <div>
        <span className="t-body fw6 flex items-center">
          {intl.formatMessage(messages.emailInfo)}{' '}
          <div className="dib ml4">
            <ButtonPlain onClick={handleEditEmail}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        </span>
        <span className="dib mt3">{email.current}</span>
      </div>
      <form className="mt6">
        <div className="flex flex-column flex-row-ns">
          <div className="w-100">
            <Input
              label={intl.formatMessage(messages.firstNameLabel)}
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="w-100 mt6 mt0-ns ml0 ml5-ns">
            <Input
              label={intl.formatMessage(messages.lastNameLabel)}
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-column flex-row-ns mt6">
          <div className="w-100">
            <Input
              prefix={
                <Dropdown
                  options={PHONE_OPTIONS}
                  value={profileData.phoneCode}
                  name="phoneCode"
                  onChange={handleChange}
                />
              }
              label={intl.formatMessage(messages.phoneLabel)}
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="w-100 mt6 mt0-ns ml0 ml5-ns">
            <Input
              prefix={
                <Dropdown
                  options={DOCUMENT_OPTIONS}
                  value={profileData.documentType}
                  name="documentType"
                  onChange={handleChange}
                />
              }
              label={intl.formatMessage(messages.documentLabel)}
              name="document"
              value={profileData.document}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mv7">
          {orderForm.userProfileId == null && (
            <Checkbox
              label={intl.formatMessage(messages.saveInfoLabel)}
              checked={persistInfo}
              onChange={handlePersistInfoChange}
            />
          )}
          <div className="mt6">
            <Checkbox
              label={intl.formatMessage(messages.newsletterOptinLabel)}
              checked={optinNewsletter}
              onChange={handleOptinNewsletterChange}
            />
          </div>
        </div>
        <Button size="large" block>
          {intl.formatMessage(messages.continueButtonLabel)}
        </Button>
      </form>
    </>
  )
}

export default ProfileForm

import React, { useState, useCallback, useRef, useReducer } from 'react'
import { defineMessages, useIntl, MessageDescriptor } from 'react-intl'
import { OrderForm } from 'vtex.order-manager'
import { OrderProfile } from 'vtex.order-profile'
import {
  Input,
  Checkbox,
  Button,
  ButtonPlain,
  IconEdit,
  Dropdown,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { PhoneField, PhoneContext, rules } from 'vtex.phone-field'

const DOCUMENT_OPTIONS = [
  {
    value: 'cpf',
    label: 'CPF',
  },
]

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
  fieldRequiredMessage: {
    id: 'store/checkout-profile-field-required-message',
  },
  invalidPhoneMessage: {
    id: 'store/checkout-profile-invalid-phone-message',
  },
})

type FieldState<T> = { value: T; error?: MessageDescriptor; isValid?: boolean }

type ProfileState = {
  firstName: FieldState<string>
  lastName: FieldState<string>
  phone: FieldState<string>
  documentType: FieldState<string>
  document: FieldState<string>
}

type ProfileAction = {
  type: 'update'
  field: keyof ProfileState
  value?: string
  error?: MessageDescriptor
  isValid?: boolean
}

const profileReducer = (
  profile: ProfileState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case 'update': {
      const { field, type, ...fieldData } = action
      return {
        ...profile,
        [action.field]: {
          ...profile[action.field],
          ...fieldData,
        },
      }
    }
    default: {
      return profile
    }
  }
}

const ProfileForm: React.FC = () => {
  const { orderForm } = OrderForm.useOrderForm()
  const { setOrderProfile } = OrderProfile.useOrderProfile()
  const { navigate } = useRuntime()
  const intl = useIntl()

  const [loading, setLoading] = useState(false)

  const [persistInfo, setPersistInfo] = useState(false)
  const [optinNewsletter, setOptinNewsletter] = useState(false)

  const [profileData, dispatch] = useReducer<
    React.Reducer<ProfileState, ProfileAction>
  >(profileReducer, {
    firstName: { value: orderForm.clientProfileData?.firstName ?? '' },
    lastName: { value: orderForm.clientProfileData?.lastName ?? '' },
    phone: { value: orderForm.clientProfileData?.phone ?? '' },
    documentType: { value: 'cpf' },
    document: { value: orderForm.clientProfileData?.document ?? '' },
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
    dispatch({
      type: 'update',
      field: evt.target.name as keyof ProfileState,
      value: evt.target.value,
    })
  }

  const validateField = useCallback(
    (name: keyof ProfileState, value: string) => {
      if (!value) {
        dispatch({
          type: 'update',
          field: name,
          isValid: false,
          error: messages.fieldRequiredMessage,
        })
      } else {
        dispatch({
          type: 'update',
          field: name,
          isValid: true,
          error: undefined,
        })
      }
    },
    []
  )

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = evt => {
    validateField(evt.target.name as keyof ProfileState, evt.target.value)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async evt => {
    evt.preventDefault()

    if (Object.values(profileData).some(({ isValid }) => !isValid)) {
      return
    }

    setLoading(true)

    const profileDataValues: {
      [field in keyof ProfileState]: ProfileState[field]['value']
    } = Object.keys(profileData).reduce(
      (profile, fieldName) => ({
        ...profile,
        [fieldName]: profileData[fieldName as keyof ProfileState].value,
      }),
      {} as any
    )

    const { success } = await setOrderProfile(profileDataValues)

    setLoading(false)

    if (success) {
      // yay
    }
  }

  const handlePhoneChange = ({
    value,
    isValid,
  }: {
    value: string
    isValid: boolean
  }) => {
    dispatch({
      type: 'update',
      field: 'phone',
      value,
      error: isValid ? undefined : messages.invalidPhoneMessage,
      isValid,
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
      <form className="mt6" onSubmit={handleSubmit}>
        <div className="flex flex-column flex-row-ns">
          <div className="w-100">
            <Input
              label={intl.formatMessage(messages.firstNameLabel)}
              name="firstName"
              value={profileData.firstName.value}
              errorMessage={
                profileData.firstName.error
                  ? intl.formatMessage(profileData.firstName.error)
                  : undefined
              }
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="w-100 mt6 mt0-ns ml0 ml5-ns">
            <Input
              label={intl.formatMessage(messages.lastNameLabel)}
              name="lastName"
              value={profileData.lastName.value}
              errorMessage={
                profileData.lastName.error
                  ? intl.formatMessage(profileData.lastName.error)
                  : undefined
              }
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
        <div className="flex flex-column flex-row-ns mt6">
          <div className="w-100">
            <PhoneContext.PhoneContextProvider rules={rules}>
              <PhoneField
                label={intl.formatMessage(messages.phoneLabel)}
                value={profileData.phone.value}
                onChange={handlePhoneChange}
                errorMessage={
                  profileData.phone.error
                    ? intl.formatMessage(profileData.phone.error)
                    : undefined
                }
              />
            </PhoneContext.PhoneContextProvider>
          </div>
          <div className="w-100 mt6 mt0-ns ml0 ml5-ns">
            <Input
              prefix={
                <Dropdown
                  options={DOCUMENT_OPTIONS}
                  value={profileData.documentType.value}
                  name="documentType"
                  onChange={handleChange}
                />
              }
              label={intl.formatMessage(messages.documentLabel)}
              name="document"
              value={profileData.document.value}
              errorMessage={
                profileData.document.error
                  ? intl.formatMessage(profileData.document.error)
                  : undefined
              }
              onChange={handleChange}
              onBlur={handleBlur}
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
        <Button
          size="large"
          type="submit"
          block
          disabled={loading}
          loading={loading}
        >
          {intl.formatMessage(messages.continueButtonLabel)}
        </Button>
      </form>
    </>
  )
}

export default ProfileForm

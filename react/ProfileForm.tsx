import React, {
  useState,
  useCallback,
  useRef,
  useReducer,
  useEffect,
} from 'react'
import { defineMessages, useIntl, MessageDescriptor } from 'react-intl'
import { OrderForm } from 'vtex.order-manager'
import { OrderProfile } from 'vtex.order-profile'
import { Input, Checkbox, Button, ButtonPlain, IconEdit } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { PhoneField, PhoneContext, rules } from 'vtex.phone-field'
import { DocumentField } from 'vtex.document-field'
import { Router } from 'vtex.checkout-container'

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
  invalidDocumentMessage: {
    id: 'store/checkout-profile-invalid-document-message',
  },
  submitErrorMessage: {
    id: 'store/checkout-profile-submit-error-message',
  },
})

type FieldState<T> = {
  value: T
  blur?: boolean
} & (
  | {
      error?: undefined
      isValid: true
    }
  | { error: MessageDescriptor; isValid: false }
)

type ProfileState = {
  firstName: FieldState<string>
  lastName: FieldState<string>
  phone: FieldState<string>
  documentType: FieldState<string>
  document: FieldState<string>
}

type ProfileAction = { field: keyof ProfileState } & (
  | {
      type: 'update'
      value: string
      isValid?: boolean
    }
  | {
      type: 'set_error'
      isValid: boolean
      error: MessageDescriptor | undefined
    }
  | { type: 'blur' }
  | { type: 'focus' }
)

const profileReducer = (
  profile: ProfileState,
  action: ProfileAction
): ProfileState => {
  const { field } = action
  switch (action.type) {
    case 'update': {
      const { value, isValid } = action
      const newField = {
        ...profile[field],
        value,
        isValid: isValid ?? profile[field].isValid,
      }

      return {
        ...profile,
        [field]: newField,
      }
    }
    case 'set_error': {
      const { error, isValid } = action
      return {
        ...profile,
        [field]: {
          ...profile[field],
          error,
          isValid,
        },
      }
    }
    case 'blur': {
      return {
        ...profile,
        [field]: {
          ...profile[field],
          blur: true,
        },
      }
    }
    case 'focus': {
      return {
        ...profile,
        [field]: { ...profile[field], focus: true },
      }
    }
    default: {
      return profile
    }
  }
}

const ProfileForm: React.FC = () => {
  const { orderForm } = OrderForm.useOrderForm()
  const {
    setOrderProfile,
    setClientPreferencesData,
  } = OrderProfile.useOrderProfile()
  const { navigate } = useRuntime()
  const intl = useIntl()
  const history = Router.useHistory()

  const [loading, setLoading] = useState(false)
  const [submitFailed, setSubmitFailed] = useState(false)
  const phoneContainerRef = useRef<HTMLDivElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const [persistInfo, setPersistInfo] = useState(false)
  const [optInNewsletter, setOptInNewsletter] = useState(
    orderForm.clientPreferencesData?.optInNewsletter ?? false
  )

  const [profileData, dispatch] = useReducer<
    React.Reducer<ProfileState, ProfileAction>
  >(profileReducer, {
    firstName: {
      value: orderForm.clientProfileData?.firstName ?? '',
      isValid: true,
    },
    lastName: {
      value: orderForm.clientProfileData?.lastName ?? '',
      isValid: true,
    },
    phone: { value: orderForm.clientProfileData?.phone ?? '', isValid: true },
    documentType: {
      value: orderForm.clientProfileData?.documentType ?? 'cpf',
      isValid: true,
    },
    document: {
      value: orderForm.clientProfileData?.document ?? '',
      isValid: true,
    },
  })

  const emailRef = useRef(orderForm.clientProfileData?.email)

  const validateField = useCallback(
    <T extends any>(fieldName: keyof ProfileState, field: FieldState<T>) => {
      if (!field.value && (field.isValid ?? true)) {
        dispatch({
          type: 'set_error',
          field: fieldName,
          isValid: false,
          error: messages.fieldRequiredMessage,
        })
      }
    },
    []
  )

  useEffect(() => {
    Object.entries(profileData).forEach(([fieldName, field]) =>
      validateField(fieldName as keyof ProfileState, field)
    )
  }, [profileData, validateField])

  const handleEditEmail = useCallback(() => {
    navigate({ page: 'store.checkout.identification' })
  }, [navigate])

  const handlePersistInfoChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setPersistInfo(evt.target.checked)
  }

  const handleOptinNewsletterChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setOptInNewsletter(evt.target.checked)
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    dispatch({
      type: 'update',
      field: evt.target.name as keyof ProfileState,
      value: evt.target.value,
      isValid: evt.target.value.length > 0,
    })
  }

  const handleDocumentChange = ({
    document,
    documentType,
    isValid,
  }: {
    document: string
    documentType: string
    isValid: boolean
  }) => {
    dispatch({
      type: 'update',
      field: 'document',
      value: document,
      isValid,
    })

    dispatch({
      type: 'update',
      field: 'documentType',
      value: documentType,
    })

    if (!isValid) {
      dispatch({
        type: 'set_error',
        field: 'document',
        isValid: false,
        error:
          document.length > 0
            ? messages.invalidDocumentMessage
            : messages.fieldRequiredMessage,
      })
    }
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = evt => {
    dispatch({
      type: 'blur',
      field: evt.target.name as keyof ProfileState,
    })
  }

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = evt => {
    dispatch({
      type: 'focus',
      field: evt.target.name as keyof ProfileState,
    })
  }

  const handlePhoneBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    // this timeout is needed because the phone field component focus
    // the listbox button after the change handler, so we need to wait
    // for the next tick when the focus has been potentially changed to it
    setTimeout(() => {
      if (
        document.activeElement == null ||
        // consider that the listbox is also our "input", so we won't trigger
        // the error message if the user is selecting the country calling code
        (document.activeElement !== phoneInputRef.current &&
          !document.activeElement.matches('[data-reach-listbox-list=""]') &&
          !(
            phoneContainerRef.current!.compareDocumentPosition(
              document.activeElement
            ) & Node.DOCUMENT_POSITION_CONTAINED_BY
          ))
      ) {
        dispatch({
          type: 'blur',
          field: 'phone',
        })
      }
    }, 0)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async evt => {
    evt.preventDefault()

    setSubmitFailed(false)

    if (Object.values(profileData).some(({ isValid }) => !isValid)) {
      // send blur event to all fields so it's clear to the user which
      // fields are in an invalid state.
      Object.keys(profileData).forEach(field =>
        dispatch({ type: 'blur', field: field as keyof ProfileState })
      )
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

    try {
      const [
        { success: profileUpdateSuccess },
        { success: clientPreferencesUpdateSuccess },
      ] = await Promise.all([
        setOrderProfile({
          ...profileDataValues,
          email: emailRef.current,
        }),
        setClientPreferencesData({ optInNewsletter }),
      ])

      if (profileUpdateSuccess && clientPreferencesUpdateSuccess) {
        history.push('/shipping')
      } else {
        setSubmitFailed(true)
      }
    } catch (err) {
      setSubmitFailed(true)
    } finally {
      setLoading(false)
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
      isValid,
    })

    if (!isValid) {
      dispatch({
        type: 'set_error',
        field: 'phone',
        isValid: false,
        error: messages.invalidPhoneMessage,
      })
    }
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
        <span className="dib mt3">{emailRef.current}</span>
      </div>
      <form className="mt6" onSubmit={handleSubmit}>
        <div className="flex flex-column flex-row-ns">
          <div className="w-100">
            <Input
              label={intl.formatMessage(messages.firstNameLabel)}
              name="firstName"
              value={profileData.firstName.value}
              errorMessage={
                (profileData.firstName.blur &&
                  !profileData.firstName.isValid &&
                  intl.formatMessage(profileData.firstName.error)) ||
                undefined
              }
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          </div>
          <div className="w-100 mt6 mt0-ns ml0 ml5-ns">
            <Input
              label={intl.formatMessage(messages.lastNameLabel)}
              name="lastName"
              value={profileData.lastName.value}
              errorMessage={
                (profileData.lastName.blur &&
                  !profileData.lastName.isValid &&
                  intl.formatMessage(profileData.lastName.error)) ||
                undefined
              }
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          </div>
        </div>
        <div className="flex flex-column flex-row-ns mt6">
          <div className="w-100" ref={phoneContainerRef}>
            <PhoneContext.PhoneContextProvider rules={rules}>
              <PhoneField
                ref={phoneInputRef}
                label={intl.formatMessage(messages.phoneLabel)}
                value={profileData.phone.value}
                name="phone"
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                onFocus={handleFocus}
                errorMessage={
                  (profileData.phone.blur &&
                    !profileData.phone.isValid &&
                    intl.formatMessage(profileData.phone.error)) ||
                  undefined
                }
              />
            </PhoneContext.PhoneContextProvider>
          </div>
          <div className="w-100 mt6 mt0-ns ml0 ml5-ns">
            <DocumentField
              document={profileData.document.value}
              documentType={profileData.documentType.value}
              label={intl.formatMessage(messages.documentLabel)}
              name="document"
              errorMessage={
                (profileData.document.blur &&
                  !profileData.document.isValid &&
                  intl.formatMessage(profileData.document.error)) ||
                undefined
              }
              onChange={handleDocumentChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
          </div>
        </div>
        <div className="mv7">
          {orderForm.userProfileId == null && (
            <Checkbox
              id="save-personal-info"
              label={intl.formatMessage(messages.saveInfoLabel)}
              checked={persistInfo}
              onChange={handlePersistInfoChange}
            />
          )}
          <div className="mt6">
            <Checkbox
              id="optin-newsletter"
              label={intl.formatMessage(messages.newsletterOptinLabel)}
              checked={optInNewsletter}
              onChange={handleOptinNewsletterChange}
            />
          </div>
        </div>
        <Button
          size="large"
          type="submit"
          block
          disabled={loading}
          isLoading={loading}
        >
          <span className="f5">
            {intl.formatMessage(messages.continueButtonLabel)}
          </span>
        </Button>
        {submitFailed && (
          <span className="dib mt5 t-auxiliary c-danger">
            {intl.formatMessage(messages.submitErrorMessage)}
          </span>
        )}
      </form>
    </>
  )
}

export default ProfileForm

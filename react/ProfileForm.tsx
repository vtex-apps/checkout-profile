import React, { useState, useCallback } from 'react'
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

const DOCUMENT_OPTIONS = [
  {
    value: 'cpf',
    label: 'CPF',
  },
]

const PHONE_OPTIONS = [
  {
    value: 'BRA',
    label: '+55',
  },
]

const ProfileForm: React.FC = () => {
  const { orderForm } = OrderForm.useOrderForm()
  const { navigate } = useRuntime()

  const [documentType, setDocumentType] = useState('cpf')
  const [phoneCode, setPhoneCode] = useState('BRA')

  const [persistInfo, setPersistInfo] = useState(false)
  const [optinNewsletter, setOptinNewsletter] = useState(false)

  const [fullName, setFullName] = useState(() =>
    orderForm.clientProfileData
      ? `${orderForm.clientProfileData.firstName} ${orderForm.clientProfileData.lastName}`
      : ''
  )
  const [phoneNumber, setPhoneNumber] = useState(
    orderForm.clientProfileData?.phone ?? ''
  )
  const [document, setDocument] = useState(
    orderForm.clientProfileData?.document ?? ''
  )

  const handleEditEmail = useCallback(() => {
    navigate({ page: 'store.checkout.identification' })
  }, [navigate])

  const handlePersistInfoChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setPersistInfo(evt.target.checked)
  }

  const handleOptinNewsletterChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setOptinNewsletter(evt.target.checked)
  }

  const handleFullNameChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setFullName(evt.target.value)
  }

  const handlePhoneCodeChange: React.ChangeEventHandler<HTMLSelectElement> = evt => {
    setPhoneCode(evt.target.value)
  }

  const handleDocumentTypeChange: React.ChangeEventHandler<HTMLSelectElement> = evt => {
    setDocumentType(evt.target.value)
  }

  const handleDocumentChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setDocument(evt.target.value)
  }

  const handlePhoneNumberChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setPhoneNumber(evt.target.value)
  }

  return (
    <>
      <div>
        <span className="t-body b flex items-center">
          Fill info for{' '}
          <div className="dib ml4">
            <ButtonPlain onClick={handleEditEmail}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        </span>
        <span className="dib mt3">{orderForm.clientProfileData.email}</span>
      </div>
      <form className="mt6">
        <Input
          label="Full name"
          value={fullName}
          onChange={handleFullNameChange}
        />
        <div className="flex flex-column flex-row-ns mt6">
          <div className="w-100">
            <Input
              prefix={
                <Dropdown
                  options={PHONE_OPTIONS}
                  value={phoneCode}
                  onChange={handlePhoneCodeChange}
                />
              }
              label="Phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </div>
          <div className="w-100 ml0 ml5-ns">
            <Input
              prefix={
                <Dropdown
                  options={DOCUMENT_OPTIONS}
                  value={documentType}
                  onChange={handleDocumentTypeChange}
                />
              }
              label="Document"
              value={document}
              onChange={handleDocumentChange}
            />
          </div>
        </div>
        <div className="mv7">
          <Checkbox
            label="Save my info for future purchases."
            checked={persistInfo}
            onChange={handlePersistInfoChange}
          />
          <div className="mt6">
            <Checkbox
              label="I want to receive the newsletter."
              checked={optinNewsletter}
              onChange={handleOptinNewsletterChange}
            />
          </div>
        </div>
        <Button size="large" block>
          Continue
        </Button>
      </form>
    </>
  )
}

export default ProfileForm

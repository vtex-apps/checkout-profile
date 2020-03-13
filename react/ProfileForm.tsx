import React, { useState } from 'react'
import { OrderForm } from 'vtex.order-manager'
import {
  Input,
  Checkbox,
  Button,
  ButtonPlain,
  IconEdit,
  Dropdown,
} from 'vtex.styleguide'

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

  const [documentType, setDocumentType] = useState('cpf')
  const [phoneCode, setPhoneCode] = useState('BRA')

  return (
    <>
      <div>
        <span className="t-body b">
          Fill info for{' '}
          <ButtonPlain>
            <IconEdit solid />
          </ButtonPlain>
        </span>
        <br />
        <span className="dib mt3">{orderForm.clientProfileData.email}</span>
      </div>
      <form className="mt6">
        <Input label="Full name" block />
        <div className="flex flex-column flex-row-ns mt6">
          <div className="w-100">
            <Input
              prefix={
                <Dropdown
                  options={PHONE_OPTIONS}
                  value={phoneCode}
                  onChange={({
                    target: { value },
                  }: React.ChangeEvent<HTMLSelectElement>) =>
                    setPhoneCode(value)
                  }
                />
              }
              label="Phone number"
            />
          </div>
          <div className="w-100 ml0 ml5-ns">
            <Input
              prefix={
                <Dropdown
                  options={DOCUMENT_OPTIONS}
                  value={documentType}
                  onChange={({
                    target: { value },
                  }: React.ChangeEvent<HTMLSelectElement>) =>
                    setDocumentType(value)
                  }
                />
              }
              label="Document"
            />
          </div>
        </div>
        <div className="mv7">
          <Checkbox label="Save my info for future purchases." />
          <div className="mt6">
            <Checkbox label="I want to receive the newsletter." />
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

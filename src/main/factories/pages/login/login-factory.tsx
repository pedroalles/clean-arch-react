import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { AxiosHttpClient } from '@/infra/http/axios-http-client/axios-http-client'
import { Login } from '@/presentation/pages'
import { EmailValidation } from '@/validation/validators/email/email-validation'
import { MinLengthValidation } from '@/validation/validators/min-length/min-length-validation'
import { RequiredFieldValidation } from '@/validation/validators/required-field/required-field-validation'
import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import { FC } from 'react'

export const makeLogin : FC = () => {
  const url = 'http://fordevs.herokuapp.com/api/login'
  const axiosHttpClient = new AxiosHttpClient()
  const remoteAuthentication = new RemoteAuthentication(url, axiosHttpClient)
  const validationComposite = new ValidationComposite([
    new RequiredFieldValidation('email'),
    new EmailValidation('email'),
    new RequiredFieldValidation('password'),
    new MinLengthValidation('password', 5)
  ])
  return (
    <Login
      authentication={remoteAuthentication}
      validation={validationComposite}
    />
  )
}

import { Login } from '@/presentation/pages'
import { FC } from 'react'
import { makeRemoteAuthentication } from '../../usecases/authentication/remote-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLogin : FC = () => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
    />
  )
}

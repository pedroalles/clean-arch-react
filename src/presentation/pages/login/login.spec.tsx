// import React from 'react'
import { render } from '@testing-library/react'
import Login from './login'

describe('Login Component', () => {
  it('should start with initial state', () => {
    const { getByTestId } = render(<Login />)
    const errorWrap = getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe('Required Field')
    expect(emailStatus.textContent).toBe('🔴')
    const passwordStatus = getByTestId('password-status')
    expect(passwordStatus.title).toBe('Required Field')
    expect(passwordStatus.textContent).toBe('🔴')
  })
})

// import React from 'react'
import { Validation } from '@/presentation/protocols/validation'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'

class ValidationSpy implements Validation {
  errorMessage: string
  input: object

  validate (input: object): string {
    this.input = input
    return this.errorMessage
  }
}

type SutTypes ={
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy}/>)
  return {
    sut,
    validationSpy
  }
}

describe('Login Component', () => {
  afterEach(cleanup)

  it('should start with initial state', () => {
    const { sut: { getByTestId } } = makeSut()
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

  it('should call Validation with correct values', async () => {
    const { sut: { getByTestId }, validationSpy } = makeSut()
    const emailInput = getByTestId('email')
    fireEvent.input(emailInput, { target: { value: 'any_email' } })
    expect(validationSpy.input).toEqual({
      email: 'any_email'
    })
  })
})

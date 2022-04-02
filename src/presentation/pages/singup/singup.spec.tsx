import { Helper } from '@/presentation/test'
import { render, RenderResult } from '@testing-library/react'
import SingUp from './singup'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(<SingUp/>)
  return {
    sut
  }
}

describe('Singup Component', () => {
  it('should start with initial state', () => {
    const validationError = 'Required Field'
    const { sut: { getByTestId } } = makeSut()
    Helper.testChildCount(getByTestId, 'error-wrap', 0)
    Helper.testButtonStatus(getByTestId, 'submit', true)
    Helper.testStatusForField(getByTestId, 'name', validationError)
    Helper.testStatusForField(getByTestId, 'email', validationError)
    Helper.testStatusForField(getByTestId, 'password', validationError)
    Helper.testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })
})

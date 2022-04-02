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

const testChildCount = (getByTestId, fieldName: string, count: number):void => {
  const el = getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

const testButtonStatus = (getByTestId, elementTestId: string, isDisabled: Boolean):void => {
  const button = getByTestId(elementTestId) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testStatusForField = (getByTestId, fieldName: string, validationError?:string):void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'ok')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Singup Component', () => {
  it('should start with initial state', () => {
    const validationError = 'Required Field'
    const { sut: { getByTestId } } = makeSut()
    testChildCount(getByTestId, 'error-wrap', 0)
    testButtonStatus(getByTestId, 'submit', true)
    testStatusForField(getByTestId, 'name', validationError)
    testStatusForField(getByTestId, 'email', validationError)
    testStatusForField(getByTestId, 'password', validationError)
    testStatusForField(getByTestId, 'passwordConfirmation', validationError)
  })
})

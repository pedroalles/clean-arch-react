import { fireEvent } from '@testing-library/react'
import faker from 'faker'

export const testChildCount = (getByTestId, fieldName: string, count: number):void => {
  const el = getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

export const testButtonStatus = (getByTestId, elementTestId: string, isDisabled: Boolean):void => {
  const button = getByTestId(elementTestId) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testStatusForField = (getByTestId, fieldName: string, validationError?:string):void => {
  const fieldStatus = getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'ok')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (getByTestId, fieldName: string, value = faker.random.word()): void => {
  const emailInput = getByTestId(fieldName)
  fireEvent.input(emailInput, { target: { value } })
}

export const testElementExists = (getByTestId, elementTestId: string):void => {
  const element = getByTestId(elementTestId)
  expect(element).toBeTruthy()
}

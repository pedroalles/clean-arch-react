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

import { FC, useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'

type Props = {
  text: string
}

const SubmitButton: FC<Props> = ({ text }: Props) => {
  const { state } = useContext(Context)
  return (<button data-testid="submit" type="submit" disabled={state.isInvalidForm}>{text}</button>)
}

export default SubmitButton

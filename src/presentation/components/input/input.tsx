import { ChangeEvent, DetailedHTMLProps, FC, InputHTMLAttributes, useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: FC<Props> = (props: Props) => {
  const { setState, errorState } = useContext(Context)
  const error = errorState[props.name]

  const handleChange = (event: ChangeEvent<HTMLInputElement>):void => {
    setState(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  const getStatus = (): string => {
    return error ? '🔴' : '🟢'
  }
  const getTitle = (): string => {
    return error || 'ok'
  }
  return (
    <div className={Styles.inputWrap}>
      <input {...props} data-testid={props.name} onChange={handleChange}/>
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status} onChange={handleChange}>{getStatus()}</span>
  </div>
  )
}

export default Input

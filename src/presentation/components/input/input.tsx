import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'

import Styles from './input-styles.scss'

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: FC<Props> = (props: Props) => {
  return (
    <div className={Styles.inputWrap}>
      <input {...props} />
      <span className={Styles.status}>🔴</span>
  </div>
  )
}

export default Input

import { FC } from 'react'
import Spinner from '../spinner/spinner'

import Styles from './form-status-styles.scss'

const FormStatus: FC = () => {
  return (
    <div className={Styles.errorWrap}>
      <Spinner className={Styles.spinner} />
      <span className={Styles.error}>Error</span>
  </div>
  )
}

export default FormStatus

import { HTMLAttributes, FC } from 'react'

import Styles from './spinner-styles.scss'

type Props = HTMLAttributes<HTMLElement>

const Spinner: FC<Props> = (props: Props) => {
  return (
    <div className={[Styles.spinner, props.className].join(' ')}>
      <div /><div/><div/>
    </div>
  )
}

export default Spinner

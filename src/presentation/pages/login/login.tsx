import { FC, useEffect, useState } from 'react'
import { Header, Input, FormStatus, Footer } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const Login: FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: ''
  })
  const [errorState] = useState({
    email: 'Required Field',
    password: 'Required Field',
    main: ''
  })

  useEffect(() => {
    validation.validate({ email: state.email })
  }, [state.email])
  useEffect(() => {
    validation.validate({ password: state.password })
  }, [state.password])

  return (
    <div className={Styles.login}>
    <Header />

    <Context.Provider value={{ state, setState, errorState }}>
    <form className={Styles.form}>
      <h2>Login</h2>
      <Input data-testid="email" type="email" name="email" placeholder="Enter your e-mail" />
      <Input type="password" name="password" placeholder="Enter your password"/>
      <button className={Styles.submit} data-testid="submit" type="submit" disabled>Enter</button>
      <span className={Styles.link}>Sing Up</span>
      <FormStatus />
    </form>
    </Context.Provider>

    <Footer />
  </div>
  )
}

export default Login

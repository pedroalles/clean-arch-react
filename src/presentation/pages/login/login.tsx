import { FC, useState } from 'react'
import { Header, Input, FormStatus, Footer } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

const Login: FC = () => {
  const [state] = useState({
    isLoading: false
  })
  const [errorState] = useState({
    email: 'Required Field',
    password: 'Required Field',
    main: ''
  })
  return (
    <div className={Styles.login}>
    <Header />

    <Context.Provider value={{ state, errorState }}>
    <form className={Styles.form}>
      <h2>Login</h2>
      <Input data-testid="email" type="email" name="email" placeholder="Enter your e-mail"/>
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

import { FC, useState } from 'react'
import { Header, Input, FormStatus, Footer } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type StateProps = {
  isLoading: Boolean
  errorMessage: string
}

const Login: FC = () => {
  const [state] = useState<StateProps>({
    isLoading: false,
    errorMessage: ''
  })
  return (
    <div className={Styles.login}>
    <Header />

    <Context.Provider value={state}>
    <form className={Styles.form}>
      <h2>Login</h2>
      <Input type="email" name="email" placeholder="Enter your e-mail"/>
      <Input type="password" name="password" placeholder="Enter your password"/>
      <button type="submit">Enter</button>
      <span className={Styles.link}>Sing Up</span>
      <FormStatus />
    </form>
    </Context.Provider>

    <Footer />
  </div>
  )
}

export default Login

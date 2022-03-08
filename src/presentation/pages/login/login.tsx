import { FC } from 'react'
import { Header, Input, FormStatus, Footer } from '@/presentation/components'
import Styles from './login-styles.scss'

const Login: FC = () => (
  <div className={Styles.login}>
    <Header />
    <form className={Styles.form}>
      <h2>Login</h2>
      <Input type="email" name="email" placeholder="Enter your e-mail"/>
      <Input type="password" name="password" placeholder="Enter your password"/>
      <button type="submit">Enter</button>
      <span className={Styles.link}>Sing Up</span>
      <FormStatus />
    </form>
    <Footer />
  </div>
)

export default Login

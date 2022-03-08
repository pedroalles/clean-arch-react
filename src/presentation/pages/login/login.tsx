import Header from '@/presentation/components/header/header'
import Footer from '@/presentation/components/footer/footer'
import Spinner from '@/presentation/components/spinner/spinner'
import Input from '@/presentation/components/input/input'

import { FC } from 'react'
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
      <div className={Styles.errorWrap}>
        <Spinner className={Styles.spinner} />
        <span className={Styles.error}>Error</span>
      </div>
    </form>
    <Footer />
  </div>
)

export default Login

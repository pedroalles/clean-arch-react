import Header from '@/presentation/components/header/header'
import Footer from '@/presentation/components/footer/footer'
import Spinner from '@/presentation/components/spinner/spinner'

import { FC } from 'react'
import Styles from './login-styles.scss'

const Login: FC = () => (
  <div className={Styles.login}>
    <Header />
    <form className={Styles.form}>

      <h2>Login</h2>

      <div className={Styles.inputWrap}>
        <input type="email" name="email" placeholder="Enter your e-mail" />
        <span className={Styles.status}>🔴</span>
      </div>

      <div className={Styles.inputWrap}>
        <input type="password" name="password" placeholder="Enter your password" />
        <span className={Styles.status}>🔴</span>
      </div>

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

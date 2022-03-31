import { FC } from 'react'
import { Header, Input, FormStatus, Footer } from '@/presentation/components'
import Styles from './singup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { Link } from 'react-router-dom'

const SingUp: FC = () => {
  return (
    <div className={Styles.singup}>
    <Header />
    <Context.Provider value={{ state: {}, errorState: {} }}>
    <form className={Styles.form}>
      <h2>Criar Conta</h2>
      <Input type="text" name="name" placeholder="Enter your name" />
      <Input type="email" name="email" placeholder="Enter your e-mail" />
      <Input type="password" name="password" placeholder="Enter your password"/>
      <Input type="password" name="passwordConfirmation" placeholder="Confirm the password"/>
      <button className={Styles.submit} type="submit">Enter</button>
      <Link data-testid="singup" to="/login" className={Styles.link}>Back to login</Link>
      <FormStatus />
    </form>
    </Context.Provider>

    <Footer />
  </div>
  )
}

export default SingUp

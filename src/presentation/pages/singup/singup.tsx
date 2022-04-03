import { FC, useEffect, useState } from 'react'
import { Header, Input, FormStatus, Footer } from '@/presentation/components'
import Styles from './singup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { IValidation } from '@/presentation/protocols/validation'

type Props = {
  validation: IValidation
}

const SingUp: FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: ''
  })
  const [errorState, setErrorState] = useState({
    name: '',
    email: 'Required Field',
    password: 'Required Field',
    passwordConfirmation: 'Required Field',
    main: ''
  })

  useEffect(() => {
    setErrorState(prevState => ({
      ...prevState,
      name: validation.validate('name', state.name)
    }))
  }, [state.name])

  return (
    <div className={Styles.singup}>
    <Header />
    <Context.Provider value={{ state, setState, errorState }}>
    <form className={Styles.form}>
      <h2>Criar Conta</h2>
      <Input type="text" name="name" placeholder="Enter your name" />
      <Input type="email" name="email" placeholder="Enter your e-mail" />
      <Input type="password" name="password" placeholder="Enter your password"/>
      <Input type="password" name="passwordConfirmation" placeholder="Confirm the password"/>
      <button data-testid="submit" className={Styles.submit} type="submit" disabled>Enter</button>
      <span data-testid="singup" className={Styles.link}>Back to login</span>
      <FormStatus />
    </form>
    </Context.Provider>

    <Footer />
  </div>
  )
}

export default SingUp

import { FC, FormEvent, useEffect, useState } from 'react'
import { Header, Input, FormStatus, SubmitButton, Footer } from '@/presentation/components'
import Styles from './singup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { IValidation } from '@/presentation/protocols/validation'
import { IAddAccount, ISaveAccessToken } from '@/domain/usecases'
import { Link, useHistory } from 'react-router-dom'

type Props = {
  validation: IValidation
  addAccount: IAddAccount
  saveAccessToken : ISaveAccessToken
}

const SingUp: FC<Props> = ({ validation, addAccount, saveAccessToken }: Props) => {
  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    isInvalidForm: true,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  const [errorState, setErrorState] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    main: ''
  })

  useEffect(() => {
    const name = validation.validate('name', state.name)
    const email = validation.validate('email', state.email)
    const password = validation.validate('password', state.password)
    const passwordConfirmation = validation.validate('passwordConfirmation', state.passwordConfirmation)

    setState(prevState => ({
      ...prevState,
      isInvalidForm: !!name || !!email || !!password || !!passwordConfirmation
    }))

    setErrorState(prevState => ({
      ...prevState,
      name,
      email,
      password,
      passwordConfirmation
    }))
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.isInvalidForm) return
      setState(prevState => ({ ...prevState, isLoading: true }))
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })
      await saveAccessToken.save(account.accessToken)
      history.replace('/')
    } catch (error) {
      setErrorState(prevState => ({ ...prevState, main: error.message }))
      setState(prevState => ({ ...prevState, isLoading: false }))
    }
  }

  return (
    <div className={Styles.singup}>
    <Header />
    <Context.Provider value={{ state, setState, errorState }}>
    <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
      <h2>Criar Conta</h2>
      <Input type="text" name="name" placeholder="Enter your name" />
      <Input type="email" name="email" placeholder="Enter your e-mail" />
      <Input type="password" name="password" placeholder="Enter your password"/>
      <Input type="password" name="passwordConfirmation" placeholder="Confirm the password"/>
      <SubmitButton text='Cadastrar'/>
      <Link data-testid="login" to="/login" replace className={Styles.link}>Log In</Link>
      <FormStatus />
    </form>
    </Context.Provider>
    <Footer />
  </div>
  )
}

export default SingUp

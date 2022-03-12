import { FC, FormEvent, useEffect, useState } from 'react'
import { Header, Input, FormStatus, Footer } from '@/presentation/components'
import Styles from './login-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { IValidation } from '@/presentation/protocols/validation'
import { IAuthentication } from '@/domain/usecases'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
  validation: IValidation
  authentication: IAuthentication
}

const Login: FC<Props> = ({ validation, authentication }: Props) => {
  const navigate = useNavigate()
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: ''
  })
  const [errorState, setErrorState] = useState({
    email: '',
    password: '',
    main: ''
  })

  useEffect(() => {
    setErrorState(prevState => ({
      ...prevState,
      email: validation.validate('email', state.email)
    }))
  }, [state.email])

  useEffect(() => {
    setErrorState(prevState => ({
      ...prevState,
      password: validation.validate('password', state.password)
    }))
  }, [state.password])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || errorState.email || errorState.password) return
      setState(prevState => ({ ...prevState, isLoading: true }))
      const { email, password } = state
      const account = await authentication.auth({ email, password })
      localStorage.setItem('accessToken', account.accessToken)
      navigate('/', { replace: true })
    } catch (error) {
      setErrorState(prevState => ({ ...prevState, main: error.message }))
      setState(prevState => ({ ...prevState, isLoading: false }))
    }
  }
  return (
    <div className={Styles.login}>
    <Header />

    <Context.Provider value={{ state, setState, errorState }}>
    <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Input data-testid="email" type="email" name="email" placeholder="Enter your e-mail" />
      <Input type="password" name="password" placeholder="Enter your password"/>
      <button className={Styles.submit} data-testid="submit" type="submit" disabled={!!errorState.email || !!errorState.password}>Enter</button>
      <Link data-testid="singup" to="/singup" className={Styles.link}>Sing Up</Link>
      <FormStatus />
    </form>
    </Context.Provider>

    <Footer />
  </div>
  )
}

export default Login

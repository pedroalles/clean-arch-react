import { FC } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import '@/presentation/styles/global.scss'
import { SingUp } from '@/presentation/pages'

type Props = {
  makeLogin: FC
}

const Router:FC<Props> = ({ makeLogin }:Props) => {
  return (
    <BrowserRouter>
      <Switch>
      <Route path="/login" exact component={makeLogin} />
      <Route path="/singup" exact component={SingUp} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router

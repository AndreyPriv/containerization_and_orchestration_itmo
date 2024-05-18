import AuthForm from '../components/AuthForm/AuthForm'
import { withHeader } from '../components/hocs'

const Auth = () => {
	return <AuthForm />
}

export default withHeader(Auth)

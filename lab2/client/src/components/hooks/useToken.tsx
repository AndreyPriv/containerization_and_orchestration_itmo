import { $tokens, setAccessToken } from '../../lib/api'
import { useUnit } from '../../lib/state-engine'

export const useToken = () => {
	const token = useUnit($tokens)

	return {
		setToken: setAccessToken,
		token: token.access_token
	}
}

import axios, { AxiosResponse, AxiosError } from 'axios'
import { createEvent, createStore, persist } from './state-engine'

export const setAccessToken = createEvent<string | null>()
export const setRefreshToken = createEvent<string | null>()

export const $tokens = createStore<Tokens>({
	access_token: null,
	refresh_token: null
})
	.on(setAccessToken, (state, access_token) => ({ ...state, access_token }))
	.on(setRefreshToken, (state, refresh_token) => ({
		...state,
		refresh_token
	}))

persist({ store: $tokens, key: 'tokens' })

export const getAccessToken = (): string | null => {
	return $tokens.getState().access_token
}

export const getRefreshToken = (): string | null => {
	return $tokens.getState().refresh_token
}

export const logout = () => {
	setAccessToken(null)
	setRefreshToken(null)
}

// for multiple requests
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (
	error: AxiosError | null,
	token: string | null = null
) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token)
		}
	})

	failedQueue = []
}

axios.interceptors.response.use(
	function (response) {
		return response
	},
	function (error) {
		const originalRequest = error.config

		if (error.response.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise(function (resolve, reject) {
					failedQueue.push({ resolve, reject })
				})
					.then(token => {
						originalRequest.headers['Authorization'] = 'Bearer ' + token
						return axios(originalRequest)
					})
					.catch(err => {
						return Promise.reject(err)
					})
			}

			originalRequest._retry = true
			isRefreshing = true

			const refresh_token = getRefreshToken()
			return new Promise(function (resolve, reject) {
				axios
					.post<AuthResponse>('/api/auth/refresh', { refresh_token })
					.then(({ data }) => {
						setAccessToken(data.access_token)
						setRefreshToken(data.refresh_token)

						axios.defaults.headers.common['Authorization'] =
							'Bearer ' + data.access_token
						originalRequest.headers['Authorization'] =
							'Bearer ' + data.access_token
						processQueue(null, data.access_token)
						resolve(axios(originalRequest))
					})
					.catch((err: AxiosError) => {
						processQueue(err, null)
						reject(err)
					})
					.then(() => {
						isRefreshing = false
					})
			})
		}

		return Promise.reject(error)
	}
)

const handleError = (error: AxiosError) => {
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		console.error('Response Error:', error.response.data)
		console.error('Status Code:', error.response.status)
		console.error('Headers:', error.response.headers)
	} else if (error.request) {
		// The request was made but no response was received
		console.error('Request Error:', error.request)
	} else {
		// Something happened in setting up the request that triggered an Error
		console.error('General Error:', error.message)
	}

	return Promise.reject(error)
}

const axiosInstance = axios.create()

export const get = async <T>(url: string): Promise<T> => {
	try {
		const response: AxiosResponse<T> = await axiosInstance.get(url)
		return response.data
	} catch (error: any) {
		return handleError(error)
	}
}

export const post = async <T>(url: string, data: any): Promise<T> => {
	try {
		const response: AxiosResponse<T> = await axiosInstance.post(url, data)
		return response.data
	} catch (error: any) {
		return handleError(error)
	}
}

export const put = async <T>(url: string, data: any): Promise<T> => {
	try {
		const response: AxiosResponse<T> = await axiosInstance.put(url, data)
		return response.data
	} catch (error: any) {
		return handleError(error)
	}
}

type AuthResponse = {
	access_token: string
	refresh_token: string
}

type Tokens = {
	access_token: string | null
	refresh_token: string | null
}

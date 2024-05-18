import { useToggle } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import {
	TextInput,
	PasswordInput,
	Text,
	Paper,
	PaperProps,
	Button,
	Anchor,
	Stack
} from '@mantine/core'

import classes from './AuthForm.module.css'
import cx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { createEffect } from '../../lib/state-engine'
import { post } from '../../lib/api'
import { useEffect, useState } from 'react'
import * as api from '../../lib/api'
import { useToken } from '../hooks'

const loginFx = createEffect(async (body: Omit<AuthPayload, 'email'>) => {
	const data = await post<AuthResponse>('/api/auth/login', body)
	return data
})

const signupFx = createEffect(async (body: AuthPayload) => {
	const data = await post<AuthResponse>('/api/auth/signup', body)
	return data
})

const AuthForm = ({ className, ...props }: PaperProps) => {
	const navigate = useNavigate()
	const { token } = useToken()

	const [type, toggle] = useToggle(['login', 'register'])
	const [error, setError] = useState<string | null>(null)
	const form = useForm({
		initialValues: {
			username: '',
			password: '',
			email: ''
		},

		validate: {
			username: val =>
				val.length < 4
					? 'Имя пользователя должно содержать не менее 4 символов'
					: null,
			email: val =>
				type === 'login'
					? null
					: /^\S+@\S+$/.test(val)
					? null
					: 'Invalid email',
			password: val =>
				val.length < 4 ? 'Пароль должен содержать не менее 4 символов' : null
		}
	})

	const handleOnSubmit = async (e: AuthPayload) => {
		try {
			let result = type === 'login' ? await loginFx(e) : await signupFx(e)

			if (result.access_token) {
				api.setAccessToken(result.access_token)
				api.setRefreshToken(result.refresh_token)

				navigate('/')
			}
		} catch (error) {
			setError('Что-то пошло не так')
		}
	}

	useEffect(() => {
		if (token) {
			navigate('/')
		}
	}, [])

	return (
		<Paper
			display="flex"
			p="lg"
			className={cx(classes.auth, className)}
			{...props}
		>
			<Text size="lg" fw={500} tt="uppercase" ta="center">
				Добро пожаловать
			</Text>

			<form onSubmit={form.onSubmit(handleOnSubmit)}>
				<Stack>
					<TextInput
						required
						placeholder="Имя пользователя"
						value={form.values.username}
						onChange={event =>
							form.setFieldValue('username', event.currentTarget.value)
						}
						error={
							form.errors.username &&
							'Имя пользователя должно содержать не менее 4 символов'
						}
						radius="lg"
					/>
					{type === 'register' && (
						<TextInput
							required
							placeholder="hello@hahathon.dev"
							value={form.values.email}
							onChange={event =>
								form.setFieldValue('email', event.currentTarget.value)
							}
							error={form.errors.email && 'Invalid email'}
							radius="lg"
						/>
					)}
					<PasswordInput
						required
						placeholder="Пароль"
						value={form.values.password}
						onChange={event =>
							form.setFieldValue('password', event.currentTarget.value)
						}
						error={
							form.errors.password &&
							'Пароль должен содержать не менее 4 символов'
						}
						radius="lg"
					/>
				</Stack>

				<Stack mt="xl" align="start" gap={0}>
					<Button
						color={error ? 'red' : 'dark'}
						radius="lg"
						type="submit"
						w="100%"
					>
						{type === 'register' ? 'Создать аккаунт' : 'Войти'}
					</Button>
					{error && (
						<Text c="red" size="sm">
							{error}
						</Text>
					)}
					<Anchor
						component="button"
						type="button"
						c="dimmed"
						onClick={() => toggle()}
						size="xs"
						mt="md"
					>
						{type === 'register'
							? 'Есть аккаунт? Войти'
							: 'Нет аккаунта? Регистрация'}
					</Anchor>
				</Stack>
			</form>
		</Paper>
	)
}

export default AuthForm

type AuthPayload = {
	username: string
	password: string
	email: string
}

type AuthResponse = {
	access_token: string
	refresh_token: string
}

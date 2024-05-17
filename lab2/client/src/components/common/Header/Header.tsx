import {
	AppShell,
	Button,
	Group,
	TextInput,
	TextInputProps
} from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'
import { IconSearch } from '@tabler/icons-react'
import { useToken } from '../../hooks'
import classes from './Header.module.css'
import { Logo, ThemeSwitch } from '..'
import UserMenu from '../UserMenu'

const SearchInput = (props: TextInputProps) => {
	const icon = <IconSearch style={{ width: 16, height: 16 }} />

	return (
		<TextInput
			variant="filled"
			placeholder="Искать людей"
			leftSection={icon}
			style={{ marginInline: 'auto' }}
			{...props}
		/>
	)
}

const LoginButton = () => {
	return (
		<Link to="auth">
			<Button w={80}>Войти</Button>
		</Link>
	)
}

const Header = ({ children }: HeaderProps) => {
	const location = useLocation()
	const { token } = useToken()
	const isAuth = location.pathname === '/auth'

	return (
		<AppShell header={{ height: 60 }} padding="md">
			<AppShell.Header className={classes.header}>
				<div className={classes.inner}>
					<Logo size={28} />
					<SearchInput />
					<Group gap="xs">
						<ThemeSwitch />
						{!isAuth && !token && <LoginButton />}
						{token && <UserMenu />}
					</Group>
				</div>
			</AppShell.Header>
			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	)
}

export default Header

type HeaderProps = {
	children: React.ReactNode
}

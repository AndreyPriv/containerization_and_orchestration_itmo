import cx from 'clsx'
import { useState } from 'react'
import {
	Avatar,
	UnstyledButton,
	Menu,
	rem,
	useMantineTheme
} from '@mantine/core'
import {
	IconLogout,
	IconHeart,
	IconStar,
	IconSettings
} from '@tabler/icons-react'
import classes from './UserMenu.module.css'
import { logout } from '../../../lib/api'

const UserMenu = () => {
	const theme = useMantineTheme()
	const [userMenuOpened, setUserMenuOpened] = useState(false)

	const user = {
		name: 'Jane Spoonfighter',
		image:
			'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png'
	}

	return (
		<Menu
			width={200}
			position="bottom-end"
			transitionProps={{ transition: 'pop-top-right' }}
			onClose={() => setUserMenuOpened(false)}
			onOpen={() => setUserMenuOpened(true)}
			withinPortal
		>
			<Menu.Target>
				<UnstyledButton
					className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
				>
					<Avatar src={user.image} alt={user.name} radius="xl" size={34} />
				</UnstyledButton>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					leftSection={
						<IconHeart
							style={{ width: rem(16), height: rem(16) }}
							color={theme.colors.red[6]}
							stroke={1.5}
						/>
					}
				>
					Хакатоны
				</Menu.Item>
				<Menu.Item
					leftSection={
						<IconStar
							style={{ width: rem(16), height: rem(16) }}
							color={theme.colors.yellow[6]}
							stroke={1.5}
						/>
					}
				>
					Избранное
				</Menu.Item>

				<Menu.Item
					leftSection={
						<IconSettings
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
				>
					Настройки
				</Menu.Item>
				<Menu.Item
					leftSection={
						<IconLogout
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
					onClick={logout}
				>
					Выйти
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}

export default UserMenu

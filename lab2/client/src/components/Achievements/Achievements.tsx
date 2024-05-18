import {
	SimpleGrid,
	Text,
	UnstyledButton,
	useMantineTheme
} from '@mantine/core'
import { IconStar } from '@tabler/icons-react'

import classes from './Achievements.module.css'

const achievement = {
	title: 'Название хакатона',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
	icon: IconStar,
	color: 'yellow'
}

const Achievements = ({ count = 6 }: Props) => {
	const theme = useMantineTheme()

	const items = [...Array(6)].map((_, i) => (
		<UnstyledButton key={i} className={classes.achievement}>
			<achievement.icon
				color={theme.colors[achievement.color][6]}
				className={classes.icon}
			/>
			<Text size="xs" mt={7} ta="center" px="xs">
				{achievement.title}
			</Text>
		</UnstyledButton>
	))

	return (
		<div>
			<Text className={classes.label} c="dimmed">
				Достижения
			</Text>
			<SimpleGrid cols={3} mt="md">
				{items.splice(0, count)}
			</SimpleGrid>
		</div>
	)
}

export default Achievements

type Props = {
	count?: number
}

import { Badge, Group, Stack, Text } from '@mantine/core'
import classes from './Skills.module.css'

const badges = [
	{ emoji: '☀️', label: 'React' },
	{ emoji: '🦓', label: 'TypeScript' },
	{ emoji: '🌊', label: 'Git' },
	{ emoji: '🌲', label: 'Vite.js' },
	{ emoji: '🤽', label: 'Docker' },
	{ emoji: '☀️', label: 'Git' },
	{ emoji: '🦓', label: 'HTML' },
	{ emoji: '🌊', label: 'CSS' },
	{ emoji: '🌲', label: 'SQL' },
	{ emoji: '🤽', label: 'MongoDB' },
	{ emoji: '☀️', label: 'C#' },
	{ emoji: '🦓', label: 'Jira' },
	{ emoji: '🌊', label: 'Trello' },
	{ emoji: '🌲', label: 'VSCode' },
	{ emoji: '🤽', label: 'NPM' }
]

const Skills = ({ count = 6 }: Props) => {
	const features = badges.map(badge => (
		<Badge variant="light" key={badge.label} leftSection={badge.emoji}>
			{badge.label}
		</Badge>
	))

	return (
		<Stack gap={4}>
			<Text className={classes.label}>Скиллы</Text>
			<Group gap={7} mt={5}>
				{features.splice(0, count)}
			</Group>
		</Stack>
	)
}

export default Skills

type Props = {
	count?: number
}

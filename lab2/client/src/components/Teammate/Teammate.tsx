import { Avatar, Text, Stack, ActionIcon, Divider } from '@mantine/core'
import classes from './Teammate.module.css'
import Achievements from '../Achievements'
import { IconX } from '@tabler/icons-react'
import Tags from '../Skills'
import Actions from '../Actions'

const Teammate = (props: Props) => {
	return (
		<Stack justify="space-between" h="100%">
			<Avatar
				src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${props.teammate.id}.png`}
				size={120}
				radius={120}
				mx="auto"
			/>
			<ActionIcon
				variant="transparent"
				color="dark"
				size="lg"
				aria-label="Close"
				style={{ alignSelf: 'flex-start' }}
				onClick={props.resetSelected}
				className={classes.close}
			>
				<IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
			</ActionIcon>
			<Stack gap="0">
				<Text ta="center" fz="lg" fw={500}>
					Jane Glassbreaker
				</Text>
				<Text ta="center" c="dimmed" fz="sm">
					jglassbreaker@hahathon.ai • Дизайнер
				</Text>
			</Stack>

			<Divider />

			<Achievements />

			<Divider />

			<Tags />

			<Divider />

			<Actions />
		</Stack>
	)
}

export default Teammate

type Props = {
	teammate: Teammate
	resetSelected: () => void
}

export type Teammate = {
	id: number
}

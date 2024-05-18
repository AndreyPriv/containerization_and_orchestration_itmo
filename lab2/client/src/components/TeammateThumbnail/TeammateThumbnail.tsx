import { Avatar, Text, Group, Stack } from '@mantine/core'
import { IconPhoneCall, IconAt } from '@tabler/icons-react'
import classes from './TeammateThumbnail.module.css'
import { Teammate } from '../Teammate'
import Achievements from '../Achievements'
import Tags from '../Skills'
import About from '../About'

const TeammateThumbnail = ({
	showAbout = false,
	showTags = false,
	...rest
}: Props) => {
	return (
		<Stack justify="space-between" h="100%">
			<Group wrap="nowrap">
				<Avatar
					src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-${rest.teammate.id}.png`}
					size={94}
					radius="md"
				/>
				<div>
					<Text fz="xs" tt="uppercase" fw={700} c="dimmed">
						Software engineer
					</Text>

					<Text fz="lg" fw={500} className={classes.name}>
						Robert Glassbreaker
					</Text>

					<Group wrap="nowrap" gap={10} mt={3}>
						<IconAt stroke={1.5} size="1rem" className={classes.icon} />
						<Text fz="xs" c="dimmed">
							robert@glassbreaker.io
						</Text>
					</Group>

					<Group wrap="nowrap" gap={10} mt={5}>
						<IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
						<Text fz="xs" c="dimmed">
							+11 (876) 890 56 23
						</Text>
					</Group>
				</div>
			</Group>
			{showAbout && (
				<About text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
			)}
			{showTags && <Tags count={7} />}
		</Stack>
	)
}

export default TeammateThumbnail

type Props = {
	teammate: Teammate
	showAbout?: boolean
	showTags?: boolean
}

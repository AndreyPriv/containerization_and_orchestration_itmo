import { Text } from '@mantine/core'

import classes from './About.module.css'

const About = (props: Props) => {
	return (
		<div>
			<Text className={classes.label}>О себе</Text>
			<Text c="dimmed" fz="sm">
				{props.text}
			</Text>
		</div>
	)
}

export default About

type Props = {
	text: string
}

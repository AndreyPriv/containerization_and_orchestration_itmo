import { useState } from 'react'
import { ActionIcon, Button, Group } from '@mantine/core'
import { IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'

import classes from './Actions.module.css'

const Actions = () => {
	const [liked, setLiked] = useState(false)

	return (
		<Group mt="xs">
			<Button radius="md" style={{ flex: 1 }}>
				Добавить в избранное
			</Button>
			<ActionIcon
				variant="default"
				radius="md"
				size={36}
				onClick={() => setLiked(!liked)}
			>
				{liked ? (
					<IconThumbUpFilled className={classes.like} stroke={1.5} />
				) : (
					<IconThumbUp className={classes.like} stroke={1.5} />
				)}
			</ActionIcon>
		</Group>
	)
}

export default Actions

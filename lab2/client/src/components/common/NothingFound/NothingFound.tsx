import { Container, Title, Text, Button, Group, Center } from '@mantine/core'
import { Illustration } from './Illustration'
import classes from './NothingFound.module.css'
import { useNavigate } from 'react-router-dom'

const NothingFound = () => {
	const navigate = useNavigate()

	return (
		<Container className={classes.root}>
			<div className={classes.inner}>
				<Illustration className={classes.image} />
				<div className={classes.content}>
					<Title className={classes.title}>Вы нашли тайное место.</Title>
					<Text
						c="dimmed"
						size="lg"
						ta="center"
						className={classes.description}
					>
						К сожалению, это всего лишь страница 404. Возможно, вы ошиблись в
						адресе или страница была перемещена на другой URL.
					</Text>
					<Group justify="center">
						<Button
							variant="light"
							radius="lg"
							size="md"
							onClick={() => navigate('/', { replace: true })}
						>
							Верните меня на главную страницу
						</Button>
					</Group>
				</div>
			</div>
		</Container>
	)
}

export default NothingFound

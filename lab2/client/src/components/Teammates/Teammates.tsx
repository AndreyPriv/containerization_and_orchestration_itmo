import { Card, Pagination, Stack, Transition } from '@mantine/core'
import classes from './Teammates.module.css'
import cx from 'clsx'
import { useEffect, useState } from 'react'
import Teammate from '../Teammate'
import TeammateThumbnail from '../TeammateThumbnail'

const Teammates = () => {
	const [mounted, setMounted] = useState(false)
	const [selected, setSelected] = useState<number | null>(null)

	const handleCardClick = (index: number) => {
		setSelected(prevIndex => (prevIndex === index ? null : index))
	}

	const teammates = [...Array(6)].map((_, i) => i + 1)

	useEffect(() => {
		setMounted(true)
	}, [])

	const resetSelected = () => setSelected(null)

	return (
		<Stack maw={1200} mx="auto" w="100%" h="100%" mih="100%">
			<Transition
				mounted={mounted}
				transition="fade"
				duration={400}
				timingFunction="ease"
				keepMounted
			>
				{styles => (
					<div
						className={cx(classes.teammates, {
							[`${classes['expanded']}`]: !!selected
						})}
						style={styles}
					>
						{teammates.map(id => (
							<Card
								key={id}
								className={cx(classes.card, {
									[`${classes['active']}`]: selected === id,
									[`${classes.pointer}`]: selected !== id
								})}
								withBorder
								onClick={() => selected !== id && handleCardClick(id)}
							>
								{selected === id ? (
									<Teammate teammate={{ id }} resetSelected={resetSelected} />
								) : (
									<TeammateThumbnail
										teammate={{ id }}
										showAbout={!Boolean(selected)}
										showTags={!Boolean(selected)}
									/>
								)}
							</Card>
						))}
					</div>
				)}
			</Transition>
			<Pagination total={10} style={{ alignSelf: 'flex-end' }} />
		</Stack>
	)
}

export default Teammates

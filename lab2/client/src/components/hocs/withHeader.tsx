import { ComponentType } from 'react'
import { Header } from '../common'

type WithHeaderProps<P> = Partial<P>

const withHeader = <P extends object>(PageComponent: ComponentType<P>) => {
	const WithHeaderComponent: React.FC<WithHeaderProps<P>> = props => (
		<Header>
			<PageComponent {...(props as P)} />
		</Header>
	)

	WithHeaderComponent.displayName = `withHeader(${
		PageComponent.displayName || PageComponent.name || 'Component'
	})`

	return WithHeaderComponent
}

export default withHeader

import { createBrowserRouter } from 'react-router-dom'
import Root from './routes/root'
import Auth from './routes/auth'
import NothingFound from './components/common/NothingFound'

export const router = createBrowserRouter([
	{
		children: [
			{
				path: '/',
				element: <Root />
			},
			{
				path: '/auth',
				element: <Auth />
			},
			{
				path: '*',
				element: <NothingFound />
			}
		]
	}
])

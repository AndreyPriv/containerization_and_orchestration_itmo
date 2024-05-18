import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'

import { router } from './routers.tsx'

import './main.module.css'
import '@mantine/core/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MantineProvider>
			<RouterProvider router={router} />
		</MantineProvider>
	</React.StrictMode>
)

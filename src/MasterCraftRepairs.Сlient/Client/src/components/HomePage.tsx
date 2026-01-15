import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HomePage.css'

export const HomePage = () => {
	const { isAuthenticated, checkAuth } = useAuth()
	const location = useLocation()

	useEffect(() => {
		checkAuth()
	}, [location.pathname, checkAuth])

	return (
		<div className="homepage">
			{isAuthenticated && (
				<Link
					to="/cabinet/client"
					className="homepage-cabinet-btn"
				>
					Вернуться в кабинет
				</Link>
			)}
			<div className="homepage-hero">
				<h1 className="homepage-title">MasterCraft Repairs</h1>
				<p className="homepage-subtitle">
					Профессиональный ремонт техники с гарантией качества
				</p>
				<img
					src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.1yBzEO-ft3WMRXLGpUAozAHaE7%3Fpid%3DApi&f=1&ipt=1dee10e077932650df7abf2fd3dda07509c3bbb8dea13dcb270ea483c8dea7db&ipo=images"
					alt="Service illustration"
					className="homepage-image"
					onError={e => {
						e.currentTarget.src =
							'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80'
					}}
				/>
			</div>
		</div>
	)
}

import { Link, useNavigate } from 'react-router-dom'
import { Api } from '../../lib/api'
import './ClientCabinet.css'

export const ClientCabinet = () => {
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			await Api.LogoutClient()
			navigate('/')
		} catch (error) {
			console.error('Ошибка при выходе:', error)
			navigate('/')
		}
	}

	return (
		<div className="client-cabinet">
			<aside className="cabinet-sidebar">
				<nav className="sidebar-menu">
					<Link
						to="/profile/client"
						className="sidebar-menu-item"
					>
						Профиль
					</Link>
					<div className="sidebar-menu-item active">Обращения</div>
					<button
						onClick={handleLogout}
						className="sidebar-menu-item sidebar-logout-btn"
					>
						Выход
					</button>
					<Link
						to="/"
						className="sidebar-menu-item"
					>
						Главная
					</Link>
				</nav>
			</aside>
			<main className="cabinet-content">
				<div className="content-header">
					<h1 className="content-title">Обращения</h1>
					<button className="create-request-btn">Создать обращение</button>
				</div>
				<div className="requests-section">
					<div className="requests-empty">
						<p>У вас пока нет обращений</p>
					</div>
				</div>
			</main>
		</div>
	)
}

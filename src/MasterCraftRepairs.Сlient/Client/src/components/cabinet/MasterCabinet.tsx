import { Link, useNavigate } from 'react-router-dom'
import { Api } from '../../lib/api'
import './MasterCabinet.css'

export const MasterCabinet = () => {
	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
			await Api.LogoutMaster()
		} catch (error) {
			console.error('Ошибка при выходе через API:', error)
			// Если API не работает, все равно обновляем состояние
		} finally {
			// Всегда обновляем состояние авторизации и перенаправляем
			navigate('/')
		}
	}

	return (
		<div className="master-cabinet">
			<aside className="cabinet-sidebar">
				<nav className="sidebar-menu">
					<Link
						to="/profile/master"
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
				</div>
				<div className="requests-section">
					<div className="requests-empty">
						<p>Нет доступных обращений</p>
					</div>
				</div>
			</main>
		</div>
	)
}

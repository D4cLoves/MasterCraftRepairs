import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Api } from '../../lib/api'
import { ViewOrderModalMaster } from './ViewOrderModalMaster'
import './MasterCabinet.css'

interface Order {
	id: string;
	categoryName: string;
	serialNumber: string;
	releaseYear: string;
	brand: string;
	model: string;
	description: string;
	startDate: string;
	endDate: string | null;
	price: number;
	orderType: string;
	masterName: string | null;
	clientId: string;
	masterId: string | null;
}

type TabType = 'available' | 'in-progress' | 'completed';

export const MasterCabinet = () => {
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState<TabType>('available')
	const [availableOrders, setAvailableOrders] = useState<Order[]>([])
	const [inProgressOrders, setInProgressOrders] = useState<Order[]>([])
	const [completedOrders, setCompletedOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [isViewModalOpen, setIsViewModalOpen] = useState(false)

	useEffect(() => {
		fetchOrders()
	}, [])

	const fetchOrders = async () => {
		try {
			setLoading(true)
			const [availableRes, inProgressRes, completedRes] = await Promise.all([
				Api.GetAvailableOrders(),
				Api.GetMasterOrders(),
				Api.GetMasterCompletedOrders()
			])
			setAvailableOrders(availableRes.orders || [])
			setInProgressOrders(inProgressRes.orders || [])
			setCompletedOrders(completedRes.orders || [])
			setError(null)
		} catch (err) {
			console.error('Ошибка загрузки обращений:', err)
			setError('Не удалось загрузить обращения. Попробуйте позже.')
		} finally {
			setLoading(false)
		}
	}

	const handleViewOrder = (order: Order) => {
		setSelectedOrder(order)
		setIsViewModalOpen(true)
	}

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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU')
	}

	const getCurrentOrders = () => {
		switch (activeTab) {
			case 'available':
				return availableOrders
			case 'in-progress':
				return inProgressOrders
			case 'completed':
				return completedOrders
			default:
				return []
		}
	}

	const getCurrentOrdersCount = () => {
		switch (activeTab) {
			case 'available':
				return availableOrders.length
			case 'in-progress':
				return inProgressOrders.length
			case 'completed':
				return completedOrders.length
			default:
				return 0
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

				<div className="tabs-container">
					<button
						className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
						onClick={() => setActiveTab('available')}
					>
						Доступные ({availableOrders.length})
					</button>
					<button
						className={`tab-button ${activeTab === 'in-progress' ? 'active' : ''}`}
						onClick={() => setActiveTab('in-progress')}
					>
						В работе ({inProgressOrders.length})
					</button>
					<button
						className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
						onClick={() => setActiveTab('completed')}
					>
						Завершенные ({completedOrders.length})
					</button>
				</div>

				<div className="requests-section">
					{loading ? (
						<div className="requests-loading">
							<p>Загрузка обращений...</p>
						</div>
					) : error ? (
						<div className="requests-error">
							<p>{error}</p>
							<button onClick={fetchOrders} className="retry-btn">Повторить</button>
						</div>
					) : getCurrentOrdersCount() > 0 ? (
						<div className="requests-grid">
							{getCurrentOrders().map((order) => (
								<div key={order.id} className="request-card" onClick={() => handleViewOrder(order)}>
									<div className="request-header">
										<h3>{order.brand} {order.model}</h3>
										<span className={`status-badge status-${order.orderType.toLowerCase()}`}>
											{order.orderType}
										</span>
									</div>
									<div className="request-details">
										<p><strong>Категория:</strong> {order.categoryName}</p>
										<p><strong>Серийный номер:</strong> {order.serialNumber}</p>
										<p><strong>Год выпуска:</strong> {order.releaseYear}</p>
										<p><strong>Описание проблемы:</strong> {order.description.length > 100 ? `${order.description.substring(0, 100)}...` : order.description}</p>
										<p><strong>Дата создания:</strong> {formatDate(order.startDate)}</p>
										{order.endDate && (
											<p><strong>Дата завершения:</strong> {formatDate(order.endDate)}</p>
										)}
										<p><strong>Цена:</strong> {order.price.toLocaleString('ru-RU')} ₽</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="requests-empty">
							<p>
								{activeTab === 'available' && 'Нет доступных обращений'}
								{activeTab === 'in-progress' && 'Нет заказов в работе'}
								{activeTab === 'completed' && 'Нет завершенных заказов'}
							</p>
						</div>
					)}
				</div>
			</main>
			{isViewModalOpen && selectedOrder && (
				<ViewOrderModalMaster
					order={selectedOrder}
					onClose={() => {
						setIsViewModalOpen(false)
						setSelectedOrder(null)
					}}
					onUpdated={fetchOrders}
					isInProgress={activeTab === 'in-progress'}
				/>
			)}
		</div>
	)
}

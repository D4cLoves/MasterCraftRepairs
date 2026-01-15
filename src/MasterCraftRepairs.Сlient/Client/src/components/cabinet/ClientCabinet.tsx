import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { CreateOrderModal } from './CreateOrderModal'
import { ViewOrderModal } from './ViewOrderModal'
import './ClientCabinet.css'

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
}

export const ClientCabinet = () => {
	const navigate = useNavigate()
	const { checkAuth } = useAuth()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isViewModalOpen, setIsViewModalOpen] = useState(false)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<'Все' | 'Новый' | 'В процессе' | 'Завершен' | 'Отменен'>('Все')
	const [page, setPage] = useState(1)
	const pageSize = 8

	useEffect(() => {
		fetchOrders()
	}, [])

	const fetchOrders = async () => {
		try {
			setLoading(true)
			const response = await Api.GetMyOrders()
			setOrders(response.orders || [])
			setPage(1)
			setError(null)
		} catch (err) {
			console.error('Ошибка загрузки обращений:', err)
			setError('Не удалось загрузить обращения. Попробуйте позже.')
		} finally {
			setLoading(false)
		}
	}

	const filteredOrders = useMemo(() => {
		const q = query.trim().toLowerCase()
		return orders.filter(o => {
			const matchesQuery =
				q.length === 0 ||
				`${o.brand} ${o.model}`.toLowerCase().includes(q) ||
				o.serialNumber.toLowerCase().includes(q) ||
				o.categoryName.toLowerCase().includes(q) ||
				o.description.toLowerCase().includes(q)

			const matchesStatus = statusFilter === 'Все' || o.orderType === statusFilter
			return matchesQuery && matchesStatus
		})
	}, [orders, query, statusFilter])

	const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))

	const pagedOrders = useMemo(() => {
		const start = (page - 1) * pageSize
		return filteredOrders.slice(start, start + pageSize)
	}, [filteredOrders, page])

	const handleLogout = async () => {
		try {
			await Api.LogoutClient()
			await checkAuth()
			navigate('/')
		} catch (error) {
			console.error('Ошибка при выходе:', error)
			await checkAuth()
			navigate('/')
		}
	}

	const handleViewOrder = (order: Order) => {
		setSelectedOrder(order);
		setIsViewModalOpen(true);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU')
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
					<button
						className="create-request-btn"
						onClick={() => setIsModalOpen(true)}
					>
						Создать обращение
					</button>
				</div>
				<div className="requests-section">
					<div className="requests-toolbar">
						<input
							className="requests-search"
							placeholder="Поиск: бренд, модель, серийный, категория…"
							value={query}
							onChange={e => setQuery(e.target.value)}
						/>
						<select
							className="requests-filter"
							value={statusFilter}
							onChange={e => {
								setStatusFilter(e.target.value as any)
								setPage(1)
							}}
						>
							<option value="Все">Все</option>
							<option value="Новый">Новый</option>
							<option value="В процессе">В процессе</option>
							<option value="Завершен">Завершен</option>
							<option value="Отменен">Отменен</option>
						</select>
					</div>
					{loading ? (
						<div className="requests-loading">
							<p>Загрузка обращений...</p>
						</div>
					) : error ? (
						<div className="requests-error">
							<p>{error}</p>
							<button onClick={fetchOrders} className="retry-btn">Повторить</button>
						</div>
					) : filteredOrders.length > 0 ? (
						<>
							<div className="requests-grid">
								{pagedOrders.map((order) => (
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
										<p><strong>Описание проблемы:</strong> {order.description}</p>
										<p><strong>Дата создания:</strong> {formatDate(order.startDate)}</p>
										{order.endDate && (
											<p><strong>Дата завершения:</strong> {formatDate(order.endDate)}</p>
										)}
										<p><strong>Цена:</strong> {order.price.toLocaleString('ru-RU')} ₽</p>
										{order.masterName && (
											<p><strong>Мастер:</strong> {order.masterName}</p>
										)}
									</div>
								</div>
							))}
							</div>
							<div className="requests-pagination">
								<button
									className="page-btn"
									onClick={() => setPage(p => Math.max(1, p - 1))}
									disabled={page <= 1}
								>
									Назад
								</button>
								<div className="page-info">
									Стр. {page} / {totalPages}
								</div>
								<button
									className="page-btn"
									onClick={() => setPage(p => Math.min(totalPages, p + 1))}
									disabled={page >= totalPages}
								>
									Вперед
								</button>
							</div>
						</>
					) : (
						<div className="requests-empty">
							<p>У вас пока нет обращений</p>
						</div>
					)}
				</div>
			</main>
			{isModalOpen && (
				<CreateOrderModal
					onClose={() => setIsModalOpen(false)}
					onSubmitSuccess={fetchOrders}
				/>
			)}
			{isViewModalOpen && selectedOrder && (
				<ViewOrderModal
					order={selectedOrder}
					onClose={() => setIsViewModalOpen(false)}
					onUpdated={fetchOrders}
				/>
			)}
		</div>
	)
}

import { useState, useEffect } from 'react';
import { Api } from '../../lib/api';
import './AdminPanel.css';

type TabType = 'clients' | 'masters' | 'categories' | 'orders';

export const AdminPanel = () => {
	const [activeTab, setActiveTab] = useState<TabType>('clients');
	const [clients, setClients] = useState<any[]>([]);
	const [masters, setMasters] = useState<any[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [editingItem, setEditingItem] = useState<any>(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		loadData();
	}, [activeTab]);

	const loadData = async () => {
		setLoading(true);
		setError(null);
		try {
			switch (activeTab) {
				case 'clients':
					const clientsRes = await Api.AdminGetClients();
					setClients(clientsRes.clients || []);
					break;
				case 'masters':
					const mastersRes = await Api.AdminGetMasters();
					setMasters(mastersRes.masters || []);
					break;
				case 'categories':
					const categoriesRes = await Api.AdminGetCategories();
					setCategories(categoriesRes.categories || []);
					break;
				case 'orders':
					const ordersRes = await Api.AdminGetOrders();
					setOrders(ordersRes.orders || []);
					break;
			}
		} catch (err: any) {
			setError(err.message || 'Ошибка загрузки данных');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string, type: TabType) => {
		if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return;

		try {
			switch (type) {
				case 'clients':
					await Api.AdminDeleteClient(id);
					break;
				case 'masters':
					await Api.AdminDeleteMaster(id);
					break;
				case 'categories':
					await Api.AdminDeleteCategory(id);
					break;
			}
			loadData();
		} catch (err: any) {
			alert(err.message || 'Ошибка удаления');
		}
	};

	const handleEdit = (item: any) => {
		setEditingItem(item);
		setShowModal(true);
	};

	const handleCreate = () => {
		setEditingItem(null);
		setShowModal(true);
	};

	const handleSave = async (data: any) => {
		try {
			if (editingItem) {
				// Update
				switch (activeTab) {
					case 'clients':
						await Api.AdminUpdateClient(editingItem.id, data);
						break;
					case 'masters':
						await Api.AdminUpdateMaster(editingItem.id, data);
						break;
					case 'categories':
						await Api.AdminUpdateCategory(editingItem.id, data);
						break;
				}
			} else {
				// Create
				switch (activeTab) {
					case 'clients':
						await Api.AdminCreateClient(data);
						break;
					case 'masters':
						await Api.AdminCreateMaster(data);
						break;
					case 'categories':
						await Api.AdminCreateCategory(data);
						break;
				}
			}
			setShowModal(false);
			loadData();
		} catch (err: any) {
			alert(err.message || 'Ошибка сохранения');
		}
	};

	return (
		<div className="admin-panel">
			<div className="admin-header">
				<h1>Панель администратора</h1>
			</div>

			<div className="admin-tabs">
				<button
					className={activeTab === 'clients' ? 'active' : ''}
					onClick={() => setActiveTab('clients')}
				>
					Клиенты
				</button>
				<button
					className={activeTab === 'masters' ? 'active' : ''}
					onClick={() => setActiveTab('masters')}
				>
					Мастера
				</button>
				<button
					className={activeTab === 'categories' ? 'active' : ''}
					onClick={() => setActiveTab('categories')}
				>
					Категории
				</button>
				<button
					className={activeTab === 'orders' ? 'active' : ''}
					onClick={() => setActiveTab('orders')}
				>
					Заказы
				</button>
			</div>

			<div className="admin-content">
				{loading && <div className="admin-loading">Загрузка...</div>}
				{error && <div className="admin-error">{error}</div>}

				{activeTab === 'clients' && (
					<div className="admin-section">
						<button className="admin-create-btn" onClick={handleCreate}>
							+ Создать клиента
						</button>
						<table className="admin-table">
							<thead>
								<tr>
									<th>Имя</th>
									<th>Email</th>
									<th>Телефон</th>
									<th>Действия</th>
								</tr>
							</thead>
							<tbody>
								{clients.map((client) => (
									<tr key={client.id}>
										<td>{client.firstName} {client.lastName}</td>
										<td>{client.email}</td>
										<td>{client.phone}</td>
										<td>
											<button onClick={() => handleEdit(client)}>Изменить</button>
											<button onClick={() => handleDelete(client.id, 'clients')}>Удалить</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === 'masters' && (
					<div className="admin-section">
						<button className="admin-create-btn" onClick={handleCreate}>
							+ Создать мастера
						</button>
						<table className="admin-table">
							<thead>
								<tr>
									<th>Имя</th>
									<th>Email</th>
									<th>Заработано</th>
									<th>Завершено заказов</th>
									<th>Действия</th>
								</tr>
							</thead>
							<tbody>
								{masters.map((master) => (
									<tr key={master.id}>
										<td>{master.firstName} {master.lastName}</td>
										<td>{master.email}</td>
										<td>{master.totalEarnings?.toLocaleString('ru-RU')} ₽</td>
										<td>{master.completedOrdersCount}</td>
										<td>
											<button onClick={() => handleEdit(master)}>Изменить</button>
											<button onClick={() => handleDelete(master.id, 'masters')}>Удалить</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === 'categories' && (
					<div className="admin-section">
						<button className="admin-create-btn" onClick={handleCreate}>
							+ Создать категорию
						</button>
						<table className="admin-table">
							<thead>
								<tr>
									<th>Название</th>
									<th>Действия</th>
								</tr>
							</thead>
							<tbody>
								{categories.map((category) => (
									<tr key={category.id}>
										<td>{category.name}</td>
										<td>
											<button onClick={() => handleEdit(category)}>Изменить</button>
											<button onClick={() => handleDelete(category.id, 'categories')}>Удалить</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === 'orders' && (
					<div className="admin-section">
						<table className="admin-table">
							<thead>
								<tr>
									<th>Категория</th>
									<th>Клиент</th>
									<th>Мастер</th>
									<th>Цена</th>
									<th>Статус</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order.id}>
										<td>{order.categoryName}</td>
										<td>{order.clientName}</td>
										<td>{order.masterName || '-'}</td>
										<td>{order.price?.toLocaleString('ru-RU')} ₽</td>
										<td>{order.orderType}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{showModal && (
				<AdminModal
					item={editingItem}
					type={activeTab}
					onClose={() => setShowModal(false)}
					onSave={handleSave}
				/>
			)}
		</div>
	);
};

const AdminModal = ({ item, type, onClose, onSave }: any) => {
	const [formData, setFormData] = useState<any>(item || {});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<div className="admin-modal-overlay" onClick={onClose}>
			<div className="admin-modal" onClick={(e) => e.stopPropagation()}>
				<h2>{item ? 'Изменить' : 'Создать'}</h2>
				<form onSubmit={handleSubmit}>
					{type === 'clients' && (
						<>
							<input
								placeholder="Имя"
								value={formData.firstName || ''}
								onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
								required
							/>
							<input
								placeholder="Фамилия"
								value={formData.lastName || ''}
								onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
								required
							/>
							<input
								placeholder="Email"
								type="email"
								value={formData.email || ''}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								required
							/>
							<input
								placeholder="Телефон"
								value={formData.phone || ''}
								onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
								required
							/>
							{!item && (
								<input
									placeholder="Пароль"
									type="password"
									value={formData.password || ''}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required
								/>
							)}
						</>
					)}
					{type === 'masters' && (
						<>
							<input
								placeholder="Имя"
								value={formData.firstName || ''}
								onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
								required
							/>
							<input
								placeholder="Фамилия"
								value={formData.lastName || ''}
								onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
								required
							/>
							<input
								placeholder="Email"
								type="email"
								value={formData.email || ''}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								required
							/>
							<input
								placeholder="Телефон"
								value={formData.phone || ''}
								onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
								required
							/>
							{!item && (
								<input
									placeholder="Пароль"
									type="password"
									value={formData.password || ''}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required
								/>
							)}
						</>
					)}
					{type === 'categories' && (
						<input
							placeholder="Название категории"
							value={formData.name || ''}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							required
						/>
					)}
					<div className="admin-modal-actions">
						<button type="submit">Сохранить</button>
						<button type="button" onClick={onClose}>Отмена</button>
					</div>
				</form>
			</div>
		</div>
	);
};

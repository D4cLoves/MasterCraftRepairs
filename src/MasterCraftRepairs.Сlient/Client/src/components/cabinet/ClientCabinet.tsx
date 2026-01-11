import './ClientCabinet.css';

export const ClientCabinet = () => {
	const handleCreateRequest = () => {
		// TODO: Переход на страницу создания обращения
		console.log('Создание обращения на починку техники');
	};

	return (
		<div className="cabinet-container">
			<div className="cabinet-card">
				<h2 className="cabinet-title">Личный кабинет клиента</h2>

				<div className="cabinet-section">
					<div className="cabinet-welcome">
						<p className="cabinet-greeting">Добро пожаловать!</p>
						<p className="cabinet-subtitle">Управляйте своими обращениями и отслеживайте статус ремонта</p>
					</div>
				</div>

				<div className="cabinet-section">
					<button
						onClick={handleCreateRequest}
						className="cabinet-button cabinet-button-primary"
					>
						<span className="button-icon">📱</span>
						Создать обращение на починку техники
					</button>
				</div>

				<div className="cabinet-section">
					<h3 className="section-title">Мои обращения</h3>
					<div className="requests-list">
						<p className="empty-state">У вас пока нет обращений</p>
					</div>
				</div>
			</div>
		</div>
	);
};

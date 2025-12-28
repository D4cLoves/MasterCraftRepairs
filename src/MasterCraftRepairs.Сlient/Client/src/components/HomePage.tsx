import { Link } from 'react-router-dom';

export const HomePage = () => {
	return (
		<div className="homepage">
			<div className="hero-container">
				<div className="hero-content">
					<h1 className="hero-title">MasterCraftRepairs</h1>
					<p className="hero-description">
						Профессиональный сервис ремонта техники с удобной системой
						отслеживания заказов.
					</p>
					<p className="hero-description">
						Получайте актуальную информацию о статусе ремонта в режиме реального
						времени.
					</p>

					<div className="cta-section">
						<Link
							to="/auth/master/register"
							className="ios-button"
						>
							Стать мастером
						</Link>
						<Link
							to="/auth/client/register"
							className="ios-button"
						>
							Стать клиентом
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

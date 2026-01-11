import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation = () => {
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className="navigation">
			<div className="navigation-container">
				<div className="navigation-brand">
					<Link
						to="/"
						className="brand-link"
					>
						<span className="brand-icon">⚙️</span>
						<span className="brand-text">MasterCraftRepairs</span>
					</Link>
				</div>
				<div className="navigation-links">
					<Link
						to="/auth/master/register"
						className={`nav-link ${
							isActive('/auth/master/register') ? 'active' : ''
						}`}
					>
						Регистрация мастера
					</Link>
					<Link
						to="/auth/client/register"
						className={`nav-link ${
							isActive('/auth/client/register') ? 'active' : ''
						}`}
					>
						Регистрация клиента
					</Link>
				</div>
			</div>
		</nav>
	);
};

import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation = () => {
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className="navigation">
			<div className="navigation-container">
				<div className="navigation-links">
					<Link
						to="/auth/master/login"
						className={`nav-link ${isActive('/auth/master/login') ? 'active' : ''}`}
					>
						Вход мастера
					</Link>
					<Link
						to="/auth/master/register"
						className={`nav-link ${isActive('/auth/master/register') ? 'active' : ''}`}
					>
						Регистрация мастера
					</Link>
					<Link
						to="/auth/client/login"
						className={`nav-link ${isActive('/auth/client/login') ? 'active' : ''}`}
					>
						Вход клиента
					</Link>
					<Link
						to="/auth/client/register"
						className={`nav-link ${isActive('/auth/client/register') ? 'active' : ''}`}
					>
						Регистрация клиента
					</Link>
				</div>
			</div>
		</nav>
	);
};


import { useState } from 'react';
import './Auth.css';

interface MasterLoginProps {
	onLogin?: (email: string, password: string) => void;
}

export const MasterLogin = ({ onLogin }: MasterLoginProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (onLogin) {
			onLogin(email, password);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2 className="auth-title">Вход для мастера</h2>
				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="master-email">Email</label>
						<input
							id="master-email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Введите email"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="master-password">Пароль</label>
						<input
							id="master-password"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="Введите пароль"
							required
						/>
					</div>

					<button type="submit" className="auth-button">
						Войти
					</button>
				</form>
			</div>
		</div>
	);
};

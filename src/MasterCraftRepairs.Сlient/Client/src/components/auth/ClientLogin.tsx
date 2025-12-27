import { useState } from 'react';
import './Auth.css';

interface ClientLoginProps {
	onLogin?: (email: string, password: string) => void;
}

export const ClientLogin = ({ onLogin }: ClientLoginProps) => {
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
				<h2 className="auth-title">Вход для клиента</h2>
				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="client-email">Email</label>
						<input
							id="client-email"
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Введите email"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="client-password">Пароль</label>
						<input
							id="client-password"
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

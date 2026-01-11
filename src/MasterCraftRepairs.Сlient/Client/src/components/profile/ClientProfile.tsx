import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Api } from '../../lib/api'
import './ClientProfile.css'

interface ClientProfileData {
	id: string
	firstName: string
	lastName: string
	phone: string
	passport: string
	address: string
	birthday: string
	email: string
}

export const ClientProfile = () => {
	const [profile, setProfile] = useState<ClientProfileData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadProfile = async () => {
			try {
				setLoading(true)
				const data = await Api.GetClientProfile()
				setProfile(data)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ошибка загрузки профиля')
			} finally {
				setLoading(false)
			}
		}

		loadProfile()
	}, [])

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString)
			return date.toLocaleDateString('ru-RU', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		} catch {
			return dateString
		}
	}

	if (loading) {
		return (
			<div className="client-profile">
				<div className="profile-container">
					<div className="profile-loading">Загрузка...</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="client-profile">
				<div className="profile-container">
					<div className="profile-error">{error}</div>
					<Link
						to="/cabinet/client"
						className="profile-back-link"
					>
						Вернуться в кабинет
					</Link>
				</div>
			</div>
		)
	}

	if (!profile) {
		return (
			<div className="client-profile">
				<div className="profile-container">
					<div className="profile-error">Профиль не найден</div>
					<Link
						to="/cabinet/client"
						className="profile-back-link"
					>
						Вернуться в кабинет
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="client-profile">
			<div className="profile-container">
				<div className="profile-header">
					<h1 className="profile-title">Профиль</h1>
					<Link
						to="/cabinet/client"
						className="profile-back-link"
					>
						← Назад в кабинет
					</Link>
				</div>

				<div className="profile-content">
					<div className="profile-section">
						<div className="profile-field">
							<label className="profile-label">Имя</label>
							<div className="profile-value">{profile.firstName}</div>
						</div>

						<div className="profile-field">
							<label className="profile-label">Фамилия</label>
							<div className="profile-value">{profile.lastName}</div>
						</div>

						<div className="profile-field">
							<label className="profile-label">Email</label>
							<div className="profile-value">{profile.email}</div>
						</div>

						<div className="profile-field">
							<label className="profile-label">Телефон</label>
							<div className="profile-value">{profile.phone}</div>
						</div>

						<div className="profile-field">
							<label className="profile-label">Паспорт</label>
							<div className="profile-value">{profile.passport}</div>
						</div>

						<div className="profile-field">
							<label className="profile-label">Адрес</label>
							<div className="profile-value">{profile.address}</div>
						</div>

						<div className="profile-field">
							<label className="profile-label">Дата рождения</label>
							<div className="profile-value">
								{formatDate(profile.birthday)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

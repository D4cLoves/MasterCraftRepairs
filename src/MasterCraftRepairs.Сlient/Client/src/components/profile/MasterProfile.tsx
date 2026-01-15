import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Api } from '../../lib/api'
import './MasterProfile.css'

interface MasterProfileData {
	id: string
	firstName: string
	lastName: string
	phone: string
	passport: string
	birthday: string
	email: string
}

export const MasterProfile = () => {
	const [profile, setProfile] = useState<MasterProfileData | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [editData, setEditData] = useState({ phone: '', passport: '' })
	const [saveLoading, setSaveLoading] = useState(false)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadProfile = async () => {
			try {
				setLoading(true)
				const data = await Api.GetMasterProfile()
				setProfile(data)
				setEditData({
					phone: data.phone,
					passport: data.passport
				})
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

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setEditData(prev => ({ ...prev, [name]: value }))
	}

	const handleCancelEdit = () => {
		if (!profile) return
		setEditData({
			phone: profile.phone,
			passport: profile.passport
		})
		setError(null)
		setIsEditing(false)
	}

	const handleSave = async () => {
		if (!profile) return
		setSaveLoading(true)
		setError(null)
		try {
			await Api.UpdateMasterProfile(editData)
			const refreshed = await Api.GetMasterProfile()
			setProfile(refreshed)
			setEditData({
				phone: refreshed.phone,
				passport: refreshed.passport
			})
			setIsEditing(false)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка сохранения профиля')
		} finally {
			setSaveLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="master-profile">
				<div className="profile-container">
					<div className="profile-loading">Загрузка...</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="master-profile">
				<div className="profile-container">
					<div className="profile-error">{error}</div>
					<Link
						to="/cabinet/master"
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
			<div className="master-profile">
				<div className="profile-container">
					<div className="profile-error">Профиль не найден</div>
					<Link
						to="/cabinet/master"
						className="profile-back-link"
					>
						Вернуться в кабинет
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="master-profile">
			<div className="profile-container">
				<div className="profile-header">
					<h1 className="profile-title">Профиль</h1>
					<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
						{!isEditing ? (
							<button
								className="profile-back-link"
								onClick={() => setIsEditing(true)}
								type="button"
							>
								Редактировать
							</button>
						) : (
							<>
								<button
									className="profile-back-link"
									onClick={handleCancelEdit}
									type="button"
									disabled={saveLoading}
								>
									Отмена
								</button>
								<button
									className="profile-back-link"
									onClick={handleSave}
									type="button"
									disabled={saveLoading}
								>
									{saveLoading ? 'Сохранение…' : 'Сохранить'}
								</button>
							</>
						)}
						<Link
							to="/cabinet/master"
							className="profile-back-link"
						>
							← Назад в кабинет
						</Link>
					</div>
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
							{isEditing ? (
								<input
									className="profile-value"
									name="phone"
									value={editData.phone}
									onChange={handleEditChange}
								/>
							) : (
								<div className="profile-value">{profile.phone}</div>
							)}
						</div>

						<div className="profile-field">
							<label className="profile-label">Паспорт</label>
							{isEditing ? (
								<input
									className="profile-value"
									name="passport"
									value={editData.passport}
									onChange={handleEditChange}
								/>
							) : (
								<div className="profile-value">{profile.passport}</div>
							)}
						</div>

						<div className="profile-field">
							<label className="profile-label">Дата рождения</label>
							<div className="profile-value">
								{formatDate(profile.birthday)}
							</div>
						</div>
					</div>
					{error && (
						<div className="profile-error" style={{ marginTop: '1rem' }}>
							{error}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

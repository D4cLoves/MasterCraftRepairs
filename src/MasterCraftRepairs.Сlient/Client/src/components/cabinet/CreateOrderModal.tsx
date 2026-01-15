import { useState, useEffect, useRef } from 'react'
import { Api } from '../../lib/api'
import './CreateOrderModal.css'

interface Category {
    id: string
    name: string
}

// Type for the Category entity from the API response
type ApiCategoryResponse = {
    id: string;
    name: {
        value: string;
    };
};

interface CreateOrderModalProps {
    onClose: () => void
    onSubmitSuccess?: () => void;
}

export const CreateOrderModal = ({ onClose, onSubmitSuccess }: CreateOrderModalProps) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showDropdown, setShowDropdown] = useState(false)

    const dropdownRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        categoryId: '',
        serialNumber: '',
        releaseYear: '',
        brand: '',
        model: '',
        price: '',
        description: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadData = async () => {
        setIsLoading(true)
        try {
            const response = await Api.GetCategories()
            // Transform the categories to convert CategoryName objects to strings
            const transformedCategories = response.categories.map((category: ApiCategoryResponse) => ({
                id: category.id,
                name: category.name.value
            }));
            setCategories(transformedCategories)
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
            setErrors({ submit: 'Не удалось загрузить данные. Попробуйте позже.' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCategoryChange = (category: Category) => {
        setFormData(prev => ({ ...prev, categoryId: category.id }))
        if (errors.categoryId) {
            setErrors(prev => ({ ...prev, categoryId: '' }))
        }
        setShowDropdown(false);
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: Record<string, string> = {}

        if (!formData.categoryId) {
            newErrors.categoryId = 'Выберите категорию'
        }
        if (!formData.serialNumber.trim()) {
            newErrors.serialNumber = 'Серийный номер обязателен'
        }
        if (!formData.releaseYear) {
            newErrors.releaseYear = 'Год выпуска обязателен'
        }
        if (!formData.brand.trim()) {
            newErrors.brand = 'Бренд обязателен'
        }
        if (!formData.model.trim()) {
            newErrors.model = 'Модель обязательна'
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Введите корректную цену'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно'
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true)
            try {
                await Api.CreateOrder({
                    categoryId: formData.categoryId,
                    serialNumber: formData.serialNumber,
                    releaseYear: `${formData.releaseYear}-01-01`,
                    brand: formData.brand,
                    model: formData.model,
                    price: formData.price,
                    description: formData.description
                })
                onClose()
                if (onSubmitSuccess) {
                    onSubmitSuccess();
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : 'Ошибка создания обращения'
                setErrors({ submit: errorMessage })
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="create-order-modal"
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">Создать обращение</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="create-order-form"
                >
                    <div className="form-group">
                        <label>Категория *</label>
                        <div className="custom-select" ref={dropdownRef}>
                            <div
                                className={`custom-select-trigger ${errors.categoryId ? 'input-error' : ''} ${showDropdown ? 'open' : ''}`}
                                onClick={() => setShowDropdown(!showDropdown)}
                                tabIndex={0}
                            >
                                {formData.categoryId
                                    ? categories.find(c => c.id === formData.categoryId)?.name || 'Выберите категорию'
                                    : 'Выберите категорию'}
                                <span className={`arrow ${showDropdown ? 'up' : 'down'}`}>&#9662;</span>
                            </div>
                            {showDropdown && (
                                <div className="custom-select-options">
                                    {categories.map(category => (
                                        <div
                                            key={category.id}
                                            className="custom-select-option"
                                            onClick={() => handleCategoryChange(category)}
                                        >
                                            {category.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.categoryId && (
                            <div className="error-message">{errors.categoryId}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="serialNumber">Серийный номер *</label>
                        <input
                            id="serialNumber"
                            name="serialNumber"
                            type="text"
                            value={formData.serialNumber}
                            onChange={handleChange}
                            placeholder="Введите серийный номер"
                            className={errors.serialNumber ? 'input-error' : ''}
                            disabled={isLoading}
                        />
                        {errors.serialNumber && (
                            <div className="error-message">{errors.serialNumber}</div>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="releaseYear">Год выпуска *</label>
                            <input
                                id="releaseYear"
                                name="releaseYear"
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                value={formData.releaseYear}
                                onChange={handleChange}
                                placeholder="Год"
                                className={errors.releaseYear ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            {errors.releaseYear && (
                                <div className="error-message">{errors.releaseYear}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Цена (₽) *</label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={errors.price ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            {errors.price && (
                                <div className="error-message">{errors.price}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="brand">Бренд *</label>
                            <input
                                id="brand"
                                name="brand"
                                type="text"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="Введите бренд"
                                className={errors.brand ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            {errors.brand && (
                                <div className="error-message">{errors.brand}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="model">Модель *</label>
                            <input
                                id="model"
                                name="model"
                                type="text"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="Введите модель"
                                className={errors.model ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            {errors.model && (
                                <div className="error-message">{errors.model}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание проблемы *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Опишите проблему, с которой столкнулись..."
                            rows={4}
                            className={errors.description ? 'input-error' : ''}
                            disabled={isLoading}
                        />
                        {errors.description && (
                            <div className="error-message">{errors.description}</div>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="error-message" style={{ marginBottom: '1rem' }}>
                            {errors.submit}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="modal-btn modal-btn-secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="modal-btn modal-btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Создание...' : 'Создать обращение'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

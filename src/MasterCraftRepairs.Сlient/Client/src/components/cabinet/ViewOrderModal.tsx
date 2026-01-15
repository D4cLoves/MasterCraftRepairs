import { useMemo, useState } from 'react';
import { Api } from '../../lib/api';
import './ViewOrderModal.css';

interface Order {
  id: string;
  categoryName: string;
  serialNumber: string;
  releaseYear: string;
  brand: string;
  model: string;
  description: string;
  startDate: string;
  endDate: string | null;
  price: number;
  orderType: string;
  masterName: string | null;
}

interface ViewOrderModalProps {
  order: Order;
  onClose: () => void;
  onUpdated?: () => void;
}

export const ViewOrderModal = ({ order, onClose, onUpdated }: ViewOrderModalProps) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(order.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEditOrCancel = useMemo(() => order.orderType === 'Новый', [order.orderType]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setLoading(true);
    setError(null);
    Api.CancelOrder(order.id)
      .then((result) => {
        setIsCancelModalOpen(false);
        onUpdated?.();
        onClose();
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Error cancelling order';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancelCancel = () => {
    setIsCancelModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="view-order-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Детали обращения</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="view-order-content">
          {error && <div className="view-order-error">{error}</div>}
          <div className="order-info">
            <div className="info-row">
              <span className="info-label">ID обращения:</span>
              <span className="info-value">{order.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Категория:</span>
              <span className="info-value">{order.categoryName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Серийный номер:</span>
              <span className="info-value">{order.serialNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Год выпуска:</span>
              <span className="info-value">{order.releaseYear}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Бренд:</span>
              <span className="info-value">{order.brand}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Модель:</span>
              <span className="info-value">{order.model}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Описание проблемы:</span>
              <span className="info-value">
                {isEditing ? (
                  <textarea
                    className="view-order-textarea"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    disabled={loading}
                  />
                ) : (
                  order.description
                )}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Дата создания:</span>
              <span className="info-value">{formatDate(order.startDate)}</span>
            </div>
            {order.endDate && (
              <div className="info-row">
                <span className="info-label">Дата завершения:</span>
                <span className="info-value">{formatDate(order.endDate)}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Цена:</span>
              <span className="info-value">{order.price.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="info-row">
              <span className="info-label">Статус:</span>
              <span className={`status-badge status-${order.orderType.toLowerCase()}`}>
                {order.orderType}
              </span>
            </div>
            {order.masterName && (
              <div className="info-row">
                <span className="info-label">Мастер:</span>
                <span className="info-value">{order.masterName}</span>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button className="modal-btn modal-btn-secondary" onClick={onClose} disabled={loading}>
              Закрыть
            </button>
            {canEditOrCancel && (
              <>
                {!isEditing ? (
                  <button
                    className="modal-btn modal-btn-primary"
                    onClick={() => {
                      setDescription(order.description);
                      setIsEditing(true);
                      setError(null);
                    }}
                    disabled={loading}
                  >
                    Редактировать
                  </button>
                ) : (
                  <>
                    <button
                      className="modal-btn modal-btn-secondary"
                      onClick={() => {
                        setDescription(order.description);
                        setIsEditing(false);
                        setError(null);
                      }}
                      disabled={loading}
                    >
                      Отмена
                    </button>
                    <button
                      className="modal-btn modal-btn-primary"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          setError(null);
                          await Api.UpdateOrderDescription(order.id, description);
                          onUpdated?.();
                          setIsEditing(false);
                        } catch (e) {
                          const msg = e instanceof Error ? e.message : 'Ошибка обновления обращения';
                          setError(msg);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Сохранение…' : 'Сохранить'}
                    </button>
                  </>
                )}

                <button className="modal-btn modal-btn-danger" onClick={handleCancelClick} disabled={loading}>
                  Отменить
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения отмены */}
      {isCancelModalOpen && (
        <div className="modal-overlay" onClick={handleCancelCancel}>
          <div className="cancel-order-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Подтверждение отмены</h2>
              <button className="modal-close-btn" onClick={handleCancelCancel}>×</button>
            </div>

            <div className="cancel-order-content">
              <p>Вы уверены, что хотите отменить это обращение?</p>

              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-secondary"
                  onClick={handleCancelCancel}
                  disabled={loading}
                >
                  Назад
                </button>
                <button
                  className="modal-btn modal-btn-danger"
                  onClick={handleConfirmCancel}
                  disabled={loading}
                >
                  {loading ? 'Отмена…' : 'Подтвердить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

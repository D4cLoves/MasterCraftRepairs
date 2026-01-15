import { useState } from 'react';
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

interface ViewOrderModalMasterProps {
  order: Order;
  onClose: () => void;
  onUpdated?: () => void;
  isInProgress?: boolean;
}

export const ViewOrderModalMaster = ({ order, onClose, onUpdated, isInProgress = false }: ViewOrderModalMasterProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTakeOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      await Api.TakeOrder(order.id);
      onUpdated?.();
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка принятия заказа';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      await Api.CompleteOrder(order.id);
      onUpdated?.();
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка завершения заказа';
      setError(msg);
    } finally {
      setLoading(false);
    }
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
              <span className="info-value">{order.description}</span>
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
            {!isInProgress && order.orderType === 'Новый' && (
              <button
                className="modal-btn modal-btn-primary"
                onClick={handleTakeOrder}
                disabled={loading}
              >
                {loading ? 'Принятие…' : 'Принять заказ'}
              </button>
            )}
            {isInProgress && order.orderType === 'В процессе' && (
              <button
                className="modal-btn modal-btn-success"
                onClick={handleCompleteOrder}
                disabled={loading}
              >
                {loading ? 'Завершение…' : 'Завершить заказ'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

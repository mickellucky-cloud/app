import React from 'react';
import { MobileNotificationsSheet } from '../navigation/MobileNotificationsSheet';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onOpenPriceAlerts?: () => void;
  activeAlertsCount?: number;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onOpenPriceAlerts,
  activeAlertsCount = 0,
}) => {
  return (
    <MobileNotificationsSheet
      isOpen={isOpen}
      onClose={onClose}
      notifications={notifications}
      onMarkAsRead={onMarkAsRead}
      onMarkAllAsRead={onMarkAllAsRead}
      onOpenPriceAlerts={onOpenPriceAlerts}
      activeAlertsCount={activeAlertsCount}
    />
  );
};

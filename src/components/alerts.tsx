//src/components/alerts.tsx
import { useEffect } from 'react';

type AlertProps = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
};

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400',
    error: 'bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-gray-800 dark:text-yellow-400',
    info: 'bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400',
  };

  // make the alert disappear after 3 seconds
  useEffect(() => {
    const timeoutId = setTimeout(onClose, 3000);
    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div
      role="alert"
      className={`fixed top-0 left-0 right-0 p-4 mb-4 text-sm rounded-lg transition-all duration-300 ${styles[type]}`}
    >
      <span className="font-medium">Success alert!</span> {message}
    </div>
  );
};

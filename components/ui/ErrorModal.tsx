import React from 'react';
import Modal from './Modal';
import Button from './Button';

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onRetry?: () => void;
  onOpenPortal?: () => void;
  showPortalButton?: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = 'Error',
  message,
  onRetry,
  onOpenPortal,
  showPortalButton = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {onRetry && (
            <Button onClick={onRetry}>
              Retry
            </Button>
          )}
          {showPortalButton && onOpenPortal && (
            <Button variant="secondary" onClick={onOpenPortal}>
              Open Billing Portal
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-800">{message}</p>
            </div>
          </div>
        </div>

        {showPortalButton && (
          <p className="text-sm text-gray-600">
            You can also update your payment information directly through the billing portal.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ErrorModal;

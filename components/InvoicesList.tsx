import React from 'react';
import { Card, Badge, Skeleton } from '@/components/ui';

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

interface InvoicesListProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, isLoading = false }) => {
  const getStatusBadge = (status: Invoice['status']) => {
    const variants: Record<Invoice['status'], 'success' | 'warning' | 'danger'> = {
      paid: 'success',
      pending: 'warning',
      failed: 'danger',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Invoices</h2>
        <div className="space-y-3">
          <Skeleton variant="row" count={3} />
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
      </div>

      {invoices.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500">No invoices yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{formatDate(invoice.date)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </span>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(invoice.status)}</td>
                  <td className="py-4 px-6 text-right">
                    {invoice.downloadUrl && invoice.status === 'paid' && (
                      <a
                        href={invoice.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default InvoicesList;

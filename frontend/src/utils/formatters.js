export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'submitted':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'under-review':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'offer-received':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'visa-processing':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'enrolled':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

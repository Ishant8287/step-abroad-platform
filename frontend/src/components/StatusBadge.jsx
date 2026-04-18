import { formatStatus, getStatusColor } from '../utils/formatters';

const StatusBadge = ({ status }) => {
  if (!status) return null;
  
  const colorClass = getStatusColor(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;

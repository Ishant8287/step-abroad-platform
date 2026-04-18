import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatStatus, formatDate } from '../utils/formatters';

const ApplicationTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={event._id || eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      event.status === 'rejected'
                        ? 'bg-red-50 text-red-500'
                        : event.status === 'enrolled'
                        ? 'bg-indigo-50 text-indigo-500'
                        : event.status === 'offer-received'
                        ? 'bg-emerald-50 text-emerald-500'
                        : 'bg-blue-50 text-blue-500'
                    }`}
                  >
                    {event.status === 'rejected' ? (
                      <XCircle className="h-5 w-5" />
                    ) : event.status === 'enrolled' || event.status === 'offer-received' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {formatStatus(event.status)}
                    </p>
                    {event.comments && (
                      <p className="mt-1 text-sm text-slate-500">{event.comments}</p>
                    )}
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-slate-500">
                    <time dateTime={event.date}>{formatDate(event.date)}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationTimeline;

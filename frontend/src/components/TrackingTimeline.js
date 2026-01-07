import { CheckCircle, MapPin, Clock } from 'lucide-react';

const TrackingTimeline = ({ timeline }) => {
    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {timeline.map((event, idx) => (
                    <li key={idx}>
                        <div className="relative pb-8">
                            {idx !== timeline.length - 1 && (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-blue-100" aria-hidden="true" />
                            )}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                        idx === 0 ? 'bg-blue-600' : 'bg-slate-400'
                                    }`}>
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{event.event_type}</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                            <MapPin size={14} className="text-slate-400" /> {event.location}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-xs text-slate-400">
                                        <div className="flex items-center justify-end gap-1 font-medium text-slate-600">
                                            <Clock size={12} /> {new Date(event.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        {new Date(event.createdAt).toLocaleDateString()}
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

export default TrackingTimeline;
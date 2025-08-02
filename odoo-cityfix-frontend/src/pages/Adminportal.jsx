import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

// --- MOCK DATA ---
// Updated data structure to include details from the report modal
const initialIssues = [
  { 
    id: 1, 
    title: 'Deep Pothole in Connaught Place', 
    status: 'Pending', 
    reports: 28, 
    priority: 'High', 
    createdAt: '2025-07-28', 
    description: 'A large and dangerous pothole has formed on the main road in Connaught Place, near the inner circle. It has already caused a flat tire for one resident\'s car. It is approximately 2 feet wide and 6 inches deep.', 
    location: { lat: 28.6330, lng: 77.2193, address: 'A-24, Block A, Connaught Place, New Delhi, Delhi 110001' },
    images: [
        'https://placehold.co/400x400/d1d5db/374151?text=Pothole+1',
        'https://placehold.co/400x400/d1d5db/374151?text=Pothole+2',
    ],
    category: 'Roads',
  },
  { 
    id: 2, 
    title: 'Broken Streetlight near India Gate', 
    status: 'In Review', 
    reports: 12, 
    priority: 'Medium', 
    createdAt: '2025-07-25', 
    description: 'The streetlight at the corner of Janpath and Rajpath has been out for 3 days, making the intersection very dark and unsafe at night for pedestrians and vehicles.', 
    location: { lat: 28.6129, lng: 77.2295, address: 'Corner of Janpath and Rajpath, New Delhi, Delhi' },
    images: ['https://placehold.co/400x400/d1d5db/374151?text=Streetlight'],
    category: 'Lighting',
  },
  { 
    id: 3, 
    title: 'Overflowing Bins in Lodhi Garden', 
    status: 'Sent to Authority', 
    reports: 5, 
    priority: 'Low', 
    createdAt: '2025-07-22', 
    description: 'Waste bins near Gate 1 of Lodhi Garden are full and need to be emptied. Trash is starting to spill onto the walking paths, attracting stray dogs.', 
    location: { lat: 28.5923, lng: 77.2194, address: 'Lodhi Garden, New Delhi, Delhi' },
    images: [],
    category: 'Cleanliness',
  },
   { 
    id: 4, 
    title: 'Faded Crosswalk at Modern School', 
    status: 'Resolved', 
    reports: 8, 
    priority: 'Medium', 
    createdAt: '2025-06-15', 
    description: 'The crosswalk at the main entrance of Modern School on Barakhamba Road is barely visible. It needs to be repainted for student safety during peak hours.', 
    location: { lat: 28.6288, lng: 77.2245, address: 'Outside Modern School, Barakhamba Road, New Delhi' },
    images: ['https://placehold.co/400x400/d1d5db/374151?text=Crosswalk'],
    category: 'Roads',
  },
];

const issuesByMonth = [
  { name: 'Jan', issues: 12 }, { name: 'Feb', issues: 19 }, { name: 'Mar', issues: 15 },
  { name: 'Apr', issues: 25 }, { name: 'May', issues: 22 }, { name: 'Jun', issues: 31 },
  { name: 'Jul', issues: 28 },
];

// --- ICONS (lucide-react inspired) ---
const Plus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const MoreVertical = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
const FileText = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const CheckCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const Send = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const Eye = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Trash2 = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const X = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const MapPin = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

 

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {icon}
    </div>
    <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'In Review': 'bg-blue-100 text-blue-800 border-blue-200',
    'Sent to Authority': 'bg-purple-100 text-purple-800 border-purple-200',
    'Resolved': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
  }[status];
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config}`}>{status}</span>;
};

const PriorityBadge = ({ priority }) => {
  const config = {
    'Low': 'bg-slate-100 text-slate-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800',
  }[priority];
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config}`}>{priority}</span>;
};

const MapPreview = ({ lat, lng }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (window.google && mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat, lng },
                zoom: 15,
                disableDefaultUI: true,
            });
            new window.google.maps.Marker({
                position: { lat, lng },
                map: map,
            });
        }
    }, [lat, lng]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};


const IssueDetailModal = ({ issue, onClose, onSave }) => {
    const [currentStatus, setCurrentStatus] = useState(issue.status);
    const [currentPriority, setCurrentPriority] = useState(issue.priority);

    const handleSave = () => {
        onSave({ ...issue, status: currentStatus, priority: currentPriority });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{issue.title}</h2>
                        <p className="text-sm text-slate-500">Issue ID: {issue.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5 text-slate-500"/></button>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        {/* Left Column: Issue Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-2">Description</h3>
                                <p className="text-slate-700 leading-relaxed">{issue.description}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-2">Location</h3>
                                <div className="h-64 rounded-lg overflow-hidden border border-slate-200">
                                    <MapPreview lat={issue.location.lat} lng={issue.location.lng} />
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-slate-600">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{issue.location.address}</span>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-2">Submitted Images</h3>
                                {issue.images.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {issue.images.map((img, index) => (
                                            <a key={index} href={img} target="_blank" rel="noopener noreferrer">
                                                <img src={img} alt={`issue-img-${index}`} className="w-full h-32 object-cover rounded-lg border border-slate-200 hover:opacity-80 transition-opacity" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No images were submitted for this issue.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Admin Panel */}
                        <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                             <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-2">Category</h3>
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white text-slate-800 border border-slate-200">
                                    {issue.category}
                                </span>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 mb-2 block">Status</label>
                                <select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                                    <option>Pending</option><option>In Review</option><option>Sent to Authority</option><option>Resolved</option><option>Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-500 mb-2 block">Priority</label>
                                <select value={currentPriority} onChange={(e) => setCurrentPriority(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                                </select>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-2">Reports</h3>
                                <p className="text-lg font-bold text-slate-800">{issue.reports}</p>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-2">Reported On</h3>
                                <p className="text-sm text-slate-700">{issue.createdAt}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl space-x-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition">Update Issue</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const [issues, setIssues] = useState(initialIssues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Load Google Maps script
  useEffect(() => {
    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyARzdkgMct7QcNkLFVA9i2AwvP4yL_BNNY`; // IMPORTANT: Replace with your actual API key
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
  }, []);

  const stats = {
    pending: issues.filter(i => i.status === 'Pending').length,
    inReview: issues.filter(i => i.status === 'In Review').length,
    sent: issues.filter(i => i.status === 'Sent to Authority').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
  };

  const handleOpenModal = (issue) => {
      setSelectedIssue(issue);
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setSelectedIssue(null);
      setIsModalOpen(false);
  };
  
  const handleSaveIssue = (issueToSave) => {
    setIssues(issues.map(i => i.id === issueToSave.id ? issueToSave : i));
  };

  const handleDeleteIssue = (issueId) => {
      setIssues(issues.filter(i => i.id !== issueId));
  };

  return (
    <div className="min-h-screen  ">
      <Navbar />
      <main className="py-8 mt-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Issues Dashboard</h1>
              <p className="mt-1 text-slate-500">Monitor, manage, and resolve community-reported issues.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Pending Issues" value={stats.pending} icon={<FileText className="w-6 h-6 text-amber-500"/>} />
            <StatCard title="In Review" value={stats.inReview} icon={<Eye className="w-6 h-6 text-blue-500"/>} />
            <StatCard title="Sent to Authority" value={stats.sent} icon={<Send className="w-6 h-6 text-purple-500"/>} />
            <StatCard title="Total Resolved" value={stats.resolved} icon={<CheckCircle className="w-6 h-6 text-green-500"/>} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Current Issues</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3">Issue Title</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3 text-center">Reports</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map(issue => (
                      <tr key={issue.id} className="bg-white border-b hover:bg-slate-50">
                        <th className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{issue.title}</th>
                        <td className="px-6 py-4"><StatusBadge status={issue.status} /></td>
                        <td className="px-6 py-4"><PriorityBadge priority={issue.priority} /></td>
                        <td className="px-6 py-4 text-center font-medium text-slate-700">{issue.reports}</td>
                        <td className="px-6 py-4">{issue.createdAt}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end space-x-2">
                                <button onClick={() => handleOpenModal(issue)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"><MoreVertical className="w-4 h-4"/></button>
                                <button onClick={() => handleDeleteIssue(issue.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4"/></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Monthly Reports</h2>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={issuesByMonth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} stroke="#cbd5e1" />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} stroke="#cbd5e1" />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }} />
                    <Bar dataKey="issues" fill="#475569" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {isModalOpen && selectedIssue && <IssueDetailModal issue={selectedIssue} onClose={handleCloseModal} onSave={handleSaveIssue} />}
    </div>
  );
}

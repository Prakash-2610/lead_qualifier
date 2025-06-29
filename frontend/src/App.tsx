import { useEffect, useState } from 'react';
import axios from 'axios';
import LeadTable from './components/LeadTable';
import LeadChart from './components/LeadChart';
import LeadBarChart from './components/LeadBarChart';
import './App.css';
import { trackEvent } from './eventTracker';



interface Lead {
  id: number;
  name: string;
  company: string;
  industry: string;
  size: number;
  source: string;
  created_at: string;
  quality?: string;
  summary?: string;
}

const App = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState<'table' | 'pie' | 'bar'>('table');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState<number | undefined>(undefined);

  const fetchLeads = async () => {
    try {
      const params: any = {};
      if (industry) params.industry = industry;
      if (size) params.size = size;
      const res = await axios.get('http://127.0.0.1:8000/api/leads', { params });
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  useEffect(() => {
   fetchLeads();
  }, []);

  return (
    <div className="p-4">
      <h1>Lead Qualifier Dashboard</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>Industry: </label>
        <select
          value={industry}
          onChange={(e) => {
            const newIndustry = e.target.value;
            setIndustry(newIndustry);
            trackEvent("filter", { filterType: newIndustry }); 
          }}
        >
          <option value="">All</option>
          <option value="Technology">Technology</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
        </select>

        <label style={{ marginLeft: '1rem' }}>Max Size: </label>
        <input
          type="range"
          min="5"
          max="500"
          step="5"
          value={size || 500}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <span> {size || 500}</span>

        <button onClick={() => {
          trackEvent("refresh_click", { industry, size });
          fetchLeads();
        }} style={{ marginLeft: '1rem' }}>
            Refresh
        </button>

        <button
          onClick={() => {
            setView('pie');
            trackEvent("toggle_view", { view: 'pie' });
          }}
          style={{ marginLeft: '1rem' }}
        >
          Show Pie Chart
        </button>

        <button
          onClick={() => {
            setView('bar');
            trackEvent("toggle_view", { view: 'bar' });
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          Show Bar Chart
        </button>

        <button
          onClick={() => {
            setView('table');
            trackEvent("toggle_view", { view: 'table' });
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          Show Table
        </button>

      </div>
      {view === 'table' && <LeadTable leads={leads} />}
      {view === 'pie' && <LeadChart leads={leads} />}
      {view === 'bar' && <LeadBarChart leads={leads} />}
    </div>
  );
};

export default App;

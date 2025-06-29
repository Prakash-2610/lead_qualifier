import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

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

const LeadBarChart = ({ leads }: { leads: Lead[] }) => {
  const industryCounts: Record<string, number> = {};
  leads.forEach((lead) => {
    industryCounts[lead.industry] = (industryCounts[lead.industry] || 0) + 1;
  });

  const chartData = Object.entries(industryCounts).map(([industry, count]) => ({
    industry,
    leads: count,
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="industry" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leads" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadBarChart;

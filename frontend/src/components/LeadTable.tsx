import React from 'react';

interface Lead {
  id: number;
  name: string;
  company: string;
  industry: string;
  size: number;
  source: string;
  created_at: string;
}

const LeadTable = ({ leads }: { leads: Lead[] }) => {
  return (
    <table border={1} cellPadding={6} style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Company</th>
          <th>Industry</th>
          <th>Size</th>
          <th>Source</th>
          <th>Created</th>
          <th>Quality</th> 
          <th>Summary</th> 
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{lead.name}</td>
            <td>{lead.company}</td>
            <td>{lead.industry}</td>
            <td>{lead.size}</td>
            <td>{lead.source}</td>
            <td>{new Date(lead.created_at).toLocaleDateString()}</td>
            <td>{lead.quality || '—'}</td> 
            <td>{lead.summary || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeadTable;

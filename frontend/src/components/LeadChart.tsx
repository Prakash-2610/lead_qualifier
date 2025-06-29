import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const LeadChart = ({ leads }: { leads: any[] }) => {
  const grouped = leads.reduce((acc: any, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default LeadChart;

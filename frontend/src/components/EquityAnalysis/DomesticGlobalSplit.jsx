import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

export default function DomesticGlobalSplit({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Domestic vs Global Equity</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-4 mt-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: COLORS[index] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartCardProps {
  title: string;
  type: 'line' | 'pie';
}

const salesData = [
  { name: '1月', value: 320 },
  { name: '2月', value: 380 },
  { name: '3月', value: 450 },
  { name: '4月', value: 420 },
  { name: '5月', value: 520 },
  { name: '6月', value: 480 },
  { name: '7月', value: 560 },
  { name: '8月', value: 540 },
  { name: '9月', value: 490 },
  { name: '10月', value: 580 },
  { name: '11月', value: 610 },
  { name: '12月', value: 650 },
];

const inventoryData = [
  { name: '当前库存量', value: 580, color: '#3b82f6' },
  { name: '即将入库车辆', value: 120, color: '#10b981' },
  { name: '已售出车辆', value: 280, color: '#f59e0b' },
  { name: '维修车辆', value: 85, color: '#ef4444' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100">
        <p className="text-xs font-medium text-gray-800">{payload[0].name}</p>
        <p className="text-xs text-gray-600 mt-1">
          {payload[0].payload.name === '当前库存量' || payload[0].payload.name === '即将入库车辆' || payload[0].payload.name === '已售出车辆' || payload[0].payload.name === '维修车辆'
            ? `${payload[0].value} 辆`
            : `¥${payload[0].value}万`}
        </p>
      </div>
    );
  }
  return null;
};

export function ChartCard({ title, type }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">查看更多</button>
      </div>
      {type === 'line' ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#e5e7eb" />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#e5e7eb" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center gap-4 h-48">
          <div className="flex-1 h-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={192}>
              <PieChart>
                <defs>
                  <filter id="pie-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                  </filter>
                </defs>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  style={{ filter: 'url(#pie-shadow)' }}
                >
                  {inventoryData.map((entry) => (
                    <Cell key={`pie-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 pr-2 shrink-0">
            {inventoryData.map((item) => (
              <div key={`legend-${item.name}`} className="flex items-start gap-2">
                <div className="w-3 h-3 rounded-sm mt-0.5 shadow-sm" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 leading-tight">{item.name}</div>
                  <div className="text-sm font-bold text-gray-800 mt-0.5">{item.value}辆</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

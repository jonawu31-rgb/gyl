import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const rankingData = [
  { name: '大众', percentage: 32, color: '#3b82f6', gradient: ['#60a5fa', '#3b82f6'] },
  { name: '丰田', percentage: 26, color: '#10b981', gradient: ['#34d399', '#10b981'] },
  { name: '奔驰', percentage: 24, color: '#f59e0b', gradient: ['#fbbf24', '#f59e0b'] },
  { name: '宝马', percentage: 18, color: '#ef4444', gradient: ['#f87171', '#ef4444'] },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-xl border border-gray-100">
        <p className="text-xs font-bold text-gray-800">{payload[0].payload.name}</p>
        <p className="text-sm font-bold text-blue-600 mt-0.5">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function SalesRanking() {
  return (
    <div className="relative bg-white rounded-xl p-4 border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex items-center justify-between mb-1 shrink-0">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
          销售排行
        </h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
          查看更多
        </button>
      </div>

      <div className="relative flex-1 min-h-0" style={{ minHeight: '80px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rankingData}
            layout="vertical"
            margin={{ top: 16, right: 40, left: 4, bottom: 16 }}
          >
            <defs>
              <linearGradient id="sranking-g-0" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={rankingData[0].gradient[0]} />
                <stop offset="100%" stopColor={rankingData[0].gradient[1]} />
              </linearGradient>
              <linearGradient id="sranking-g-1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={rankingData[1].gradient[0]} />
                <stop offset="100%" stopColor={rankingData[1].gradient[1]} />
              </linearGradient>
              <linearGradient id="sranking-g-2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={rankingData[2].gradient[0]} />
                <stop offset="100%" stopColor={rankingData[2].gradient[1]} />
              </linearGradient>
              <linearGradient id="sranking-g-3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={rankingData[3].gradient[0]} />
                <stop offset="100%" stopColor={rankingData[3].gradient[1]} />
              </linearGradient>
              <filter id="sranking-shadow-0" x="-5%" y="-80%" width="130%" height="260%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={rankingData[0].color} floodOpacity="0.45" />
              </filter>
              <filter id="sranking-shadow-1" x="-5%" y="-80%" width="130%" height="260%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={rankingData[1].color} floodOpacity="0.45" />
              </filter>
              <filter id="sranking-shadow-2" x="-5%" y="-80%" width="130%" height="260%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={rankingData[2].color} floodOpacity="0.45" />
              </filter>
              <filter id="sranking-shadow-3" x="-5%" y="-80%" width="130%" height="260%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={rankingData[3].color} floodOpacity="0.45" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              stroke="#e5e7eb"
              domain={[0, 35]}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 600 }}
              stroke="#e5e7eb"
              width={30}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar
              dataKey="percentage"
              radius={[0, 6, 6, 0]}
              barSize={10}
              label={{
                position: 'right',
                formatter: (value: number) => `${value}%`,
                fontSize: 11,
                fill: '#6b7280',
                fontWeight: 700,
              }}
              isAnimationActive={false}
            >
              {rankingData.map((entry, index) => (
                <Cell
                  key={`sranking-c-${entry.name}`}
                  fill={`url(#sranking-g-${index})`}
                  style={{ filter: `url(#sranking-shadow-${index})` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

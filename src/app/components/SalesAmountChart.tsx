import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { name: '5月', value: 520 },
  { name: '6月', value: 480 },
  { name: '7月', value: 560 },
  { name: '8月', value: 540 },
  { name: '9月', value: 490 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-xl border border-gray-100">
        <p className="text-xs font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-sm font-bold text-cyan-600 mt-0.5">¥{payload[0].value}万</p>
      </div>
    );
  }
  return null;
};

export function SalesAmountChart() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
          销售额度统计
        </h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
          查看更多
        </button>
      </div>

      <div className="relative flex-1 min-h-0" style={{ minHeight: '80px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
            <defs>
              <linearGradient key="salesAmtColorValue" id="salesAmtColorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#e5e7eb"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              stroke="#e5e7eb"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0ea5e9', strokeWidth: 1.5 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              fill="url(#salesAmtColorValue)"
              isAnimationActive={false}
              dot={{ fill: '#fff', stroke: '#0ea5e9', strokeWidth: 2.5, r: 4 }}
              activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

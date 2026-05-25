import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const inventoryData = [
  { name: '当前库存量', value: 14987, color: '#3b82f6', gradient: ['#60a5fa', '#3b82f6'] },
  { name: '已售出车辆', value: 980,   color: '#10b981', gradient: ['#34d399', '#10b981'] },
  { name: '即将入库',   value: 356,   color: '#f59e0b', gradient: ['#fbbf24', '#f59e0b'] },
  { name: '维修车辆',   value: 75,    color: '#ef4444', gradient: ['#f87171', '#ef4444'] },
];

const totalInventory = 16398;
const inventoryPercentage = 86;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-xl border border-gray-100">
        <p className="text-xs font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-xs text-gray-600 mt-0.5">{payload[0].value.toLocaleString()} 辆</p>
      </div>
    );
  }
  return null;
};

function LegendItem({ item }: { item: typeof inventoryData[0] }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2.5 h-2.5 rounded-sm shrink-0"
        style={{
          background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
          boxShadow: `0 2px 4px ${item.color}66`,
        }}
      />
      <div className="min-w-0">
        <div className="text-[10px] text-gray-400 leading-tight truncate">{item.name}</div>
        <div className="text-sm font-bold text-gray-800 leading-tight">
          {item.value.toLocaleString()}
          <span className="text-[10px] text-gray-400 ml-0.5 font-normal">辆</span>
        </div>
      </div>
    </div>
  );
}

export function InventoryStats() {
  return (
    <div className="relative bg-white rounded-xl p-4 border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-2 shrink-0">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          库存统计
        </h3>
        <div className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
          <span className="text-xs text-gray-500">总库存：</span>
          <span className="text-xs font-bold text-gray-800">{totalInventory.toLocaleString()}</span>
          <span className="text-xs text-blue-600 ml-1 font-semibold">({inventoryPercentage}%)</span>
        </div>
      </div>

      {/* Chart + two-side legend */}
      <div className="relative flex-1 min-h-0 flex items-center gap-2">

        {/* Left legend — items 0 & 1 */}
        <div className="flex flex-col justify-center gap-3 shrink-0 w-[88px]">
          {inventoryData.slice(0, 2).map(item => (
            <LegendItem key={item.name} item={item} />
          ))}
        </div>

        {/* Pie */}
        <div className="flex-1 h-full min-w-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {inventoryData.map((entry, index) => (
                  <linearGradient key={`ig-${index}`} id={`ig-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.gradient[0]} />
                    <stop offset="100%" stopColor={entry.gradient[1]} />
                  </linearGradient>
                ))}
                <filter id="pie-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.28" />
                </filter>
              </defs>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                innerRadius="46%"
                outerRadius="72%"
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={false}
                style={{ filter: 'url(#pie-shadow)' }}
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`ic-${entry.name}`} fill={`url(#ig-${index})`} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-base font-bold text-gray-900">{inventoryPercentage}%</div>
              <div className="text-[10px] text-gray-400">在库率</div>
            </div>
          </div>
        </div>

        {/* Right legend — items 2 & 3 */}
        <div className="flex flex-col justify-center gap-3 shrink-0 w-[88px]">
          {inventoryData.slice(2, 4).map(item => (
            <LegendItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

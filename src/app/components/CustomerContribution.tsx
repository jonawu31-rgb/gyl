import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CustomerData {
  rank: number;
  customerName: string;
  salesAmount: number;
  grossProfit: number;
  orderCount: number;
  salesRate: number;
  profitRate: number;
}

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1",
  "#14b8a6", "#eab308", "#d946ef", "#0ea5e9", "#a3e635",
  "#fb923c", "#f43f5e", "#a78bfa", "#34d399", "#fbbf24",
];

const allCustomers: CustomerData[] = [
  { rank: 1,  customerName: "广州宏达汽配",   salesAmount: 285600.00, grossProfit: 68544.00, orderCount: 142, salesRate: 18.52, profitRate: 20.15 },
  { rank: 2,  customerName: "深圳联合汽配",   salesAmount: 231200.00, grossProfit: 52776.00, orderCount: 98,  salesRate: 14.99, profitRate: 15.51 },
  { rank: 3,  customerName: "东莞盛达零部件", salesAmount: 198500.00, grossProfit: 43670.00, orderCount: 87,  salesRate: 12.87, profitRate: 12.84 },
  { rank: 4,  customerName: "佛山鑫源汽配",   salesAmount: 176300.00, grossProfit: 38786.00, orderCount: 76,  salesRate: 11.43, profitRate: 11.40 },
  { rank: 5,  customerName: "惠州天驰配件",   salesAmount: 143800.00, grossProfit: 31636.00, orderCount: 65,  salesRate: 9.32,  profitRate: 9.30 },
  { rank: 6,  customerName: "中山汽配城",     salesAmount: 112400.00, grossProfit: 24728.00, orderCount: 54,  salesRate: 7.29,  profitRate: 7.27 },
  { rank: 7,  customerName: "珠海明达汽配",   salesAmount: 98700.00,  grossProfit: 20727.00, orderCount: 43,  salesRate: 6.40,  profitRate: 6.09 },
  { rank: 8,  customerName: "汕头顺风配件",   salesAmount: 76500.00,  grossProfit: 15300.00, orderCount: 32,  salesRate: 4.96,  profitRate: 4.50 },
  { rank: 9,  customerName: "江门远大汽配",   salesAmount: 54200.00,  grossProfit: 10840.00, orderCount: 28,  salesRate: 3.51,  profitRate: 3.19 },
  { rank: 10, customerName: "肇庆华达配件",   salesAmount: 42800.00,  grossProfit: 8560.00,  orderCount: 21,  salesRate: 2.77,  profitRate: 2.52 },
  { rank: 11, customerName: "清远鑫辉汽配",   salesAmount: 35600.00,  grossProfit: 7120.00,  orderCount: 18,  salesRate: 2.31,  profitRate: 2.09 },
  { rank: 12, customerName: "韶关天宇配件",   salesAmount: 28900.00,  grossProfit: 5780.00,  orderCount: 14,  salesRate: 1.87,  profitRate: 1.70 },
  { rank: 13, customerName: "其他客户A",      salesAmount: 22100.00,  grossProfit: 4420.00,  orderCount: 11,  salesRate: 1.43,  profitRate: 1.30 },
  { rank: 14, customerName: "其他客户B",      salesAmount: 18400.00,  grossProfit: 3680.00,  orderCount: 9,   salesRate: 1.19,  profitRate: 1.08 },
  { rank: 15, customerName: "其他客户C",      salesAmount: 15200.00,  grossProfit: 3040.00,  orderCount: 7,   salesRate: 0.99,  profitRate: 0.89 },
];

const fmt = (n: number) => n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function buildChartData(customers: CustomerData[], topN: number, field: "salesRate" | "profitRate") {
  const top = customers.slice(0, topN);
  const otherRate = customers.slice(topN).reduce((s, c) => s + c[field], 0);
  const result = top.map(c => ({ name: c.customerName, value: parseFloat(c[field].toFixed(2)) }));
  if (otherRate > 0) result.push({ name: "其他", value: parseFloat(otherRate.toFixed(2)) });
  return result;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-medium text-gray-800">{payload[0].name}</p>
        <p className="text-blue-600">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function CustomerContribution() {
  const [startDate, setStartDate] = useState("2026-04-27");
  const [endDate, setEndDate] = useState("2026-05-28");
  const [topN, setTopN] = useState(20);
  const [dateError, setDateError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const displayed = allCustomers.slice(0, topN);
  const salesChartData = buildChartData(allCustomers, topN, "salesRate");
  const profitChartData = buildChartData(allCustomers, topN, "profitRate");

  const totalPages = Math.ceil(displayed.length / pageSize);
  const paged = displayed.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    if (startDate && endDate && startDate > endDate) {
      setDateError("开始日期不能晚于结束日期");
      return;
    }
    setDateError("");
  };

  const handleReset = () => {
    setStartDate("2026-04-27");
    setEndDate("2026-05-28");
    setTopN(20);
    setDateError("");
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">客户贡献率</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">开始日期：</span>
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setDateError(""); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">结束日期：</span>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setDateError(""); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">显示数量：</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => setTopN(Math.max(1, topN - 1))} className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm border-r border-gray-300">−</button>
              <input
                type="number"
                value={topN}
                min={1}
                max={100}
                onChange={e => setTopN(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-14 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button onClick={() => setTopN(Math.min(100, topN + 1))} className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm border-l border-gray-300">+</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSearch} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
          {dateError && <span className="text-xs text-red-500">{dateError}</span>}
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {/* Charts */}
        <div className="grid grid-cols-2 gap-4 px-4 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">客户销售额贡献率</h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {salesChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                    iconSize={10}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">客户利润贡献率</h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profitChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {profitChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                    iconSize={10}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detail table */}
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-16">排名</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">销售额</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利润</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">订单数</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">销售额贡献率</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">利润贡献率</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr key={item.rank} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5">
                  {item.rank <= 3 ? (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${item.rank === 1 ? "bg-yellow-500" : item.rank === 2 ? "bg-gray-400" : "bg-amber-600"}`}>
                      {item.rank}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">{item.rank}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.customerName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{fmt(item.salesAmount)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{fmt(item.grossProfit)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 text-right">{item.orderCount}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, item.salesRate / 20 * 100)}%` }} />
                    </div>
                    <span className="text-sm text-blue-600 font-medium w-14 text-right">{item.salesRate.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, item.profitRate / 20 * 100)}%` }} />
                    </div>
                    <span className="text-sm text-emerald-600 font-medium w-14 text-right">{item.profitRate.toFixed(2)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{displayed.length}</span> 条</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
            <button onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))} disabled={currentPage >= (totalPages || 1)} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

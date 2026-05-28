import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

interface CategoryRow {
  name: string;
  qty: number;
  revenue: number;
  cost: number;
  profit: number;
  profitRate: number;
  avgPrice: number;
  share: number;
  children?: CategoryRow[];
}

const mockCategories: CategoryRow[] = [
  {
    name: "油品", qty: 320, revenue: 48000, cost: 28000, profit: 20000, profitRate: 41.7, avgPrice: 150, share: 38.5,
    children: [
      { name: "机油", qty: 180, revenue: 28000, cost: 16000, profit: 12000, profitRate: 42.9, avgPrice: 155.6, share: 22.5 },
      { name: "机油滤", qty: 90, revenue: 12000, cost: 7000, profit: 5000, profitRate: 41.7, avgPrice: 133.3, share: 9.6 },
      { name: "空滤", qty: 50, revenue: 8000, cost: 5000, profit: 3000, profitRate: 37.5, avgPrice: 160, share: 6.4 },
    ],
  },
  {
    name: "刹车系统", qty: 210, revenue: 38500, cost: 22000, profit: 16500, profitRate: 42.9, avgPrice: 183.3, share: 30.9,
    children: [
      { name: "前刹车片", qty: 120, revenue: 22000, cost: 12500, profit: 9500, profitRate: 43.2, avgPrice: 183.3, share: 17.6 },
      { name: "后刹车片", qty: 90, revenue: 16500, cost: 9500, profit: 7000, profitRate: 42.4, avgPrice: 183.3, share: 13.2 },
    ],
  },
  {
    name: "点火系统", qty: 180, revenue: 27000, cost: 16500, profit: 10500, profitRate: 38.9, avgPrice: 150, share: 21.6,
    children: [
      { name: "火花塞", qty: 100, revenue: 15000, cost: 9000, profit: 6000, profitRate: 40, avgPrice: 150, share: 12 },
      { name: "高压线", qty: 80, revenue: 12000, cost: 7500, profit: 4500, profitRate: 37.5, avgPrice: 150, share: 9.6 },
    ],
  },
  {
    name: "其他", qty: 95, revenue: 11200, cost: 7000, profit: 4200, profitRate: 37.5, avgPrice: 117.9, share: 9,
  },
];

const totalRevenue = mockCategories.reduce((s, r) => s + r.revenue, 0);
const totalCost = mockCategories.reduce((s, r) => s + r.cost, 0);
const totalProfit = totalRevenue - totalCost;
const totalProfitRate = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0";

function CategoryTable({ rows, title }: { rows: CategoryRow[]; title: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (name: string) => setExpanded(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next; });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">品类名称</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">数量</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">业绩</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利率(%)</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">平均单价</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">占比(%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <>
              <tr
                key={row.name}
                className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${row.children ? "cursor-pointer" : ""}`}
                onClick={() => row.children && toggle(row.name)}
              >
                <td className="px-4 py-2.5 font-medium text-gray-800">
                  <span className="flex items-center gap-1">
                    {row.children ? (
                      expanded.has(row.name) ? <ExpandMoreIcon sx={{ fontSize: 16 }} className="text-gray-500" /> : <ChevronRightIcon sx={{ fontSize: 16 }} className="text-gray-500" />
                    ) : <span className="w-4" />}
                    {row.name}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right text-gray-700">{row.qty.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-gray-800">¥{row.revenue.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">¥{row.cost.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-blue-600 font-medium">¥{row.profit.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{row.profitRate}%</td>
                <td className="px-4 py-2.5 text-right text-gray-600">¥{row.avgPrice.toFixed(1)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{row.share}%</td>
              </tr>
              {row.children && expanded.has(row.name) && row.children.map(child => (
                <tr key={child.name} className="border-b border-gray-100 bg-gray-50/60">
                  <td className="px-4 py-2 text-gray-700 pl-10">{child.name}</td>
                  <td className="px-4 py-2 text-right text-gray-600">{child.qty.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-gray-700">¥{child.revenue.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-gray-500">¥{child.cost.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-blue-500">¥{child.profit.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-gray-600">{child.profitRate}%</td>
                  <td className="px-4 py-2 text-right text-gray-500">¥{child.avgPrice.toFixed(1)}</td>
                  <td className="px-4 py-2 text-right text-gray-600">{child.share}%</td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GrossProfitStats() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [activeQuick, setActiveQuick] = useState<"today" | "month" | "year" | "custom">("today");

  const setToday = () => {
    const d = new Date().toISOString().slice(0, 10);
    setStartDate(d); setEndDate(d); setActiveQuick("today");
  };
  const setMonth = () => {
    const now = new Date();
    const first = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const d = now.toISOString().slice(0, 10);
    setStartDate(first); setEndDate(d); setActiveQuick("month");
  };
  const setYear = () => {
    const year = new Date().getFullYear();
    setStartDate(`${year}-01-01`); setEndDate(`${year}-12-31`); setActiveQuick("year");
  };
  const handleReset = () => { setStartDate(today); setEndDate(today); setActiveQuick("today"); };

  const quickBtnClass = (key: string) =>
    `px-3 py-1.5 text-sm rounded-lg border transition-colors ${activeQuick === key ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`;

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">毛利统计</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button className={quickBtnClass("today")} onClick={setToday}>今日</button>
          <button className={quickBtnClass("month")} onClick={setMonth}>本月</button>
          <button className={quickBtnClass("year")} onClick={setYear}>本年</button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">开始日期：</span>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setActiveQuick("custom"); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">结束日期：</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setActiveQuick("custom"); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "营收收入", value: `¥${totalRevenue.toLocaleString()}`, color: "blue" },
            { label: "成本", value: `¥${totalCost.toLocaleString()}`, color: "orange" },
            { label: "毛利", value: `¥${totalProfit.toLocaleString()}`, color: "blue" },
            { label: "毛利率", value: `${totalProfitRate}%`, color: "blue" },
          ].map(card => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{card.label}</div>
              <div className={`text-xl font-bold ${card.color === "orange" ? "text-orange-500" : "text-blue-600"}`}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Category tables */}
        <CategoryTable rows={mockCategories} title="大类业绩" />
        <CategoryTable
          rows={mockCategories.flatMap(c => c.children ?? [])}
          title="二级品类业绩"
        />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

interface CategoryRow {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  profitRate: number;
  avgPrice: number;
  ratio: number;
  children?: SubCategoryRow[];
}

interface SubCategoryRow {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  profitRate: number;
  avgPrice: number;
  ratio: number;
}

const mockCategories: CategoryRow[] = [
  {
    id: "C1", name: "油品", quantity: 186, revenue: 28600, cost: 18200, profit: 10400, profitRate: 36.36, avgPrice: 153.76, ratio: 28.5,
    children: [
      { id: "SC1-1", name: "机油", quantity: 120, revenue: 18000, cost: 11000, profit: 7000, profitRate: 38.89, avgPrice: 150, ratio: 17.9 },
      { id: "SC1-2", name: "冷却液", quantity: 66, revenue: 10600, cost: 7200, profit: 3400, profitRate: 32.08, avgPrice: 160.6, ratio: 10.6 },
    ],
  },
  {
    id: "C2", name: "耗材", quantity: 134, revenue: 22400, cost: 14500, profit: 7900, profitRate: 35.27, avgPrice: 167.16, ratio: 22.3,
    children: [
      { id: "SC2-1", name: "机油滤清器", quantity: 80, revenue: 13200, cost: 8400, profit: 4800, profitRate: 36.36, avgPrice: 165, ratio: 13.2 },
      { id: "SC2-2", name: "空气滤清器", quantity: 54, revenue: 9200, cost: 6100, profit: 3100, profitRate: 33.70, avgPrice: 170.37, ratio: 9.2 },
    ],
  },
  {
    id: "C3", name: "制动系统", quantity: 96, revenue: 16800, cost: 10200, profit: 6600, profitRate: 39.29, avgPrice: 175, ratio: 16.7,
    children: [
      { id: "SC3-1", name: "刹车片", quantity: 60, revenue: 10200, cost: 6100, profit: 4100, profitRate: 40.20, avgPrice: 170, ratio: 10.2 },
      { id: "SC3-2", name: "刹车盘", quantity: 36, revenue: 6600, cost: 4100, profit: 2500, profitRate: 37.88, avgPrice: 183.33, ratio: 6.6 },
    ],
  },
  {
    id: "C4", name: "发动机", quantity: 72, revenue: 14200, cost: 9100, profit: 5100, profitRate: 35.92, avgPrice: 197.22, ratio: 14.1,
    children: [
      { id: "SC4-1", name: "皮带张紧轮", quantity: 40, revenue: 7800, cost: 4800, profit: 3000, profitRate: 38.46, avgPrice: 195, ratio: 7.8 },
      { id: "SC4-2", name: "凸轮轴油封", quantity: 32, revenue: 6400, cost: 4300, profit: 2100, profitRate: 32.81, avgPrice: 200, ratio: 6.4 },
    ],
  },
  {
    id: "C5", name: "配件", quantity: 88, revenue: 18600, cost: 11400, profit: 7200, profitRate: 38.71, avgPrice: 211.36, ratio: 18.5,
    children: [
      { id: "SC5-1", name: "雨刮器", quantity: 45, revenue: 8800, cost: 5200, profit: 3600, profitRate: 40.91, avgPrice: 195.56, ratio: 8.8 },
      { id: "SC5-2", name: "气门嘴", quantity: 43, revenue: 9800, cost: 6200, profit: 3600, profitRate: 36.73, avgPrice: 227.91, ratio: 9.8 },
    ],
  },
];

const mockSubCategories: SubCategoryRow[] = mockCategories.flatMap(c => c.children || []);

function formatAmount(val: number) {
  return val.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getDateRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { start: fmt(start), end: fmt(end) };
}

const TableSection: React.FC<{
  title: string;
  rows: (CategoryRow | SubCategoryRow)[];
  showChildren?: boolean;
  expandedIds?: Set<string>;
  onToggle?: (id: string) => void;
}> = ({ title, rows, showChildren, expandedIds, onToggle }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? <ExpandLessIcon sx={{ fontSize: 18 }} className="text-gray-500" /> : <ExpandMoreIcon sx={{ fontSize: 18 }} className="text-gray-500" />}
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["序号", "名称", "数量", "业绩", "成本", "毛利", "毛利率", "平均单价", "占比"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isCategory = showChildren && "children" in row;
                const isExpanded = expandedIds?.has(row.id);
                return (
                  <>
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 transition-colors ${isCategory ? "cursor-pointer hover:bg-blue-50/40" : "hover:bg-gray-50/60"} ${isExpanded ? "bg-blue-50/20" : ""}`}
                      onClick={() => isCategory && onToggle?.(row.id)}
                    >
                      <td className="px-4 py-2.5 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800 flex items-center gap-1.5 whitespace-nowrap">
                        {isCategory && (
                          isExpanded
                            ? <ExpandLessIcon sx={{ fontSize: 14 }} className="text-blue-500" />
                            : <ExpandMoreIcon sx={{ fontSize: 14 }} className="text-gray-400" />
                        )}
                        {row.name}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{row.quantity}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-800">{formatAmount(row.revenue)}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{formatAmount(row.cost)}</td>
                      <td className="px-4 py-2.5 text-sm text-green-700 font-medium">{formatAmount(row.profit)}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{row.profitRate.toFixed(2)}%</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{formatAmount(row.avgPrice)}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{row.ratio.toFixed(1)}%</td>
                    </tr>
                    {isExpanded && isCategory && (row as CategoryRow).children?.map((child, ci) => (
                      <tr key={child.id} className="border-b border-gray-100 bg-blue-50/10 hover:bg-blue-50/30 transition-colors">
                        <td className="pl-8 pr-4 py-2 text-sm text-gray-400">{idx + 1}.{ci + 1}</td>
                        <td className="pl-8 pr-4 py-2 text-sm text-gray-700 whitespace-nowrap">{child.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{child.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{formatAmount(child.revenue)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatAmount(child.cost)}</td>
                        <td className="px-4 py-2 text-sm text-green-600">{formatAmount(child.profit)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{child.profitRate.toFixed(2)}%</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatAmount(child.avgPrice)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{child.ratio.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-400">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const RevenueSummary: React.FC = () => {
  const defaultRange = getDateRange(30);
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);
  const [activeQuick, setActiveQuick] = useState<7 | 15 | 30 | null>(30);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const totalRevenue = mockCategories.reduce((s, c) => s + c.revenue, 0);
  const totalCost = mockCategories.reduce((s, c) => s + c.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const totalProfitRate = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const handleQuick = (days: 7 | 15 | 30) => {
    const r = getDateRange(days);
    setStartDate(r.start);
    setEndDate(r.end);
    setActiveQuick(days);
  };

  const handleSearch = () => {
    setActiveQuick(null);
  };

  const handleReset = () => {
    const r = getDateRange(30);
    setStartDate(r.start);
    setEndDate(r.end);
    setActiveQuick(30);
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const kpiBtn = "px-3 py-1.5 text-sm rounded-lg border transition-all";
  const kpiQuick = (days: 7 | 15 | 30) =>
    `${kpiBtn} ${activeQuick === days ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex-1 p-3 space-y-3">
        {/* Filter bar */}
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 shrink-0">开始日期</label>
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setActiveQuick(null); }}
              className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 bg-white w-36" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 shrink-0">结束日期</label>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setActiveQuick(null); }}
              className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 bg-white w-36" />
          </div>
          <div className="flex items-center gap-1.5">
            {([7, 15, 30] as const).map(d => (
              <button key={d} onClick={() => handleQuick(d)} className={kpiQuick(d)}>近{d}天</button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <button onClick={handleSearch}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center gap-1.5">
            <SearchIcon sx={{ fontSize: 15 }} />搜索
          </button>
          <button onClick={handleReset}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 15 }} />重置
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Profit overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-semibold text-gray-700 mb-2 pb-2 border-b border-gray-100">利润概览</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "收入", value: `¥${formatAmount(totalRevenue)}`, color: "text-blue-600" },
                { label: "成本", value: `¥${formatAmount(totalCost)}`, color: "text-orange-600" },
                { label: "毛利", value: `¥${formatAmount(totalProfit)}`, color: "text-green-600" },
                { label: "毛利率", value: `${totalProfitRate.toFixed(2)}%`, color: "text-purple-600" },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                  <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-semibold text-gray-700 mb-2 pb-2 border-b border-gray-100">营收汇总</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "营业额", value: `¥${formatAmount(totalRevenue * 1.08)}`, color: "text-blue-600" },
                { label: "实收金额", value: `¥${formatAmount(totalRevenue * 0.95)}`, color: "text-green-600" },
                { label: "实付金额", value: `¥${formatAmount(totalCost * 1.02)}`, color: "text-red-600" },
                { label: "项目销售", value: `¥${formatAmount(totalRevenue * 0.32)}`, color: "text-indigo-600" },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                  <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category tables */}
        <TableSection
          title="大类业绩"
          rows={mockCategories}
          showChildren
          expandedIds={expandedCategories}
          onToggle={toggleCategory}
        />
        <TableSection
          title="二级品类业绩"
          rows={mockSubCategories}
        />
      </div>
    </div>
  );
};

export default RevenueSummary;

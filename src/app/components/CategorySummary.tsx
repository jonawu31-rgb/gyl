import { useState } from "react";
import { FileDownload as ExportIcon, Search as SearchIcon } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CategoryRow {
  name: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  profitRate: number;
  avgPrice: number;
  share: number;
}

interface SubCategoryRow extends CategoryRow {
  parent: string;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

function genData(days: number): { categories: CategoryRow[]; subCategories: SubCategoryRow[] } {
  const factor = days / 30;
  const categories: CategoryRow[] = [
    { name: "发动机配件", quantity: Math.round(1240 * factor), revenue: Math.round(186000 * factor), cost: Math.round(124200 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { name: "刹车配件", quantity: Math.round(980 * factor), revenue: Math.round(98000 * factor), cost: Math.round(61250 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { name: "电器配件", quantity: Math.round(750 * factor), revenue: Math.round(112500 * factor), cost: Math.round(78750 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { name: "空调系统", quantity: Math.round(460 * factor), revenue: Math.round(64400 * factor), cost: Math.round(41860 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { name: "悬挂系统", quantity: Math.round(320 * factor), revenue: Math.round(96000 * factor), cost: Math.round(67200 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
  ];
  const totalRevenue = categories.reduce((s, r) => s + r.revenue, 0);
  categories.forEach((r) => {
    r.profit = r.revenue - r.cost;
    r.profitRate = r.profit / r.revenue * 100;
    r.avgPrice = r.revenue / r.quantity;
    r.share = r.revenue / totalRevenue * 100;
  });

  const subCategories: SubCategoryRow[] = [
    { parent: "发动机配件", name: "机油滤清器", quantity: Math.round(480 * factor), revenue: Math.round(43200 * factor), cost: Math.round(28800 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "发动机配件", name: "空气滤清器", quantity: Math.round(390 * factor), revenue: Math.round(58500 * factor), cost: Math.round(39000 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "发动机配件", name: "机油", quantity: Math.round(370 * factor), revenue: Math.round(84300 * factor), cost: Math.round(56400 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "刹车配件", name: "刹车片", quantity: Math.round(520 * factor), revenue: Math.round(52000 * factor), cost: Math.round(33800 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "刹车配件", name: "刹车盘", quantity: Math.round(280 * factor), revenue: Math.round(33600 * factor), cost: Math.round(19600 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "刹车配件", name: "刹车油", quantity: Math.round(180 * factor), revenue: Math.round(12400 * factor), cost: Math.round(7850 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "电器配件", name: "蓄电池", quantity: Math.round(210 * factor), revenue: Math.round(52500 * factor), cost: Math.round(37800 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "电器配件", name: "车灯", quantity: Math.round(340 * factor), revenue: Math.round(34000 * factor), cost: Math.round(22100 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "空调系统", name: "空调滤清器", quantity: Math.round(280 * factor), revenue: Math.round(28000 * factor), cost: Math.round(19600 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "空调系统", name: "压缩机", quantity: Math.round(80 * factor), revenue: Math.round(36400 * factor), cost: Math.round(22260 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "悬挂系统", name: "减震器", quantity: Math.round(200 * factor), revenue: Math.round(60000 * factor), cost: Math.round(42000 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
    { parent: "悬挂系统", name: "弹簧", quantity: Math.round(120 * factor), revenue: Math.round(36000 * factor), cost: Math.round(25200 * factor), profit: 0, profitRate: 0, avgPrice: 0, share: 0 },
  ];
  const totalSub = subCategories.reduce((s, r) => s + r.revenue, 0);
  subCategories.forEach((r) => {
    r.profit = r.revenue - r.cost;
    r.profitRate = r.profit / r.revenue * 100;
    r.avgPrice = r.revenue / r.quantity;
    r.share = r.revenue / totalSub * 100;
  });

  return { categories, subCategories };
}

function fmt(n: number) { return n.toLocaleString("zh-CN", { maximumFractionDigits: 0 }); }
function fmtMoney(n: number) { return "¥" + n.toLocaleString("zh-CN", { maximumFractionDigits: 0 }); }
function fmtPct(n: number) { return n.toFixed(1) + "%"; }

interface TableProps { rows: (CategoryRow | SubCategoryRow)[]; title: string; colors?: string[] }

function SummaryTable({ rows, title, colors }: TableProps) {
  const total = {
    quantity: rows.reduce((s, r) => s + r.quantity, 0),
    revenue: rows.reduce((s, r) => s + r.revenue, 0),
    cost: rows.reduce((s, r) => s + r.cost, 0),
    profit: rows.reduce((s, r) => s + r.profit, 0),
  };
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-800">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {["品类名称", "数量", "业绩", "成本", "毛利", "毛利率", "平均单价", "占比"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {colors && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />}
                    <span className="text-sm font-medium text-gray-800">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{fmt(r.quantity)}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{fmtMoney(r.revenue)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{fmtMoney(r.cost)}</td>
                <td className="px-4 py-2.5 text-sm text-green-700 font-medium">{fmtMoney(r.profit)}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-medium ${r.profitRate >= 30 ? "text-green-600" : r.profitRate >= 20 ? "text-blue-600" : "text-orange-600"}`}>
                    {fmtPct(r.profitRate)}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{fmtMoney(r.avgPrice)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, r.share)}%` }} />
                    </div>
                    <span className="text-xs text-gray-600">{fmtPct(r.share)}</span>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-blue-50 border-t-2 border-blue-200">
              <td className="px-4 py-2.5 text-sm font-bold text-gray-800">合计</td>
              <td className="px-4 py-2.5 text-sm font-semibold text-gray-800">{fmt(total.quantity)}</td>
              <td className="px-4 py-2.5 text-sm font-bold text-gray-800">{fmtMoney(total.revenue)}</td>
              <td className="px-4 py-2.5 text-sm font-semibold text-gray-800">{fmtMoney(total.cost)}</td>
              <td className="px-4 py-2.5 text-sm font-bold text-green-700">{fmtMoney(total.profit)}</td>
              <td className="px-4 py-2.5 text-xs font-medium text-blue-600">{fmtPct(total.profit / total.revenue * 100)}</td>
              <td className="px-4 py-2.5 text-sm text-gray-600">{fmtMoney(total.revenue / total.quantity)}</td>
              <td className="px-4 py-2.5 text-xs font-medium text-gray-600">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const QUICK_DAYS = [{ label: "近7天", days: 7 }, { label: "近15天", days: 15 }, { label: "近30天", days: 30 }];

export function CategorySummary() {
  const [quickDays, setQuickDays] = useState(30);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-29");
  const { categories, subCategories } = genData(quickDays);

  const totalRevenue = categories.reduce((s, r) => s + r.revenue, 0);
  const totalProfit = categories.reduce((s, r) => s + r.profit, 0);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">品类汇总</h2>
        <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
          <ExportIcon sx={{ fontSize: 16 }} />导出
        </button>
      </div>

      {/* Filter bar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            {QUICK_DAYS.map(({ label, days }) => (
              <button key={days} onClick={() => setQuickDays(days)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${quickDays === days ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-300" />
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-white" />
            <span className="text-gray-400 text-sm">至</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-white" />
          </div>
          <button className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <SearchIcon sx={{ fontSize: 16 }} />搜索
          </button>
          <button onClick={() => { setQuickDays(30); setStartDate("2026-05-01"); setEndDate("2026-05-29"); }}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">重置</button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "总业绩", value: fmtMoney(totalRevenue), sub: "近" + quickDays + "天", color: "blue" },
            { label: "总成本", value: fmtMoney(categories.reduce((s, r) => s + r.cost, 0)), sub: "近" + quickDays + "天", color: "gray" },
            { label: "总毛利", value: fmtMoney(totalProfit), sub: "近" + quickDays + "天", color: "green" },
            { label: "综合毛利率", value: fmtPct(totalProfit / totalRevenue * 100), sub: "平均", color: "purple" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-lg font-bold ${s.color === "blue" ? "text-blue-600" : s.color === "green" ? "text-green-600" : s.color === "purple" ? "text-purple-600" : "text-gray-700"}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-800">大类业绩分布</span>
          </div>
          <div className="p-4" style={{ height: 220 }}>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => "¥" + (v / 10000).toFixed(0) + "万"} />
                  <Tooltip formatter={(v: number) => fmtMoney(v)} labelStyle={{ fontWeight: 600 }} />
                  <Bar dataKey="revenue" name="业绩" radius={[4, 4, 0, 0]} barSize={18}>
                    {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables */}
        <SummaryTable rows={categories} title="大类业绩汇总" colors={COLORS} />
        <SummaryTable rows={subCategories} title="二级品类业绩明细" />
      </div>
    </div>
  );
}

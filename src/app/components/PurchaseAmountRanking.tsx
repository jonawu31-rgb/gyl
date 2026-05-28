import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

// ─── Mock data ────────────────────────────────────────────────────────────────

const months = ["2026-02", "2026-03", "2026-04", "2026-05"];

const suppliers = ["顺丰供应链", "德邦物流", "宝骏配件厂", "瑞派汽配", "中联汽车零部件"];

const supplierColors = ["#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#10B981"];

const rawData: Record<string, number[]> = {
  "顺丰供应链":    [128000, 145000, 136000, 162000],
  "德邦物流":      [98000,  112000, 125000, 118000],
  "宝骏配件厂":    [75000,  88000,  95000,  102000],
  "瑞派汽配":      [62000,  70000,  68000,  85000],
  "中联汽车零部件":[45000,  52000,  61000,  58000],
};

const chartData = months.map((month, idx) => {
  const entry: Record<string, string | number> = { month };
  suppliers.forEach(s => { entry[s] = rawData[s][idx]; });
  return entry;
});

// Totals for ranking
const supplierTotals = suppliers.map(s => ({
  name: s,
  total: rawData[s].reduce((a, b) => a + b, 0),
  monthly: rawData[s],
})).sort((a, b) => b.total - a.total);

const brands = ["博世", "德尔福", "宝骏", "法雷奥", "大陆"];
const categories = ["刹车系统", "发动机附件", "变速箱", "悬挂系统", "电气系统"];

function fmt(n: number) {
  if (n >= 10000) return `¥${(n / 10000).toFixed(1)}万`;
  return `¥${n.toLocaleString()}`;
}

function fmtFull(n: number) {
  return `¥${n.toLocaleString()}`;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold text-gray-700 mb-2">{label}</div>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-800">{fmtFull(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PurchaseAmountRanking() {
  const [startMonth, setStartMonth] = useState("2026-02");
  const [endMonth, setEndMonth] = useState("2026-05");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [categoryKw, setCategoryKw] = useState("");

  const visibleSuppliers = selectedSupplier
    ? suppliers.filter(s => s === selectedSupplier)
    : suppliers;

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">采购金额排行</h2>
      </div>

      {/* Filters */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">开始月份：</span>
            <input type="month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">结束月份：</span>
            <input type="month" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">品类：</span>
            <input value={categoryKw} onChange={(e) => setCategoryKw(e.target.value)} placeholder="请选择品类" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">供应商：</span>
            <FauxSelect className="flex-1" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} placeholder="请选择供应商">
              <option value="">全部</option>
              {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">品牌：</span>
            <FauxSelect className="flex-1" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} placeholder="请选择品牌">
              <option value="">全部</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2 col-start-4 justify-end">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setStartMonth("2026-02"); setEndMonth("2026-05"); setSelectedSupplier(""); setSelectedBrand(""); setCategoryKw(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0 p-4">
        {/* Chart */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">采购金额趋势对比</div>
          <div className="border-b border-gray-100 mb-4" />
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} tick={{ fontSize: 11, fill: "#6B7280" }} width={52} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                {visibleSuppliers.map((s, i) => (
                  <Line
                    key={s}
                    type="monotone"
                    dataKey={s}
                    stroke={supplierColors[suppliers.indexOf(s) % supplierColors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Ranking */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">供应商采购金额排行</div>
          <div className="border-b border-gray-100 mb-3" />
          <div className="space-y-2">
            {supplierTotals
              .filter(s => !selectedSupplier || s.name === selectedSupplier)
              .map((supplier, idx) => {
                const maxTotal = supplierTotals[0].total;
                const ratio = supplier.total / maxTotal;
                return (
                  <div key={supplier.name} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${idx === 0 ? "bg-yellow-100 text-yellow-700" : idx === 1 ? "bg-gray-100 text-gray-600" : idx === 2 ? "bg-orange-100 text-orange-600" : "bg-gray-50 text-gray-500"}`}>
                      {idx + 1}
                    </div>
                    <div className="w-32 shrink-0">
                      <div className="text-sm font-medium text-gray-800">{supplier.name}</div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${ratio * 100}%`, backgroundColor: supplierColors[suppliers.indexOf(supplier.name) % supplierColors.length] }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      {supplier.monthly.map((amt, mIdx) => (
                        <div key={months[mIdx]} className="text-center min-w-[72px]">
                          <div className="text-[11px] text-gray-400">{months[mIdx]}</div>
                          <div className="text-sm text-gray-700">{fmt(amt)}</div>
                        </div>
                      ))}
                      <div className="text-center min-w-[80px] border-l border-gray-200 pl-4">
                        <div className="text-[11px] text-gray-400">合计</div>
                        <div className="text-sm font-semibold text-gray-800">{fmt(supplier.total)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

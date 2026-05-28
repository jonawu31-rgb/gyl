import React, { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface SlowItem {
  id: string;
  name: string;
  category: string;
  code: string;
  warehouse: string;
  stock: number;
  costPrice: number;
  stockAmount: number;
  lastSaleDate: string;
  staleDays: number;
}

const mockSuppliers = ["博世供应商", "曼牌供应商", "NGK供应商", "壳牌供应商", "德尔福供应商"];
const mockBrands = ["博世", "曼牌", "NGK", "壳牌", "德尔福"];

const mockData: SlowItem[] = [
  { id: "1", name: "卡扣系列", category: "配件", code: "MHJKKE", warehouse: "嘉兴仓", stock: 0, costPrice: 0, stockAmount: 0, lastSaleDate: "-", staleDays: 365 },
  { id: "2", name: "转向头", category: "耗材", code: "SP000004", warehouse: "嘉兴仓", stock: 0, costPrice: 0, stockAmount: 0, lastSaleDate: "-", staleDays: 365 },
  { id: "3", name: "刹车片（前）", category: "制动系统", code: "SP000020", warehouse: "嘉兴仓", stock: 10, costPrice: 95, stockAmount: 950, lastSaleDate: "2026-02-10", staleDays: 107 },
  { id: "4", name: "减震器（前）", category: "悬挂系统", code: "SP000070", warehouse: "嘉兴仓", stock: 2, costPrice: 360, stockAmount: 720, lastSaleDate: "2026-02-01", staleDays: 116 },
  { id: "5", name: "节气门", category: "进气系统", code: "SP000035", warehouse: "嘉兴仓", stock: 3, costPrice: 210, stockAmount: 630, lastSaleDate: "2026-01-20", staleDays: 128 },
  { id: "6", name: "水泵", category: "冷却系统", code: "SP000095", warehouse: "嘉兴仓", stock: 2, costPrice: 165, stockAmount: 330, lastSaleDate: "2025-12-01", staleDays: 178 },
  { id: "7", name: "转向拉杆", category: "转向系统", code: "SP000060", warehouse: "嘉兴仓", stock: 4, costPrice: 145, stockAmount: 580, lastSaleDate: "2025-11-15", staleDays: 194 },
  { id: "8", name: "皮带张紧轮", category: "发动机", code: "SP000080", warehouse: "嘉兴仓", stock: 3, costPrice: 75, stockAmount: 225, lastSaleDate: "2025-10-20", staleDays: 220 },
];

const SlowInventory: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [brand, setBrand] = useState("");
  const [staleDays, setStaleDays] = useState(90);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = mockData.filter(r => {
    const q = keyword.toLowerCase();
    const matchKw = !keyword || r.name.includes(q) || r.code.includes(q);
    const matchCat = !category || r.category === category;
    const matchStale = r.staleDays >= staleDays;
    return matchKw && matchCat && matchStale;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalKinds = filtered.length;
  const totalQty = filtered.reduce((s, r) => s + r.stock, 0);
  const totalAmount = filtered.reduce((s, r) => s + r.stockAmount, 0);

  const btnPrimary = "px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 flex items-center gap-1.5";
  const btnSecondary = "px-3 py-1.5 text-sm rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5";

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-44">
            <SearchIcon sx={{ fontSize: 15 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="配件名称/编码" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <FauxSelect value={category} onChange={e => setCategory(e.target.value)} className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400 w-32">
            <option value="">品类</option>
            {["配件", "耗材", "油品", "制动系统", "发动机", "悬挂系统", "进气系统", "冷却系统", "转向系统"].map(c => <option key={c} value={c}>{c}</option>)}
          </FauxSelect>
          <FauxSelect value={supplier} onChange={e => setSupplier(e.target.value)} className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400 w-32">
            <option value="">供应商</option>
            {mockSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
          </FauxSelect>
          <FauxSelect value={brand} onChange={e => setBrand(e.target.value)} className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400 w-28">
            <option value="">品牌</option>
            {mockBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </FauxSelect>
          <div className="flex items-center gap-1.5">
            <input type="number" min={1} max={3650} value={staleDays} onChange={e => setStaleDays(Number(e.target.value) || 90)}
              className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-blue-400 bg-white" />
            <span className="text-sm text-gray-600 whitespace-nowrap">天未销售</span>
          </div>
          <button onClick={() => setCurrentPage(1)} className={btnPrimary}><SearchIcon sx={{ fontSize: 15 }} />搜索</button>
          <button onClick={() => { setKeyword(""); setCategory(""); setSupplier(""); setBrand(""); setStaleDays(90); setCurrentPage(1); }} className={btnSecondary}>
            <RefreshIcon sx={{ fontSize: 15 }} />重置
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "滞销商品种类", value: `${totalKinds} 种`, color: "text-blue-600" },
            { label: "滞销库存数量", value: `${totalQty} 件`, color: "text-orange-600" },
            { label: "滞销库存金额", value: `¥${totalAmount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`, color: "text-red-600" },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">{item.label}</span>
              <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["商品名称", "品类", "商品编码", "仓库名称", "库存数量", "成本价", "库存金额", "最后销售日期", "未销售天数"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{row.name}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.category}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.code}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.warehouse}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{row.stock}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">¥{row.costPrice.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">¥{row.stockAmount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.lastSaleDate}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-sm font-semibold ${row.staleDays >= 180 ? "text-red-600" : row.staleDays >= 90 ? "text-orange-500" : "text-gray-700"}`}>
                    {row.staleDays} 天
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
        <span className="text-xs text-gray-500">共 {filtered.length} 条数据</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-2.5 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">上一页</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 text-xs rounded border transition-all ${currentPage === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-2.5 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};

export default SlowInventory;

import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  ShoppingCart as PurchaseIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface WarningItem {
  id: string;
  name: string;
  spec: string;
  drawingNo: string;
  code: string;
  category: string;
  origin: string;
  supplier: string;
  warehouse: string;
  warningType: "low" | "high";
  warningTime: string;
  stock: number;
  minStock: number;
  maxStock: number;
  cost: number;
  price: number;
  profit: number;
  profitRate: number;
  stockTotal: number;
  retailTotal: number;
}

interface SafetyStockItem {
  id: string;
  name: string;
  spec: string;
  code: string;
  category: string;
  minStock: number;
  maxStock: number;
}

const mockWarningData: WarningItem[] = [
  {
    id: "1", name: "博世机油滤清器", spec: "OX-143D", drawingNo: "OX-143D", code: "SP000012",
    category: "耗材类", origin: "德国", supplier: "博世供应商", warehouse: "主仓库",
    warningType: "low", warningTime: "2026-05-28 09:12", stock: 2, minStock: 10, maxStock: 100,
    cost: 18.5, price: 28.0, profit: 9.5, profitRate: 33.9, stockTotal: 37, retailTotal: 56,
  },
  {
    id: "2", name: "NGK铱金火花塞", spec: "BKR6EIX", drawingNo: "BKR6EIX", code: "SP000034",
    category: "耗材类", origin: "日本", supplier: "NGK供应商", warehouse: "主仓库",
    warningType: "low", warningTime: "2026-05-28 08:45", stock: 3, minStock: 20, maxStock: 200,
    cost: 45.0, price: 68.0, profit: 23.0, profitRate: 33.8, stockTotal: 135, retailTotal: 204,
  },
  {
    id: "3", name: "刹车片（前）", spec: "标准型", drawingNo: "BP-7612", code: "SP000056",
    category: "制动系统", origin: "国产", supplier: "东风制动", warehouse: "嘉兴仓",
    warningType: "low", warningTime: "2026-05-27 16:30", stock: 4, minStock: 15, maxStock: 80,
    cost: 85.0, price: 128.0, profit: 43.0, profitRate: 33.6, stockTotal: 340, retailTotal: 512,
  },
  {
    id: "4", name: "空气滤清器", spec: "C24650", drawingNo: "C24650", code: "SP000078",
    category: "耗材类", origin: "德国", supplier: "曼牌供应商", warehouse: "主仓库",
    warningType: "low", warningTime: "2026-05-27 14:20", stock: 5, minStock: 25, maxStock: 150,
    cost: 22.0, price: 35.0, profit: 13.0, profitRate: 37.1, stockTotal: 110, retailTotal: 175,
  },
  {
    id: "5", name: "雨刮器（前）", spec: "600mm", drawingNo: "WB600", code: "SP000089",
    category: "外装件", origin: "国产", supplier: "博世供应商", warehouse: "主仓库",
    warningType: "high", warningTime: "2026-05-27 11:00", stock: 320, minStock: 10, maxStock: 200,
    cost: 28.0, price: 45.0, profit: 17.0, profitRate: 37.8, stockTotal: 8960, retailTotal: 14400,
  },
  {
    id: "6", name: "机油（壳牌5W-40）", spec: "4L装", drawingNo: "-", code: "SP000023",
    category: "油品", origin: "进口", supplier: "壳牌供应商", warehouse: "主仓库",
    warningType: "low", warningTime: "2026-05-26 17:45", stock: 1, minStock: 12, maxStock: 60,
    cost: 168.0, price: 228.0, profit: 60.0, profitRate: 26.3, stockTotal: 168, retailTotal: 228,
  },
  {
    id: "7", name: "减震器（前）", spec: "标准型", drawingNo: "SA-7238", code: "SP000045",
    category: "悬挂系统", origin: "国产", supplier: "东风汽配", warehouse: "嘉兴仓",
    warningType: "low", warningTime: "2026-05-26 09:30", stock: 1, minStock: 5, maxStock: 30,
    cost: 180.0, price: 260.0, profit: 80.0, profitRate: 30.8, stockTotal: 180, retailTotal: 260,
  },
];

const mockSafetyStockData: SafetyStockItem[] = [
  { id: "1", name: "博世机油滤清器", spec: "OX-143D", code: "SP000012", category: "耗材类", minStock: 10, maxStock: 100 },
  { id: "2", name: "NGK铱金火花塞", spec: "BKR6EIX", code: "SP000034", category: "耗材类", minStock: 20, maxStock: 200 },
  { id: "3", name: "刹车片（前）", spec: "标准型", code: "SP000056", category: "制动系统", minStock: 15, maxStock: 80 },
  { id: "4", name: "空气滤清器", spec: "C24650", code: "SP000078", category: "耗材类", minStock: 25, maxStock: 150 },
  { id: "5", name: "雨刮器（前）", spec: "600mm", code: "SP000089", category: "外装件", minStock: 10, maxStock: 200 },
  { id: "6", name: "机油（壳牌5W-40）", spec: "4L装", code: "SP000023", category: "油品", minStock: 12, maxStock: 60 },
  { id: "7", name: "减震器（前）", spec: "标准型", code: "SP000045", category: "悬挂系统", minStock: 5, maxStock: 30 },
  { id: "8", name: "冷却液", spec: "2L装", code: "SP000101", category: "耗材类", minStock: 15, maxStock: 80 },
];

interface SafetyEditState {
  id: string;
  minStock: number;
  maxStock: number;
}

function formatAmount(val: number) {
  return "¥" + val.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InventoryWarning() {
  const [activeTab, setActiveTab] = useState<"warning" | "safety">("warning");
  const [keyword, setKeyword] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<SafetyEditState | null>(null);
  const [safetyData, setSafetyData] = useState(mockSafetyStockData);
  const pageSize = 20;

  const filtered = mockWarningData.filter(r => {
    const q = keyword.toLowerCase();
    const matchKw = !keyword || r.name.includes(q) || r.code.includes(q);
    const matchWh = !warehouse || r.warehouse === warehouse;
    const matchCat = !category || r.category === category;
    return matchKw && matchWh && matchCat;
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allChecked = paged.length > 0 && paged.every(r => selectedIds.has(r.id));
  const toggleAll = () => {
    if (allChecked) {
      const next = new Set(selectedIds);
      paged.forEach(r => next.delete(r.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paged.forEach(r => next.add(r.id));
      setSelectedIds(next);
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleReset = () => {
    setKeyword("");
    setWarehouse("");
    setCategory("");
    setCurrentPage(1);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    setSafetyData(prev => prev.map(r =>
      r.id === editingItem.id
        ? { ...r, minStock: editingItem.minStock, maxStock: editingItem.maxStock }
        : r
    ));
    setEditingItem(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">库存预警</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex gap-1">
          {(["warning", "safety"] as const).map((tab) => {
            const label = tab === "warning" ? "库存预警" : "安全库存查询";
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-5 py-2.5 text-sm font-medium transition-all relative ${active ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                {label}
                {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        {activeTab === "warning" ? (
          <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">配件查询：</span>
              <input
                type="text"
                placeholder="输入配件名称/编码"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">仓库：</span>
              <FauxSelect
                className="flex-1"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                placeholder="请选择默认仓库"
              >
                <option value="">全部仓库</option>
                <option value="主仓库">主仓库</option>
                <option value="嘉兴仓">嘉兴仓</option>
                <option value="杭州仓">杭州仓</option>
              </FauxSelect>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">品类：</span>
              <FauxSelect
                className="flex-1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="请选择品类"
              >
                <option value="">全部品类</option>
                <option value="耗材类">耗材类</option>
                <option value="制动系统">制动系统</option>
                <option value="悬挂系统">悬挂系统</option>
                <option value="油品">油品</option>
                <option value="外装件">外装件</option>
              </FauxSelect>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
                <SearchIcon sx={{ fontSize: 16 }} />
                搜索
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5"
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
                重置
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">安全库存配置列表</span>
          </div>
        )}
      </div>

      {/* Action bar (warning tab only) */}
      {activeTab === "warning" && (
        <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <PurchaseIcon sx={{ fontSize: 16 }} />
              立即采购
            </button>
            <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <ExportIcon sx={{ fontSize: 16 }} />
              导出
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        {activeTab === "warning" ? (
          <div className="relative">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-3 text-left whitespace-nowrap w-10">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-10">序号</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">配件名称</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">图号</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">编码</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品类</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">产地</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">供应商</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">预警类型</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">预警时间</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">库存数量</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">最低库存</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">最高库存</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">售价</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利率</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">库存总额</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gray-50 shadow-[-2px_0_6px_rgba(0,0,0,0.06)]">零售总额</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.has(item.id) ? "bg-blue-50/30" : ""}`}
                  >
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleRow(item.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-2.5 text-sm font-medium text-gray-800 whitespace-nowrap">{item.name}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.spec}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.drawingNo}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.code}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.category}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.origin}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.supplier}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.warehouse}</td>
                    <td className="px-3 py-2.5 text-sm whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        item.warningType === "low" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.warningType === "low" ? "低于最低库存" : "高于最高库存"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.warningTime}</td>
                    <td className="px-3 py-2.5 text-sm text-right">
                      <span className={`font-semibold ${item.warningType === "low" ? "text-red-500" : "text-yellow-600"}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{item.minStock}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{item.maxStock}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{formatAmount(item.cost)}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{formatAmount(item.price)}</td>
                    <td className="px-3 py-2.5 text-sm text-blue-600 text-right">{formatAmount(item.profit)}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 text-right">{item.profitRate.toFixed(1)}%</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{formatAmount(item.stockTotal)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-right sticky right-0 bg-white shadow-[-2px_0_6px_rgba(0,0,0,0.06)]">
                      {formatAmount(item.retailTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">编码</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品类</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">最低库存</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">最高库存</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-20">操作</th>
              </tr>
            </thead>
            <tbody>
              {safetyData.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{item.spec}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-500">{item.code}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{item.category}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{item.minStock}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{item.maxStock}</td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => setEditingItem({ id: item.id, minStock: item.minStock, maxStock: item.maxStock })}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {activeTab === "warning" ? (
              <>
                已选择 <span className="font-semibold text-gray-800">{selectedIds.size}</span> 项 / 共 <span className="font-semibold text-gray-800">{filtered.length}</span> 项
              </>
            ) : (
              <>共 <span className="font-semibold text-gray-800">{safetyData.length}</span> 条</>
            )}
          </div>
          {activeTab === "warning" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))}
                disabled={currentPage >= (totalPages || 1)}
                className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Safety Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">编辑安全库存</h2>
              <button onClick={() => setEditingItem(null)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最低库存</label>
                <input
                  type="number"
                  value={editingItem.minStock}
                  onChange={(e) => setEditingItem({ ...editingItem, minStock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最高库存</label>
                <input
                  type="number"
                  value={editingItem.maxStock}
                  onChange={(e) => setEditingItem({ ...editingItem, maxStock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

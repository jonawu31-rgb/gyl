import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  QrCode as BarcodeIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface StockItem {
  id: string;
  name: string;
  spec: string;
  drawing: string;
  code: string;
  category: string;
  warehouse: string;
  cost: number;
  price: number;
  stock: number;
  origin: string;
  supplier: string;
}

const mockStock: StockItem[] = [
  { id: "1", name: "机油滤清器", spec: "标准型", drawing: "OE001", code: "SP000001", category: "油品", warehouse: "嘉兴仓", cost: 2.5, price: 10, stock: 2, origin: "原厂", supplier: "广州达华汽配" },
  { id: "2", name: "空气滤清器", spec: "高效型", drawing: "OE002", code: "SP000002", category: "油品", warehouse: "嘉兴仓", cost: 5, price: 10, stock: 1, origin: "副厂", supplier: "广州达华汽配" },
  { id: "3", name: "火花塞（铂金）", spec: "铂金4支", drawing: "OE003", code: "SP000003", category: "24125", warehouse: "黄油粒", cost: 5, price: 10, stock: 8, origin: "原厂", supplier: "佛山泰安汽配" },
];

interface TransactionItem {
  id: string;
  date: string;
  partName: string;
  spec: string;
  code: string;
  warehouse: string;
  inQty: number;
  outQty: number;
  balance: number;
  type: string;
  orderNo: string;
}

const mockTransactions: TransactionItem[] = [
  { id: "1", date: "2026-05-28", partName: "机油滤清器", spec: "标准型", code: "SP000001", warehouse: "嘉兴仓", inQty: 10, outQty: 0, balance: 12, type: "采购入库", orderNo: "PO20260528001" },
  { id: "2", date: "2026-05-27", partName: "机油滤清器", spec: "标准型", code: "SP000001", warehouse: "嘉兴仓", inQty: 0, outQty: 8, balance: 2, type: "销售出库", orderNo: "SO20260527001" },
  { id: "3", date: "2026-05-26", partName: "火花塞（铂金）", spec: "铂金4支", code: "SP000003", warehouse: "黄油粒", inQty: 20, outQty: 0, balance: 20, type: "采购入库", orderNo: "PO20260526001" },
  { id: "4", date: "2026-05-25", partName: "火花塞（铂金）", spec: "铂金4支", code: "SP000003", warehouse: "黄油粒", inQty: 0, outQty: 12, balance: 8, type: "销售出库", orderNo: "SO20260525001" },
];

export function StockQuery() {
  const [activeTab, setActiveTab] = useState<"stock" | "transaction">("stock");
  const [searchPart, setSearchPart] = useState("");
  const [searchWarehouse, setSearchWarehouse] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = mockStock.filter(r =>
    (!searchPart || r.name.includes(searchPart) || r.spec.includes(searchPart) || r.code.includes(searchPart) || r.drawing.includes(searchPart)) &&
    (!searchWarehouse || r.warehouse === searchWarehouse) &&
    (!searchCategory || r.category === searchCategory)
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalCost = filtered.reduce((s, r) => s + r.cost, 0);
  const totalStock = filtered.reduce((s, r) => s + r.stock, 0);
  const totalStockValue = filtered.reduce((s, r) => s + r.cost * r.stock, 0);
  const totalRetailValue = filtered.reduce((s, r) => s + r.price * r.stock, 0);

  const handleReset = () => { setSearchPart(""); setSearchWarehouse(""); setSearchCategory(""); setCurrentPage(1); };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paged.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map(r => r.id)));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">库存查询</h2>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex">
          {[["stock", "库存查询"], ["transaction", "商品收发明细"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "stock" | "transaction")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "stock" ? (
        <>
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">配件查询：</span>
                <input
                  type="text"
                  placeholder="名称/规格/条码/编码/OE码/图号"
                  value={searchPart}
                  onChange={e => { setSearchPart(e.target.value); setCurrentPage(1); }}
                  className="w-52 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">仓库：</span>
                <FauxSelect className="w-28" value={searchWarehouse} onChange={e => { setSearchWarehouse(e.target.value); setCurrentPage(1); }} placeholder="请选择">
                  <option value="">全部</option>
                  <option value="嘉兴仓">嘉兴仓</option>
                  <option value="黄油粒">黄油粒</option>
                </FauxSelect>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">品类：</span>
                <FauxSelect className="w-28" value={searchCategory} onChange={e => { setSearchCategory(e.target.value); setCurrentPage(1); }} placeholder="请选择">
                  <option value="">全部</option>
                  <option value="油品">油品</option>
                  <option value="24125">24125</option>
                </FauxSelect>
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

          <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                <DownloadIcon sx={{ fontSize: 16 }} />导出
              </button>
              <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                <BarcodeIcon sx={{ fontSize: 16 }} />打条码
                {selectedIds.size > 0 && <span className="ml-0.5 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">{selectedIds.size}</span>}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-3 w-10">
                    <input type="checkbox" className="accent-blue-500" checked={selectedIds.size === paged.length && paged.length > 0} onChange={toggleAll} />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 w-10">序号</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">配件名称</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">图号</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">编码</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品类</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">售价</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利率</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">库存数量</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">库存总额</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">零售总额</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">产地</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">供应商</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row, idx) => {
                  const margin = row.price - row.cost;
                  const marginRate = row.price > 0 ? Math.round((margin / row.price) * 100) : 0;
                  return (
                    <tr key={row.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.has(row.id) ? "bg-blue-50/30" : ""}`}>
                      <td className="px-3 py-2.5 text-center">
                        <input type="checkbox" className="accent-blue-500" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} />
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="px-3 py-2.5 text-gray-800 font-medium">{row.name}</td>
                      <td className="px-3 py-2.5 text-gray-600">{row.spec}</td>
                      <td className="px-3 py-2.5 text-gray-600 font-mono">{row.drawing}</td>
                      <td className="px-3 py-2.5 text-blue-600 font-mono">{row.code}</td>
                      <td className="px-3 py-2.5 text-gray-600">{row.category}</td>
                      <td className="px-3 py-2.5 text-gray-600">{row.warehouse}</td>
                      <td className="px-3 py-2.5 text-gray-800 text-right">{row.cost.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-gray-800 text-right">{row.price.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-gray-800 text-right">{margin.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-gray-800 text-right">{marginRate}%</td>
                      <td className="px-3 py-2.5 text-gray-800 text-right font-medium">{row.stock}</td>
                      <td className="px-3 py-2.5 text-gray-800 text-right">{(row.cost * row.stock).toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-gray-800 text-right">{(row.price * row.stock).toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-gray-600">{row.origin}</td>
                      <td className="px-3 py-2.5 text-gray-600">{row.supplier}</td>
                    </tr>
                  );
                })}
                {/* Summary row */}
                {filtered.length > 0 && (
                  <tr className="bg-blue-50 border-b border-blue-100 font-semibold">
                    <td className="px-3 py-2.5" colSpan={2} />
                    <td className="px-3 py-2.5 text-blue-700 text-sm">合计</td>
                    <td colSpan={5} />
                    <td className="px-3 py-2.5 text-right text-blue-700">{totalCost.toFixed(2)}</td>
                    <td colSpan={3} />
                    <td className="px-3 py-2.5 text-right text-blue-700">{totalStock}</td>
                    <td className="px-3 py-2.5 text-right text-blue-700">{totalStockValue.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right text-blue-700">{totalRetailValue.toFixed(2)}</td>
                    <td colSpan={2} />
                  </tr>
                )}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{filtered.length}</span> 条</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
                <button onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))} disabled={currentPage >= (totalPages || 1)} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">配件查询：</span>
                <input type="text" placeholder="名称/编码" className="w-44 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">日期：</span>
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white" />
                <span className="text-gray-400 text-sm">至</span>
                <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg flex items-center gap-1.5">
                  <SearchIcon sx={{ fontSize: 16 }} />搜索
                </button>
                <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 flex items-center gap-1.5">
                  <RefreshIcon sx={{ fontSize: 16 }} />重置
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-12">序号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">日期</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">配件名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">编码</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">入库数量</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">出库数量</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">结存数量</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">关联单号</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{row.partName}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.spec}</td>
                    <td className="px-4 py-2.5 text-blue-600 font-mono">{row.code}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.warehouse}</td>
                    <td className="px-4 py-2.5 text-right">{row.inQty > 0 ? <span className="text-blue-600">+{row.inQty}</span> : <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-2.5 text-right">{row.outQty > 0 ? <span className="text-red-500">-{row.outQty}</span> : <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-2.5 text-right text-gray-800 font-medium">{row.balance}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.type}</td>
                    <td className="px-4 py-2.5 text-gray-600 font-mono">{row.orderNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{mockTransactions.length}</span> 条</div>
          </div>
        </>
      )}
    </div>
  );
}

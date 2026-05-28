import React, { useState } from "react";
import {
  FileDownload as FileDownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PartItem {
  partsId: string;
  partsName: string;
  spec: string;
  drawingNo: string;
  barcode: string;
  origin: string;
  supplier: string;
  code: string;
  stock: number;
  costPrice: number;
  warehouse: string;
  category: string;
}

interface SelectedPart extends PartItem {
  transferPrice: number;
  quantity: number;
  costAmount: number;
  transferAmount: number;
  remark: string;
}

interface TransferRecord {
  id: string;
  orderNo: string;
  manualNo: string;
  createTime: string;
  toWarehouse: string;
  fromWarehouse: string;
  transferAmount: number;
  freight: number;
  transfererName: string;
  creatorName: string;
  receiverName: string;
  remark: string;
  auditStatus: "待审核" | "已审核" | "已驳回";
}

interface InboundRecord {
  id: string;
  orderNo: string;
  manualNo: string;
  inboundTime: string;
  fromWarehouse: string;
  transferAmount: number;
  freight: number;
  warehouseAdmin: string;
  creatorName: string;
}

interface VoidRecord extends TransferRecord {
  voidTime: string;
  voiderName: string;
}

const mockParts: PartItem[] = [
  { partsId: "P001", partsName: "刹车油", spec: "DOT4", drawingNo: "T-001", barcode: "6901234567890", origin: "德国", supplier: "博世供应商", code: "BOS3645356", stock: 100, costPrice: 45.50, warehouse: "总仓库", category: "刹车系统" },
  { partsId: "P002", partsName: "机油滤清器", spec: "标准型", drawingNo: "T-002", barcode: "6901234567891", origin: "日本", supplier: "曼牌供应商", code: "MAN24125", stock: 50, costPrice: 25.00, warehouse: "总仓库", category: "润滑系统" },
  { partsId: "P003", partsName: "空气滤清器", spec: "高效型", drawingNo: "T-003", barcode: "6901234567892", origin: "美国", supplier: "K&N供应商", code: "KN-AIR001", stock: 80, costPrice: 35.00, warehouse: "总仓库", category: "进气系统" },
  { partsId: "P004", partsName: "火花塞", spec: "铂金型", drawingNo: "T-004", barcode: "6901234567893", origin: "日本", supplier: "NGK供应商", code: "NGK-SPK001", stock: 200, costPrice: 28.00, warehouse: "副仓库", category: "点火系统" },
];

const mockCategories = ["全部", "刹车系统", "润滑系统", "进气系统", "点火系统"];
const mockWarehouses = ["总仓库", "副仓库", "东区仓库", "西区仓库"];
const mockEmployees = ["张三", "李四", "王五", "赵六"];

const mockHangRecords: TransferRecord[] = [
  { id: "H1", orderNo: "TRF20260528001", manualNo: "", createTime: "2026-05-28 10:00", toWarehouse: "东区仓库", fromWarehouse: "总仓库", transferAmount: 910.00, freight: 20.00, transfererName: "张三", creatorName: "操作员A", receiverName: "李四", remark: "", auditStatus: "待审核" },
];

const mockOutRecords: TransferRecord[] = [
  { id: "O1", orderNo: "TRF20260527001", manualNo: "M20260527", createTime: "2026-05-27 14:00", toWarehouse: "副仓库", fromWarehouse: "总仓库", transferAmount: 455.00, freight: 0, transfererName: "王五", creatorName: "操作员B", receiverName: "赵六", remark: "日常调拨", auditStatus: "已审核" },
  { id: "O2", orderNo: "TRF20260525001", manualNo: "", createTime: "2026-05-25 09:30", toWarehouse: "西区仓库", fromWarehouse: "总仓库", transferAmount: 280.00, freight: 15.00, transfererName: "张三", creatorName: "操作员A", receiverName: "李四", remark: "", auditStatus: "待审核" },
];

const mockInRecords: InboundRecord[] = [
  { id: "I1", orderNo: "TRF20260526001", manualNo: "", inboundTime: "2026-05-26 16:00", fromWarehouse: "总仓库", transferAmount: 350.00, freight: 10.00, warehouseAdmin: "仓管员A", creatorName: "操作员B" },
];

const mockVoidRecords: VoidRecord[] = [
  { id: "V1", orderNo: "TRF20260510001", manualNo: "", createTime: "2026-05-10 10:00", toWarehouse: "副仓库", fromWarehouse: "总仓库", transferAmount: 225.00, freight: 0, transfererName: "张三", creatorName: "操作员A", receiverName: "李四", remark: "", auditStatus: "待审核", voidTime: "2026-05-11 09:00", voiderName: "管理员" },
];

const auditStatusColors: Record<string, string> = {
  "待审核": "bg-yellow-100 text-yellow-700",
  "已审核": "bg-green-100 text-green-700",
  "已驳回": "bg-red-100 text-red-700",
};

type TabKey = "create" | "hang" | "outRecords" | "inRecords" | "voided";

const TransferManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("create");

  const tabs = [
    { key: "create" as TabKey, label: "调拨开单" },
    { key: "hang" as TabKey, label: "挂单记录" },
    { key: "outRecords" as TabKey, label: "调出记录" },
    { key: "inRecords" as TabKey, label: "调入记录" },
    { key: "voided" as TabKey, label: "作废记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-bold text-gray-800">调拨管理</h2>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-4">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.key ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "create" && <CreateTab />}
        {activeTab === "hang" && <HangTab />}
        {activeTab === "outRecords" && <OutRecordsTab />}
        {activeTab === "inRecords" && <InRecordsTab />}
        {activeTab === "voided" && <VoidedTab />}
      </div>
    </div>
  );
};

const CreateTab: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [searchResults, setSearchResults] = useState<PartItem[]>([]);
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  const [manualNo, setManualNo] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [receiver, setReceiver] = useState("");
  const [transferer, setTransferer] = useState("");
  const [freight, setFreight] = useState("");
  const [remark, setRemark] = useState("");

  const handleSearch = () => {
    if (!searchText.trim() && (!categoryFilter || categoryFilter === "全部")) {
      setSearchResults([]);
      return;
    }
    const q = searchText.toLowerCase();
    setSearchResults(mockParts.filter(p =>
      (!q || p.partsName.includes(q) || p.code.toLowerCase().includes(q) || p.spec.includes(q) || p.drawingNo.includes(q)) &&
      (categoryFilter === "全部" || !categoryFilter || p.category === categoryFilter)
    ));
  };

  const handleAddPart = (part: PartItem) => {
    if (selectedParts.find(p => p.partsId === part.partsId)) return;
    setSelectedParts(prev => [...prev, {
      ...part, transferPrice: part.costPrice, quantity: 1,
      costAmount: part.costPrice, transferAmount: part.costPrice, remark: ""
    }]);
    setSearchText("");
    setSearchResults([]);
  };

  const updatePart = (id: string, field: "transferPrice" | "quantity", val: number) => {
    setSelectedParts(prev => prev.map(p => {
      if (p.partsId !== id) return p;
      const np = { ...p, [field]: val };
      np.costAmount = +(np.costPrice * np.quantity).toFixed(2);
      np.transferAmount = +(np.transferPrice * np.quantity).toFixed(2);
      return np;
    }));
  };

  const updateRemark = (id: string, val: string) => {
    setSelectedParts(prev => prev.map(p => p.partsId === id ? { ...p, remark: val } : p));
  };

  const removePart = (id: string) => setSelectedParts(prev => prev.filter(p => p.partsId !== id));

  const handleReset = () => {
    setSelectedParts([]);
    setManualNo(""); setToWarehouse(""); setReceiver(""); setTransferer(""); setFreight(""); setRemark("");
    setSearchText(""); setSearchResults([]); setCategoryFilter("全部");
  };

  const handleSubmit = () => {
    if (selectedParts.length === 0) { alert("请至少选择一个配件"); return; }
    if (!toWarehouse) { alert("请选择调入仓库"); return; }
    if (!receiver) { alert("请选择收货人"); return; }
    if (!transferer) { alert("请选择调拨员"); return; }
    alert("调拨单提交成功！");
    handleReset();
  };

  const totalCost = selectedParts.reduce((s, p) => s + p.costAmount, 0);
  const totalTransfer = selectedParts.reduce((s, p) => s + p.transferAmount, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar - pinned */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 shrink-0">配件查询</span>
          <div className="relative flex-1 min-w-40">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="名称/规格/条码/编码/OE码/图号"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">品类</label>
            <FauxSelect value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-28">
              {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </FauxSelect>
          </div>
          <button onClick={handleSearch} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
        </div>
      </div>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-auto">
        {searchResults.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-4 py-2 bg-blue-50 text-xs font-medium text-blue-600">搜索结果（点击行添加配件）</div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  {["配件名称","规格","图号","条码","产地","供应商","编码","门店库存","成本价","仓库"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchResults.map(part => (
                  <tr key={part.partsId} onClick={() => handleAddPart(part)}
                    className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors">
                    <td className="px-3 py-2 text-sm text-blue-600 font-medium">{part.partsName}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.spec}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.drawingNo}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.barcode}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.origin}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.supplier}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.code}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.stock}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.costPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm text-gray-700">{part.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["配件名称","规格","图号","条码","成本价","*调拨价","数量","成本金额","调拨金额","备注","产地","供应商","调出仓库","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedParts.length === 0 ? (
              <tr><td colSpan={14} className="px-4 py-12 text-center text-sm text-gray-400">暂无数据，请搜索并添加配件</td></tr>
            ) : selectedParts.map(part => (
              <tr key={part.partsId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-2 text-sm text-gray-900 font-medium whitespace-nowrap">{part.partsName}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.spec}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.drawingNo}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.barcode}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.costPrice.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <input type="number" min={0} step={0.01} value={part.transferPrice}
                    onChange={e => updatePart(part.partsId, "transferPrice", parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-blue-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-3 py-2">
                  <input type="number" min={1} value={part.quantity}
                    onChange={e => updatePart(part.partsId, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.costAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-sm font-semibold text-gray-800">{part.transferAmount.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <input type="text" placeholder="请输入" value={part.remark} onChange={e => updateRemark(part.partsId, e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400" />
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.origin}</td>
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">{part.supplier}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.warehouse}</td>
                <td className="px-3 py-2">
                  <button onClick={() => removePart(part.partsId)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom footer - pinned */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">手工单号</label>
            <input type="text" placeholder="请输入" value={manualNo} onChange={e => setManualNo(e.target.value)}
              className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 调入仓库</label>
            <FauxSelect value={toWarehouse} onChange={e => setToWarehouse(e.target.value)} className="w-28">
              <option value="">请选择</option>
              {mockWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 收货人</label>
            <FauxSelect value={receiver} onChange={e => setReceiver(e.target.value)} className="w-24">
              <option value="">请选择</option>
              {mockEmployees.map(a => <option key={a} value={a}>{a}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 调拨员</label>
            <FauxSelect value={transferer} onChange={e => setTransferer(e.target.value)} className="w-24">
              <option value="">请选择</option>
              {mockEmployees.map(a => <option key={a} value={a}>{a}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">运费</label>
            <input type="number" min={0} placeholder="0" value={freight} onChange={e => setFreight(e.target.value)}
              className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">备注</label>
            <input type="text" placeholder="请输入" value={remark} onChange={e => setRemark(e.target.value)}
              className="w-36 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="text-sm text-gray-600 shrink-0">
            成本：<span className="font-semibold text-gray-800">¥{totalCost.toFixed(2)}</span>
            <span className="mx-1.5 text-gray-300">|</span>
            调拨：<span className="font-semibold text-blue-600">¥{totalTransfer.toFixed(2)}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => alert("已保存为挂单！")} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">挂单</button>
            <button onClick={handleReset} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">重置</button>
            <button onClick={handleSubmit} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">提交</button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ListTabProps {
  records: TransferRecord[];
  columns: string[];
  renderRow: (r: TransferRecord, index: number, pageOffset: number) => React.ReactNode;
  showExport?: boolean;
  extraFilters?: React.ReactNode;
}

const RecordListTab: React.FC<ListTabProps> = ({ records, columns, renderRow, showExport = true, extraFilters }) => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = records.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          {showExport && (
            <>
              <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
                <FileDownloadIcon sx={{ fontSize: 16 }} />导出
              </button>
              <div className="w-px h-6 bg-gray-300" />
            </>
          )}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">关键字</label>
            <input type="text" placeholder="单号" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          {extraFilters}
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">开始日期</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">结束日期</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => { setKeyword(""); setStartDate(""); setEndDate(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {columns.map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, i) => renderRow(r, i, (currentPage - 1) * pageSize))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{total}</span> 条</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">上一页</button>
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};

const HangTab: React.FC = () => (
  <RecordListTab
    records={mockHangRecords}
    columns={["序号","单号","手工单号","开单时间","调入仓库","调拨金额","运费","调拨员","开单员","备注","收货人","操作"]}
    renderRow={(r, i, offset) => (
      <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
        <td className="px-3 py-3 text-sm text-gray-700">{offset + i + 1}</td>
        <td className="px-3 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.manualNo || "-"}</td>
        <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.toWarehouse}</td>
        <td className="px-3 py-3 text-sm font-semibold text-gray-800">¥{r.transferAmount.toFixed(2)}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.transfererName}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.creatorName}</td>
        <td className="px-3 py-3 text-sm text-gray-600">{r.remark || "-"}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.receiverName}</td>
        <td className="px-3 py-3 flex items-center gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <EditIcon sx={{ fontSize: 16 }} />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <DeleteIcon sx={{ fontSize: 16 }} />
          </button>
        </td>
      </tr>
    )}
  />
);

const OutRecordsTab: React.FC = () => (
  <RecordListTab
    records={mockOutRecords}
    columns={["序号","单号","手工单号","开单时间","调入仓库","商品金额","运费","调拨员","开单员","审核状态","操作"]}
    renderRow={(r, i, offset) => (
      <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
        <td className="px-3 py-3 text-sm text-gray-700">{offset + i + 1}</td>
        <td className="px-3 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.manualNo || "-"}</td>
        <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.toWarehouse}</td>
        <td className="px-3 py-3 text-sm font-semibold text-gray-800">¥{r.transferAmount.toFixed(2)}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.transfererName}</td>
        <td className="px-3 py-3 text-sm text-gray-700">{r.creatorName}</td>
        <td className="px-3 py-3">
          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${auditStatusColors[r.auditStatus]}`}>{r.auditStatus}</span>
        </td>
        <td className="px-3 py-3">
          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </button>
        </td>
      </tr>
    )}
  />
);

const InRecordsTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = mockInRecords.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = mockInRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 16 }} />导出
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">关键字</label>
            <input type="text" placeholder="单号" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">开始日期</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">结束日期</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => { setKeyword(""); setStartDate(""); setEndDate(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号","单号","手工单号","入库时间","调出仓库","商品金额","运费","仓库管理员","开单员","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.manualNo || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.inboundTime}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.fromWarehouse}</td>
                <td className="px-3 py-3 text-sm font-semibold text-gray-800">¥{r.transferAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.warehouseAdmin}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.creatorName}</td>
                <td className="px-3 py-3">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{total}</span> 条</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">上一页</button>
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};

const VoidedTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = mockVoidRecords.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = mockVoidRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 16 }} />导出
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">关键字</label>
            <input type="text" placeholder="单号" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">开始日期</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">结束日期</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => { setKeyword(""); setStartDate(""); setEndDate(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号","单号","手工单号","撤销时间","开单时间","调入仓库","商品金额","运费","调拨员","开单员","撤单员","备注","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={13} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.manualNo || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.voidTime}</td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.toWarehouse}</td>
                <td className="px-3 py-3 text-sm font-semibold text-gray-800">¥{r.transferAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.transfererName}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.creatorName}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.voiderName}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{r.remark || "-"}</td>
                <td className="px-3 py-3">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{total}</span> 条</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">上一页</button>
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};

export default TransferManagement;

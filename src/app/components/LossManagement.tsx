import { useState } from "react";
import {
  FileDownload as FileDownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PartItem {
  partsId: string;
  partsName: string;
  spec: string;
  brand: string;
  origin: string;
  supplier: string;
  code: string;
  stock: number;
  costPrice: number;
  warehouse: string;
  category: string;
}

interface SelectedPart extends PartItem {
  quantity: number;
  subtotal: number;
  remark: string;
}

interface LossRecord {
  id: string;
  orderNo: string;
  createTime: string;
  totalAmount: number;
  lossReason: string;
  creatorName: string;
  status: "submitted" | "voided";
}

interface VoidRecord extends LossRecord {
  voidTime: string;
  voiderName: string;
}

const mockParts: PartItem[] = [
  { partsId: "P001", partsName: "前刹车片", spec: "通用型", brand: "ATE", category: "刹车系统", origin: "德国", supplier: "ATE供应商", code: "ATE-BRK001", stock: 100, costPrice: 45.00, warehouse: "主仓库" },
  { partsId: "P002", partsName: "机油滤清器", spec: "标准型", brand: "曼牌", category: "润滑系统", origin: "日本", supplier: "曼牌供应商", code: "MAN-OIL001", stock: 50, costPrice: 25.00, warehouse: "主仓库" },
  { partsId: "P003", partsName: "空气滤清器", spec: "高效型", brand: "K&N", category: "进气系统", origin: "美国", supplier: "K&N供应商", code: "KN-AIR001", stock: 80, costPrice: 35.00, warehouse: "主仓库" },
  { partsId: "P004", partsName: "火花塞", spec: "铂金型", brand: "NGK", category: "点火系统", origin: "日本", supplier: "NGK供应商", code: "NGK-SPK001", stock: 200, costPrice: 28.00, warehouse: "副仓库" },
];

const mockRecords: LossRecord[] = [
  { id: "1", orderNo: "LOSS20260528001", createTime: "2026-05-28 10:30", totalAmount: 180.00, lossReason: "配件损坏无法使用", creatorName: "黄伟霆", status: "submitted" },
  { id: "2", orderNo: "LOSS20260526001", createTime: "2026-05-26 14:20", totalAmount: 75.00, lossReason: "仓储过期", creatorName: "张强", status: "submitted" },
];

const mockVoidRecords: VoidRecord[] = [
  { id: "V1", orderNo: "LOSS20260510001", createTime: "2026-05-10 09:00", totalAmount: 112.00, lossReason: "丢失", creatorName: "王五", status: "voided", voidTime: "2026-05-10 16:00", voiderName: "管理员" },
];

type TabKey = "create" | "records" | "voided";

const LossManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("create");

  const tabs = [
    { key: "create" as TabKey, label: "报损开单" },
    { key: "records" as TabKey, label: "报损记录" },
    { key: "voided" as TabKey, label: "作废记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-bold text-gray-800">报损管理</h2>
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
        {activeTab === "records" && <RecordsTab />}
        {activeTab === "voided" && <VoidedTab />}
      </div>
    </div>
  );
};

const CreateTab: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<PartItem[]>([]);
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  const [lossReason, setLossReason] = useState("");

  const handleSearch = () => {
    if (!searchText.trim()) { setSearchResults([]); return; }
    const q = searchText.toLowerCase();
    setSearchResults(mockParts.filter(p =>
      p.partsName.includes(q) || p.code.toLowerCase().includes(q) || p.spec.includes(q)
    ));
  };

  const handleAddPart = (part: PartItem) => {
    if (selectedParts.find(p => p.partsId === part.partsId)) return;
    setSelectedParts(prev => [...prev, { ...part, quantity: 1, subtotal: part.costPrice, remark: "" }]);
    setSearchText("");
    setSearchResults([]);
  };

  const updateQty = (id: string, qty: number) => {
    setSelectedParts(prev => prev.map(p =>
      p.partsId === id ? { ...p, quantity: qty, subtotal: +(p.costPrice * qty).toFixed(2) } : p
    ));
  };

  const updateRemark = (id: string, val: string) => {
    setSelectedParts(prev => prev.map(p => p.partsId === id ? { ...p, remark: val } : p));
  };

  const removePart = (id: string) => setSelectedParts(prev => prev.filter(p => p.partsId !== id));

  const handleReset = () => {
    setSelectedParts([]);
    setLossReason("");
    setSearchText("");
    setSearchResults([]);
  };

  const handleSubmit = () => {
    if (selectedParts.length === 0) { alert("请至少选择一个配件"); return; }
    if (!lossReason.trim()) { alert("请填写报损原因"); return; }
    alert("报损单提交成功！");
    handleReset();
  };

  const totalCost = selectedParts.reduce((s, p) => s + p.subtotal, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 shrink-0">配件查询</span>
          <div className="relative flex-1 min-w-52">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="名称/规格/条码/编码/OE码"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white"
            />
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
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  {["配件名称","规格","品类","产地","供应商","编码","门店库存","成本价","仓库"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchResults.map(part => (
                  <tr key={part.partsId} onClick={() => handleAddPart(part)}
                    className="border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{part.partsName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.spec}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.origin}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.supplier}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.stock}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.costPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{part.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["配件名称","规格","编码","成本价","数量","合计","备注","产地","供应商","仓库","操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedParts.length === 0 ? (
              <tr><td colSpan={11} className="px-4 py-12 text-center text-sm text-gray-400">请在上方搜索配件并点击添加</td></tr>
            ) : selectedParts.map(part => (
              <tr key={part.partsId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">{part.partsName}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{part.spec}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{part.code}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{part.costPrice.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <input type="number" min={1} max={part.stock} value={part.quantity}
                    onChange={e => updateQty(part.partsId, Math.min(part.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{part.subtotal.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <input type="text" placeholder="请输入" value={part.remark} onChange={e => updateRemark(part.partsId, e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{part.origin}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{part.supplier}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{part.warehouse}</td>
                <td className="px-4 py-3">
                  <button onClick={() => removePart(part.partsId)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 报损原因</label>
            <input type="text" placeholder="请输入报损原因（损坏/过期/丢失等）" value={lossReason} onChange={e => setLossReason(e.target.value)}
              className="w-64 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{selectedParts.length}</span> 种，合计：<span className="font-semibold text-blue-600">¥{totalCost.toFixed(2)}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={handleReset} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">重置</button>
            <button onClick={handleSubmit} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">提交</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecordsTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = mockRecords.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = mockRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <input type="text" placeholder="名称/规格/条码/编码/OE码" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-52 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => setKeyword("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号","单号","开单时间","报损金额","报损原因","开单员","操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{r.orderNo}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">¥{r.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.lossReason}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.creatorName}</td>
                <td className="px-4 py-3">
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
              className="w-52 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => setKeyword("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号","单号","撤销时间","开单时间","报损金额","报损原因","开单员","撤单员","操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{r.orderNo}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.voidTime}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">¥{r.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.lossReason}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.creatorName}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.voiderName}</td>
                <td className="px-4 py-3">
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

export default LossManagement;

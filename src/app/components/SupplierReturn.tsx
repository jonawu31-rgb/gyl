import { useState } from "react";
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
  brand: string;
  origin: string;
  supplier: string;
  code: string;
  stock: number;
  costPrice: number;
  warehouse: string;
}

interface SelectedPart extends PartItem {
  returnPrice: number;
  quantity: number;
  costAmount: number;
  returnAmount: number;
  remark: string;
}

interface ReturnRecord {
  id: string;
  orderNo: string;
  manualNo: string;
  createTime: string;
  costAmount: number;
  returnAmount: number;
  paymentMethod: string;
  freight: number;
  returnerName: string;
  creatorName: string;
  remark: string;
  refundableAmount: number;
  refundedAmount: number;
  refundStatus: "未退款" | "部分退款" | "已退款";
  supplierName: string;
}

interface VoidRecord extends ReturnRecord {
  voidTime: string;
  voiderName: string;
}

const mockParts: PartItem[] = [
  { partsId: "P001", partsName: "刹车油", spec: "DOT4", brand: "博世", origin: "德国", supplier: "博世供应商", code: "BOS3645356", stock: 100, costPrice: 45.50, warehouse: "总仓库" },
  { partsId: "P002", partsName: "机油滤清器", spec: "标准型", brand: "曼牌", origin: "日本", supplier: "曼牌供应商", code: "MAN24125", stock: 50, costPrice: 25.00, warehouse: "总仓库" },
  { partsId: "P003", partsName: "空气滤清器", spec: "高效型", brand: "K&N", origin: "美国", supplier: "K&N供应商", code: "KN-AIR001", stock: 80, costPrice: 35.00, warehouse: "总仓库" },
  { partsId: "P004", partsName: "火花塞", spec: "铂金型", brand: "NGK", origin: "日本", supplier: "NGK供应商", code: "NGK-SPK001", stock: 200, costPrice: 28.00, warehouse: "副仓库" },
];

const mockSuppliers = ["博世供应商", "曼牌供应商", "K&N供应商", "NGK供应商"];
const mockEmployees = ["张三", "李四", "王五", "赵六"];
const mockPaymentMethods = ["现金", "银行转账", "支票", "微信", "支付宝"];

const mockRecords: ReturnRecord[] = [
  { id: "1", orderNo: "RET20260528001", manualNo: "", createTime: "2026-05-28 10:30", costAmount: 455.00, returnAmount: 430.00, paymentMethod: "现金", freight: 25.00, returnerName: "张三", creatorName: "操作员A", remark: "质量问题退货", refundableAmount: 430.00, refundedAmount: 430.00, refundStatus: "已退款", supplierName: "博世供应商" },
  { id: "2", orderNo: "RET20260527001", manualNo: "M20260527", createTime: "2026-05-27 14:20", costAmount: 250.00, returnAmount: 240.00, paymentMethod: "银行转账", freight: 0, returnerName: "李四", creatorName: "操作员B", remark: "", refundableAmount: 240.00, refundedAmount: 120.00, refundStatus: "部分退款", supplierName: "曼牌供应商" },
];

const mockDrafts: ReturnRecord[] = [
  { id: "D1", orderNo: "RET20260528002", manualNo: "", createTime: "2026-05-28 11:00", costAmount: 175.00, returnAmount: 165.00, paymentMethod: "现金", freight: 10.00, returnerName: "王五", creatorName: "操作员A", remark: "", refundableAmount: 165.00, refundedAmount: 0, refundStatus: "未退款", supplierName: "K&N供应商" },
];

const mockVoidRecords: VoidRecord[] = [
  { id: "V1", orderNo: "RET20260510001", manualNo: "", createTime: "2026-05-10 09:00", costAmount: 140.00, returnAmount: 130.00, paymentMethod: "现金", freight: 10.00, returnerName: "张三", creatorName: "操作员A", remark: "", refundableAmount: 130.00, refundedAmount: 0, refundStatus: "未退款", supplierName: "NGK供应商", voidTime: "2026-05-11 10:00", voiderName: "管理员" },
];

const refundStatusColors: Record<string, string> = {
  "未退款": "bg-gray-100 text-gray-700",
  "部分退款": "bg-yellow-100 text-yellow-700",
  "已退款": "bg-green-100 text-green-700",
};

type TabKey = "create" | "draft" | "records" | "voided";

const SupplierReturn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("create");

  const tabs = [
    { key: "create" as TabKey, label: "退货开单" },
    { key: "draft" as TabKey, label: "退货草稿" },
    { key: "records" as TabKey, label: "退货记录" },
    { key: "voided" as TabKey, label: "作废记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-bold text-gray-800">供应商退货</h2>
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
        {activeTab === "draft" && <DraftTab />}
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
  const [manualNo, setManualNo] = useState("");
  const [returner, setReturner] = useState("");
  const [supplier, setSupplier] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [freight, setFreight] = useState("");
  const [remark, setRemark] = useState("");

  const handleSearch = () => {
    if (!searchText.trim()) { setSearchResults([]); return; }
    const q = searchText.toLowerCase();
    setSearchResults(mockParts.filter(p =>
      p.partsName.includes(q) || p.code.toLowerCase().includes(q) || p.spec.includes(q)
    ));
  };

  const handleAddPart = (part: PartItem) => {
    if (selectedParts.find(p => p.partsId === part.partsId)) return;
    setSelectedParts(prev => [...prev, {
      ...part, returnPrice: part.costPrice, quantity: 1,
      costAmount: part.costPrice, returnAmount: part.costPrice, remark: ""
    }]);
    setSearchText("");
    setSearchResults([]);
  };

  const updatePart = (id: string, field: "returnPrice" | "quantity", val: number) => {
    setSelectedParts(prev => prev.map(p => {
      if (p.partsId !== id) return p;
      const np = { ...p, [field]: val };
      np.costAmount = +(np.costPrice * np.quantity).toFixed(2);
      np.returnAmount = +(np.returnPrice * np.quantity).toFixed(2);
      return np;
    }));
  };

  const updateRemark = (id: string, val: string) => {
    setSelectedParts(prev => prev.map(p => p.partsId === id ? { ...p, remark: val } : p));
  };

  const removePart = (id: string) => setSelectedParts(prev => prev.filter(p => p.partsId !== id));

  const handleReset = () => {
    setSelectedParts([]);
    setManualNo(""); setReturner(""); setSupplier(""); setPaymentMethod(""); setFreight(""); setRemark("");
    setSearchText(""); setSearchResults([]);
  };

  const handleSubmit = () => {
    if (selectedParts.length === 0) { alert("请至少选择一个配件"); return; }
    if (!returner) { alert("请选择退货员"); return; }
    if (!supplier) { alert("请选择供应商"); return; }
    if (selectedParts.some(p => p.returnPrice <= 0)) { alert("请填写退货价格"); return; }
    alert("退货单提交成功！");
    handleReset();
  };

  const totalCost = selectedParts.reduce((s, p) => s + p.costAmount, 0);
  const totalReturn = selectedParts.reduce((s, p) => s + p.returnAmount, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar - pinned */}
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
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  {["配件名称","规格","品牌","产地","供应商","编码","门店库存","成本价","仓库"].map(h => (
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
                    <td className="px-3 py-2 text-sm text-gray-700">{part.brand}</td>
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
              {["配件名称","规格","编码","成本价","*退货价","数量","成本金额","退货金额","备注","产地","供应商","仓库","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedParts.length === 0 ? (
              <tr><td colSpan={13} className="px-4 py-12 text-center text-sm text-gray-400">暂无数据，请搜索并添加配件</td></tr>
            ) : selectedParts.map(part => (
              <tr key={part.partsId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-2 text-sm text-gray-900 font-medium whitespace-nowrap">{part.partsName}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.spec}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.code}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.costPrice.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <input type="number" min={0} step={0.01} value={part.returnPrice}
                    onChange={e => updatePart(part.partsId, "returnPrice", parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-blue-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-3 py-2">
                  <input type="number" min={1} value={part.quantity}
                    onChange={e => updatePart(part.partsId, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.costAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-sm font-semibold text-gray-800">{part.returnAmount.toFixed(2)}</td>
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
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 退货员</label>
            <FauxSelect value={returner} onChange={e => setReturner(e.target.value)} className="w-28">
              <option value="">请选择</option>
              {mockEmployees.map(a => <option key={a} value={a}>{a}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 供应商</label>
            <FauxSelect value={supplier} onChange={e => setSupplier(e.target.value)} className="w-32">
              <option value="">请选择</option>
              {mockSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">收款方式</label>
            <FauxSelect value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-24">
              <option value="">请选择</option>
              {mockPaymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
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
            退货：<span className="font-semibold text-blue-600">¥{totalReturn.toFixed(2)}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => alert("已保存为草稿！")} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">草稿</button>
            <button onClick={handleReset} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">重置</button>
            <button onClick={handleSubmit} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">提交</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DraftTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = mockDrafts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = mockDrafts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <input type="text" placeholder="单号/手工单号" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-44 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => setKeyword("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号","单号","手工单号","开单时间","成本金额","退货金额","退款方式","运费","退货员","开单员","备注","可退总额","已退金额","退款状态","供应商","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={16} className="px-4 py-8 text-center text-sm text-gray-400">暂无草稿</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.manualNo || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.costAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm font-semibold text-gray-800">¥{r.returnAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.paymentMethod || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.returnerName}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.creatorName}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{r.remark || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.refundableAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.refundedAmount.toFixed(2)}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${refundStatusColors[r.refundStatus]}`}>{r.refundStatus}</span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.supplierName}</td>
                <td className="px-3 py-3 flex items-center gap-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <EditIcon sx={{ fontSize: 16 }} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <DeleteIcon sx={{ fontSize: 16 }} />
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

const RecordsTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [partQuery, setPartQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [returner, setReturner] = useState("");
  const [supplier, setSupplier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
            <input type="text" placeholder="单号/手工单号" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">配件查询</label>
            <input type="text" placeholder="配件名称/编码" value={partQuery} onChange={e => setPartQuery(e.target.value)}
              className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">收款方式</label>
            <FauxSelect value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-24">
              <option value="">全部</option>
              {mockPaymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">退货员</label>
            <FauxSelect value={returner} onChange={e => setReturner(e.target.value)} className="w-28">
              <option value="">全部</option>
              {mockEmployees.map(a => <option key={a} value={a}>{a}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">供应商</label>
            <FauxSelect value={supplier} onChange={e => setSupplier(e.target.value)} className="w-32">
              <option value="">全部</option>
              {mockSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
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
          <button onClick={() => { setKeyword(""); setPartQuery(""); setPaymentMethod(""); setReturner(""); setSupplier(""); setStartDate(""); setEndDate(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号","单号","手工单号","开单时间","成本金额","退货金额","退款方式","运费","退货员","开单员","备注","可退总额","已退金额","退款状态","供应商","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.manualNo || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.costAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm font-semibold text-gray-800">¥{r.returnAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.paymentMethod || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.returnerName}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.creatorName}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{r.remark || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.refundableAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.refundedAmount.toFixed(2)}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${refundStatusColors[r.refundStatus]}`}>{r.refundStatus}</span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.supplierName}</td>
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
            <input type="text" placeholder="单号/手工单号" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-44 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => setKeyword("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号","单号","手工单号","撤销时间","开单时间","成本金额","退货金额","退款方式","运费","退货员","开单员","撤单员","备注","可退总额","已退金额","退款状态","供应商","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={18} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.manualNo || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.voidTime}</td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.costAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm font-semibold text-gray-800">¥{r.returnAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.paymentMethod || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.returnerName}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.creatorName}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{r.voiderName}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{r.remark || "-"}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.refundableAmount.toFixed(2)}</td>
                <td className="px-3 py-3 text-sm text-gray-700">¥{r.refundedAmount.toFixed(2)}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${refundStatusColors[r.refundStatus]}`}>{r.refundStatus}</span>
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.supplierName}</td>
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

export default SupplierReturn;

import { useState } from "react";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Block as VoidIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface KitPart {
  partId: string;
  partName: string;
  partCode: string;
  spec: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  stock: number;
}

interface AssemblyRecord {
  assemblyId: string;
  kitName: string;
  quantity: number;
  assemblyDate: string;
  totalCost: number;
  operator: string;
  status: "已组装" | "已作废";
  remark: string;
  parts: KitPart[];
}

interface KitTemplate {
  templateId: string;
  name: string;
  parts: KitPart[];
}

const mockTemplates: KitTemplate[] = [
  {
    templateId: "TPL001",
    name: "标准套件A",
    parts: [
      { partId: "P001", partName: "前刹车片",   partCode: "BRK001", spec: "通用型", quantity: 4, unitCost: 45, subtotal: 180, stock: 100 },
      { partId: "P002", partName: "机油滤清器", partCode: "OIL001", spec: "标准型", quantity: 1, unitCost: 25, subtotal: 25,  stock: 50  },
    ],
  },
  {
    templateId: "TPL002",
    name: "高级套件B",
    parts: [
      { partId: "P003", partName: "空气滤清器", partCode: "AIR001", spec: "高效型", quantity: 1, unitCost: 35, subtotal: 35,  stock: 80  },
      { partId: "P004", partName: "火花塞",     partCode: "SPK001", spec: "铂金",   quantity: 4, unitCost: 28, subtotal: 112, stock: 200 },
    ],
  },
];

const mockAvailableParts: KitPart[] = [
  { partId: "P001", partName: "前刹车片",   partCode: "BRK001", spec: "通用型", quantity: 0, unitCost: 45, subtotal: 0, stock: 100 },
  { partId: "P002", partName: "机油滤清器", partCode: "OIL001", spec: "标准型", quantity: 0, unitCost: 25, subtotal: 0, stock: 50  },
  { partId: "P003", partName: "空气滤清器", partCode: "AIR001", spec: "高效型", quantity: 0, unitCost: 35, subtotal: 0, stock: 80  },
  { partId: "P004", partName: "火花塞",     partCode: "SPK001", spec: "铂金",   quantity: 0, unitCost: 28, subtotal: 0, stock: 200 },
  { partId: "P005", partName: "后刹车片",   partCode: "BRK002", spec: "通用型", quantity: 0, unitCost: 50, subtotal: 0, stock: 75  },
];

const mockRecords: AssemblyRecord[] = [
  {
    assemblyId: "ASM20260528001", kitName: "标准套件A", quantity: 10,
    assemblyDate: "2026-05-28", totalCost: 2050, operator: "张三",
    status: "已组装", remark: "常规组装",
    parts: [
      { partId: "P001", partName: "前刹车片",   partCode: "BRK001", spec: "通用型", quantity: 40, unitCost: 45, subtotal: 1800, stock: 100 },
      { partId: "P002", partName: "机油滤清器", partCode: "OIL001", spec: "标准型", quantity: 10, unitCost: 25, subtotal: 250,  stock: 50  },
    ],
  },
  {
    assemblyId: "ASM20260527001", kitName: "高级套件B", quantity: 5,
    assemblyDate: "2026-05-27", totalCost: 735, operator: "李四",
    status: "已组装", remark: "",
    parts: [
      { partId: "P003", partName: "空气滤清器", partCode: "AIR001", spec: "高效型", quantity: 5,  unitCost: 35, subtotal: 175, stock: 80  },
      { partId: "P004", partName: "火花塞",     partCode: "SPK001", spec: "铂金",   quantity: 20, unitCost: 28, subtotal: 560, stock: 200 },
    ],
  },
];

// ─── Void Confirm ──────────────────────────────────────────────────────────────
function VoidConfirm({ id, onClose, onConfirm }: { id: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">提示</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-6 text-sm text-gray-700">确定要作废组装单 <span className="font-medium">{id}</span> 吗？</div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确定</button>
        </div>
      </div>
    </div>
  );
}

// ─── Parts Selection Dialog ────────────────────────────────────────────────────
function PartsSelectionDialog({ selectedParts, onClose, onConfirm }: {
  selectedParts: KitPart[];
  onClose: () => void;
  onConfirm: (parts: KitPart[]) => void;
}) {
  const [parts, setParts] = useState<KitPart[]>(
    mockAvailableParts.map(p => {
      const existing = selectedParts.find(sp => sp.partId === p.partId);
      return existing ? { ...existing } : { ...p };
    })
  );
  const [searchText, setSearchText] = useState("");

  const filtered = parts.filter(p => p.partName.includes(searchText) || p.partCode.includes(searchText));

  const handleQtyChange = (partId: string, qty: number) => {
    setParts(parts.map(p => {
      if (p.partId !== partId) return p;
      const q = Math.max(0, qty);
      return { ...p, quantity: q, subtotal: q * p.unitCost };
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-semibold text-gray-800">选择配件</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-4 py-3 border-b border-gray-200 shrink-0">
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="搜索配件名称或编码" className="w-72 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件编码</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">库存</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">单价</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">使用数量</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">小计</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(part => (
                <tr key={part.partId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-sm text-gray-600 font-mono">{part.partCode}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-800">{part.partName}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.spec}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 text-right">{part.stock}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{part.unitCost.toFixed(2)}</td>
                  <td className="px-4 py-2.5">
                    <input type="number" min="0" max={part.stock} value={part.quantity} onChange={e => handleQtyChange(part.partId, parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 text-center" />
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-800 text-right">¥{part.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 shrink-0">
          <div className="text-sm text-gray-600">已选 <span className="font-semibold text-blue-600">{parts.filter(p => p.quantity > 0).length}</span> 种配件</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
            <button onClick={() => onConfirm(parts.filter(p => p.quantity > 0))} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Assembly Dialog ────────────────────────────────────────────────────
function AddAssemblyDialog({ onClose, onSave }: { onClose: () => void; onSave: (r: AssemblyRecord) => void }) {
  const [templateId, setTemplateId] = useState("");
  const [kitName, setKitName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [remark, setRemark] = useState("");
  const [selectedParts, setSelectedParts] = useState<KitPart[]>([]);
  const [showParts, setShowParts] = useState(false);

  const handleTemplateSelect = (tid: string) => {
    setTemplateId(tid);
    const tpl = mockTemplates.find(t => t.templateId === tid);
    if (tpl) { setKitName(tpl.name); setSelectedParts(tpl.parts.map(p => ({ ...p }))); }
  };

  const handleSubmit = () => {
    if (!kitName || selectedParts.length === 0) { alert("请填写套件名称并选择配件"); return; }
    const insufficient = selectedParts.filter(p => p.quantity * quantity > p.stock);
    if (insufficient.length > 0) { alert(`以下配件库存不足：${insufficient.map(p => p.partName).join("、")}`); return; }
    const totalCost = selectedParts.reduce((s, p) => s + p.subtotal, 0) * quantity;
    const newRec: AssemblyRecord = {
      assemblyId: `ASM${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      kitName, quantity, assemblyDate: new Date().toISOString().slice(0, 10),
      totalCost, operator: "黄伟霆", status: "已组装", remark,
      parts: selectedParts.map(p => ({ ...p, quantity: p.quantity * quantity, subtotal: p.subtotal * quantity })),
    };
    onSave(newRec);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-semibold text-gray-800">新增组装</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 w-24 shrink-0">从模版选择</label>
            <FauxSelect className="flex-1" value={templateId} onChange={e => handleTemplateSelect(e.target.value)} placeholder="选择模版...">
              {mockTemplates.map(t => <option key={t.templateId} value={t.templateId}>{t.name}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 w-24 shrink-0"><span className="text-red-500">*</span> 套件名称</label>
            <input value={kitName} onChange={e => setKitName(e.target.value)} placeholder="输入套件名称" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 w-24 shrink-0">组装数量</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-start gap-3">
            <label className="text-sm text-gray-700 w-24 shrink-0 pt-1.5">配件列表</label>
            <div className="flex-1">
              <button onClick={() => setShowParts(true)} className="mb-3 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg text-sm hover:bg-blue-50 flex items-center gap-1.5">
                <AddIcon sx={{ fontSize: 16 }} />添加配件
              </button>
              {selectedParts.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">配件名称</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">规格</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">单位用量</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">单价</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">小计</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedParts.map(part => (
                        <tr key={part.partId} className="border-b border-gray-100">
                          <td className="px-3 py-2 text-gray-800">{part.partName}</td>
                          <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                          <td className="px-3 py-2 text-right">{part.quantity}</td>
                          <td className="px-3 py-2 text-right">¥{part.unitCost.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">¥{part.subtotal.toFixed(2)}</td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => setSelectedParts(selectedParts.filter(p => p.partId !== part.partId))} className="text-xs text-red-500 hover:text-red-700">移除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-sm font-medium flex justify-between">
                    <span>单套成本合计</span><span>¥{selectedParts.reduce((s, p) => s + p.subtotal, 0).toFixed(2)}</span>
                  </div>
                  <div className="px-3 py-2 bg-blue-50 border-t border-gray-200 text-sm font-semibold flex justify-between">
                    <span>总成本（×{quantity}）</span>
                    <span className="text-blue-700">¥{(selectedParts.reduce((s, p) => s + p.subtotal, 0) * quantity).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <label className="text-sm text-gray-700 w-24 shrink-0 pt-1.5">备注</label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} placeholder="选填" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
      {showParts && (
        <PartsSelectionDialog
          selectedParts={selectedParts}
          onClose={() => setShowParts(false)}
          onConfirm={parts => { setSelectedParts(parts); setShowParts(false); }}
        />
      )}
    </div>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────
function DetailDialog({ record, onClose }: { record: AssemblyRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-semibold text-gray-800">组装单详情</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[["组装单号", record.assemblyId], ["套件名称", record.kitName], ["组装数量", String(record.quantity)], ["组装日期", record.assemblyDate], ["操作人", record.operator]].map(([l, v]) => (
              <div key={l} className="flex gap-3">
                <span className="text-gray-500 w-20 shrink-0">{l}：</span>
                <span className="font-medium text-gray-800">{v}</span>
              </div>
            ))}
            <div className="flex gap-3">
              <span className="text-gray-500 w-20 shrink-0">成本合计：</span>
              <span className="font-semibold text-blue-600">¥{record.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-500 w-20 shrink-0">状态：</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${record.status === "已组装" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-red-100 text-red-700 border border-red-200"}`}>{record.status}</span>
            </div>
            {record.remark && (
              <div className="col-span-2 flex gap-3">
                <span className="text-gray-500 w-20 shrink-0">备注：</span>
                <span className="text-gray-700">{record.remark}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">配件明细</h4>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700">配件编码</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700">配件名称</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700">规格</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700">使用数量</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700">单价</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700">小计</th>
                </tr>
              </thead>
              <tbody>
                {record.parts.map(part => (
                  <tr key={part.partId} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-600 font-mono">{part.partCode}</td>
                    <td className="px-3 py-2 text-gray-800">{part.partName}</td>
                    <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                    <td className="px-3 py-2 text-right">{part.quantity}</td>
                    <td className="px-3 py-2 text-right">¥{part.unitCost.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-medium">¥{part.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={5} className="px-3 py-2 text-right font-semibold text-gray-700">合计</td>
                  <td className="px-3 py-2 text-right font-semibold text-blue-600">¥{record.totalCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const KitAssembly: React.FC = () => {
  const [records, setRecords] = useState<AssemblyRecord[]>(mockRecords);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [detailRecord, setDetailRecord] = useState<AssemblyRecord | null>(null);
  const [voidRecord, setVoidRecord] = useState<AssemblyRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = records.filter(r =>
    (!searchText || r.kitName.includes(searchText) || r.assemblyId.includes(searchText)) &&
    (!statusFilter || r.status === statusFilter) &&
    (!startDate || r.assemblyDate >= startDate) &&
    (!endDate || r.assemblyDate <= endDate)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchText(""); setStartDate(""); setEndDate(""); setStatusFilter(""); setCurrentPage(1); };

  const handleVoidConfirm = () => {
    if (voidRecord) {
      setRecords(records.map(r => r.assemblyId === voidRecord.assemblyId ? { ...r, status: "已作废" } : r));
      setVoidRecord(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">套件组装</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">套件名称/单号：</span>
            <input value={searchText} onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }} placeholder="请输入" className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">组装日期：</span>
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            <span className="text-gray-400 text-sm">-</span>
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">状态：</span>
            <FauxSelect className="w-28" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} placeholder="全部">
              <option value="">全部</option>
              <option value="已组装">已组装</option>
              <option value="已作废">已作废</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(1)} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => setShowAddDialog(true)} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增组装
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">组装单号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">套件名称</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">组装数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">组装日期</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本合计</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((record, idx) => (
              <tr key={record.assemblyId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 font-mono">{record.assemblyId}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{record.kitName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{record.quantity}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{record.assemblyDate}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800 text-right">¥{record.totalCost.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{record.operator}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${record.status === "已组装" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-red-100 text-red-700 border border-red-200"}`}>{record.status}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button onClick={() => setDetailRecord(record)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                      <ViewIcon sx={{ fontSize: 13 }} />查看
                    </button>
                    {record.status === "已组装" && (
                      <button onClick={() => setVoidRecord(record)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                        <VoidIcon sx={{ fontSize: 13 }} />作废
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
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

      {showAddDialog && <AddAssemblyDialog onClose={() => setShowAddDialog(false)} onSave={r => { setRecords([r, ...records]); setShowAddDialog(false); }} />}
      {detailRecord && <DetailDialog record={detailRecord} onClose={() => setDetailRecord(null)} />}
      {voidRecord && <VoidConfirm id={voidRecord.assemblyId} onClose={() => setVoidRecord(null)} onConfirm={handleVoidConfirm} />}
    </div>
  );
};

import React from "react";
export default KitAssembly;

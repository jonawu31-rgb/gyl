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
  vehicleType?: string;
  featureCode?: string;
  origin?: string;
  unit?: string;
  supplierName?: string;
  warehouse?: string;
  brand?: string;
  remark?: string;
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
  { partId: "P001", partName: "转向头", partCode: "SP000004", spec: "", vehicleType: "", featureCode: "", origin: "", unit: "", supplierName: "", warehouse: "嘉兴仓", brand: "", remark: "", quantity: 0, unitCost: 45, subtotal: 0, stock: 100 },
  { partId: "P002", partName: "壳牌机油", partCode: "SP000003", spec: "", vehicleType: "", featureCode: "", origin: "", unit: "", supplierName: "", warehouse: "嘉兴仓", brand: "", remark: "", quantity: 0, unitCost: 25, subtotal: 0, stock: 50 },
  { partId: "P003", partName: "5646356", partCode: "352+656", spec: "", vehicleType: "单独的", featureCode: "", origin: "", unit: "个", supplierName: "黄油粒", warehouse: "黄油粒", brand: "乐学", remark: "", quantity: 0, unitCost: 35, subtotal: 0, stock: 80 },
  { partId: "P004", partName: "下轴", partCode: "L034200000297", spec: "", vehicleType: "伽途T3/祥菱V1", featureCode: "原厂", origin: "原厂", unit: "根", supplierName: "", warehouse: "嘉兴仓", brand: "原厂", remark: "", quantity: 0, unitCost: 28, subtotal: 0, stock: 200 },
  { partId: "P005", partName: "卡扣【盟虎机】F", partCode: "MHJKKF", spec: "F", vehicleType: "通用", featureCode: "自营品牌", origin: "", unit: "个", supplierName: "", warehouse: "嘉兴仓", brand: "盟虎机", remark: "", quantity: 0, unitCost: 50, subtotal: 0, stock: 75 },
  { partId: "P006", partName: "卡扣【盟虎机】E", partCode: "MHJKKE", spec: "E", vehicleType: "通用", featureCode: "自营品牌", origin: "", unit: "个", supplierName: "", warehouse: "嘉兴仓", brand: "盟虎机", remark: "", quantity: 0, unitCost: 50, subtotal: 0, stock: 75 },
  { partId: "P007", partName: "卡扣【盟虎机】D", partCode: "MHJKKD", spec: "D", vehicleType: "通用", featureCode: "自营品牌", origin: "", unit: "个", supplierName: "", warehouse: "嘉兴仓", brand: "盟虎机", remark: "", quantity: 0, unitCost: 50, subtotal: 0, stock: 75 },
  { partId: "P008", partName: "卡扣【盟虎机】C", partCode: "MHJKKC", spec: "C", vehicleType: "通用", featureCode: "自营品牌", origin: "", unit: "个", supplierName: "", warehouse: "嘉兴仓", brand: "盟虎机", remark: "", quantity: 0, unitCost: 50, subtotal: 0, stock: 75 },
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
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(selectedParts.map((part) => part.partId))
  );

  const filtered = parts.filter(
    (p) =>
      (!searchName || p.partName.includes(searchName)) &&
      (!searchCode || p.partCode.includes(searchCode))
  );

  const toggleSelect = (partId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(partId)) {
        next.delete(partId);
      } else {
        next.add(partId);
      }
      return next;
    });
  };

  const handleReset = () => {
    setSearchName("");
    setSearchCode("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-semibold text-gray-800">选择配件</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-4 py-3 border-b border-gray-200 shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 whitespace-nowrap">配件名称</span>
              <input value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="配件名称" className="w-56 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 whitespace-nowrap">配件编码</span>
              <input value={searchCode} onChange={e => setSearchCode(e.target.value)} placeholder="配件编码" className="w-56 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm flex items-center gap-1.5">
                <SearchIcon sx={{ fontSize: 16 }} />搜索
              </button>
              <button onClick={handleReset} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
                <RefreshIcon sx={{ fontSize: 16 }} />重置
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto min-h-0 px-4 py-3">
          <div className="overflow-auto border border-gray-200">
          <table className="w-max min-w-full">
            <thead className="bg-emerald-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-3 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && filtered.every((part) => selectedIds.has(part.partId))}
                    onChange={() => {
                      const allSelected = filtered.length > 0 && filtered.every((part) => selectedIds.has(part.partId));
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        filtered.forEach((part) => {
                          if (allSelected) next.delete(part.partId);
                          else next.add(part.partId);
                        });
                        return next;
                      });
                    }}
                    className="w-4 h-4 rounded border-gray-300 accent-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">序号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件编码</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">适用车型</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">特征码</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">产地</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单位</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">供应商名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品牌</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">备注</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((part, index) => (
                <tr key={part.partId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(part.partId)}
                      onChange={() => toggleSelect(part.partId)}
                      className="w-4 h-4 rounded border-gray-300 accent-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 font-mono">{part.partCode}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-800">{part.partName}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.spec || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.vehicleType || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.featureCode || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.origin || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.unit || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.supplierName || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.warehouse || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.brand || ""}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{part.remark || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 shrink-0">
          <div className="text-sm text-gray-600">共 <span className="font-semibold text-emerald-600">82</span> 条数据</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FauxSelect className="w-28" value="20" onChange={() => undefined}>
                <option value="20">20条/页</option>
              </FauxSelect>
              <button className="w-7 h-7 border border-gray-200 rounded bg-white text-gray-400">{`<`}</button>
              <button className="w-7 h-7 rounded bg-emerald-500 text-white">1</button>
              <button className="w-7 h-7 border border-gray-200 rounded bg-white text-gray-600">2</button>
              <button className="w-7 h-7 border border-gray-200 rounded bg-white text-gray-600">3</button>
              <button className="w-7 h-7 border border-gray-200 rounded bg-white text-gray-600">4</button>
              <button className="w-7 h-7 border border-gray-200 rounded bg-white text-gray-600">5</button>
              <button className="w-7 h-7 border border-gray-200 rounded bg-white text-gray-400">{`>`}</button>
              <span className="ml-2">前往</span>
              <input value="1" readOnly className="w-14 px-2 py-1 border border-gray-300 rounded text-center bg-white" />
              <span>页</span>
            </div>
            <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
            <button
              onClick={() => onConfirm(parts.filter((p) => selectedIds.has(p.partId)).map((p) => ({ ...p, quantity: p.quantity || 1, subtotal: (p.quantity || 1) * p.unitCost })))}
              className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 shadow-sm"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Assembly Dialog ────────────────────────────────────────────────────
function AddAssemblyDialog({ onClose, onSave }: { onClose: () => void; onSave: (r: AssemblyRecord) => void }) {
  const [activeTab, setActiveTab] = useState<"template" | "parts">("template");
  const [target, setTarget] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [otherCost, setOtherCost] = useState("");
  const [operator, setOperator] = useState("");
  const [inWarehouse, setInWarehouse] = useState("");
  const [outWarehouse, setOutWarehouse] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedParts, setSelectedParts] = useState<KitPart[]>([]);
  const [showParts, setShowParts] = useState(false);

  const handleTemplateSelect = (tid: string) => {
    setTemplateId(tid);
    const tpl = mockTemplates.find(t => t.templateId === tid);
    if (tpl) {
      setSelectedParts(tpl.parts.map(p => ({ ...p })));
    }
  };

  const handleSubmit = () => {
    if (!target || !templateId || !operator || quantity <= 0) {
      alert("请完善必填信息");
      return;
    }
    if (selectedParts.length === 0) {
      alert("请选择配件明细");
      return;
    }
    const insufficient = selectedParts.filter(p => p.quantity * quantity > p.stock);
    if (insufficient.length > 0) { alert(`以下配件库存不足：${insufficient.map(p => p.partName).join("、")}`); return; }
    const partsCost = selectedParts.reduce((s, p) => s + p.subtotal, 0) * quantity;
    const totalCost = partsCost + Number(laborCost || 0) + Number(otherCost || 0);
    const newRec: AssemblyRecord = {
      assemblyId: `ASM${new Date().toISOString().slice(0, 10).replace(/-/g, "")}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      kitName: `${target}-${templateId}`, quantity, assemblyDate: new Date().toISOString().slice(0, 10),
      totalCost, operator, status: "已组装", remark,
      parts: selectedParts.map(p => ({ ...p, quantity: p.quantity * quantity, subtotal: p.subtotal * quantity })),
    };
    onSave(newRec);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-semibold text-gray-800">新增套件组装</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 pt-4 shrink-0">
          <div className="flex justify-center">
            <div className="inline-flex border border-gray-300 rounded-sm overflow-hidden">
              <button onClick={() => setActiveTab("template")} className={`px-4 py-2 text-sm min-w-28 ${activeTab === "template" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"}`}>模版信息</button>
              <button onClick={() => setActiveTab("parts")} className={`px-4 py-2 text-sm min-w-28 ${activeTab === "parts" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"}`}>配件明细</button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === "template" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-16 shrink-0">对象</label>
                  <FauxSelect className="flex-1" value={target} onChange={e => setTarget(e.target.value)} placeholder="请选择对象">
                    <option value="保养套件">保养套件</option>
                    <option value="维修套件">维修套件</option>
                    <option value="精品套件">精品套件</option>
                  </FauxSelect>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-20 shrink-0"><span className="text-red-500">*</span> 配件模块</label>
                  <FauxSelect className="flex-1" value={templateId} onChange={e => handleTemplateSelect(e.target.value)} placeholder="请选择配件模块">
                    {mockTemplates.map(t => <option key={t.templateId} value={t.templateId}>{t.name}</option>)}
                  </FauxSelect>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-20 shrink-0"><span className="text-red-500">*</span> 人工费用</label>
                  <input value={laborCost} onChange={e => setLaborCost(e.target.value)} placeholder="请输入人工费用" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-20 shrink-0"><span className="text-red-500">*</span> 数量</label>
                  <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} placeholder="请输入数量" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-20 shrink-0">其他成本</label>
                  <input value={otherCost} onChange={e => setOtherCost(e.target.value)} placeholder="请输入其他成本" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-20 shrink-0">入货仓</label>
                  <FauxSelect className="flex-1" value={inWarehouse} onChange={e => setInWarehouse(e.target.value)} placeholder="请选择">
                    <option value="成品仓">成品仓</option>
                    <option value="主仓">主仓</option>
                  </FauxSelect>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-20 shrink-0"><span className="text-red-500">*</span> 经办人</label>
                  <FauxSelect className="flex-1" value={operator} onChange={e => setOperator(e.target.value)} placeholder="请选择">
                    <option value="黄伟霆">黄伟霆</option>
                    <option value="张三">张三</option>
                    <option value="李四">李四</option>
                  </FauxSelect>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-20 shrink-0">出货仓</label>
                  <FauxSelect className="flex-1" value={outWarehouse} onChange={e => setOutWarehouse(e.target.value)} placeholder="请选择">
                    <option value="配件仓">配件仓</option>
                    <option value="主仓">主仓</option>
                  </FauxSelect>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <label className="text-sm text-gray-700 w-16 shrink-0 pt-2">备注</label>
                <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={5} placeholder="请输入描述" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={() => setShowParts(true)} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-lg hover:from-emerald-600 hover:to-emerald-700 shadow-sm flex items-center gap-1.5">
                <AddIcon sx={{ fontSize: 16 }} />新增
              </button>
              <div className="border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-emerald-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">序号</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">编号</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">配件名称</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">规格</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">用量</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">成本价</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedParts.length > 0 ? (
                      selectedParts.map((part, index) => (
                        <tr key={part.partId} className="border-b border-gray-100">
                          <td className="px-3 py-2.5 text-sm text-gray-700">{index + 1}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-600">{part.partCode}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-800">{part.partName}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-600">{part.spec || ""}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">{part.quantity}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-700">¥{part.unitCost.toFixed(2)}</td>
                          <td className="px-3 py-2.5">
                            <button onClick={() => setSelectedParts(selectedParts.filter(p => p.partId !== part.partId))} className="text-xs text-red-500 hover:text-red-700">删除</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="h-64 text-center text-sm text-gray-400">暂无数据</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200">取消</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 shadow-sm">确定</button>
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

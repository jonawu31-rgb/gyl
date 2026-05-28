import { useState } from "react";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, Refresh as RefreshIcon,
  Inventory2 as PartsIcon, Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface KitPart {
  partId: string;
  partName: string;
  spec: string;
  costPrice: number;
  quantity: number;
}

interface KitTemplate {
  templateId: string;
  name: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  remark: string;
  status: "enabled" | "disabled";
  parts: KitPart[];
  updatedAt: string;
}

const CATEGORIES = ["刹车配件", "发动机配件", "电器配件", "空调系统", "悬挂系统", "车身配件"];

const AVAILABLE_PARTS: (Omit<KitPart, "quantity"> & { stock: number })[] = [
  { partId: "P001", partName: "刹车片", spec: "前轮/通用", costPrice: 85, stock: 200 },
  { partId: "P002", partName: "刹车盘", spec: "280mm", costPrice: 120, stock: 150 },
  { partId: "P003", partName: "刹车油", spec: "DOT4/500ml", costPrice: 35, stock: 300 },
  { partId: "P004", partName: "刹车分泵", spec: "通用型", costPrice: 95, stock: 80 },
  { partId: "P005", partName: "机油滤清器", spec: "标准型", costPrice: 28, stock: 400 },
  { partId: "P006", partName: "空气滤清器", spec: "标准型", costPrice: 45, stock: 350 },
  { partId: "P007", partName: "机油", spec: "5W-30/4L", costPrice: 180, stock: 120 },
  { partId: "P008", partName: "火花塞", spec: "铂金型", costPrice: 65, stock: 200 },
  { partId: "P009", partName: "冷却液", spec: "防冻型/2L", costPrice: 55, stock: 180 },
  { partId: "P010", partName: "空调滤清器", spec: "标准型", costPrice: 38, stock: 250 },
  { partId: "P011", partName: "空调压缩机油", spec: "PAG46/250ml", costPrice: 68, stock: 100 },
  { partId: "P012", partName: "减震器", spec: "前/通用", costPrice: 320, stock: 60 },
];

const initTemplates: KitTemplate[] = [
  {
    templateId: "KT001", name: "刹车系统保养套件", category: "刹车配件",
    sellingPrice: 580, costPrice: 335, remark: "含四轮刹车片及刹车油",
    status: "enabled", updatedAt: "2026-05-18 10:30",
    parts: [
      { partId: "P001", partName: "刹车片", spec: "前轮/通用", costPrice: 85, quantity: 2 },
      { partId: "P002", partName: "刹车盘", spec: "280mm", costPrice: 120, quantity: 1 },
      { partId: "P003", partName: "刹车油", spec: "DOT4/500ml", costPrice: 35, quantity: 1 },
      { partId: "P004", partName: "刹车分泵", spec: "通用型", costPrice: 95, quantity: 1 },
    ],
  },
  {
    templateId: "KT002", name: "发动机维保套件", category: "发动机配件",
    sellingPrice: 1280, costPrice: 871, remark: "适合小保养+大保养",
    status: "enabled", updatedAt: "2026-05-15 14:22",
    parts: [
      { partId: "P005", partName: "机油滤清器", spec: "标准型", costPrice: 28, quantity: 1 },
      { partId: "P006", partName: "空气滤清器", spec: "标准型", costPrice: 45, quantity: 1 },
      { partId: "P007", partName: "机油", spec: "5W-30/4L", costPrice: 180, quantity: 4 },
      { partId: "P008", partName: "火花塞", spec: "铂金型", costPrice: 65, quantity: 4 },
      { partId: "P009", partName: "冷却液", spec: "防冻型/2L", costPrice: 55, quantity: 1 },
    ],
  },
  {
    templateId: "KT003", name: "空调系统清洁套件", category: "空调系统",
    sellingPrice: 320, costPrice: 174, remark: "含空调滤和压缩机油",
    status: "enabled", updatedAt: "2026-05-10 09:15",
    parts: [
      { partId: "P010", partName: "空调滤清器", spec: "标准型", costPrice: 38, quantity: 2 },
      { partId: "P011", partName: "空调压缩机油", spec: "PAG46/250ml", costPrice: 68, quantity: 1 },
      { partId: "P009", partName: "冷却液", spec: "防冻型/2L", costPrice: 55, quantity: 1 },
    ],
  },
  {
    templateId: "KT004", name: "前减震器更换套件", category: "悬挂系统",
    sellingPrice: 1580, costPrice: 815, remark: "含左右减震器及配件",
    status: "disabled", updatedAt: "2026-04-28 16:40",
    parts: [
      { partId: "P012", partName: "减震器", spec: "前/通用", costPrice: 320, quantity: 2 },
      { partId: "P001", partName: "刹车片", spec: "前轮/通用", costPrice: 85, quantity: 2 },
    ],
  },
];

const nowStr = () => new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);

interface TemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<KitTemplate, "templateId" | "updatedAt">) => void;
  editData?: KitTemplate | null;
}

function TemplateDialog({ open, onClose, onSave, editData }: TemplateDialogProps) {
  const emptyForm = () => ({ name: "", category: CATEGORIES[0], sellingPrice: 0, costPrice: 0, remark: "", status: "enabled" as const, parts: [] as KitPart[] });
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [partsOpen, setPartsOpen] = useState(false);
  const [partSearch, setPartSearch] = useState("");

  const reset = () => {
    if (editData) {
      const { templateId: _id, updatedAt: _u, ...rest } = editData;
      setForm({ ...rest });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  };

  if (!open) return null;
  if (open && form.name === "" && !editData) { /* initial load handled inline */ }

  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const computedCost = form.parts.reduce((s, p) => s + p.costPrice * p.quantity, 0);

  const togglePart = (ap: typeof AVAILABLE_PARTS[0]) => {
    setForm((prev) => {
      const exists = prev.parts.find((p) => p.partId === ap.partId);
      if (exists) return { ...prev, parts: prev.parts.filter((p) => p.partId !== ap.partId) };
      return { ...prev, parts: [...prev.parts, { partId: ap.partId, partName: ap.partName, spec: ap.spec, costPrice: ap.costPrice, quantity: 1 }] };
    });
  };

  const setPartQty = (partId: string, qty: number) => {
    setForm((prev) => ({ ...prev, parts: prev.parts.map((p) => p.partId === partId ? { ...p, quantity: Math.max(1, qty) } : p) }));
  };

  const removePart = (partId: string) => setForm((prev) => ({ ...prev, parts: prev.parts.filter((p) => p.partId !== partId) }));

  const filteredParts = AVAILABLE_PARTS.filter((p) =>
    !partSearch || p.partName.toLowerCase().includes(partSearch.toLowerCase()) || p.partId.toLowerCase().includes(partSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name.trim()) { setErrors({ name: "请填写模版名称" }); return; }
    onSave({ ...form, costPrice: computedCost });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 620 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑套件模版" : "新增套件模版"}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>

        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* Left form */}
          <div className="w-80 shrink-0 border-r border-gray-200 overflow-auto p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模版名称 <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} placeholder="请输入模版名称"
                onChange={(e) => { set("name", e.target.value); setErrors({}); }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 ${errors.name ? "border-red-400" : "border-gray-300"}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">套件分类</label>
              <FauxSelect value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </FauxSelect>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">销售价（元）</label>
                <input type="number" min={0} value={form.sellingPrice} onChange={(e) => set("sellingPrice", Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">成本价（元）</label>
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">{computedCost.toFixed(2)}</div>
                <p className="text-xs text-gray-400 mt-0.5">自动汇总配件成本</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <div className="flex items-center gap-2 mt-1">
                <button type="button" onClick={() => set("status", form.status === "enabled" ? "disabled" : "enabled")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${form.status === "enabled" ? "bg-blue-500" : "bg-gray-200"}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${form.status === "enabled" ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-gray-600">{form.status === "enabled" ? "启用" : "停用"}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea rows={3} value={form.remark} placeholder="可选说明" onChange={(e) => set("remark", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400 resize-none" />
            </div>
          </div>

          {/* Right parts */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
              <span className="text-sm font-medium text-gray-700">配件清单 <span className="text-gray-400 font-normal">（{form.parts.length} 种）</span></span>
              <button onClick={() => setPartsOpen(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center gap-1">
                <AddIcon sx={{ fontSize: 14 }} />选择配件
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {form.parts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <PartsIcon sx={{ fontSize: 40 }} className="opacity-30 mb-2" />
                  <p className="text-sm">尚未添加配件，点击右上方"选择配件"</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="border-b border-gray-200">
                      {["配件名称", "规格", "成本价", "数量", "小计", ""].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {form.parts.map((p) => (
                      <tr key={p.partId} className="border-b border-gray-100 hover:bg-blue-50/40">
                        <td className="px-4 py-2 text-sm text-gray-800">{p.partName}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{p.spec}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">¥{p.costPrice}</td>
                        <td className="px-4 py-2">
                          <input type="number" min={1} value={p.quantity}
                            onChange={(e) => setPartQty(p.partId, Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-blue-400" />
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-800">¥{(p.costPrice * p.quantity).toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => removePart(p.partId)} className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"><CloseIcon sx={{ fontSize: 14 }} /></button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td colSpan={4} className="px-4 py-2 text-sm font-semibold text-gray-700">合计成本</td>
                      <td className="px-4 py-2 text-sm font-bold text-blue-600">¥{computedCost.toFixed(2)}</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">保存模版</button>
        </div>
      </div>

      {/* Parts select dialog */}
      {partsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 720, height: 500 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
              <h3 className="text-base font-bold text-gray-800">选择配件</h3>
              <button onClick={() => setPartsOpen(false)} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
            </div>
            <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
              <div className="relative w-64">
                <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="搜索配件名称/编码..." value={partSearch} onChange={(e) => setPartSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400 bg-gray-50" />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    {["", "编码", "配件名称", "规格", "成本价", "库存"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredParts.map((p) => {
                    const selected = form.parts.some((fp) => fp.partId === p.partId);
                    return (
                      <tr key={p.partId} className={`border-b border-gray-100 cursor-pointer transition-colors ${selected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                        onClick={() => togglePart(p)}>
                        <td className="px-4 py-2.5">
                          <input type="checkbox" checked={selected} readOnly className="rounded accent-blue-500" />
                        </td>
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-500">{p.partId}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-800">{p.partName}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-500">{p.spec}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-700">¥{p.costPrice}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{p.stock}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between shrink-0">
              <span className="text-sm text-gray-500">已选 <span className="font-semibold text-blue-600">{form.parts.length}</span> 种配件</span>
              <button onClick={() => setPartsOpen(false)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700">确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function KitTemplateManagement() {
  const [templates, setTemplates] = useState<KitTemplate[]>(initTemplates);
  const [keyword, setKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<KitTemplate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewParts, setViewParts] = useState<KitTemplate | null>(null);

  const filtered = templates.filter((t) =>
    (!keyword || t.name.toLowerCase().includes(keyword.toLowerCase()) || t.templateId.toLowerCase().includes(keyword.toLowerCase())) &&
    (!filterCategory || t.category === filterCategory) &&
    (!filterStatus || t.status === filterStatus)
  );

  const handleSave = (data: Omit<KitTemplate, "templateId" | "updatedAt">) => {
    if (editTarget) {
      setTemplates((prev) => prev.map((t) => t.templateId === editTarget.templateId ? { ...t, ...data, updatedAt: nowStr() } : t));
    } else {
      setTemplates((prev) => [...prev, { templateId: `KT${Date.now()}`, ...data, updatedAt: nowStr() }]);
    }
    setEditTarget(null);
  };

  const handleDelete = (id: string) => { setTemplates((prev) => prev.filter((t) => t.templateId !== id)); setDeleteId(null); };

  const deleteTarget = templates.find((t) => t.templateId === deleteId);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">模版管理</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditTarget(null); setDialogOpen(true); }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />新增模版
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button onClick={() => { setKeyword(""); setFilterCategory(""); setFilterStatus(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative w-60">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索模版名称/编号..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <FauxSelect value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700">
            <option value="">全部分类</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </FauxSelect>
          <FauxSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700">
            <option value="">全部状态</option>
            <option value="enabled">启用</option>
            <option value="disabled">停用</option>
          </FauxSelect>
          <span className="text-xs text-gray-400">共 {filtered.length} 条</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["模版编号", "模版名称", "分类", "销售价", "成本价", "配件种数", "状态", "更新时间", "操作"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((t) => (
              <tr key={t.templateId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{t.templateId}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{t.name}</div>
                  {t.remark && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{t.remark}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">{t.category}</span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">¥{t.sellingPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-600">¥{t.costPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.parts.length} 种</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${t.status === "enabled" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {t.status === "enabled" ? "启用" : "停用"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{t.updatedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button title="查看配件" onClick={() => setViewParts(t)} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"><PartsIcon sx={{ fontSize: 16 }} /></button>
                    <button title="编辑" onClick={() => { setEditTarget(t); setDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><EditIcon sx={{ fontSize: 16 }} /></button>
                    <button title="删除" onClick={() => setDeleteId(t.templateId)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><DeleteIcon sx={{ fontSize: 16 }} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400">共 {templates.length} 个套件模版</p>
      </div>

      {dialogOpen && (
        <TemplateDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditTarget(null); }}
          onSave={handleSave} editData={editTarget} />
      )}

      {/* View parts dialog */}
      {viewParts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 640, maxHeight: 500 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-800">配件清单</h3>
                <p className="text-xs text-gray-400 mt-0.5">{viewParts.name}</p>
              </div>
              <button onClick={() => setViewParts(null)} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    {["配件名称", "规格", "成本价", "数量", "小计"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewParts.parts.map((p) => (
                    <tr key={p.partId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-sm text-gray-800">{p.partName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{p.spec}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">¥{p.costPrice}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{p.quantity}</td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800">¥{(p.costPrice * p.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 border-t border-gray-200">
                    <td colSpan={4} className="px-4 py-2.5 text-sm font-semibold text-gray-700">成本合计</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-blue-600">
                      ¥{viewParts.parts.reduce((s, p) => s + p.costPrice * p.quantity, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end shrink-0">
              <button onClick={() => setViewParts(null)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">关闭</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
            <p className="text-sm text-gray-600 mb-4">确定删除套件模版「<span className="font-semibold text-gray-800">{deleteTarget.name}</span>」吗？删除后无法恢复。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

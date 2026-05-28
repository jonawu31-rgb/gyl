import { useState } from "react";
import {
  Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon, KeyboardArrowDown as ChevronDown,
  RotateRight as RotateIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon, RestartAlt as ResetIcon,
  AddPhotoAlternate as AddPhotoIcon, DeleteOutline as DelPhotoIcon,
  FormatBold, FormatItalic, FormatUnderlined, FormatStrikethrough,
  FormatAlignLeft, FormatAlignCenter, FormatAlignJustify, FormatAlignRight,
  FormatListBulleted, FormatListNumbered, FormatQuote, Link as LinkIcon,
  Image as InsertImageIcon, VideoLibrary, TableChart, Code,
  EmojiEmotions, HorizontalRule, Undo, Redo, Fullscreen,
  Title as TitleIcon, FormatColorText, Highlight, CheckBox as ChecklistIcon,
  Image as ImagePlaceholderIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PartSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

interface PriceLevel {
  id: string; name: string; remark: string; sortOrder: number;
  priceType: "manual" | "template"; template: string; multiplier: string; isSystem: boolean;
}

interface TagItem { id: string; name: string; }

const initPriceLevels: PriceLevel[] = [
  { id: "1", name: "备用价1", remark: "", sortOrder: 1, priceType: "template", template: "参考价", multiplier: "1.2", isSystem: false },
  { id: "2", name: "备用价2", remark: "", sortOrder: 2, priceType: "manual", template: "", multiplier: "", isSystem: false },
  { id: "3", name: "备用价3", remark: "", sortOrder: 3, priceType: "manual", template: "", multiplier: "", isSystem: false },
  { id: "4", name: "划线价", remark: "商城显示系统价格级别", sortOrder: 991, priceType: "manual", template: "", multiplier: "", isSystem: true },
  { id: "5", name: "会员价", remark: "商城显示系统价格级别", sortOrder: 992, priceType: "manual", template: "", multiplier: "", isSystem: true },
];

const AVAILABLE_TAGS = ["新款到货", "特价促销", "热销商品", "库存紧张", "品牌推荐", "原厂件", "副厂件"];

function getLevelFormula(pl: PriceLevel) {
  if (pl.priceType === "template" && pl.template && pl.multiplier) return `${pl.template} * ${pl.multiplier}`;
  if (pl.priceType === "template" && pl.template) return pl.template;
  return "手工定价";
}

const inp = "flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400 bg-white text-gray-700";
const inpFull = "w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400 bg-white text-gray-700";

function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 min-w-0">
      <span className="w-[64px] text-right text-xs text-gray-600 shrink-0 leading-tight">
        {required && <span className="text-red-500">*</span>}{label}
      </span>
      {children}
    </div>
  );
}

function Sel({ value, onChange, children, className }: { value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return (
    <FauxSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=""
      className={`${className ?? "flex-1 min-w-0"} px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 bg-white ${value === "" ? "text-gray-400" : "text-gray-700"}`}
    >
      {children}
    </FauxSelect>
  );
}

// ─── Level edit/add dialog ─────────────────────────────────────────
interface LevelDialogProps {
  mode: "add" | "edit";
  initial?: PriceLevel;
  onClose: () => void;
  onSave: (data: Omit<PriceLevel, "id" | "isSystem">) => void;
}

function LevelDialog({ mode, initial, onClose, onSave }: LevelDialogProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [remark, setRemark] = useState(initial?.remark ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [priceType, setPriceType] = useState<"manual" | "template">(initial?.priceType ?? "manual");
  const [nameErr, setNameErr] = useState(false);

  const handleSave = () => {
    if (!name.trim()) { setNameErr(true); return; }
    onSave({ name: name.trim(), remark, sortOrder, priceType, template: "", multiplier: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-base font-bold text-gray-800">{mode === "add" ? "新增级别" : "编辑级别"}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-700"><span className="text-red-500">*</span> 级别名称</span>
              <span className="ml-auto text-xs text-gray-400">{name.length} / 64</span>
            </div>
            <input maxLength={64} value={name} onChange={(e) => { setName(e.target.value); setNameErr(false); }}
              placeholder="请输入级别名称" className={`${inpFull} ${nameErr ? "border-red-400" : ""}`} />
            {nameErr && <p className="text-xs text-red-500 mt-0.5">请填写级别名称</p>}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">备注</span>
              <span className="text-xs text-gray-400">{remark.length} / 500</span>
            </div>
            <textarea maxLength={500} rows={3} value={remark} onChange={(e) => setRemark(e.target.value)}
              placeholder="选填"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400 resize-none" />
          </div>
          <div>
            <span className="text-sm text-gray-700 block mb-1">排序</span>
            <div className="flex items-center gap-1">
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400" />
              <div className="flex flex-col">
                <button onClick={() => setSortOrder((v) => v + 1)} className="px-1 py-0 text-gray-400 hover:text-gray-600"><UpIcon sx={{ fontSize: 16 }} /></button>
                <button onClick={() => setSortOrder((v) => Math.max(0, v - 1))} className="px-1 py-0 text-gray-400 hover:text-gray-600"><DownIcon sx={{ fontSize: 16 }} /></button>
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-700 block mb-1.5">价格类型</span>
            <div className="flex items-center gap-6">
              {[{ v: "manual", l: "手工输入" }, { v: "template", l: "模板计算" }].map(({ v, l }) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${priceType === v ? "border-blue-500" : "border-gray-300"}`}>
                    {priceType === v && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </span>
                  <input type="radio" name="priceType" value={v} checked={priceType === v} onChange={() => setPriceType(v as "manual" | "template")} className="hidden" />
                  <span className="text-sm text-gray-700">{l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

// ─── 管理价格级别 dialog ────────────────────────────────────────────
function ManageLevelsDialog({ levels, onClose, onUpdate }: {
  levels: PriceLevel[]; onClose: () => void; onUpdate: (levels: PriceLevel[]) => void;
}) {
  const [list, setList] = useState<PriceLevel[]>(levels);
  const [editTarget, setEditTarget] = useState<PriceLevel | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...list].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleEdit = (data: Omit<PriceLevel, "id" | "isSystem">) => {
    if (!editTarget) return;
    const updated = list.map((l) => l.id === editTarget.id ? { ...l, ...data } : l);
    setList(updated); onUpdate(updated); setEditTarget(null);
  };
  const handleAdd = (data: Omit<PriceLevel, "id" | "isSystem">) => {
    const newLevel: PriceLevel = { id: String(Date.now()), ...data, isSystem: false };
    const updated = [...list, newLevel];
    setList(updated); onUpdate(updated);
  };
  const handleDelete = (id: string) => {
    const updated = list.filter((l) => l.id !== id);
    setList(updated); onUpdate(updated); setDeleteId(null);
  };
  const deleteTarget = list.find((l) => l.id === deleteId);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 560 }}>
          <div className="px-5 py-3 flex items-center justify-between border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-800">管理价格级别</h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><CloseIcon sx={{ fontSize: 18 }} /></button>
          </div>
          <div className="p-4">
            <button onClick={() => setAddOpen(true)} className="mb-3 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1">
              <AddIcon sx={{ fontSize: 15 }} />新增级别
            </button>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["级别名称", "备注", "模板", "排序", "操作"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((pl) => (
                    <tr key={pl.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2.5 text-sm text-gray-800">
                        <span className="flex items-center gap-1.5">
                          {pl.name}
                          {pl.isSystem && <span className="inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded bg-orange-100 text-orange-600">系统</span>}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-500 max-w-[110px] truncate">{pl.remark}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{pl.priceType === "template" && pl.template ? getLevelFormula(pl) : "未设置"}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">{pl.sortOrder}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditTarget(pl)} className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-700"><EditIcon sx={{ fontSize: 13 }} />编辑</button>
                          <button onClick={() => !pl.isSystem && setDeleteId(pl.id)}
                            className={`flex items-center gap-0.5 text-xs ${pl.isSystem ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-700"}`}>
                            <DeleteIcon sx={{ fontSize: 13 }} />删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {editTarget && <LevelDialog mode="edit" initial={editTarget} onClose={() => setEditTarget(null)} onSave={handleEdit} />}
      {addOpen && <LevelDialog mode="add" onClose={() => setAddOpen(false)} onSave={handleAdd} />}
      {deleteId && deleteTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs p-5">
            <h3 className="text-base font-bold text-gray-800 mb-2">确认删除</h3>
            <p className="text-sm text-gray-600 mb-4">确定删除价格级别「{deleteTarget.name}」吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── 添加OE dialog ────────────────────────────────────────────────
const MOCK_VIN_CARS = [
  "2008款 旅行版 LX 1.6 手动 基本版",
  "2010款 轿车 2.0T 自动 豪华版",
  "2012款 SUV 2.5 手动 标准版",
];
const MOCK_CATEGORIES = ["发动机", "刹车系统", "空调系统", "电器系统", "悬挂系统", "传动系统", "燃油系统", "排放系统"];
const MOCK_OE_RESULTS = [
  { oe: "1J0 919 506 A", name: "水温传感器", brand: "博世", spec: "通用" },
  { oe: "5WK9 6733", name: "空气流量计", brand: "德尔福", spec: "通用" },
  { oe: "8E0 820 043 N", name: "空调控制面板", brand: "原装", spec: "专用" },
  { oe: "06A 905 097 C", name: "曲轴位置传感器", brand: "博世", spec: "通用" },
];

type VinStep = 1 | 2 | 3 | 4;

function AddOEDialog({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"oe" | "vin">("oe");
  const [oeText, setOeText] = useState("");
  const [vinStep, setVinStep] = useState<VinStep>(1);
  const [vinText, setVinText] = useState("");
  const [selectedCar, setSelectedCar] = useState(MOCK_VIN_CARS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const VIN_STEPS = [
    { n: 1, label: "输入VIN码" }, { n: 2, label: "选择车型" },
    { n: 3, label: "选择分类" }, { n: 4, label: "查看结果" },
  ];
  const toggleCategory = (c: string) =>
    setSelectedCategory((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 820, maxHeight: "80vh" }}>
        <div className="px-6 pt-5 pb-0 flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-gray-800">添加OE</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-6 flex items-center gap-0 border-b border-gray-200 mt-3 shrink-0">
          {[{ key: "oe", label: "通过OE号匹配" }, { key: "vin", label: "通过VIN码匹配" }].map(({ key, label }) => (
            <button key={key} onClick={() => { setTab(key as "oe" | "vin"); setVinStep(1); }}
              className={`px-4 py-2.5 text-sm transition-all border-b-2 mr-2 ${tab === key ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto min-h-0 px-6 py-5">
          {tab === "oe" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">请输入OE号，支持录入多个OE号，以换行分割</p>
              <textarea value={oeText} onChange={(e) => setOeText(e.target.value)} placeholder="请输入" rows={8}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400 resize-none" />
              <div>
                <p className="text-sm text-gray-500 mb-2">示例</p>
                <div className="bg-gray-50 rounded-lg px-4 py-3 space-y-1.5 text-sm text-gray-600 border border-gray-200">
                  <p>1J0 919 506 A</p><p>5WK9 6733</p><p>8E0 820 043 N</p>
                </div>
              </div>
            </div>
          )}
          {tab === "vin" && (
            <div className="space-y-5">
              <div className="flex items-center">
                {VIN_STEPS.map((s, i) => (
                  <div key={s.n} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${vinStep >= s.n ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-300 text-gray-400"}`}>{s.n}</div>
                      <span className={`text-xs whitespace-nowrap ${vinStep === s.n ? "text-blue-600 font-semibold" : vinStep > s.n ? "text-blue-500" : "text-gray-400"}`}>{s.label}</span>
                    </div>
                    {i < VIN_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-5 ${vinStep > s.n ? "bg-blue-400" : "bg-gray-200"}`} />}
                  </div>
                ))}
              </div>
              {vinStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">请输入车架号，支持录入多个车架号(最多5个)，以换行分割</p>
                  <textarea value={vinText} onChange={(e) => setVinText(e.target.value)} placeholder="请输入" rows={7}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400 resize-none" />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">示例</p>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 space-y-1.5 text-sm text-gray-600 border border-gray-200">
                      <p>LSGJR52UX5H033527</p><p>LSGJU52P96H103125</p><p>LSGJR82U48H046179</p>
                    </div>
                  </div>
                </div>
              )}
              {vinStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 font-medium">请选择车型</p>
                  <FauxSelect
                    value={selectedCar}
                    onChange={(e) => setSelectedCar(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white text-gray-700"
                  >
                    {MOCK_VIN_CARS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </FauxSelect>
                  <p className="text-sm text-gray-500">已找到 {MOCK_VIN_CARS.length} 个匹配的车型，请选择其中一个</p>
                </div>
              )}
              {vinStep === 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 font-medium">请选择配件分类（可多选）</p>
                  <div className="grid grid-cols-4 gap-2">
                    {MOCK_CATEGORIES.map((c) => {
                      const checked = selectedCategory.includes(c);
                      return (
                        <button key={c} onClick={() => toggleCategory(c)}
                          className={`px-3 py-2.5 text-sm rounded-lg border transition-all text-left ${checked ? "bg-blue-50 border-blue-400 text-blue-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                          <span className={`inline-flex items-center justify-center w-4 h-4 rounded border mr-2 shrink-0 align-middle ${checked ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                            {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                          </span>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  {selectedCategory.length === 0 && <p className="text-xs text-gray-400">未选择则匹配全部分类</p>}
                </div>
              )}
              {vinStep === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 font-medium">匹配结果</p>
                    <span className="text-xs text-gray-500">共找到 {MOCK_OE_RESULTS.length} 条OE数据</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {["OE号", "零件名称", "品牌", "适用"].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_OE_RESULTS.map((r) => (
                          <tr key={r.oe} className="border-b border-gray-100 hover:bg-blue-50/30">
                            <td className="px-4 py-2.5 text-sm font-mono text-blue-600">{r.oe}</td>
                            <td className="px-4 py-2.5 text-sm text-gray-800">{r.name}</td>
                            <td className="px-4 py-2.5 text-sm text-gray-600">{r.brand}</td>
                            <td className="px-4 py-2.5 text-xs text-gray-500">{r.spec}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          {tab === "oe" && <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">匹配数据</button>}
          {tab === "vin" && vinStep === 1 && <button onClick={() => setVinStep(2)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">查询车型</button>}
          {tab === "vin" && vinStep > 1 && (
            <>
              <button onClick={() => setVinStep((s) => (s - 1) as VinStep)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">上一步</button>
              {vinStep < 4
                ? <button onClick={() => setVinStep((s) => (s + 1) as VinStep)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">下一步</button>
                : <button onClick={onClose} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">完成</button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 选择标签 dialog ───────────────────────────────────────────────
function SelectTagDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: (name: string) => void }) {
  const [selected, setSelected] = useState(AVAILABLE_TAGS[0]);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">选择标签</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 shrink-0">标签名称</span>
            <FauxSelect
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-400 rounded-lg text-sm focus:outline-none bg-white text-gray-700"
            >
              {AVAILABLE_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </FauxSelect>
          </div>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={() => { onConfirm(selected); onClose(); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

// ─── Rich text toolbar button ──────────────────────────────────────
function TBtn({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <button title={title}
      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors shrink-0">
      {children}
    </button>
  );
}

// ─── Main dialog ──────────────────────────────────────────────────
export function PartSettingsDialog({ open, onClose, onSave }: PartSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<"info" | "image" | "detail" | "tags">("info");
  const [manageLevelsOpen, setManageLevelsOpen] = useState(false);
  const [addOEOpen, setAddOEOpen] = useState(false);
  const [priceLevels, setPriceLevels] = useState<PriceLevel[]>(initPriceLevels);

  // 配件图片 tab state
  const [imgCount, setImgCount] = useState(1);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imgRotation, setImgRotation] = useState(0);
  const [imgScale, setImgScale] = useState(1);

  // 配件详情 tab state
  const [detailContent, setDetailContent] = useState("");

  // 标签归类 tab state
  const [tags, setTags] = useState<TagItem[]>([{ id: "1", name: "新款到货" }]);
  const [selectTagOpen, setSelectTagOpen] = useState(false);

  const [f, setF] = useState({
    code: "", partName: "", spec: "",
    vehicleType: "", drawingNo: "", unit: "",
    defaultWarehouse: "", category: "", origin: "",
    supplier: "", brand: "", feature: "",
    barcode: "", enUnit: "", hotRank: "",
    productManager: "", subCategory: "", foreignName: "",
    manufacturerCode: "", manufacturerName: "", modelNo: "",
    commonCode: "", weight: "", volume: "",
    oeCode: "", remark: "",
    retailPrice: "", wholesalePrice: "", referencePrice: "",
    transferPrice: "", bulkPrice: "", lastPurchasePrice: "", profitMargin: "",
  });
  const [prices, setPrices] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setF((prev) => ({ ...prev, [k]: v }));

  if (!open) return null;

  const tabs = [
    { key: "info", label: "配件资料" },
    { key: "image", label: "配件图片" },
    { key: "detail", label: "配件详情" },
    { key: "tags", label: "标签归类" },
  ] as const;

  const sortedLevels = [...priceLevels].sort((a, b) => a.sortOrder - b.sortOrder);

  const addTag = (name: string) => {
    if (!tags.find((t) => t.name === name)) {
      setTags((prev) => [...prev, { id: String(Date.now()), name }]);
    }
  };
  const removeTag = (id: string) => setTags((prev) => prev.filter((t) => t.id !== id));

  const IMG_SIZE = { w: 320, h: 220 };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 680 }}>
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-base font-bold text-gray-800">设置配件</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Tabs — centered, bordered group */}
        <div className="py-2.5 border-b border-gray-200 shrink-0 flex items-center justify-center bg-white">
          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-6 py-1.5 text-sm transition-all border-r border-gray-200 last:border-r-0 ${
                  activeTab === t.key
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-0">

          {/* ── 配件资料 ── */}
          {activeTab === "info" && (
            <div className="p-4 space-y-3">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-700">基础档案</span>
                </div>
                <div className="p-3 grid grid-cols-3 gap-x-4 gap-y-2">
                  <F label="编码"><input className={inp} placeholder="请输入编码(不填自动生成)" value={f.code} onChange={(e) => set("code", e.target.value)} /></F>
                  <F label="零件名称" required><input className={inp} placeholder="请输入零件名称" value={f.partName} onChange={(e) => set("partName", e.target.value)} /></F>
                  <F label="规格"><input className={inp} placeholder="请输入规格" value={f.spec} onChange={(e) => set("spec", e.target.value)} /></F>
                  <F label="适用车型"><Sel value={f.vehicleType} onChange={(v) => set("vehicleType", v)}><option value="">请选择适用车型</option><option>宝马3系</option><option>奔驰C级</option><option>丰田凯美瑞</option></Sel></F>
                  <F label="图号"><input className={inp} placeholder="请输入图号" value={f.drawingNo} onChange={(e) => set("drawingNo", e.target.value)} /></F>
                  <F label="单位"><Sel value={f.unit} onChange={(v) => set("unit", v)}><option value="">请选择单位</option><option>个</option><option>件</option><option>套</option><option>升</option></Sel></F>
                  <F label="默认仓" required><Sel value={f.defaultWarehouse} onChange={(v) => set("defaultWarehouse", v)}><option value="">请选择默认仓</option><option>主仓库</option><option>副仓库</option><option>星油柜</option></Sel></F>
                  <F label="品类" required><Sel value={f.category} onChange={(v) => set("category", v)}><option value="">请选择</option><option>发动机配件</option><option>刹车系统</option><option>电器配件</option><option>滤清器</option></Sel></F>
                  <F label="产地"><Sel value={f.origin} onChange={(v) => set("origin", v)}><option value="">请选择产地</option><option>国产</option><option>德国</option><option>日本</option><option>韩国</option></Sel></F>
                  <F label="供应商"><Sel value={f.supplier} onChange={(v) => set("supplier", v)}><option value="">请选择供应商</option><option>博世</option><option>曼牌</option><option>飞利浦</option></Sel></F>
                  <F label="品牌"><Sel value={f.brand} onChange={(v) => set("brand", v)}><option value="">请选择品牌</option><option>博世</option><option>曼牌</option><option>NGK</option></Sel></F>
                  <F label="特征"><input className={inp} placeholder="请输入特征" value={f.feature} onChange={(e) => set("feature", e.target.value)} /></F>
                  <F label="条形码"><input className={inp} placeholder="请输入条形码" value={f.barcode} onChange={(e) => set("barcode", e.target.value)} /></F>
                  <F label="英文单位"><input className={inp} placeholder="请输入英文单位" value={f.enUnit} onChange={(e) => set("enUnit", e.target.value)} /></F>
                  <F label="畅销等级"><Sel value={f.hotRank} onChange={(v) => set("hotRank", v)}><option value="">请选择品类</option><option>A类</option><option>B类</option><option>C类</option></Sel></F>
                  <F label="产品经理"><Sel value={f.productManager} onChange={(v) => set("productManager", v)}><option value="">请选择产品经理</option><option>张三</option><option>李四</option></Sel></F>
                  <F label="类别"><Sel value={f.subCategory} onChange={(v) => set("subCategory", v)}><option value="">请选择类别</option><option>A类</option><option>B类</option><option>C类</option></Sel></F>
                  <F label="外文名"><input className={inp} placeholder="请输入外文名" value={f.foreignName} onChange={(e) => set("foreignName", e.target.value)} /></F>
                  <F label="厂家编码"><input className={inp} placeholder="请输入厂家编码" value={f.manufacturerCode} onChange={(e) => set("manufacturerCode", e.target.value)} /></F>
                  <F label="厂家名称"><input className={inp} placeholder="请输入厂家名称" value={f.manufacturerName} onChange={(e) => set("manufacturerName", e.target.value)} /></F>
                  <F label="型号/型号"><input className={inp} placeholder="请输入型号" value={f.modelNo} onChange={(e) => set("modelNo", e.target.value)} /></F>
                  <F label="通用码"><Sel value={f.commonCode} onChange={(v) => set("commonCode", v)}><option value="">请选择通用码</option><option>通用</option><option>专用</option></Sel></F>
                  <F label="重量">
                    <div className="flex-1 min-w-0 flex items-center gap-1">
                      <input className={`${inp} flex-1`} placeholder="请输入重量" value={f.weight} onChange={(e) => set("weight", e.target.value)} />
                      <span className="text-xs text-gray-400 shrink-0">kg</span>
                    </div>
                  </F>
                  <F label="体积">
                    <div className="flex-1 min-w-0 flex items-center gap-1">
                      <input className={`${inp} flex-1`} placeholder="请输入体积" value={f.volume} onChange={(e) => set("volume", e.target.value)} />
                      <span className="text-xs text-gray-400 shrink-0">m³</span>
                    </div>
                  </F>
                  <F label="OE码"><input className={inp} placeholder="请输入OE码" value={f.oeCode} onChange={(e) => set("oeCode", e.target.value)} /></F>
                  <div className="col-span-2" />
                  <div className="col-span-3">
                    <F label="备注"><input className={inp} placeholder="请输入备注" value={f.remark} onChange={(e) => set("remark", e.target.value)} /></F>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-700">价格列表</span>
                </div>
                <div className="p-3 grid grid-cols-3 gap-x-4 gap-y-2">
                  <F label="零售价"><input className={inp} placeholder="请输入零售价" value={f.retailPrice} onChange={(e) => set("retailPrice", e.target.value)} /></F>
                  <F label="批发价"><input className={inp} placeholder="请输入批发价" value={f.wholesalePrice} onChange={(e) => set("wholesalePrice", e.target.value)} /></F>
                  <F label="参考价"><input className={inp} placeholder="请输入参考价" value={f.referencePrice} onChange={(e) => set("referencePrice", e.target.value)} /></F>
                  <F label="调货价"><input className={inp} placeholder="请输入调货价" value={f.transferPrice} onChange={(e) => set("transferPrice", e.target.value)} /></F>
                  <F label="批量价"><input className={inp} placeholder="请输入批量价" value={f.bulkPrice} onChange={(e) => set("bulkPrice", e.target.value)} /></F>
                  <F label="最后采购价"><input className={`${inp} bg-gray-50`} placeholder="请输入最后一次采购入库价格" readOnly value={f.lastPurchasePrice} /></F>
                  <F label="毛利率管控">
                    <div className="flex-1 min-w-0 flex items-center gap-1">
                      <input className={`${inp} flex-1`} placeholder="请输入毛利率管控" value={f.profitMargin} onChange={(e) => set("profitMargin", e.target.value)} />
                      <span className="text-xs text-gray-400 shrink-0">%</span>
                    </div>
                  </F>
                  <div className="col-span-2" />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 w-20">级别</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 w-52">
                        <div className="flex items-center gap-1.5">
                          <button className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 shadow-sm whitespace-nowrap">按模板填充</button>
                          <button onClick={() => setManageLevelsOpen(true)} className="px-2 py-0.5 text-xs border border-blue-400 text-blue-600 rounded hover:bg-blue-50 whitespace-nowrap">配置</button>
                        </div>
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">价格</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 w-36">模板</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLevels.map((pl) => {
                      const isTemplate = pl.priceType === "template";
                      return (
                        <tr key={pl.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                          <td className="px-3 py-2 text-sm text-gray-700">{pl.name}</td>
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2">
                            <input type="text" disabled={isTemplate}
                              placeholder={isTemplate ? "模板自动计算" : "请输入价格"}
                              value={isTemplate ? "" : (prices[pl.id] ?? "")}
                              onChange={(e) => setPrices((prev) => ({ ...prev, [pl.id]: e.target.value }))}
                              className={`w-36 px-2 py-1 border rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400 ${isTemplate ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 bg-white text-gray-700"}`} />
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">{getLevelFormula(pl)}</td>
                          <td className="px-3 py-2 text-xs text-gray-400">{pl.remark}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── 配件图片 ── */}
          {activeTab === "image" && (
            <div className="h-full flex flex-col">
              {/* Top toolbar */}
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setImgCount((c) => c + 1); setActiveImgIdx(imgCount); setImgRotation(0); setImgScale(1); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">
                  <AddPhotoIcon sx={{ fontSize: 16 }} />新增图片
                </button>
                <button
                  onClick={() => { if (imgCount > 0) { setImgCount((c) => Math.max(0, c - 1)); setActiveImgIdx(0); } }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                  <DelPhotoIcon sx={{ fontSize: 16 }} />删除图片
                </button>
              </div>

              {imgCount === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                  <ImagePlaceholderIcon sx={{ fontSize: 56, color: '#d1d5db' }} />
                  <p className="text-sm">暂无图片，点击「新增图片」上传</p>
                </div>
              ) : (
                <>
                  {/* Image manipulation toolbar */}
                  <div className="flex items-center justify-center gap-4 py-2 border-b border-gray-100 shrink-0">
                    {[
                      { icon: <RotateIcon sx={{ fontSize: 15 }} />, label: "旋转", action: () => setImgRotation((r) => r + 90) },
                      { icon: <ZoomInIcon sx={{ fontSize: 15 }} />, label: "放大", action: () => setImgScale((s) => Math.min(3, s + 0.2)) },
                      { icon: <ZoomOutIcon sx={{ fontSize: 15 }} />, label: "缩小", action: () => setImgScale((s) => Math.max(0.2, s - 0.2)) },
                      { icon: <ResetIcon sx={{ fontSize: 15 }} />, label: "恢复", action: () => { setImgRotation(0); setImgScale(1); } },
                    ].map(({ icon, label, action }) => (
                      <button key={label} onClick={action}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        {icon}{label}
                      </button>
                    ))}
                  </div>

                  {/* Main image preview */}
                  <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden">
                    <div style={{ transform: `rotate(${imgRotation}deg) scale(${imgScale})`, transition: "transform 0.2s ease" }}>
                      <div style={{ width: IMG_SIZE.w, height: IMG_SIZE.h }}
                        className="bg-gradient-to-br from-slate-300 via-blue-200 to-slate-400 rounded-lg flex items-center justify-center shadow-md border border-gray-200">
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <ImagePlaceholderIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
                          <span className="text-sm text-slate-400">图片 {activeImgIdx + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail strip */}
                  <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-2 shrink-0 bg-gray-50">
                    {Array.from({ length: imgCount }).map((_, i) => (
                      <button key={i} onClick={() => { setActiveImgIdx(i); setImgRotation(0); setImgScale(1); }}
                        className={`w-14 h-10 rounded border-2 transition-all flex items-center justify-center shrink-0 ${activeImgIdx === i ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                        <ImagePlaceholderIcon sx={{ fontSize: 20, color: activeImgIdx === i ? '#3b82f6' : '#9ca3af' }} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── 配件详情 ── */}
          {activeTab === "detail" && (
            <div className="h-full flex flex-col border border-gray-200 m-4 rounded-lg overflow-hidden">
              {/* Rich text toolbar */}
              <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 shrink-0">
                <TBtn title="标题"><TitleIcon sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="加粗"><FormatBold sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="斜体"><FormatItalic sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="下划线"><FormatUnderlined sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="删除线"><FormatStrikethrough sx={{ fontSize: 16 }} /></TBtn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <TBtn title="左对齐"><FormatAlignLeft sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="居中"><FormatAlignCenter sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="右对齐"><FormatAlignRight sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="两端对齐"><FormatAlignJustify sx={{ fontSize: 16 }} /></TBtn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <TBtn title="字体颜色"><FormatColorText sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="高亮"><Highlight sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="链接"><LinkIcon sx={{ fontSize: 16 }} /></TBtn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <TBtn title="无序列表"><FormatListBulleted sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="有序列表"><FormatListNumbered sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="任务列表"><ChecklistIcon sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="引用"><FormatQuote sx={{ fontSize: 16 }} /></TBtn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <TBtn title="表情"><EmojiEmotions sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="插入图片"><InsertImageIcon sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="插入视频"><VideoLibrary sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="表格"><TableChart sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="代码块"><Code sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="分割线"><HorizontalRule sx={{ fontSize: 16 }} /></TBtn>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <TBtn title="撤销"><Undo sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="重做"><Redo sx={{ fontSize: 16 }} /></TBtn>
                <TBtn title="全屏"><Fullscreen sx={{ fontSize: 16 }} /></TBtn>
              </div>
              {/* Editor area */}
              <div className="flex-1 relative">
                <textarea
                  value={detailContent}
                  onChange={(e) => setDetailContent(e.target.value)}
                  placeholder="请输入正文"
                  className="w-full h-full px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none resize-none bg-white"
                />
              </div>
            </div>
          )}

          {/* ── 标签归类 ── */}
          {activeTab === "tags" && (
            <div className="p-4">
              <button onClick={() => setSelectTagOpen(true)}
                className="mb-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">
                <AddIcon sx={{ fontSize: 16 }} />新增
              </button>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-sm font-semibold text-gray-700 w-16">序号</th>
                      <th className="px-4 py-2.5 text-left text-sm font-semibold text-gray-700">标签名称</th>
                      <th className="px-4 py-2.5 text-right text-sm font-semibold text-gray-700 w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.map((tag, i) => (
                      <tr key={tag.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 text-sm text-gray-600">{i + 1}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-800">{tag.name}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button onClick={() => removeTag(tag.id)}
                            className="flex items-center gap-0.5 text-sm text-red-500 hover:text-red-700 ml-auto">
                            <DeleteIcon sx={{ fontSize: 14 }} />删除
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tags.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">暂无标签，点击「新增」添加</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
          <button onClick={() => setAddOEOpen(true)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">匹配车型</button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">取消</button>
            <button onClick={() => { onSave?.(f); onClose(); }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
              确定
            </button>
          </div>
        </div>
      </div>

      {manageLevelsOpen && (
        <ManageLevelsDialog levels={priceLevels} onClose={() => setManageLevelsOpen(false)} onUpdate={(u) => setPriceLevels(u)} />
      )}
      {addOEOpen && <AddOEDialog onClose={() => setAddOEOpen(false)} />}
      {selectTagOpen && (
        <SelectTagDialog onClose={() => setSelectTagOpen(false)} onConfirm={addTag} />
      )}
    </div>
  );
}

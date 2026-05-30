import { useEffect, useRef, useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tier {
  id: string;
  lower: string;
  upper: string;
  ratio: string;
}

interface CommissionRecord {
  id: string;
  category: string;
  roles: string[];
  employee: string;
  amountEnabled: boolean;
  amountBasis: string;
  amountTierCount: number;
  grossEnabled: boolean;
  grossTierCount: number;
  createdAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockRecords: CommissionRecord[] = [
  { id: "1", category: "刹车系统", roles: ["销售员", "接单员"], employee: "全员", amountEnabled: true, amountBasis: "按销售额", amountTierCount: 3, grossEnabled: false, grossTierCount: 0, createdAt: "2026-04-10 09:00:00" },
  { id: "2", category: "发动机附件", roles: ["销售员"], employee: "张三", amountEnabled: true, amountBasis: "按毛利润", amountTierCount: 2, grossEnabled: true, grossTierCount: 3, createdAt: "2026-04-12 10:30:00" },
  { id: "3", category: "变速箱", roles: ["销售员", "拣货员", "打包员"], employee: "全员", amountEnabled: false, amountBasis: "--", amountTierCount: 0, grossEnabled: true, grossTierCount: 2, createdAt: "2026-04-15 14:00:00" },
  { id: "4", category: "悬挂系统", roles: ["接单员"], employee: "李四", amountEnabled: true, amountBasis: "按销售额", amountTierCount: 1, grossEnabled: false, grossTierCount: 0, createdAt: "2026-04-20 11:00:00" },
  { id: "5", category: "电气系统", roles: ["销售员", "发货员"], employee: "全员", amountEnabled: true, amountBasis: "按销售额", amountTierCount: 2, grossEnabled: true, grossTierCount: 2, createdAt: "2026-05-01 08:00:00" },
];

const allRoles = ["销售员", "接单员", "拣货员", "打包员", "发货员"];
const allEmployees = ["张三", "李四", "王五", "赵六", "孙七"];
const allCategories = ["刹车系统", "发动机附件", "变速箱", "悬挂系统", "电气系统"];

// ─── Confirm Delete ───────────────────────────────────────────────────────────

function DeleteConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">提示</h2>
        </div>
        <div className="p-5 text-sm text-gray-700">确定删除该提成设置？</div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确定</button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${on ? "bg-blue-500" : "bg-gray-300"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

function RoleMultiSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const toggle = (role: string) => {
    if (value.includes(role)) {
      onChange(value.filter((item) => item !== role));
    } else {
      onChange([...value, role]);
    }
  };

  const displayText = value.length > 0 ? value.join("、") : placeholder;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <span className={`truncate ${value.length === 0 ? "text-gray-400" : "text-gray-800"}`}>
          {displayText}
        </span>
        <span className="ml-3 text-gray-400">⌄</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((option) => {
            const checked = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 ${
                  checked ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={checked}
                  className="pointer-events-none h-4 w-4 accent-blue-500"
                />
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tier Table ───────────────────────────────────────────────────────────────

function TierTable({ tiers, onChange }: { tiers: Tier[]; onChange: (t: Tier[]) => void }) {
  const add = () => onChange([...tiers, { id: String(Date.now()), lower: "", upper: "", ratio: "" }]);
  const remove = (id: string) => onChange(tiers.filter(t => t.id !== id));
  const update = (id: string, field: keyof Tier, val: string) =>
    onChange(tiers.map(t => t.id === id ? { ...t, [field]: val } : t));

  return (
    <div>
      <table className="w-full mb-2 text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-10">序号</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">区间下限(含)</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">区间上限(含)</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">提成比例(%)</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 w-12">操作</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, idx) => (
            <tr key={tier.id} className="border-b border-gray-100">
              <td className="px-3 py-1.5 text-xs text-gray-500">{idx + 1}</td>
              <td className="px-3 py-1.5">
                <input type="number" value={tier.lower} onChange={(e) => update(tier.id, "lower", e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400" placeholder="0" />
              </td>
              <td className="px-3 py-1.5">
                <input type="text" value={tier.upper} onChange={(e) => update(tier.id, "upper", e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400" placeholder="空表示及以上" />
              </td>
              <td className="px-3 py-1.5">
                <input type="number" value={tier.ratio} onChange={(e) => update(tier.id, "ratio", e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400" placeholder="0-100" />
              </td>
              <td className="px-3 py-1.5 text-center">
                <button onClick={() => remove(tier.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Commission Dialog ────────────────────────────────────────────────────────

interface DialogProps {
  open: boolean;
  editData: CommissionRecord | null;
  onClose: () => void;
  onSave: (data: Omit<CommissionRecord, "id" | "createdAt">) => void;
}

function CommissionDialog({ open, editData, onClose, onSave }: DialogProps) {
  const [category, setCategory] = useState(editData?.category || "");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(editData?.roles || []);
  const [employee, setEmployee] = useState(editData?.employee === "全员" ? "" : (editData?.employee || ""));
  const [amountOn, setAmountOn] = useState(editData?.amountEnabled ?? false);
  const [amountBasis, setAmountBasis] = useState<"按销售额" | "按毛利润">(editData?.amountBasis === "按毛利润" ? "按毛利润" : "按销售额");
  const [amountTiers, setAmountTiers] = useState<Tier[]>([{ id: "init1", lower: "0", upper: "", ratio: "" }]);
  const [grossOn, setGrossOn] = useState(editData?.grossEnabled ?? false);
  const [grossTiers, setGrossTiers] = useState<Tier[]>([{ id: "init2", lower: "0", upper: "", ratio: "" }]);

  if (!open) return null;

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleSave = () => {
    onSave({
      category,
      roles: selectedRoles,
      employee: employee || "全员",
      amountEnabled: amountOn,
      amountBasis: amountOn ? amountBasis : "--",
      amountTierCount: amountOn ? amountTiers.length : 0,
      grossEnabled: grossOn,
      grossTierCount: grossOn ? grossTiers.length : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑提成设置" : "新增提成设置"}</h2>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Base fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">品类 <span className="text-red-500">*</span></label>
              <FauxSelect className="w-full" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="请选择品类">
                <option value="">请选择品类</option>
                {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </FauxSelect>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">提成业务角色 <span className="text-red-500">*</span></label>
              <RoleMultiSelect
                value={selectedRoles}
                onChange={setSelectedRoles}
                options={allRoles}
                placeholder="请选择提成业务角色"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联员工</label>
              <FauxSelect className="w-full" value={employee} onChange={(e) => setEmployee(e.target.value)} placeholder="不选表示全员适用">
                <option value="">全员适用</option>
                {allEmployees.map(e => <option key={e} value={e}>{e}</option>)}
              </FauxSelect>
            </div>
          </div>

          {/* Amount commission */}
          <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/30">
            <div className="px-4 py-3 flex items-center gap-3 border-b border-blue-100 bg-blue-50/50">
              <span className="px-2.5 py-1 text-sm font-semibold text-white bg-blue-600 rounded">金额提成设置</span>
              <div className="flex items-center gap-2 text-sm">
                <span className={`${amountOn ? "text-gray-500" : "text-blue-600 font-medium"}`}>关闭</span>
                <Toggle on={amountOn} onChange={setAmountOn} />
                <span className={`${amountOn ? "text-blue-600 font-medium" : "text-gray-500"}`}>开启</span>
              </div>
            </div>
            {amountOn && (
              <div className="px-4 py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">提成基准</span>
                  {(["按销售额", "按毛利润"] as const).map(opt => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={amountBasis === opt} onChange={() => setAmountBasis(opt)} className="accent-blue-500" />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">阶梯设置</span>
                    <button
                      onClick={() => setAmountTiers((prev) => [...prev, { id: String(Date.now()), lower: "", upper: "", ratio: "" }])}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      + 新增一档
                    </button>
                  </div>
                  <TierTable tiers={amountTiers} onChange={setAmountTiers} />
                  <div className="text-xs text-gray-400 mt-2">
                    示例：0-10万 提成1%，10-50万 提成1.5%，50万以上 提成2%（可与提成2同时配置，也可只配置其一）
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gross rate commission */}
          <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/30">
            <div className="px-4 py-3 flex items-center gap-3 border-b border-blue-100 bg-blue-50/50">
              <span className="px-2.5 py-1 text-sm font-semibold text-white bg-blue-600 rounded">毛利率(利润比)提成设置</span>
              <div className="flex items-center gap-2 text-sm">
                <span className={`${grossOn ? "text-gray-500" : "text-blue-600 font-medium"}`}>关闭</span>
                <Toggle on={grossOn} onChange={setGrossOn} />
                <span className={`${grossOn ? "text-blue-600 font-medium" : "text-gray-500"}`}>开启</span>
              </div>
            </div>
            {grossOn && (
              <div className="px-4 py-4">
                <div className="text-sm text-gray-600 mb-3">按毛利率区间设置提成比例</div>
                <TierTable tiers={grossTiers} onChange={setGrossTiers} />
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700">确定</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CategoryCommission() {
  const [data, setData] = useState(mockRecords);
  const [kwCategory, setKwCategory] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterBasis, setFilterBasis] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<CommissionRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = data.filter(r =>
    (!kwCategory || r.category.includes(kwCategory)) &&
    (!filterRole || r.roles.includes(filterRole)) &&
    (!filterEmployee || r.employee === filterEmployee) &&
    (!filterBasis || r.amountBasis === filterBasis)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = (form: Omit<CommissionRecord, "id" | "createdAt">) => {
    if (editData) {
      setData(d => d.map(r => r.id === editData.id ? { ...r, ...form } : r));
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setData(d => [...d, { ...form, id: String(Date.now()), createdAt: ts }]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">分类提成设置</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">品类：</span>
            <input value={kwCategory} onChange={(e) => setKwCategory(e.target.value)} placeholder="请选择品类" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">角色：</span>
            <FauxSelect className="flex-1" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">员工：</span>
            <FauxSelect className="flex-1" value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} placeholder="请选择员工">
              <option value="">全部</option>
              <option value="全员">全员</option>
              {allEmployees.map(e => <option key={e} value={e}>{e}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">提成基准：</span>
            <FauxSelect className="flex-1" value={filterBasis} onChange={(e) => setFilterBasis(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              <option value="按销售额">按销售额</option>
              <option value="按毛利润">按毛利润</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2 col-start-4 justify-end">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setKwCategory(""); setFilterRole(""); setFilterEmployee(""); setFilterBasis(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => { setEditData(null); setDialogOpen(true); }} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品类名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">提成业务角色</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">关联员工</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">金额提成</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">金额提成基准</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">金额档数</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">毛利率提成</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">毛利率档数</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-20">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.category}</td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {item.roles.map(r => (
                      <span key={r} className="inline-flex px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">{r}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.employee}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.amountEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.amountEnabled ? "开启" : "关闭"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.amountBasis}</td>
                <td className="px-4 py-2.5 text-sm text-center text-gray-600">{item.amountTierCount > 0 ? `${item.amountTierCount}档` : "--"}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.grossEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.grossEnabled ? "开启" : "关闭"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-center text-gray-600">{item.grossTierCount > 0 ? `${item.grossTierCount}档` : "--"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.createdAt}</td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => { setEditData(item); setDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><EditIcon sx={{ fontSize: 16 }} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><DeleteIcon sx={{ fontSize: 16 }} /></button>
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

      <CommissionDialog open={dialogOpen} editData={editData} onClose={() => { setDialogOpen(false); setEditData(null); }} onSave={handleSave} />
      {deleteId && <DeleteConfirm onClose={() => setDeleteId(null)} onConfirm={() => { setData(d => d.filter(r => r.id !== deleteId)); setDeleteId(null); }} />}
    </div>
  );
}

import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: string;
  status: "启用" | "停用";
  sort: number;
  address: string;
  staff: string;
  remark: string;
  createdAt: string;
}

interface Location {
  id: string;
  name: string;
  code: string;
  remark: string;
}

const mockData: Warehouse[] = [
  { id: "1", name: "嘉兴仓", code: "WH001", type: "正品仓库", status: "启用", sort: 1, address: "浙江省嘉兴市南湖区文贤路100号", staff: "张三", remark: "", createdAt: "2026-01-10 09:00:00" },
  { id: "2", name: "黄油粒", code: "WH002", type: "正品仓库", status: "启用", sort: 2, address: "", staff: "李四", remark: "配件专用仓库", createdAt: "2026-01-15 10:30:00" },
];

const mockLocations: Record<string, Location[]> = {
  "1": [
    { id: "L1", name: "A区-01", code: "A01", remark: "常规配件" },
    { id: "L2", name: "A区-02", code: "A02", remark: "大件货架" },
    { id: "L3", name: "B区-01", code: "B01", remark: "精密零件" },
  ],
  "2": [
    { id: "L4", name: "主货架-01", code: "M01", remark: "" },
  ],
};

const staffOptions = ["张三", "李四", "王五", "赵六"];
const warehouseTypes = ["正品仓库", "退货仓库", "备用仓库", "临时仓库"];

interface FormData {
  name: string;
  code: string;
  type: string;
  address: string;
  sort: number;
  status: "启用" | "停用";
  staff: string;
  remark: string;
}

const emptyForm: FormData = {
  name: "",
  code: "",
  type: "正品仓库",
  address: "",
  sort: 0,
  status: "启用",
  staff: "",
  remark: "",
};

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">删除确认</h3>
          <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-4 text-sm text-gray-700">
          确定要删除仓库 <span className="font-semibold text-gray-900">"{name}"</span> 吗？删除后不可恢复。
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确定删除</button>
        </div>
      </div>
    </div>
  );
}

function LocationDialog({ warehouse, onClose }: { warehouse: Warehouse; onClose: () => void }) {
  const [locations, setLocations] = useState<Location[]>(mockLocations[warehouse.id] ?? []);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newRemark, setNewRemark] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    const loc: Location = { id: String(Date.now()), name: newName.trim(), code: newCode.trim(), remark: newRemark.trim() };
    setLocations(prev => [...prev, loc]);
    setNewName(""); setNewCode(""); setNewRemark(""); setAdding(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">库位管理 — {warehouse.name}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">序号</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">库位名称</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">库位编码</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">备注</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {locations.map((loc, idx) => (
                  <tr key={loc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-2.5 text-gray-800">{loc.name}</td>
                    <td className="px-4 py-2.5 text-gray-600 font-mono">{loc.code}</td>
                    <td className="px-4 py-2.5 text-gray-600">{loc.remark || "—"}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => setLocations(prev => prev.filter(l => l.id !== loc.id))} className="text-xs text-red-500 hover:text-red-700">删除</button>
                    </td>
                  </tr>
                ))}
                {locations.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">暂无库位数据</td></tr>}
              </tbody>
            </table>
          </div>
          {adding ? (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              <div className="text-sm font-medium text-gray-700 mb-2">新增库位</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">库位名称 *</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="如：A区-01" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">库位编码</label>
                  <input value={newCode} onChange={e => setNewCode(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="如：A01" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">备注</label>
                  <input value={newRemark} onChange={e => setNewRemark(e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="选填" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} className="px-3 py-1.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600">确定添加</button>
                <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
              <AddIcon sx={{ fontSize: 16 }} />新增库位
            </button>
          )}
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
        </div>
      </div>
    </div>
  );
}

function WarehouseFormDialog({
  title,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  initial: FormData;
  onSave: (data: FormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (key: keyof FormData, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = "仓库名称为必填项";
    if (!form.type) errs.type = "仓库类型为必填项";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 仓库名称 */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600"><span className="text-red-500">*</span> 仓库名称</label>
            <div className="flex-1">
              <input value={form.name} onChange={e => set("name", e.target.value)} className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.name ? "border-red-400" : "border-gray-200"}`} placeholder="请输入仓库名称" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>
          {/* 仓库编码 */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">仓库编码</label>
            <input value={form.code} onChange={e => set("code", e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="选填，可自动生成" />
          </div>
          {/* 仓库类型 */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600"><span className="text-red-500">*</span> 仓库类型</label>
            <div className="flex-1">
              <FauxSelect className="w-full" value={form.type} onChange={e => set("type", e.target.value)}>
                {warehouseTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </FauxSelect>
              {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
            </div>
          </div>
          {/* 仓库地址 */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">仓库地址</label>
            <input value={form.address} onChange={e => set("address", e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="选填" />
          </div>
          {/* 排序值 */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600"><span className="text-red-500">*</span> 排序值</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => set("sort", Math.max(0, form.sort - 1))} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 border-r border-gray-200">−</button>
              <input
                type="number"
                value={form.sort}
                onChange={e => set("sort", parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1.5 text-sm text-center focus:outline-none"
              />
              <button onClick={() => set("sort", form.sort + 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 border-l border-gray-200">+</button>
            </div>
          </div>
          {/* 状态 */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">状态</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="status" value="启用" checked={form.status === "启用"} onChange={() => set("status", "启用")} className="accent-blue-500" />启用
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                <input type="radio" name="status" value="停用" checked={form.status === "停用"} onChange={() => set("status", "停用")} className="accent-blue-500" />停用
              </label>
            </div>
          </div>
          {/* 仓库人员 */}
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">仓库人员</label>
            <FauxSelect className="flex-1" value={form.staff} onChange={e => set("staff", e.target.value)} placeholder="请选择仓库人员">
              {staffOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          {/* 备注 */}
          <div className="flex items-start gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600 pt-1.5">备注</label>
            <textarea value={form.remark} onChange={e => set("remark", e.target.value)} rows={3} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="选填" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

export function WarehouseManagement() {
  const [data, setData] = useState<Warehouse[]>(mockData);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Warehouse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null);
  const [locationTarget, setLocationTarget] = useState<Warehouse | null>(null);

  const filtered = data.filter(r =>
    (!searchName || r.name.includes(searchName)) &&
    (!searchType || r.type === searchType)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchName(""); setSearchType(""); setCurrentPage(1); };

  const handleAdd = (form: FormData) => {
    const code = form.code || `WH${String(data.length + 1).padStart(3, "0")}`;
    const rec: Warehouse = { id: String(Date.now()), ...form, code, createdAt: new Date().toLocaleString("zh-CN") };
    setData(prev => [rec, ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (form: FormData) => {
    if (!editTarget) return;
    setData(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...form } : r));
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">仓库管理</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">仓库名称：</span>
            <input
              type="text"
              placeholder="仓库名称"
              value={searchName}
              onChange={e => { setSearchName(e.target.value); setCurrentPage(1); }}
              className="w-40 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">仓库类型：</span>
            <FauxSelect className="w-32" value={searchType} onChange={e => { setSearchType(e.target.value); setCurrentPage(1); }} placeholder="请选择">
              <option value="">全部</option>
              {warehouseTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
        <button onClick={() => setShowAdd(true)} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增仓库
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">仓库名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库编码</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">排序</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">备注</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-800 font-medium">{row.name}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 font-mono">{row.code}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.type}</td>
                <td className="px-4 py-2.5">
                  {row.status === "启用"
                    ? <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">启用</span>
                    : <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 border border-red-200">停用</span>}
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.sort}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{row.remark || "—"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">{row.createdAt}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setLocationTarget(row)} className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800">
                      <LocationIcon sx={{ fontSize: 13 }} />库位
                    </button>
                    <button onClick={() => setEditTarget(row)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                      <EditIcon sx={{ fontSize: 13 }} />编辑
                    </button>
                    <button onClick={() => setDeleteTarget(row)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                      <DeleteIcon sx={{ fontSize: 13 }} />删除
                    </button>
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

      {showAdd && (
        <WarehouseFormDialog title="新增仓库" initial={emptyForm} onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editTarget && (
        <WarehouseFormDialog
          title="编辑仓库"
          initial={{ name: editTarget.name, code: editTarget.code, type: editTarget.type, address: editTarget.address, sort: editTarget.sort, status: editTarget.status, staff: editTarget.staff, remark: editTarget.remark }}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {locationTarget && <LocationDialog warehouse={locationTarget} onClose={() => setLocationTarget(null)} />}
    </div>
  );
}

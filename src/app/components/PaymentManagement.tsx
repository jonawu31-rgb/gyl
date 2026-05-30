import { useState, useEffect } from "react";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, Refresh as RefreshIcon, Close as CloseIcon,
  Add as PlusIcon,
} from "@mui/icons-material";

interface PaymentMethod {
  paymentId: string;
  paymentName: string;
  sortOrder: number;
  status: "enabled" | "disabled";
  imageUrl: string;
  createdAt: string;
}

const initMethods: PaymentMethod[] = [
  { paymentId: "PM001", paymentName: "现金", sortOrder: 1, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:17:23" },
  { paymentId: "PM002", paymentName: "现金", sortOrder: 1, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:40:32" },
  { paymentId: "PM003", paymentName: "微信", sortOrder: 2, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:17:23" },
  { paymentId: "PM004", paymentName: "微信", sortOrder: 2, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:40:32" },
  { paymentId: "PM005", paymentName: "支付宝", sortOrder: 3, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:17:23" },
  { paymentId: "PM006", paymentName: "支付宝", sortOrder: 3, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:40:32" },
  { paymentId: "PM007", paymentName: "银行转账", sortOrder: 4, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:17:23" },
  { paymentId: "PM008", paymentName: "银行转账", sortOrder: 4, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:40:32" },
  { paymentId: "PM009", paymentName: "刷卡", sortOrder: 5, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:17:23" },
  { paymentId: "PM010", paymentName: "刷卡", sortOrder: 5, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:40:32" },
  { paymentId: "PM011", paymentName: "其他", sortOrder: 6, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:17:23" },
  { paymentId: "PM012", paymentName: "其他", sortOrder: 6, status: "enabled", imageUrl: "", createdAt: "2026-01-20 17:40:32" },
];

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<PaymentMethod, "paymentId">) => void;
  editData?: PaymentMethod | null;
}

function PaymentDialog({ open, onClose, onSave, editData }: DialogProps) {
  const emptyForm = (): Omit<PaymentMethod, "paymentId"> => ({
    paymentName: "",
    sortOrder: 0,
    status: "enabled",
    imageUrl: "",
    createdAt: "",
  });
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (editData) {
        const { paymentId: _, ...rest } = editData;
        setForm(rest);
      } else {
        setForm(emptyForm());
      }
      setErrors({});
    }
  }, [open, editData]);

  if (!open) return null;
  const set = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = () => {
    if (!form.paymentName.trim()) { setErrors({ paymentName: "请填写支付方式名称" }); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-2xl">
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑支付方式" : "新增支付方式"}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="overflow-auto p-5 space-y-5">
          <div className="flex items-start gap-3">
            <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">支付名称 <span className="text-red-500">*</span></label>
            <div className="flex-1">
              <input
                type="text"
                value={form.paymentName}
                placeholder="请输入支付名称"
                onChange={(e) => { set("paymentName", e.target.value); setErrors({}); }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 ${errors.paymentName ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.paymentName && <p className="text-xs text-red-500 mt-1">{errors.paymentName}</p>}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">排序值 <span className="text-red-500">*</span></label>
            <div className="w-36">
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pl-[5.25rem]">
            <span className="text-sm font-medium text-gray-700">状态</span>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={form.status === "enabled"}
                onChange={() => set("status", "enabled")}
                className="accent-blue-500"
              />
              <span className="text-sm text-gray-700">启用</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={form.status === "disabled"}
                onChange={() => set("status", "disabled")}
                className="accent-blue-500"
              />
              <span className="text-sm text-gray-700">停用</span>
            </label>
          </div>

          <div className="flex items-start gap-3">
            <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">图片</label>
            <div>
              <button
                type="button"
                className="flex h-28 w-28 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                <PlusIcon sx={{ fontSize: 34 }} />
                <span className="mt-1 text-sm">选择图片</span>
              </button>
              <p className="mt-2 text-xs text-gray-400">选填，可用于支付二维码、账号信息截图等，JPG/PNG 不超过 5MB</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

export function PaymentManagement() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initMethods);
  const [keyword, setKeyword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PaymentMethod | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = methods.filter((m) =>
    !keyword || m.paymentName.toLowerCase().includes(keyword.toLowerCase())
  ).sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));

  const handleSave = (data: Omit<PaymentMethod, "paymentId">) => {
    if (editTarget) {
      setMethods((prev) => prev.map((m) => m.paymentId === editTarget.paymentId ? { ...m, ...data } : m));
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setMethods((prev) => [...prev, { paymentId: `PM${Date.now()}`, ...data, createdAt }]);
    }
    setEditTarget(null);
  };

  const handleToggleStatus = (id: string) => {
    setMethods((prev) => prev.map((m) => m.paymentId === id ? { ...m, status: m.status === "enabled" ? "disabled" : "enabled" } : m));
  };

  const handleDelete = (id: string) => { setMethods((prev) => prev.filter((m) => m.paymentId !== id)); setDeleteId(null); };

  const deleteTarget = methods.find((m) => m.paymentId === deleteId);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">支付管理</h2>
      </div>

      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <input type="text" placeholder="支付方式名称" value={keyword} onChange={(e) => setKeyword(e.target.value)}
            className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
          />
          <button onClick={() => {}} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 shrink-0">
            <SearchIcon sx={{ fontSize: 15 }} />搜索
          </button>
          <button onClick={() => setKeyword("")} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shrink-0">重置</button>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => { setEditTarget(null); setDialogOpen(true); }}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增支付方式
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号", "名称", "状态", "排序值", "图片", "创建时间", "操作"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((m) => (
              <tr key={m.paymentId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600">{m.paymentId.replace(/^PM/, "")}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.paymentName}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleStatus(m.paymentId)}
                    className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold text-white transition-colors ${m.status === "enabled" ? "bg-emerald-500" : "bg-gray-300"}`}>
                    {m.status === "enabled" ? "启用" : "停用"}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.sortOrder}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.imageUrl ? "已上传" : <span className="text-gray-300">—</span>}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{m.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button title="编辑" onClick={() => { setEditTarget(m); setDialogOpen(true); }} className="text-sm text-emerald-500 hover:text-emerald-600 hover:underline transition-colors flex items-center gap-1"><EditIcon sx={{ fontSize: 14 }} />编辑</button>
                    <button title="删除" onClick={() => setDeleteId(m.paymentId)} className="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors flex items-center gap-1"><DeleteIcon sx={{ fontSize: 14 }} />删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400">停用的支付方式不会显示在业务单据中</p>
      </div>

      <PaymentDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditTarget(null); }} onSave={handleSave} editData={editTarget} />

      {deleteId && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
            <p className="text-sm text-gray-600 mb-4">确定删除支付方式「<span className="font-semibold text-gray-800">{deleteTarget.paymentName}</span>」吗？</p>
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

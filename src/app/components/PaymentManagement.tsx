import { useState, useEffect } from "react";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, Refresh as RefreshIcon, Close as CloseIcon,
} from "@mui/icons-material";

interface PaymentMethod {
  paymentId: string;
  paymentName: string;
  direction: "receive" | "pay" | "both";
  accountName: string;
  accountNumber: string;
  bankName: string;
  sortOrder: number;
  status: "enabled" | "disabled";
}

const DIRECTION_LABELS: Record<string, string> = {
  receive: "收款", pay: "付款", both: "通用",
};

const DIRECTION_COLORS: Record<string, string> = {
  receive: "bg-green-100 text-green-700",
  pay: "bg-orange-100 text-orange-700",
  both: "bg-blue-100 text-blue-700",
};

const initMethods: PaymentMethod[] = [
  { paymentId: "PM001", paymentName: "现金", direction: "both", accountName: "", accountNumber: "", bankName: "", sortOrder: 1, status: "enabled" },
  { paymentId: "PM002", paymentName: "银行转账", direction: "both", accountName: "广州车配智数科技有限公司", accountNumber: "4400012345678901", bankName: "中国农业银行", sortOrder: 2, status: "enabled" },
  { paymentId: "PM003", paymentName: "微信支付", direction: "receive", accountName: "车配智数", accountNumber: "wx_biz_12345", bankName: "", sortOrder: 3, status: "enabled" },
  { paymentId: "PM004", paymentName: "支付宝", direction: "receive", accountName: "车配智数官方账户", accountNumber: "admin@chepei.com", bankName: "", sortOrder: 4, status: "enabled" },
  { paymentId: "PM005", paymentName: "月结账期", direction: "receive", accountName: "", accountNumber: "", bankName: "", sortOrder: 5, status: "enabled" },
  { paymentId: "PM006", paymentName: "承兑汇票", direction: "both", accountName: "广州车配智数科技有限公司", accountNumber: "CH2026052700001", bankName: "中国工商银行", sortOrder: 6, status: "disabled" },
];

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<PaymentMethod, "paymentId">) => void;
  editData?: PaymentMethod | null;
}

function PaymentDialog({ open, onClose, onSave, editData }: DialogProps) {
  const emptyForm = (): Omit<PaymentMethod, "paymentId"> => ({
    paymentName: "", direction: "both", accountName: "", accountNumber: "", bankName: "", sortOrder: 10, status: "enabled",
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
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-lg">
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑支付方式" : "新增支付方式"}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="overflow-auto p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">支付方式名称 <span className="text-red-500">*</span></label>
            <input type="text" value={form.paymentName} placeholder="如：现金、银行转账、微信支付"
              onChange={(e) => { set("paymentName", e.target.value); setErrors({}); }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 ${errors.paymentName ? "border-red-400" : "border-gray-300"}`} />
            {errors.paymentName && <p className="text-xs text-red-500 mt-1">{errors.paymentName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">支付方向</label>
            <div className="flex items-center gap-4">
              {[{ v: "receive", l: "收款" }, { v: "pay", l: "付款" }, { v: "both", l: "通用" }].map(({ v, l }) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="direction" value={v} checked={form.direction === v}
                    onChange={() => set("direction", v)} className="text-blue-500 focus:ring-blue-200" />
                  <span className="text-sm text-gray-700">{l}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">账号名称</label>
            <input type="text" value={form.accountName} placeholder="开户名称（可选）"
              onChange={(e) => set("accountName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">账号号码</label>
            <input type="text" value={form.accountNumber} placeholder="银行账号或支付账号（可选）"
              onChange={(e) => set("accountNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开户行</label>
            <input type="text" value={form.bankName} placeholder="银行名称（可选）"
              onChange={(e) => set("bankName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
              <input type="number" min={1} value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <div className="flex items-center gap-2 mt-1">
                <button type="button" onClick={() => set("status", form.status === "enabled" ? "disabled" : "enabled")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${form.status === "enabled" ? "bg-blue-500" : "bg-gray-200"}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${form.status === "enabled" ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-gray-600">{form.status === "enabled" ? "启用" : "停用"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">保存</button>
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
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSave = (data: Omit<PaymentMethod, "paymentId">) => {
    if (editTarget) {
      setMethods((prev) => prev.map((m) => m.paymentId === editTarget.paymentId ? { ...m, ...data } : m));
    } else {
      setMethods((prev) => [...prev, { paymentId: `PM${Date.now()}`, ...data }]);
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

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditTarget(null); setDialogOpen(true); }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />新增支付方式
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button onClick={() => setKeyword("")}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative w-60">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索支付方式名称..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <span className="text-xs text-gray-400">共 {filtered.length} 条</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["支付方式名称", "支付类型", "账号名称", "账号号码", "开户行", "排序", "状态", "操作"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((m) => (
              <tr key={m.paymentId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.paymentName}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${DIRECTION_COLORS[m.direction]}`}>
                    {DIRECTION_LABELS[m.direction]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{m.accountName || <span className="text-gray-300">—</span>}</td>
                <td className="px-4 py-3 text-sm font-mono text-gray-600 max-w-[160px] truncate">{m.accountNumber || <span className="text-gray-300">—</span>}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{m.bankName || <span className="text-gray-300">—</span>}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{m.sortOrder}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleStatus(m.paymentId)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${m.status === "enabled" ? "bg-blue-500" : "bg-gray-200"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${m.status === "enabled" ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button title="编辑" onClick={() => { setEditTarget(m); setDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><EditIcon sx={{ fontSize: 16 }} /></button>
                    <button title="删除" onClick={() => setDeleteId(m.paymentId)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><DeleteIcon sx={{ fontSize: 16 }} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400">共 {methods.length} 种支付方式 · 停用的支付方式不会显示在业务单据中</p>
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

import { useState } from "react";
import {
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

interface Repayment {
  id: string;
  customerName: string;
  customerPhone: string;
  repaymentDate: string;
  amount: number;
  method: string;
  relatedOrder: string;
  operator: string;
  status: "active" | "voided";
  voidReason?: string;
  voidTime?: string;
}

const mockRepayments: Repayment[] = [
  { id: "R001", customerName: "广州恒达汽配行", customerPhone: "13800138001", repaymentDate: "2026-05-22 10:15", amount: 5000, method: "银行转账", relatedOrder: "D001", operator: "张明", status: "active" },
  { id: "R002", customerName: "东莞汇美汽配城", customerPhone: "13700137003", repaymentDate: "2026-05-20 14:30", amount: 10000, method: "微信支付", relatedOrder: "D003", operator: "王强", status: "active" },
  { id: "R003", customerName: "深圳鑫源汽配店", customerPhone: "13900139002", repaymentDate: "2026-05-18 09:45", amount: 8200, method: "现金", relatedOrder: "D002", operator: "李红", status: "active" },
  { id: "R004", customerName: "佛山通达汽车配件", customerPhone: "13600136004", repaymentDate: "2026-05-16 16:20", amount: 3000, method: "现金", relatedOrder: "D004", operator: "陈静", status: "voided", voidReason: "客户要求取消，重新结算", voidTime: "2026-05-17 09:00" },
  { id: "R005", customerName: "中山荣兴汽配商行", customerPhone: "13500135005", repaymentDate: "2026-05-14 11:00", amount: 9600, method: "支付宝", relatedOrder: "D005", operator: "张明", status: "active" },
  { id: "R006", customerName: "惠州博远汽车配件", customerPhone: "13300133007", repaymentDate: "2026-05-12 15:30", amount: 2000, method: "现金", relatedOrder: "D007", operator: "刘洋", status: "active" },
];

function VoidDialog({ repayment, onClose, onConfirm }: { repayment: Repayment; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) { setError("请填写作废原因"); return; }
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <BlockIcon sx={{ fontSize: 18 }} className="text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">确认作废还款记录</h3>
        </div>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
          <div>客户：<span className="font-medium text-gray-800">{repayment.customerName}</span></div>
          <div>还款金额：<span className="font-semibold text-red-600">¥{repayment.amount.toLocaleString()}</span></div>
          <div>还款时间：{repayment.repaymentDate}</div>
          <div>还款方式：{repayment.method}</div>
        </div>
        <p className="text-xs text-red-500 mb-3">作废后该记录状态变为「已作废」，关联挂账的已还金额将自动减少，欠款余额恢复。</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">作废原因 <span className="text-red-500">*</span></label>
          <textarea rows={3} placeholder="请输入作废原因" value={reason} onChange={e => { setReason(e.target.value); setError(""); }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none ${error ? "border-red-400" : "border-gray-300"}`} />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">取消</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">确认作废</button>
        </div>
      </div>
    </div>
  );
}

export function RepaymentRecord() {
  const [records, setRecords] = useState<Repayment[]>(mockRepayments);
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [voidTarget, setVoidTarget] = useState<Repayment | null>(null);

  const filtered = records.filter(r => {
    const kw = keyword.toLowerCase();
    const matchKw = !kw || r.customerName.toLowerCase().includes(kw) || r.customerPhone.includes(kw);
    const matchStatus = !statusFilter || r.status === statusFilter;
    const dateStr = r.repaymentDate.slice(0, 10);
    const matchStart = !startDate || dateStr >= startDate;
    const matchEnd = !endDate || dateStr <= endDate;
    return matchKw && matchStatus && matchStart && matchEnd;
  });

  const handleVoid = (reason: string) => {
    if (!voidTarget) return;
    const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);
    setRecords(prev => prev.map(r => r.id === voidTarget.id ? { ...r, status: "voided", voidReason: reason, voidTime: now } : r));
  };

  const METHOD_COLORS: Record<string, string> = {
    "现金": "bg-green-100 text-green-700",
    "银行转账": "bg-blue-100 text-blue-700",
    "微信支付": "bg-green-100 text-green-700",
    "支付宝": "bg-blue-100 text-blue-700",
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">还款记录</h2>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 16 }} />导出
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button onClick={() => { setKeyword(""); setStartDate(""); setEndDate(""); setStatusFilter(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="grid grid-cols-4 gap-2">
          <div className="relative">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索客户名称/手机号..." value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <div className="flex items-center gap-1">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 focus:bg-white" />
            <span className="text-gray-400 text-xs shrink-0">~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 focus:bg-white" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700">
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="voided">已作废</option>
          </select>
          <span className="text-xs text-gray-400 flex items-center">共 {filtered.length} 条</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["客户名称", "还款日期", "还款金额", "还款方式", "关联挂账", "操作人", "状态", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${r.status === "voided" ? "opacity-60" : ""}`}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{r.customerName}</div>
                  <div className="text-xs text-gray-400">{r.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.repaymentDate}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">¥{r.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${METHOD_COLORS[r.method] ?? "bg-gray-100 text-gray-700"}`}>{r.method}</span>
                </td>
                <td className="px-4 py-3 text-sm text-blue-600 font-mono">{r.relatedOrder}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.operator}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {r.status === "active" ? "正常" : "已作废"}
                  </span>
                  {r.status === "voided" && r.voidReason && (
                    <div className="text-xs text-gray-400 mt-0.5 max-w-[120px] truncate" title={r.voidReason}>{r.voidReason}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.status === "active" && (
                    <button onClick={() => setVoidTarget(r)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="作废">
                      <BlockIcon sx={{ fontSize: 16 }} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>正常还款总额：<span className="font-semibold text-green-600">¥{filtered.filter(r => r.status === "active").reduce((s, r) => s + r.amount, 0).toLocaleString()}</span></span>
          <span>共 {filtered.length} 条记录</span>
        </div>
      </div>

      {voidTarget && <VoidDialog repayment={voidTarget} onClose={() => setVoidTarget(null)} onConfirm={handleVoid} />}
    </div>
  );
}

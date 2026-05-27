import { useState } from "react";
import {
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

interface RepaymentRow {
  id: string;
  repaymentTime: string;
  orderNo: string;
  source: string;
  customerName: string;
  gender: string;
  phone: string;
  debt: number;
  repayment: number;
  other: number;
  prepayment: number;
  discount: number;
  outstanding: number;
  openTime: string;
  clerk: string;
  cashier: string;
  remark: string;
  voider?: string;
  status: "active" | "voided";
  voidTime?: string;
  voidReason?: string;
}

const activeRows: RepaymentRow[] = [
  { id: "R001", repaymentTime: "2026-05-22 10:15", orderNo: "HD20260522001", source: "前台", customerName: "广州恒达汽配行", gender: "男", phone: "13800138001", debt: 12580, repayment: 5000, other: 0, prepayment: 0, discount: 50, outstanding: 7530, openTime: "2026-05-22 09:52", clerk: "张明", cashier: "李红", remark: "月底前分批结清", status: "active" },
  { id: "R002", repaymentTime: "2026-05-20 14:30", orderNo: "HD20260520003", source: "业务员", customerName: "东莞汇美汽配城", gender: "女", phone: "13700137003", debt: 35000, repayment: 10000, other: 0, prepayment: 0, discount: 100, outstanding: 24900, openTime: "2026-05-20 13:18", clerk: "王强", cashier: "陈静", remark: "客户要求保留尾款", status: "active" },
  { id: "R003", repaymentTime: "2026-05-18 09:45", orderNo: "HD20260518002", source: "前台", customerName: "深圳鑫源汽配店", gender: "男", phone: "13900139002", debt: 8200, repayment: 8200, other: 0, prepayment: 0, discount: 0, outstanding: 0, openTime: "2026-05-18 09:00", clerk: "刘洋", cashier: "赵磊", remark: "已结清", status: "active" },
];

const voidRows: RepaymentRow[] = [
  { id: "V001", repaymentTime: "2026-05-16 16:20", orderNo: "HD20260516005", source: "前台", customerName: "佛山通达汽车配件", gender: "男", phone: "13600136004", debt: 6800, repayment: 3000, other: 200, prepayment: 500, discount: 20, outstanding: 3080, openTime: "2026-05-16 15:10", clerk: "张伟", cashier: "李明", remark: "客户要求取消，重新结算", voider: "王芳", status: "voided", voidTime: "2026-05-17 09:00", voidReason: "客户要求取消，重新结算" },
];

function VoidDialog({ repayment, onClose, onConfirm }: { repayment: RepaymentRow; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("请填写作废原因");
      return;
    }
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
          <div>还款金额：<span className="font-semibold text-red-600">¥{repayment.repayment.toLocaleString()}</span></div>
          <div>还款时间：{repayment.repaymentTime}</div>
          <div>单号：{repayment.orderNo}</div>
        </div>
        <p className="text-xs text-red-500 mb-3">作废后该记录状态变为「已作废」，关联挂账的已还金额将自动减少，欠款余额恢复。</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">作废原因 <span className="text-red-500">*</span></label>
          <textarea
            rows={3}
            placeholder="请输入作废原因"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none ${error ? "border-red-400" : "border-gray-300"}`}
          />
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
  const [tab, setTab] = useState<"active" | "voided">("active");
  const [records, setRecords] = useState<RepaymentRow[]>([...activeRows, ...voidRows]);
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [voidTarget, setVoidTarget] = useState<RepaymentRow | null>(null);

  const filtered = records.filter((r) => {
    const kw = keyword.toLowerCase();
    const matchKw = !kw || r.customerName.toLowerCase().includes(kw) || r.phone.includes(kw);
    const matchOrder = !orderNo || r.orderNo.includes(orderNo);
    const dateStr = r.repaymentTime.slice(0, 10);
    const matchStart = !startDate || dateStr >= startDate;
    const matchEnd = !endDate || dateStr <= endDate;
    const matchTab = tab === "active" ? r.status === "active" : r.status === "voided";
    return matchKw && matchOrder && matchStart && matchEnd && matchTab;
  });

  const handleVoid = (reason: string) => {
    if (!voidTarget) return;
    const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);
    setRecords((prev) => prev.map((r) => r.id === voidTarget.id ? { ...r, status: "voided", voidReason: reason, voidTime: now, voider: "当前用户" } : r));
  };

  const money = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">还款记录</h2>
      </div>

      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-3 gap-y-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">还款时间</span>
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-0 flex-1 px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm bg-white" />
              <span className="text-gray-400 text-xs shrink-0">至</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-0 flex-1 px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm bg-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">客户查询</span>
            <div className="relative flex-1 min-w-0">
              <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="姓名/电话" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">单号</span>
            <input type="text" placeholder="请输入单号" value={orderNo} onChange={(e) => setOrderNo(e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => {}} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5 whitespace-nowrap">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setKeyword(""); setStartDate(""); setEndDate(""); setOrderNo(""); }}
              className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5 whitespace-nowrap">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <FileDownloadIcon sx={{ fontSize: 16 }} />导出
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("active")}
            className={`px-5 py-2.5 text-sm font-medium transition-all relative ${
              tab === "active"
                ? "text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            还款记录
            {tab === "active" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button
            onClick={() => setTab("voided")}
            className={`px-5 py-2.5 text-sm font-medium transition-all relative ${
              tab === "voided"
                ? "text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            作废记录
            {tab === "voided" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {tab === "active"
                ? ["序号", "还款时间", "单号", "来源", "客户名称", "性别", "联系电话", "欠款", "还款", "其他", "预付款", "优惠", "尚欠", "开单时间", "开单员", "收银员", "备注", "操作"].map((h) => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap ${h === "操作" ? "sticky right-0 z-20 bg-gray-50 border-l border-gray-200 shadow-[-12px_0_18px_-10px_rgba(0,0,0,0.45)]" : ""}`}>{h}</th>
                  ))
                : ["序号", "作废时间", "还款时间", "单号", "来源", "客户名称", "性别", "联系电话", "欠款", "还款", "其他", "预付款", "优惠", "尚欠", "开单时间", "开单员", "收银员", "撤单员", "备注", "操作"].map((h) => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap ${h === "操作" ? "sticky right-0 z-20 bg-gray-50 border-l border-gray-200 shadow-[-12px_0_18px_-10px_rgba(0,0,0,0.45)]" : ""}`}>{h}</th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={tab === "active" ? 18 : 20} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : tab === "active" ? (
              filtered.map((row, index) => (
                <tr key={row.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${row.status === "voided" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.repaymentTime}</td>
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{row.orderNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.source}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{row.customerName}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{money(row.debt)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">{money(row.repayment)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{money(row.other)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{money(row.prepayment)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{money(row.discount)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">{money(row.outstanding)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.openTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.clerk}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.cashier}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="truncate block max-w-[160px]" title={row.remark}>{row.remark}</span>
                  </td>
                  <td className="px-4 py-3 sticky right-0 bg-white z-10 border-l border-gray-200 shadow-[-12px_0_18px_-10px_rgba(0,0,0,0.45)]">
                    <button onClick={() => setVoidTarget(row)} className="px-2 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium whitespace-nowrap" title="作废">
                      作废
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              filtered.map((row, index) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors opacity-80">
                  <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.voidTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.repaymentTime}</td>
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{row.orderNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.source}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{row.customerName}</div>
                    {row.voidReason && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]" title={row.voidReason}>{row.voidReason}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{money(row.debt)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">{money(row.repayment)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{money(row.other)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{money(row.prepayment)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{money(row.discount)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">{money(row.outstanding)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.openTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.clerk}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.cashier}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.voider ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="truncate block max-w-[160px]" title={row.remark}>{row.remark}</span>
                  </td>
                  <td className="px-4 py-3 sticky right-0 bg-white z-10 border-l border-gray-200 shadow-[-12px_0_18px_-10px_rgba(0,0,0,0.45)]">
                    <button className="px-2 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium whitespace-nowrap" title="查看">
                      查看
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>共 {filtered.length} 条数据</span>
          <span>当前筛选金额合计：<span className="font-semibold text-red-600">¥{filtered.reduce((sum, row) => sum + row.repayment, 0).toLocaleString()}</span></span>
        </div>
      </div>

      {voidTarget && <VoidDialog repayment={voidTarget} onClose={() => setVoidTarget(null)} onConfirm={handleVoid} />}
    </div>
  );
}

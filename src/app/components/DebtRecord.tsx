import { useState } from "react";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  ListAlt as ListAltIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";

interface DebtItem {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  accrualDate: string;
  accrualAmount: number;
  repaidAmount: number;
  balance: number;
  status: "unpaid" | "paid";
  expectedRepayDate: string;
}

interface DetailItem {
  id: string;
  accrualDate: string;
  accrualAmount: number;
  repaidAmount: number;
  balance: number;
  status: "unpaid" | "paid";
  expectedRepayDate: string;
  orderNo: string;
}

const mockDebts: DebtItem[] = [
  { id: "D001", customerId: "C001", customerName: "广州恒达汽配行", customerPhone: "13800138001", accrualDate: "2026-05-10", accrualAmount: 12580, repaidAmount: 5000, balance: 7580, status: "unpaid", expectedRepayDate: "2026-06-10" },
  { id: "D002", customerId: "C002", customerName: "深圳鑫源汽配店", customerPhone: "13900139002", accrualDate: "2026-04-28", accrualAmount: 8200, repaidAmount: 8200, balance: 0, status: "paid", expectedRepayDate: "2026-05-28" },
  { id: "D003", customerId: "C003", customerName: "东莞汇美汽配城", customerPhone: "13700137003", accrualDate: "2026-05-15", accrualAmount: 35000, repaidAmount: 10000, balance: 25000, status: "unpaid", expectedRepayDate: "2026-06-15" },
  { id: "D004", customerId: "C004", customerName: "佛山通达汽车配件", customerPhone: "13600136004", accrualDate: "2026-05-01", accrualAmount: 6800, repaidAmount: 3000, balance: 3800, status: "unpaid", expectedRepayDate: "2026-05-30" },
  { id: "D005", customerId: "C005", customerName: "中山荣兴汽配商行", customerPhone: "13500135005", accrualDate: "2026-04-15", accrualAmount: 9600, repaidAmount: 9600, balance: 0, status: "paid", expectedRepayDate: "2026-05-15" },
  { id: "D006", customerId: "C006", customerName: "珠海德隆汽配贸易", customerPhone: "13400134006", accrualDate: "2026-05-20", accrualAmount: 18500, repaidAmount: 0, balance: 18500, status: "unpaid", expectedRepayDate: "2026-06-20" },
  { id: "D007", customerId: "C007", customerName: "惠州博远汽车配件", customerPhone: "13300133007", accrualDate: "2026-05-08", accrualAmount: 4200, repaidAmount: 2000, balance: 2200, status: "unpaid", expectedRepayDate: "2026-06-08" },
];

const mockDetails: Record<string, DetailItem[]> = {
  C001: [
    { id: "DD001", accrualDate: "2026-05-10", accrualAmount: 8580, repaidAmount: 5000, balance: 3580, status: "unpaid", expectedRepayDate: "2026-06-10", orderNo: "SO20260510003" },
    { id: "DD002", accrualDate: "2026-05-18", accrualAmount: 4000, repaidAmount: 0, balance: 4000, status: "unpaid", expectedRepayDate: "2026-06-18", orderNo: "SO20260518007" },
  ],
  C003: [
    { id: "DD003", accrualDate: "2026-05-15", accrualAmount: 20000, repaidAmount: 10000, balance: 10000, status: "unpaid", expectedRepayDate: "2026-06-15", orderNo: "SO20260515001" },
    { id: "DD004", accrualDate: "2026-05-22", accrualAmount: 15000, repaidAmount: 0, balance: 15000, status: "unpaid", expectedRepayDate: "2026-06-22", orderNo: "SO20260522005" },
  ],
};

const PAYMENT_METHODS = ["现金", "微信支付", "支付宝", "银行转账", "其他"];

function DetailDialog({ debt, onClose }: { debt: DebtItem; onClose: () => void }) {
  const details = mockDetails[debt.customerId] ?? [
    { id: "DD_X", accrualDate: debt.accrualDate, accrualAmount: debt.accrualAmount, repaidAmount: debt.repaidAmount, balance: debt.balance, status: debt.status, expectedRepayDate: debt.expectedRepayDate, orderNo: "SO" + debt.id },
  ];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 600 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
          <div>
            <h2 className="text-lg font-bold text-gray-800">欠款明细</h2>
            <p className="text-xs text-gray-400 mt-0.5">{debt.customerName} · {debt.customerPhone}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {["关联单据", "挂账日期", "挂账金额", "已还金额", "欠款余额", "预还款日", "状态"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {details.map(d => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-blue-600 font-mono">{d.orderNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{d.accrualDate}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">¥{d.accrualAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-green-700">¥{d.repaidAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">¥{d.balance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{d.expectedRepayDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${d.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {d.status === "paid" ? "已结清" : "未结清"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold">{details.length}</span> 笔 · 总欠款余额
            <span className="font-semibold text-red-600 ml-1">¥{details.reduce((s, d) => s + d.balance, 0).toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">关闭</button>
        </div>
      </div>
    </div>
  );
}

function BatchRepayDialog({ debts, onClose, onConfirm }: { debts: DebtItem[]; onClose: () => void; onConfirm: (ids: string[]) => void }) {
  const [method, setMethod] = useState("现金");
  const [remark, setRemark] = useState("");
  const total = debts.reduce((s, d) => s + d.balance, 0);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 600 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">批量还款</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-auto p-5 min-h-0">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-4">
            <span className="text-sm text-gray-700">已选 <span className="font-semibold text-blue-600">{debts.length}</span> 条欠款记录</span>
            <span className="text-sm text-gray-700">合计还款金额：<span className="font-semibold text-red-600 text-base">¥{total.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</span></span>
          </div>
          <table className="w-full mb-5">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                {["客户名称", "挂账日期", "挂账金额", "已还金额", "欠款余额", "预还款日"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {debts.map(d => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{d.customerName}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{d.accrualDate}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-900">¥{d.accrualAmount.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-sm text-green-700">¥{d.repaidAmount.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-red-600">¥{d.balance.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{d.expectedRepayDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">还款方式 <span className="text-red-500">*</span></label>
              <select value={method} onChange={e => setMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <input type="text" placeholder="请输入备注" value={remark} onChange={e => setRemark(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400" />
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">取消</button>
          <button onClick={() => { onConfirm(debts.map(d => d.id)); onClose(); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">确认还款</button>
        </div>
      </div>
    </div>
  );
}

export function DebtRecord() {
  const [debts, setDebts] = useState<DebtItem[]>(mockDebts);
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailTarget, setDetailTarget] = useState<DebtItem | null>(null);
  const [batchRepayOpen, setBatchRepayOpen] = useState(false);

  const filtered = debts.filter(d => {
    const kw = keyword.toLowerCase();
    const matchKw = !kw || d.customerName.toLowerCase().includes(kw) || d.customerPhone.includes(kw);
    const matchStatus = !statusFilter || d.status === statusFilter;
    const matchStart = !startDate || d.accrualDate >= startDate;
    const matchEnd = !endDate || d.accrualDate <= endDate;
    return matchKw && matchStatus && matchStart && matchEnd;
  });

  const unpaidFiltered = filtered.filter(d => d.status === "unpaid");
  const allChecked = unpaidFiltered.length > 0 && unpaidFiltered.every(d => selectedIds.includes(d.id));

  const toggleAll = () => {
    if (allChecked) setSelectedIds(prev => prev.filter(id => !unpaidFiltered.some(d => d.id === id)));
    else setSelectedIds(prev => [...new Set([...prev, ...unpaidFiltered.map(d => d.id)])]);
  };

  const handleConfirmRepay = (ids: string[]) => {
    setDebts(prev => prev.map(d => ids.includes(d.id) ? { ...d, repaidAmount: d.accrualAmount, balance: 0, status: "paid" } : d));
    setSelectedIds([]);
  };

  const selectedDebts = debts.filter(d => selectedIds.includes(d.id));

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">挂账/欠款记录</h2>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => { if (selectedDebts.length) setBatchRepayOpen(true); }} disabled={!selectedIds.length}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <PaymentIcon sx={{ fontSize: 16 }} />批量还款
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 16 }} />导出
          </button>
          <button onClick={() => { setKeyword(""); setStartDate(""); setEndDate(""); setStatusFilter(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
          {selectedIds.length > 0 && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">已选 {selectedIds.length} 项</span>}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="grid grid-cols-4 gap-2">
          <div className="relative col-span-1">
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
            <option value="unpaid">未结清</option>
            <option value="paid">已结清</option>
          </select>
          <span className="text-xs text-gray-400 flex items-center">共 {filtered.length} 条</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="rounded border-gray-300 text-blue-500 cursor-pointer" />
              </th>
              {["客户名称", "挂账日期", "挂账金额", "已还金额", "欠款余额", "状态", "预还款日", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.includes(d.id) ? "bg-blue-50/30" : ""}`}>
                <td className="px-4 py-3">
                  {d.status === "unpaid" && (
                    <input type="checkbox" checked={selectedIds.includes(d.id)}
                      onChange={() => setSelectedIds(prev => prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id])}
                      className="rounded border-gray-300 text-blue-500 cursor-pointer" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{d.customerName}</div>
                  <div className="text-xs text-gray-400">{d.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{d.accrualDate}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">¥{d.accrualAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-green-700">¥{d.repaidAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-red-600">¥{d.balance.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${d.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {d.status === "paid" ? "已结清" : "未结清"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{d.expectedRepayDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setDetailTarget(d)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="欠款明细">
                      <ListAltIcon sx={{ fontSize: 16 }} />
                    </button>
                    {d.status === "unpaid" && (
                      <button onClick={() => { setSelectedIds([d.id]); setBatchRepayOpen(true); }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="还款">
                        <PaymentIcon sx={{ fontSize: 16 }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>总欠款余额：<span className="font-semibold text-red-600">¥{filtered.reduce((s, d) => s + d.balance, 0).toLocaleString()}</span></span>
          <span>共 {filtered.length} 条记录</span>
        </div>
      </div>

      {detailTarget && <DetailDialog debt={detailTarget} onClose={() => setDetailTarget(null)} />}
      {batchRepayOpen && <BatchRepayDialog debts={selectedDebts} onClose={() => setBatchRepayOpen(false)} onConfirm={handleConfirmRepay} />}
    </div>
  );
}

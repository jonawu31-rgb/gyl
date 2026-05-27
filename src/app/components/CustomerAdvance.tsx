import { useState } from "react";
import {
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface AdvanceCustomer {
  id: string;
  name: string;
  phone: string;
  totalAdvance: number;
  usedAmount: number;
  balance: number;
}

interface AdvanceDetail {
  id: string;
  date: string;
  type: "充值" | "消费" | "退款";
  amount: number;
  orderNo: string;
  remark: string;
  balance: number;
}

const mockCustomers: AdvanceCustomer[] = [
  { id: "C001", name: "广州恒达汽配行", phone: "13800138001", totalAdvance: 50000, usedAmount: 32500, balance: 17500 },
  { id: "C002", name: "深圳鑫源汽配店", phone: "13900139002", totalAdvance: 20000, usedAmount: 20000, balance: 0 },
  { id: "C003", name: "东莞汇美汽配城", phone: "13700137003", totalAdvance: 100000, usedAmount: 68000, balance: 32000 },
  { id: "C004", name: "佛山通达汽车配件", phone: "13600136004", totalAdvance: 10000, usedAmount: 3500, balance: 6500 },
  { id: "C005", name: "中山荣兴汽配商行", phone: "13500135005", totalAdvance: 30000, usedAmount: 30000, balance: 0 },
  { id: "C006", name: "珠海德隆汽配贸易", phone: "13400134006", totalAdvance: 15000, usedAmount: 8200, balance: 6800 },
  { id: "C007", name: "惠州博远汽车配件", phone: "13300133007", totalAdvance: 5000, usedAmount: 1800, balance: 3200 },
  { id: "C008", name: "广州云峰汽配集团", phone: "13200132008", totalAdvance: 200000, usedAmount: 145000, balance: 55000 },
];

const mockDetails: Record<string, AdvanceDetail[]> = {
  C001: [
    { id: "AD001", date: "2026-04-01 09:00", type: "充值", amount: 30000, orderNo: "—", remark: "银行转账预充", balance: 30000 },
    { id: "AD002", date: "2026-04-10 14:22", type: "消费", amount: -15000, orderNo: "SO20260410003", remark: "销售消费", balance: 15000 },
    { id: "AD003", date: "2026-05-01 10:00", type: "充值", amount: 20000, orderNo: "—", remark: "微信支付预充", balance: 35000 },
    { id: "AD004", date: "2026-05-15 16:30", type: "消费", amount: -17500, orderNo: "SO20260515008", remark: "销售消费", balance: 17500 },
  ],
  C003: [
    { id: "AD005", date: "2026-03-15 08:30", type: "充值", amount: 100000, orderNo: "—", remark: "年度预充款", balance: 100000 },
    { id: "AD006", date: "2026-04-01 14:00", type: "消费", amount: -30000, orderNo: "SO20260401001", remark: "批量销售", balance: 70000 },
    { id: "AD007", date: "2026-05-10 11:20", type: "消费", amount: -38000, orderNo: "SO20260510012", remark: "批量销售", balance: 32000 },
  ],
};

function DetailDialog({ customer, onClose }: { customer: AdvanceCustomer; onClose: () => void }) {
  const details = mockDetails[customer.id] ?? [];
  const TYPE_COLORS: Record<string, string> = {
    "充值": "bg-green-100 text-green-700",
    "消费": "bg-red-100 text-red-700",
    "退款": "bg-yellow-100 text-yellow-700",
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 600 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
          <div>
            <h2 className="text-lg font-bold text-gray-800">预收款明细</h2>
            <p className="text-xs text-gray-400 mt-0.5">{customer.name} · {customer.phone}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>

        {/* Summary */}
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
          <div className="flex items-center gap-8 text-sm">
            <span className="text-gray-600">预收款总额：<span className="font-semibold text-gray-900">¥{customer.totalAdvance.toLocaleString()}</span></span>
            <span className="text-gray-600">已用金额：<span className="font-semibold text-red-600">¥{customer.usedAmount.toLocaleString()}</span></span>
            <span className="text-gray-600">剩余金额：<span className="font-semibold text-green-600">¥{customer.balance.toLocaleString()}</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          {details.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">暂无明细记录</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  {["日期", "类型", "金额", "关联单号", "备注", "余额"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {details.map(d => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{d.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${TYPE_COLORS[d.type]}`}>{d.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      <span className={d.amount > 0 ? "text-green-600" : "text-red-600"}>
                        {d.amount > 0 ? "+" : ""}¥{Math.abs(d.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-mono">{d.orderNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{d.remark}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">¥{d.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">关闭</button>
        </div>
      </div>
    </div>
  );
}

export function CustomerAdvance() {
  const [keyword, setKeyword] = useState("");
  const [onlyHasBalance, setOnlyHasBalance] = useState(false);
  const [detailTarget, setDetailTarget] = useState<AdvanceCustomer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = mockCustomers.filter(c => {
    const kw = keyword.toLowerCase();
    const matchKw = !kw || c.name.toLowerCase().includes(kw) || c.phone.includes(kw);
    const matchBalance = !onlyHasBalance || c.balance > 0;
    return matchKw && matchBalance;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalAdvance = filtered.reduce((s, c) => s + c.totalAdvance, 0);
  const totalBalance = filtered.reduce((s, c) => s + c.balance, 0);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">客户预收款</h2>
      </div>

      {/* Search & Actions */}
      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索客户姓名/电话/单号..." value={keyword} onChange={e => { setKeyword(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={onlyHasBalance} onChange={e => { setOnlyHasBalance(e.target.checked); setCurrentPage(1); }}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-200" />
            <span className="text-sm text-gray-700">仅尚有预收款</span>
          </label>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <SearchIcon sx={{ fontSize: 16 }} />搜索
          </button>
          <button onClick={() => { setKeyword(""); setOnlyHasBalance(false); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
          <div className="flex-1" />
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 16 }} />导出
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-14">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">电话</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">预收款总额</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">已用金额</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">剩余金额</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : pageData.map((c, idx) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{c.phone}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">¥{c.totalAdvance.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">¥{c.usedAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-semibold ${c.balance > 0 ? "text-green-600" : "text-gray-400"}`}>
                    ¥{c.balance.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => setDetailTarget(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="查看明细">
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            共 <span className="font-semibold text-gray-700">{filtered.length}</span> 条 · 预收款总额：
            <span className="font-semibold text-gray-800">¥{totalAdvance.toLocaleString()}</span> · 剩余合计：
            <span className="font-semibold text-green-600">¥{totalBalance.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">上一页</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`px-3 py-1.5 text-sm rounded-lg ${currentPage === p ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"}`}>{p}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">下一页</button>
          </div>
        </div>
      </div>

      {detailTarget && <DetailDialog customer={detailTarget} onClose={() => setDetailTarget(null)} />}
    </div>
  );
}

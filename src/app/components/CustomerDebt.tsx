import React, { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface DebtRecord {
  id: string;
  customerName: string;
  phone: string;
  debtAmount: number;
  repaidAmount: number;
  remaining: number;
  lastRepayDate: string;
  status: "待还款" | "已结清";
}

interface RepayRecord {
  id: string;
  repayNo: string;
  customerName: string;
  repayDate: string;
  repayAmount: number;
  repayMethod: string;
  handler: string;
  remark: string;
}

interface VoidRecord {
  id: string;
  voidNo: string;
  origRepayNo: string;
  customerName: string;
  voidAmount: number;
  voidDate: string;
  voidReason: string;
  operator: string;
}

const mockDebts: DebtRecord[] = [
  { id: "1", customerName: "张伟", phone: "13800138001", debtAmount: 5800, repaidAmount: 3000, remaining: 2800, lastRepayDate: "2026-05-20", status: "待还款" },
  { id: "2", customerName: "李娜", phone: "13800138002", debtAmount: 2300, repaidAmount: 2300, remaining: 0, lastRepayDate: "2026-05-18", status: "已结清" },
  { id: "3", customerName: "王刚", phone: "13800138003", debtAmount: 9600, repaidAmount: 4000, remaining: 5600, lastRepayDate: "2026-05-15", status: "待还款" },
  { id: "4", customerName: "赵丽", phone: "13800138004", debtAmount: 1500, repaidAmount: 0, remaining: 1500, lastRepayDate: "-", status: "待还款" },
  { id: "5", customerName: "陈明", phone: "13800138005", debtAmount: 3200, repaidAmount: 3200, remaining: 0, lastRepayDate: "2026-05-10", status: "已结清" },
  { id: "6", customerName: "刘洋", phone: "13800138006", debtAmount: 7400, repaidAmount: 2400, remaining: 5000, lastRepayDate: "2026-05-22", status: "待还款" },
  { id: "7", customerName: "黄建国", phone: "13800138007", debtAmount: 4500, repaidAmount: 1500, remaining: 3000, lastRepayDate: "2026-05-12", status: "待还款" },
  { id: "8", customerName: "孙静", phone: "13800138008", debtAmount: 880, repaidAmount: 880, remaining: 0, lastRepayDate: "2026-05-08", status: "已结清" },
];

const mockRepays: RepayRecord[] = [
  { id: "R1", repayNo: "HK260520001", customerName: "张伟", repayDate: "2026-05-20", repayAmount: 3000, repayMethod: "银行转账", handler: "王五", remark: "" },
  { id: "R2", repayNo: "HK260518001", customerName: "李娜", repayDate: "2026-05-18", repayAmount: 2300, repayMethod: "现金", handler: "张三", remark: "已结清" },
  { id: "R3", repayNo: "HK260515001", customerName: "王刚", repayDate: "2026-05-15", repayAmount: 4000, repayMethod: "微信", handler: "李四", remark: "" },
  { id: "R4", repayNo: "HK260510001", customerName: "陈明", repayDate: "2026-05-10", repayAmount: 3200, repayMethod: "支付宝", handler: "王五", remark: "分批结清" },
  { id: "R5", repayNo: "HK260522001", customerName: "刘洋", repayDate: "2026-05-22", repayAmount: 2400, repayMethod: "银行转账", handler: "张三", remark: "" },
  { id: "R6", repayNo: "HK260512001", customerName: "黄建国", repayDate: "2026-05-12", repayAmount: 1500, repayMethod: "现金", handler: "赵六", remark: "" },
];

const mockVoids: VoidRecord[] = [
  { id: "V1", voidNo: "ZF260501001", origRepayNo: "HK260430001", customerName: "刘洋", voidAmount: 1000, voidDate: "2026-05-01", voidReason: "客户申请退款", operator: "张三" },
  { id: "V2", voidNo: "ZF260510002", origRepayNo: "HK260508001", customerName: "孙静", voidAmount: 500, voidDate: "2026-05-10", voidReason: "录入错误", operator: "李四" },
];

const mockPaymentMethods = ["现金", "银行转账", "支票", "微信", "支付宝"];

function RepayDialog({ debt, onClose }: { debt: DebtRecord; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [remark, setRemark] = useState("");

  const inp = "flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400 bg-white";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-sm">
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-gray-800">新增还款单</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-700">
              客户：<span className="font-medium text-blue-600">{debt.customerName}</span>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              剩余欠款：<span className="text-red-600 font-semibold">¥{debt.remaining.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[68px] text-right text-xs text-gray-600 shrink-0"><span className="text-red-500">*</span> 还款金额</span>
            <input type="number" min={0} max={debt.remaining} placeholder="请输入还款金额" value={amount}
              onChange={e => setAmount(e.target.value)} className={inp} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[68px] text-right text-xs text-gray-600 shrink-0">还款方式</span>
            <FauxSelect value={method} onChange={e => setMethod(e.target.value)} className={`${inp} flex-1`}>
              <option value="">请选择</option>
              {mockPaymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[68px] text-right text-xs text-gray-600 shrink-0">备注</span>
            <input type="text" placeholder="请输入备注" value={remark} onChange={e => setRemark(e.target.value)} className={inp} />
          </div>
        </div>
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={() => { alert("还款成功！"); onClose(); }}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewRepayDialog({ record, onClose }: { record: RepayRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-md">
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-gray-800">还款单详情</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="p-4 space-y-2.5">
          {[
            ["还款单号", record.repayNo],
            ["客户名称", record.customerName],
            ["还款日期", record.repayDate],
            ["还款金额", `¥${record.repayAmount.toFixed(2)}`],
            ["还款方式", record.repayMethod],
            ["经手人", record.handler],
            ["备注", record.remark || "-"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-3 py-1 border-b border-gray-50">
              <span className="w-20 text-right text-xs text-gray-500 shrink-0">{label}</span>
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">关闭</button>
        </div>
      </div>
    </div>
  );
}

function ViewVoidDialog({ record, onClose }: { record: VoidRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-md">
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-gray-800">还款作废记录详情</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="p-4 space-y-2.5">
          {[
            ["作废单号", record.voidNo],
            ["原还款单号", record.origRepayNo],
            ["客户名称", record.customerName],
            ["作废金额", `¥${record.voidAmount.toFixed(2)}`],
            ["作废日期", record.voidDate],
            ["作废原因", record.voidReason],
            ["操作人", record.operator],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-3 py-1 border-b border-gray-50">
              <span className="w-24 text-right text-xs text-gray-500 shrink-0">{label}</span>
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">关闭</button>
        </div>
      </div>
    </div>
  );
}

type TabKey = "debt" | "repay" | "void";

const CustomerDebt: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("debt");
  const [keyword, setKeyword] = useState("");
  const [onlyHasDebt, setOnlyHasDebt] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [repayTarget, setRepayTarget] = useState<DebtRecord | null>(null);
  const [viewRepay, setViewRepay] = useState<RepayRecord | null>(null);
  const [viewVoid, setViewVoid] = useState<VoidRecord | null>(null);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = () => setCurrentPage(1);
  const handleReset = () => { setKeyword(""); setOnlyHasDebt(false); setCurrentPage(1); };

  const filteredDebts = mockDebts.filter(r => {
    const q = keyword.toLowerCase();
    const matchKw = !keyword || r.customerName.includes(q) || r.phone.includes(q);
    const matchDebt = !onlyHasDebt || r.remaining > 0;
    return matchKw && matchDebt;
  });

  const filteredRepays = mockRepays.filter(r => {
    const q = keyword.toLowerCase();
    return !keyword || r.customerName.includes(q) || r.repayNo.includes(q);
  });

  const filteredVoids = mockVoids.filter(r => {
    const q = keyword.toLowerCase();
    return !keyword || r.customerName.includes(q) || r.voidNo.includes(q) || r.origRepayNo.includes(q);
  });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "debt", label: "欠款记录" },
    { key: "repay", label: "还款记录" },
    { key: "void", label: "还款作废记录" },
  ];

  const activeList = activeTab === "debt" ? filteredDebts : activeTab === "repay" ? filteredRepays : filteredVoids;
  const totalPages = Math.max(1, Math.ceil(activeList.length / pageSize));

  const btnBase = "px-3 py-1.5 text-sm rounded-lg border transition-all";
  const btnPrimary = `${btnBase} bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent hover:from-blue-600 hover:to-blue-700`;
  const btnSecondary = `${btnBase} bg-white text-gray-700 border-gray-200 hover:bg-gray-50`;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-gray-200 px-4 bg-white shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Search toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-52 flex-1 max-w-xs">
            <SearchIcon sx={{ fontSize: 15 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "debt" ? "姓名/电话/VIN码/单号" : "客户名称/单号"}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white"
            />
          </div>
          {activeTab === "debt" && (
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyHasDebt}
                onChange={e => setOnlyHasDebt(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-700">仅尚有欠款</span>
            </label>
          )}
          <button onClick={handleSearch} className={btnPrimary}>搜索</button>
          <button onClick={handleReset} className={btnSecondary}>重置</button>
          <div className="ml-auto">
            <button onClick={() => alert("导出Excel")}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5">
              <FileDownloadIcon sx={{ fontSize: 15 }} />导出
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        {activeTab === "debt" && (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {["序号", "客户名称", "电话", "欠款金额", "已还金额", "剩余欠款", "最近还款日期", "状态", "操作"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDebts.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
              ) : filteredDebts.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-2.5 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{row.customerName}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{row.phone}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-800">¥{row.debtAmount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-sm text-green-700">¥{row.repaidAmount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-red-600">
                    {row.remaining > 0 ? `¥${row.remaining.toFixed(2)}` : "-"}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{row.lastRepayDate}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.status === "已结清" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => alert(`查看 ${row.customerName} 欠款明细`)}
                        className="px-2.5 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors">查看</button>
                      {row.remaining > 0 && (
                        <button onClick={() => setRepayTarget(row)}
                          className="px-2.5 py-1 text-xs text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded transition-colors shadow-sm">还款</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "repay" && (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {["序号", "还款单号", "客户名称", "还款日期", "还款金额", "还款方式", "经手人", "备注", "操作"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRepays.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
              ) : filteredRepays.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-2.5 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{row.repayNo}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-800">{row.customerName}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{row.repayDate}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-green-700">¥{row.repayAmount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{row.repayMethod}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{row.handler}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-500">{row.remark || "-"}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setViewRepay(row)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <VisibilityIcon sx={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "void" && (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {["序号", "作废单号", "原还款单号", "客户名称", "作废金额", "作废日期", "作废原因", "操作人", "操作"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredVoids.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
              ) : filteredVoids.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-2.5 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{row.voidNo}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{row.origRepayNo}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-800">{row.customerName}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-red-600">¥{row.voidAmount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{row.voidDate}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{row.voidReason}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{row.operator}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setViewVoid(row)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <VisibilityIcon sx={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination footer */}
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
        <span className="text-xs text-gray-500">共 {activeList.length} 条数据</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-2.5 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">上一页</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 text-xs rounded border transition-all ${currentPage === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-2.5 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">下一页</button>
        </div>
      </div>

      {repayTarget && <RepayDialog debt={repayTarget} onClose={() => setRepayTarget(null)} />}
      {viewRepay && <ViewRepayDialog record={viewRepay} onClose={() => setViewRepay(null)} />}
      {viewVoid && <ViewVoidDialog record={viewVoid} onClose={() => setViewVoid(null)} />}
    </div>
  );
};

export default CustomerDebt;

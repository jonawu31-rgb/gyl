import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FauxSelect } from "./ui/FauxSelect";

interface SupplierSummary {
  id: string;
  supplier: string;
  initialDebt: number;
  totalPurchase: number;
  totalReturn: number;
  totalReturnDue: number;
  totalReturnPaid: number;
  returnDiscount: number;
  totalPayment: number;
  totalDiscount: number;
  remainingDebt: number;
}

interface DetailRecord {
  id: string;
  date: string;
  orderNo: string;
  supplier: string;
  purchaseAmt: number;
  returnAmt: number;
  paymentAmt: number;
  discountAmt: number;
  operator: string;
  remark: string;
}

interface RepaymentRecord {
  id: string;
  repaymentNo: string;
  supplier: string;
  date: string;
  amount: number;
  method: string;
  operator: string;
  remark: string;
}

const mockSummary: SupplierSummary[] = [
  { id: "1", supplier: "广州达华汽配有限公司", initialDebt: 5000, totalPurchase: 128000, totalReturn: 3500, totalReturnDue: 3500, totalReturnPaid: 3500, returnDiscount: 0, totalPayment: 110000, totalDiscount: 1200, remainingDebt: 18300 },
  { id: "2", supplier: "深圳鑫宇汽车零部件", initialDebt: 0, totalPurchase: 56000, totalReturn: 800, totalReturnDue: 800, totalReturnPaid: 800, returnDiscount: 0, totalPayment: 50000, totalDiscount: 500, remainingDebt: 4700 },
  { id: "3", supplier: "佛山泰安汽配贸易", initialDebt: 0, totalPurchase: 89000, totalReturn: 2200, totalReturnDue: 2200, totalReturnPaid: 2200, returnDiscount: 200, totalPayment: 82000, totalDiscount: 800, remainingDebt: 3800 },
];

const mockDetails: DetailRecord[] = [
  { id: "1", date: "2026-05-28", orderNo: "PO20260528001", supplier: "广州达华汽配有限公司", purchaseAmt: 12000, returnAmt: 0, paymentAmt: 10000, discountAmt: 0, operator: "张三", remark: "" },
  { id: "2", date: "2026-05-27", orderNo: "PO20260527001", supplier: "深圳鑫宇汽车零部件", purchaseAmt: 8000, returnAmt: 800, paymentAmt: 7000, discountAmt: 100, operator: "李四", remark: "部分退货" },
  { id: "3", date: "2026-05-26", orderNo: "PO20260526001", supplier: "佛山泰安汽配贸易", purchaseAmt: 15000, returnAmt: 0, paymentAmt: 15000, discountAmt: 300, operator: "王五", remark: "" },
  { id: "4", date: "2026-05-25", orderNo: "PO20260525001", supplier: "广州达华汽配有限公司", purchaseAmt: 25000, returnAmt: 3500, paymentAmt: 20000, discountAmt: 500, operator: "张三", remark: "退货处理" },
];

const mockRepayments: RepaymentRecord[] = [
  { id: "1", repaymentNo: "REP20260528001", supplier: "广州达华汽配有限公司", date: "2026-05-28", amount: 10000, method: "银行转账", operator: "张三", remark: "5月第一批还款" },
  { id: "2", repaymentNo: "REP20260527001", supplier: "深圳鑫宇汽车零部件", date: "2026-05-27", amount: 7000, method: "现金", operator: "李四", remark: "" },
  { id: "3", repaymentNo: "REP20260525001", supplier: "广州达华汽配有限公司", date: "2026-05-25", amount: 20000, method: "银行转账", operator: "张三", remark: "月结付款" },
];

const supplierOptions = mockSummary.map(r => r.supplier);
const CHART_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6"];

const fmt = (n: number) => n > 0 ? `¥${n.toLocaleString()}` : "¥0";

type TabKey = "chart" | "summary" | "detail" | "repayment";

export function ProcurementPayable() {
  const [activeTab, setActiveTab] = useState<TabKey>("chart");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredSummary = mockSummary.filter(r => !searchSupplier || r.supplier === searchSupplier);
  const filteredDetails = mockDetails.filter(r => !searchSupplier || r.supplier === searchSupplier);
  const filteredRepayments = mockRepayments.filter(r => !searchSupplier || r.supplier === searchSupplier);

  const chartData = filteredSummary.map(r => ({ name: r.supplier.slice(0, 6), remainingDebt: r.remainingDebt, totalPurchase: r.totalPurchase }));

  const handleReset = () => { setSearchSupplier(""); setCurrentPage(1); };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "chart", label: "欠款图表" },
    { key: "summary", label: "财务汇总" },
    { key: "detail", label: "财务明细" },
    { key: "repayment", label: "还款记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">采购应付</h2>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setCurrentPage(1); }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">供应商：</span>
            <FauxSelect className="w-52" value={searchSupplier} onChange={e => { setSearchSupplier(e.target.value); setCurrentPage(1); }} placeholder="全部">
              <option value="">全部</option>
              {supplierOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
          <div className="ml-auto">
            <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
              <DownloadIcon sx={{ fontSize: 16 }} />导出
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {/* Chart Tab */}
        {activeTab === "chart" && (
          <div className="p-5">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-3">供应商剩余欠款对比</div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(val: number) => [`¥${val.toLocaleString()}`, "剩余欠款"]} />
                      <Bar dataKey="remainingDebt" radius={[4, 4, 0, 0]}>
                        {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-3">供应商累计进货对比</div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(val: number) => [`¥${val.toLocaleString()}`, "累计进货"]} />
                      <Bar dataKey="totalPurchase" radius={[4, 4, 0, 0]}>
                        {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === "summary" && (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-10">序号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">供应商</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">期初欠款</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">累计进货</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">累计退货</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">累计应退</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">累计已退</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">退货优惠</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">累积付款</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">累积优惠</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">剩余欠款</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                    <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-2.5 text-gray-800 font-medium">{row.supplier}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.initialDebt)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.totalPurchase)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalReturn)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalReturnDue)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalReturnPaid)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.returnDiscount)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.totalPayment)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalDiscount)}</td>
                    <td className="px-4 py-2.5 text-right"><span className={`font-semibold ${row.remainingDebt > 0 ? "text-red-600" : "text-gray-600"}`}>{fmt(row.remainingDebt)}</span></td>
                  </tr>
                ))}
                {filteredSummary.length === 0 && <tr><td colSpan={11} className="py-16 text-center text-sm text-gray-400">暂无数据</td></tr>}
              </tbody>
            </table>
          </>
        )}

        {/* Detail Tab */}
        {activeTab === "detail" && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-10">序号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">日期</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">供应商</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">进货金额</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">退货金额</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">付款金额</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">优惠金额</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">经手人</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">备注</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                  <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-2.5 text-gray-600 font-mono">{row.orderNo}</td>
                  <td className="px-4 py-2.5 text-gray-800">{row.supplier}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.purchaseAmt)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{row.returnAmt > 0 ? fmt(row.returnAmt) : "—"}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.paymentAmt)}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{row.discountAmt > 0 ? fmt(row.discountAmt) : "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.operator}</td>
                  <td className="px-4 py-2.5 text-gray-500">{row.remark || "—"}</td>
                </tr>
              ))}
              {filteredDetails.length === 0 && <tr><td colSpan={10} className="py-16 text-center text-sm text-gray-400">暂无数据</td></tr>}
            </tbody>
          </table>
        )}

        {/* Repayment Tab */}
        {activeTab === "repayment" && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-10">序号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">还款单号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">供应商</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">还款日期</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">还款金额</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">还款方式</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">经手人</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">备注</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepayments.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                  <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 text-gray-600 font-mono">{row.repaymentNo}</td>
                  <td className="px-4 py-2.5 text-gray-800 font-medium">{row.supplier}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-2.5 text-right text-blue-600 font-semibold">{fmt(row.amount)}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.method}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.operator}</td>
                  <td className="px-4 py-2.5 text-gray-500">{row.remark || "—"}</td>
                </tr>
              ))}
              {filteredRepayments.length === 0 && <tr><td colSpan={8} className="py-16 text-center text-sm text-gray-400">暂无数据</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {activeTab !== "chart" && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">
              {activeTab === "summary" ? filteredSummary.length : activeTab === "detail" ? filteredDetails.length : filteredRepayments.length}
            </span> 条
          </div>
        </div>
      )}
    </div>
  );
}

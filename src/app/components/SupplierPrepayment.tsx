import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PrepaymentRecord {
  id: string;
  supplierName: string;
  phone: string;
  totalPrepayment: number;
  usedAmount: number;
  remainingAmount: number;
  status: "可用" | "已用完";
}

interface PrepaymentDetail {
  date: string;
  type: string;
  amount: number;
  operator: string;
  remark: string;
}

const mockData: PrepaymentRecord[] = [
  { id: "1", supplierName: "广州达华汽配有限公司", phone: "13800138001", totalPrepayment: 50000, usedAmount: 32000, remainingAmount: 18000, status: "可用" },
  { id: "2", supplierName: "深圳鑫宇汽车零部件", phone: "13900139002", totalPrepayment: 20000, usedAmount: 20000, remainingAmount: 0, status: "已用完" },
  { id: "3", supplierName: "佛山泰安汽配贸易", phone: "18688886003", totalPrepayment: 30000, usedAmount: 15500, remainingAmount: 14500, status: "可用" },
];

const mockDetails: Record<string, PrepaymentDetail[]> = {
  "1": [
    { date: "2026-05-20", type: "预付款充值", amount: 30000, operator: "张三", remark: "月度预付款" },
    { date: "2026-05-22", type: "采购扣减", amount: -12000, operator: "系统", remark: "采购单PO20260522001" },
    { date: "2026-05-25", type: "预付款充值", amount: 20000, operator: "张三", remark: "" },
    { date: "2026-05-27", type: "采购扣减", amount: -20000, operator: "系统", remark: "采购单PO20260527001" },
  ],
  "2": [
    { date: "2026-04-10", type: "预付款充值", amount: 20000, operator: "李四", remark: "季度预付款" },
    { date: "2026-04-28", type: "采购扣减", amount: -20000, operator: "系统", remark: "采购单PO20260428001" },
  ],
  "3": [
    { date: "2026-05-01", type: "预付款充值", amount: 30000, operator: "张三", remark: "月度预付款" },
    { date: "2026-05-15", type: "采购扣减", amount: -10000, operator: "系统", remark: "采购单PO20260515001" },
    { date: "2026-05-20", type: "采购扣减", amount: -5500, operator: "系统", remark: "采购单PO20260520002" },
  ],
};

function DetailDialog({ record, onClose }: { record: PrepaymentRecord; onClose: () => void }) {
  const details = mockDetails[record.id] ?? [];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">预付款明细 — {record.supplierName}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-4 bg-gray-50 grid grid-cols-3 gap-4 shrink-0 border-b border-gray-200">
          {[
            ["预付款余额", `¥${record.totalPrepayment.toLocaleString()}`],
            ["已用金额", `¥${record.usedAmount.toLocaleString()}`],
            ["剩余金额", `¥${record.remainingAmount.toLocaleString()}`],
          ].map(([label, value]) => (
            <div key={label} className="text-center">
              <div className="text-xs text-gray-500">{label}</div>
              <div className="text-base font-semibold text-gray-800 mt-0.5">{value}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">日期</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">类型</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">金额</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">操作人</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {details.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-600">{d.date}</td>
                  <td className="px-4 py-2.5 text-gray-800">{d.type}</td>
                  <td className={`px-4 py-2.5 font-medium ${d.amount > 0 ? "text-blue-600" : "text-red-600"}`}>{d.amount > 0 ? `+¥${d.amount.toLocaleString()}` : `-¥${Math.abs(d.amount).toLocaleString()}`}</td>
                  <td className="px-4 py-2.5 text-gray-600">{d.operator}</td>
                  <td className="px-4 py-2.5 text-gray-500">{d.remark || "—"}</td>
                </tr>
              ))}
              {details.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">暂无明细</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
        </div>
      </div>
    </div>
  );
}

export function SupplierPrepayment() {
  const [data] = useState<PrepaymentRecord[]>(mockData);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<PrepaymentRecord | null>(null);
  const pageSize = 20;

  const filtered = data.filter(r =>
    (!searchName || r.supplierName.includes(searchName) || r.phone.includes(searchName)) &&
    (!searchStatus || r.status === searchStatus)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchName(""); setSearchStatus(""); setCurrentPage(1); };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">供应商预付款</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">供应商：</span>
            <input
              type="text"
              placeholder="姓名/电话"
              value={searchName}
              onChange={e => { setSearchName(e.target.value); setCurrentPage(1); }}
              className="w-40 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">状态：</span>
            <FauxSelect className="w-28" value={searchStatus} onChange={e => { setSearchStatus(e.target.value); setCurrentPage(1); }} placeholder="请选择">
              <option value="">全部</option>
              <option value="可用">可用</option>
              <option value="已用完">已用完</option>
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
        <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
          <DownloadIcon sx={{ fontSize: 16 }} />导出
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">供应商名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">电话</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">预付款余额</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">已用金额</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">剩余金额</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-800 font-medium">{row.supplierName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.phone}</td>
                <td className="px-4 py-2.5 text-sm text-gray-800 text-right">¥{row.totalPrepayment.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 text-right">¥{row.usedAmount.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-right">{row.remainingAmount > 0 ? <span className="text-blue-600">¥{row.remainingAmount.toLocaleString()}</span> : <span className="text-gray-400">¥0</span>}</td>
                <td className="px-4 py-2.5">
                  {row.status === "可用"
                    ? <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">可用</span>
                    : <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200">已用完</span>}
                </td>
                <td className="px-4 py-2.5">
                  <button onClick={() => setViewRecord(row)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                    <ViewIcon sx={{ fontSize: 13 }} />查看
                  </button>
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

      {viewRecord && <DetailDialog record={viewRecord} onClose={() => setViewRecord(null)} />}
    </div>
  );
}

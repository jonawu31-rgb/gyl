import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface ProcurementStatRow {
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

const mockData: ProcurementStatRow[] = [
  {
    id: "1", supplier: "广州达华汽配有限公司",
    initialDebt: 5000, totalPurchase: 128000, totalReturn: 3500, totalReturnDue: 3500, totalReturnPaid: 3500,
    returnDiscount: 0, totalPayment: 110000, totalDiscount: 1200, remainingDebt: 18300,
  },
  {
    id: "2", supplier: "深圳鑫宇汽车零部件",
    initialDebt: 0, totalPurchase: 56000, totalReturn: 800, totalReturnDue: 800, totalReturnPaid: 800,
    returnDiscount: 0, totalPayment: 50000, totalDiscount: 500, remainingDebt: 4700,
  },
  {
    id: "3", supplier: "佛山泰安汽配贸易",
    initialDebt: 0, totalPurchase: 89000, totalReturn: 2200, totalReturnDue: 2200, totalReturnPaid: 2200,
    returnDiscount: 200, totalPayment: 82000, totalDiscount: 800, remainingDebt: 3800,
  },
];

const supplierOptions = mockData.map(r => r.supplier);

const fmt = (n: number) => n > 0 ? `¥${n.toLocaleString()}` : n === 0 ? "¥0" : `-¥${Math.abs(n).toLocaleString()}`;

export function ProcurementStats() {
  const [data] = useState<ProcurementStatRow[]>(mockData);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = data.filter(r => !searchSupplier || r.supplier === searchSupplier);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchSupplier(""); setCurrentPage(1); };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">采购统计</h2>
      </div>

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
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-10">序号</th>
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
            {paged.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-gray-800 font-medium">{row.supplier}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.initialDebt)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.totalPurchase)}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalReturn)}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalReturnDue)}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalReturnPaid)}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.returnDiscount)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{fmt(row.totalPayment)}</td>
                <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.totalDiscount)}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`font-semibold ${row.remainingDebt > 0 ? "text-red-600" : "text-gray-600"}`}>{fmt(row.remainingDebt)}</span>
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
    </div>
  );
}

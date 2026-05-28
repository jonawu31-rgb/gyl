import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface SalaryRecord {
  id: string;
  salaryMonth: string;
  employeeName: string;
  baseSalary: number;
  totalCommission: number;
  totalSalary: number;
}

const mockData: SalaryRecord[] = [
  { id: "1",  salaryMonth: "2026-05", employeeName: "黄伟霆", baseSalary: 8000.00, totalCommission: 3250.00, totalSalary: 11250.00 },
  { id: "2",  salaryMonth: "2026-05", employeeName: "张三",   baseSalary: 5000.00, totalCommission: 2100.00, totalSalary: 7100.00 },
  { id: "3",  salaryMonth: "2026-05", employeeName: "李四",   baseSalary: 5000.00, totalCommission: 1850.00, totalSalary: 6850.00 },
  { id: "4",  salaryMonth: "2026-05", employeeName: "王五",   baseSalary: 4500.00, totalCommission: 960.00,  totalSalary: 5460.00 },
  { id: "5",  salaryMonth: "2026-05", employeeName: "赵六",   baseSalary: 4500.00, totalCommission: 720.00,  totalSalary: 5220.00 },
  { id: "6",  salaryMonth: "2026-05", employeeName: "孙七",   baseSalary: 4000.00, totalCommission: 480.00,  totalSalary: 4480.00 },
  { id: "7",  salaryMonth: "2026-04", employeeName: "黄伟霆", baseSalary: 8000.00, totalCommission: 3100.00, totalSalary: 11100.00 },
  { id: "8",  salaryMonth: "2026-04", employeeName: "张三",   baseSalary: 5000.00, totalCommission: 1950.00, totalSalary: 6950.00 },
  { id: "9",  salaryMonth: "2026-04", employeeName: "李四",   baseSalary: 5000.00, totalCommission: 1700.00, totalSalary: 6700.00 },
  { id: "10", salaryMonth: "2026-04", employeeName: "王五",   baseSalary: 4500.00, totalCommission: 880.00,  totalSalary: 5380.00 },
  { id: "11", salaryMonth: "2026-03", employeeName: "黄伟霆", baseSalary: 8000.00, totalCommission: 2800.00, totalSalary: 10800.00 },
  { id: "12", salaryMonth: "2026-03", employeeName: "张三",   baseSalary: 5000.00, totalCommission: 1600.00, totalSalary: 6600.00 },
];

const employees = ["黄伟霆", "张三", "李四", "王五", "赵六", "孙七"];

export function SalaryReport() {
  const [month, setMonth] = useState("2026-05");
  const [employee, setEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = mockData.filter(r =>
    (!month || r.salaryMonth === month) &&
    (!employee || r.employeeName === employee)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalBase = filtered.reduce((s, r) => s + r.baseSalary, 0);
  const totalCommission = filtered.reduce((s, r) => s + r.totalCommission, 0);
  const totalSalary = filtered.reduce((s, r) => s + r.totalSalary, 0);

  const handleReset = () => {
    setMonth("2026-05");
    setEmployee("");
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">工资报表</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">月份：</span>
            <input type="month" value={month} onChange={(e) => { setMonth(e.target.value); setCurrentPage(1); }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">员工：</span>
            <FauxSelect className="flex-1" value={employee} onChange={(e) => { setEmployee(e.target.value); setCurrentPage(1); }} placeholder="请选择">
              <option value="">全部</option>
              {employees.map(e => <option key={e} value={e}>{e}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />查询
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
          <ExportIcon sx={{ fontSize: 16 }} />导出Excel
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">工资月份</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">员工姓名</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">基础工资</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">总提成</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">总工资</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.salaryMonth}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.employeeName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{item.baseSalary.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{item.totalCommission.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-800 text-right">¥{item.totalSalary.toFixed(2)}</td>
              </tr>
            ))}
            {filtered.length > 0 && (
              <tr className="bg-blue-50/50 border-t border-blue-100">
                <td colSpan={3} className="px-4 py-2.5 text-sm font-semibold text-gray-700">合计</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-800 text-right">¥{totalBase.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-800 text-right">¥{totalCommission.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm font-bold text-blue-700 text-right">¥{totalSalary.toFixed(2)}</td>
              </tr>
            )}
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

import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface TurnoverItem {
  id: string;
  name: string;
  drawingNo: string;
  revenue: number;
  openingCost: number;
  closingCost: number;
  avgCost: number;
  turnoverRate: number;
  turnoverDays: number;
}

const mockMonthlyData: TurnoverItem[] = [
  { id: "1", name: "整体", drawingNo: "-", revenue: 186400, openingCost: 320000, closingCost: 298000, avgCost: 309000, turnoverRate: 0.60, turnoverDays: 51 },
  { id: "2", name: "博世机油滤清器", drawingNo: "OX-143D", revenue: 54400, openingCost: 42000, closingCost: 38500, avgCost: 40250, turnoverRate: 1.35, turnoverDays: 23 },
  { id: "3", name: "NGK火花塞", drawingNo: "BKR6E-11", revenue: 43200, openingCost: 28000, closingCost: 25600, avgCost: 26800, turnoverRate: 1.61, turnoverDays: 19 },
  { id: "4", name: "刹车片（前片）", drawingNo: "BP-7612", revenue: 39900, openingCost: 55000, closingCost: 51200, avgCost: 53100, turnoverRate: 0.75, turnoverDays: 41 },
  { id: "5", name: "空气滤清器", drawingNo: "AF-3056", revenue: 30800, openingCost: 22000, closingCost: 20100, avgCost: 21050, turnoverRate: 1.46, turnoverDays: 21 },
  { id: "6", name: "壳牌机油5W-40", drawingNo: "-", revenue: 28520, openingCost: 18500, closingCost: 16200, avgCost: 17350, turnoverRate: 1.64, turnoverDays: 19 },
  { id: "7", name: "减震器（前）", drawingNo: "SA-7238", revenue: 24440, openingCost: 68000, closingCost: 65300, avgCost: 66650, turnoverRate: 0.37, turnoverDays: 84 },
  { id: "8", name: "正时皮带", drawingNo: "TB-0892", revenue: 16800, openingCost: 35000, closingCost: 33800, avgCost: 34400, turnoverRate: 0.49, turnoverDays: 63 },
];

const mockCategoryData: TurnoverItem[] = [
  { id: "1", name: "整体", drawingNo: "-", revenue: 186400, openingCost: 320000, closingCost: 298000, avgCost: 309000, turnoverRate: 0.60, turnoverDays: 51 },
  { id: "2", name: "耗材类", drawingNo: "-", revenue: 112000, openingCost: 95000, closingCost: 88000, avgCost: 91500, turnoverRate: 1.22, turnoverDays: 25 },
  { id: "3", name: "制动系统", drawingNo: "-", revenue: 42600, openingCost: 78000, closingCost: 74200, avgCost: 76100, turnoverRate: 0.56, turnoverDays: 55 },
  { id: "4", name: "发动机配件", drawingNo: "-", revenue: 18400, openingCost: 52000, closingCost: 49800, avgCost: 50900, turnoverRate: 0.36, turnoverDays: 86 },
  { id: "5", name: "悬挂系统", drawingNo: "-", revenue: 13400, openingCost: 95000, closingCost: 86000, avgCost: 90500, turnoverRate: 0.15, turnoverDays: 208 },
];

function formatAmount(val: number) {
  return "¥" + val.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InventoryTurnover() {
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [supplier, setSupplier] = useState("");
  const [periodType, setPeriodType] = useState("monthly");
  const [period, setPeriod] = useState("2026-05");
  const [dimension, setDimension] = useState("overall");
  const [brand, setBrand] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const data = dimension === "category" ? mockCategoryData : mockMonthlyData;
  const totalPages = Math.ceil(data.length / pageSize);
  const paged = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setKeyword("");
    setCategoryFilter("");
    setWarehouse("");
    setSupplier("");
    setPeriodType("monthly");
    setPeriod("2026-05");
    setDimension("overall");
    setBrand("");
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">库存周转率</h2>
      </div>

      {/* Filters */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">配件：</span>
            <input
              type="text"
              placeholder="请输入配件名称/编码"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">品类：</span>
            <FauxSelect
              className="flex-1"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="请选择品类"
            >
              <option value="">全部品类</option>
              <option value="耗材类">耗材类</option>
              <option value="制动系统">制动系统</option>
              <option value="发动机配件">发动机配件</option>
              <option value="悬挂系统">悬挂系统</option>
              <option value="电气系统">电气系统</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">仓库：</span>
            <FauxSelect
              className="flex-1"
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              placeholder="请选择仓库"
            >
              <option value="">全部仓库</option>
              <option value="main">主仓库</option>
              <option value="jiaxing">嘉兴仓</option>
              <option value="hangzhou">杭州仓</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">供应商：</span>
            <FauxSelect
              className="flex-1"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="请选择供应商"
            >
              <option value="">全部供应商</option>
              <option value="bosch">博世供应商</option>
              <option value="ngk">NGK供应商</option>
              <option value="shell">壳牌供应商</option>
              <option value="mann">曼牌供应商</option>
            </FauxSelect>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">周期类型：</span>
            <FauxSelect
              className="flex-1"
              value={periodType}
              onChange={(e) => { setPeriodType(e.target.value); }}
            >
              <option value="monthly">月度</option>
              <option value="quarterly">季度</option>
              <option value="yearly">年度</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">周期：</span>
            {periodType === "monthly" ? (
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            ) : periodType === "quarterly" ? (
              <FauxSelect className="flex-1" value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="2026-Q1">2026年 第一季度</option>
                <option value="2026-Q2">2026年 第二季度</option>
                <option value="2025-Q4">2025年 第四季度</option>
              </FauxSelect>
            ) : (
              <FauxSelect className="flex-1" value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="2026">2026年</option>
                <option value="2025">2025年</option>
                <option value="2024">2024年</option>
              </FauxSelect>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">统计维度：</span>
            <FauxSelect
              className="flex-1"
              value={dimension}
              onChange={(e) => { setDimension(e.target.value); setCurrentPage(1); }}
            >
              <option value="overall">整体</option>
              <option value="category">品类</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">品牌：</span>
            <FauxSelect
              className="flex-1"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="请选择品牌"
            >
              <option value="">全部品牌</option>
              <option value="博世">博世</option>
              <option value="NGK">NGK</option>
              <option value="壳牌">壳牌</option>
              <option value="曼牌">曼牌</option>
            </FauxSelect>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <SearchIcon sx={{ fontSize: 16 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5"
          >
            <RefreshIcon sx={{ fontSize: 16 }} />
            重置
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ExportIcon sx={{ fontSize: 16 }} />
            导出
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-14">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">图号</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">销售额</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">期初库存成本</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">期末库存成本</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">平均库存成本</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">周转率</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">周转天数</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${idx === 0 ? "bg-blue-50/30 font-semibold" : ""}`}>
                <td className="px-4 py-3 text-sm text-gray-500">{idx === 0 ? "-" : (currentPage - 1) * pageSize + idx}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.drawingNo}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right">{formatAmount(item.revenue)}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatAmount(item.openingCost)}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatAmount(item.closingCost)}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatAmount(item.avgCost)}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`font-semibold ${item.turnoverRate >= 1 ? "text-blue-600" : item.turnoverRate >= 0.5 ? "text-gray-700" : "text-red-500"}`}>
                    {item.turnoverRate.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.turnoverDays} 天</td>
              </tr>
            ))}
          </tbody>
        </table>
        {paged.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{data.length}</span> 条
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

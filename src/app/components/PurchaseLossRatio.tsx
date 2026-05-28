import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

interface CategoryLossItem {
  id: string;
  customerName: string;
  phone: string;
  totalCategories: number;
  period1Categories: number;
  period2Categories: number;
  lostCategories: number;
  lostCategoryNames: string;
  categoryRatio: number;
  lossRate: number;
  period1Amount: number;
  period2Amount: number;
}

interface ProductLossItem {
  id: string;
  customerName: string;
  phone: string;
  period1Products: number;
  period2Products: number;
  lostProducts: number;
  lostProductNames: string;
  lossRate: number;
  period1Amount: number;
  period2Amount: number;
}

const mockCategoryData: CategoryLossItem[] = [
  {
    id: "1", customerName: "嘉兴新龙汽修", phone: "13812345678", totalCategories: 12,
    period1Categories: 8, period2Categories: 5, lostCategories: 3,
    lostCategoryNames: "制动系统、电气系统、进气系统", categoryRatio: 62.5, lossRate: 37.5,
    period1Amount: 28600, period2Amount: 18400,
  },
  {
    id: "2", customerName: "龙华汽配城", phone: "13698765432", totalCategories: 20,
    period1Categories: 15, period2Categories: 12, lostCategories: 3,
    lostCategoryNames: "冷却系统、悬挂系统、传动系统", categoryRatio: 80.0, lossRate: 20.0,
    period1Amount: 52300, period2Amount: 47100,
  },
  {
    id: "3", customerName: "博远汽车服务", phone: "15912348765", totalCategories: 8,
    period1Categories: 6, period2Categories: 3, lostCategories: 3,
    lostCategoryNames: "发动机、变速箱、排放系统", categoryRatio: 50.0, lossRate: 50.0,
    period1Amount: 34800, period2Amount: 16200,
  },
  {
    id: "4", customerName: "华鑫汽修中心", phone: "17823456789", totalCategories: 15,
    period1Categories: 12, period2Categories: 11, lostCategories: 1,
    lostCategoryNames: "空调系统", categoryRatio: 91.7, lossRate: 8.3,
    period1Amount: 41200, period2Amount: 38900,
  },
  {
    id: "5", customerName: "联众汽配商行", phone: "13556789012", totalCategories: 18,
    period1Categories: 10, period2Categories: 8, lostCategories: 2,
    lostCategoryNames: "车灯配件、外装件", categoryRatio: 80.0, lossRate: 20.0,
    period1Amount: 22600, period2Amount: 19300,
  },
];

const mockProductData: ProductLossItem[] = [
  {
    id: "1", customerName: "嘉兴新龙汽修", phone: "13812345678",
    period1Products: 28, period2Products: 18, lostProducts: 10,
    lostProductNames: "刹车盘、气门嘴、雨刮器喷水泵、节温器、凸轮轴传感器...",
    lossRate: 35.7, period1Amount: 28600, period2Amount: 18400,
  },
  {
    id: "2", customerName: "龙华汽配城", phone: "13698765432",
    period1Products: 65, period2Products: 54, lostProducts: 11,
    lostProductNames: "水温传感器、转向助力泵、空调压缩机、散热器...",
    lossRate: 16.9, period1Amount: 52300, period2Amount: 47100,
  },
  {
    id: "3", customerName: "博远汽车服务", phone: "15912348765",
    period1Products: 22, period2Products: 10, lostProducts: 12,
    lostProductNames: "正时链条、活塞环、曲轴油封、气门弹簧、凸轮轴...",
    lossRate: 54.5, period1Amount: 34800, period2Amount: 16200,
  },
  {
    id: "4", customerName: "华鑫汽修中心", phone: "17823456789",
    period1Products: 45, period2Products: 42, lostProducts: 3,
    lostProductNames: "空调冷凝器、干燥罐、膨胀阀",
    lossRate: 6.7, period1Amount: 41200, period2Amount: 38900,
  },
  {
    id: "5", customerName: "联众汽配商行", phone: "13556789012",
    period1Products: 38, period2Products: 30, lostProducts: 8,
    lostProductNames: "前大灯总成、倒车灯、转向灯灯泡、保险杠...",
    lossRate: 21.1, period1Amount: 22600, period2Amount: 19300,
  },
];

function formatAmount(val: number) {
  return "¥" + val.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PurchaseLossRatio() {
  const [activeTab, setActiveTab] = useState<"category" | "product">("category");
  const [customerKeyword, setCustomerKeyword] = useState("");
  const [period1Start, setPeriod1Start] = useState("2026-04-01");
  const [period1End, setPeriod1End] = useState("2026-04-30");
  const [period2Start, setPeriod2Start] = useState("2026-05-01");
  const [period2End, setPeriod2End] = useState("2026-05-28");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const categoryFiltered = mockCategoryData.filter(r =>
    !customerKeyword || r.customerName.includes(customerKeyword) || r.phone.includes(customerKeyword)
  );
  const productFiltered = mockProductData.filter(r =>
    !customerKeyword || r.customerName.includes(customerKeyword) || r.phone.includes(customerKeyword)
  );

  const currentData = activeTab === "category" ? categoryFiltered : productFiltered;
  const totalPages = Math.ceil(currentData.length / pageSize);

  const handleReset = () => {
    setCustomerKeyword("");
    setPeriod1Start("2026-04-01");
    setPeriod1End("2026-04-30");
    setPeriod2Start("2026-05-01");
    setPeriod2End("2026-05-28");
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">采购流失比（客户采购流失分析）</h2>
      </div>

      {/* Filters */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">客户查询：</span>
            <input
              type="text"
              placeholder="输入客户名称或电话"
              value={customerKeyword}
              onChange={(e) => setCustomerKeyword(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">时间段1：</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="date"
                value={period1Start}
                onChange={(e) => setPeriod1Start(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-gray-400 text-xs shrink-0">至</span>
              <input
                type="date"
                value={period1End}
                onChange={(e) => setPeriod1End(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">时间段2：</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="date"
                value={period2Start}
                onChange={(e) => setPeriod2Start(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-gray-400 text-xs shrink-0">至</span>
              <input
                type="date"
                value={period2End}
                onChange={(e) => setPeriod2End(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex gap-1">
          {(["category", "product"] as const).map((tab) => {
            const label = tab === "category" ? "品类流失分析" : "单品流失分析";
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-5 py-2.5 text-sm font-medium transition-all relative ${active ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}`}
              >
                {label}
                {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        {activeTab === "category" ? (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户电话</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">系统总品类数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段1品类数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段2品类数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">流失品类数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 min-w-[180px]">流失品类</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">品类数比</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">流失率</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段1金额</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段2金额</th>
              </tr>
            </thead>
            <tbody>
              {categoryFiltered.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.totalCategories}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.period1Categories}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.period2Categories}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-semibold ${item.lostCategories > 0 ? "text-red-500" : "text-gray-700"}`}>
                      {item.lostCategories}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px]">
                    <div className="line-clamp-2">{item.lostCategoryNames}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.categoryRatio.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${item.lossRate >= 40 ? "text-red-500" : item.lossRate >= 20 ? "text-yellow-600" : "text-gray-700"}`}>
                      {item.lossRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatAmount(item.period1Amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatAmount(item.period2Amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户电话</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段1商品数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段2商品数</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">流失商品数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 min-w-[200px]">流失商品</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">流失率</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段1金额</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">时间段2金额</th>
              </tr>
            </thead>
            <tbody>
              {productFiltered.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.period1Products}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{item.period2Products}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-semibold ${item.lostProducts > 0 ? "text-red-500" : "text-gray-700"}`}>
                      {item.lostProducts}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[220px]">
                    <div className="line-clamp-2">{item.lostProductNames}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${item.lossRate >= 40 ? "text-red-500" : item.lossRate >= 20 ? "text-yellow-600" : "text-gray-700"}`}>
                      {item.lossRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatAmount(item.period1Amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatAmount(item.period2Amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {currentData.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{currentData.length}</span> 条
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
              onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))}
              disabled={currentPage >= (totalPages || 1)}
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

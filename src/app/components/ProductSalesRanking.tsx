import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
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

interface ProductRankItem {
  rank: number;
  name: string;
  code: string;
  sales: number;
  revenue: number;
  profit: number;
  profitRate: number;
  orderCount: number;
  customerCount: number;
}

interface CategoryRankItem {
  rank: number;
  name: string;
  sales: number;
  revenue: number;
  profit: number;
  profitRate: number;
  orderCount: number;
  customerCount: number;
}

const mockProductData: ProductRankItem[] = [
  { rank: 1, name: "博世机油滤清器", code: "SP000012", sales: 680, revenue: 54400, profit: 19040, profitRate: 35.0, orderCount: 312, customerCount: 185 },
  { rank: 2, name: "NGK火花塞", code: "SP000034", sales: 540, revenue: 43200, profit: 16416, profitRate: 38.0, orderCount: 278, customerCount: 162 },
  { rank: 3, name: "刹车片（前片）", code: "SP000056", sales: 420, revenue: 39900, profit: 15561, profitRate: 39.0, orderCount: 215, customerCount: 143 },
  { rank: 4, name: "空气滤清器", code: "SP000078", sales: 385, revenue: 30800, profit: 10780, profitRate: 35.0, orderCount: 194, customerCount: 126 },
  { rank: 5, name: "壳牌机油5W-40", code: "SP000023", sales: 310, revenue: 28520, profit: 9122, profitRate: 32.0, orderCount: 173, customerCount: 118 },
  { rank: 6, name: "减震器（前）", code: "SP000045", sales: 188, revenue: 24440, profit: 8798, profitRate: 36.0, orderCount: 145, customerCount: 98 },
  { rank: 7, name: "燃油泵总成", code: "SP000067", sales: 76, revenue: 22800, profit: 7980, profitRate: 35.0, orderCount: 68, customerCount: 54 },
  { rank: 8, name: "雨刮器（前）", code: "SP000089", sales: 290, revenue: 20300, profit: 6899, profitRate: 34.0, orderCount: 187, customerCount: 133 },
  { rank: 9, name: "冷却液", code: "SP000101", sales: 245, revenue: 18375, profit: 6431, profitRate: 35.0, orderCount: 156, customerCount: 112 },
  { rank: 10, name: "正时皮带", code: "SP000123", sales: 112, revenue: 16800, profit: 5880, profitRate: 35.0, orderCount: 97, customerCount: 78 },
];

const mockCategoryData: CategoryRankItem[] = [
  { rank: 1, name: "耗材类", sales: 2150, revenue: 158200, profit: 55370, profitRate: 35.0, orderCount: 1250, customerCount: 620 },
  { rank: 2, name: "制动系统", sales: 980, revenue: 98000, profit: 36260, profitRate: 37.0, orderCount: 680, customerCount: 390 },
  { rank: 3, name: "发动机配件", sales: 540, revenue: 72900, profit: 25515, profitRate: 35.0, orderCount: 425, customerCount: 265 },
  { rank: 4, name: "电气系统", sales: 760, revenue: 53200, profit: 18620, profitRate: 35.0, orderCount: 520, customerCount: 298 },
  { rank: 5, name: "悬挂系统", sales: 312, revenue: 40560, profit: 14196, profitRate: 35.0, orderCount: 278, customerCount: 180 },
];

const MEDALS = ["🥇", "🥈", "🥉"];

const BAR_COLORS = [
  "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE",
  "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE",
];

function formatAmount(val: number) {
  return "¥" + val.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ProductSalesRanking() {
  const [dimension, setDimension] = useState<"product" | "category">("product");
  const [sortField, setSortField] = useState("revenue");
  const [displayCount, setDisplayCount] = useState(10);
  const [startDate, setStartDate] = useState("2026-04-29");
  const [endDate, setEndDate] = useState("2026-05-28");
  const [supplier, setSupplier] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const productData = mockProductData.slice(0, displayCount);
  const categoryData = mockCategoryData.slice(0, displayCount);

  const chartData = (dimension === "product" ? productData : categoryData).map((item) => ({
    name: item.name.length > 8 ? item.name.slice(0, 8) + "…" : item.name,
    value: sortField === "revenue" ? item.revenue : sortField === "sales" ? item.sales : item.profit,
  })).reverse();

  const sortLabel = sortField === "revenue" ? "销售额（元）" : sortField === "sales" ? "销量" : "毛利润（元）";

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">商品销售排行</h2>
      </div>

      {/* Filters */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">时间范围：</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-gray-400 text-xs shrink-0">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
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
              <option value="电气系统">电气系统</option>
              <option value="悬挂系统">悬挂系统</option>
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
              <option value="博世">博世供应商</option>
              <option value="曼牌">曼牌供应商</option>
              <option value="NGK">NGK供应商</option>
              <option value="壳牌">壳牌供应商</option>
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
              <option value="曼牌">曼牌</option>
              <option value="NGK">NGK</option>
              <option value="壳牌">壳牌</option>
              <option value="德尔福">德尔福</option>
            </FauxSelect>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">统计维度：</span>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden h-[32px] flex-1">
              <button
                onClick={() => setDimension("product")}
                className={`flex-1 text-xs font-medium transition-colors ${dimension === "product" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                商品
              </button>
              <button
                onClick={() => setDimension("category")}
                className={`flex-1 text-xs font-medium transition-colors border-l border-gray-300 ${dimension === "category" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                品类
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">排序字段：</span>
            <FauxSelect
              className="flex-1"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="revenue">销售额</option>
              <option value="sales">销量</option>
              <option value="profit">毛利润</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">显示数量：</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-[34px] flex-1">
              <button
                onClick={() => setDisplayCount(Math.max(5, displayCount - 5))}
                className="px-2.5 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium h-full"
              >-</button>
              <span className="flex-1 text-center text-sm text-gray-800">{displayCount}</span>
              <button
                onClick={() => setDisplayCount(Math.min(50, displayCount + 5))}
                className="px-2.5 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium h-full"
              >+</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />
              搜索
            </button>
            <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* Chart + Table */}
      <div className="flex-1 overflow-auto min-h-0">
        {/* Bar Chart */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {dimension === "product" ? "商品" : "品类"}销售排行榜 TOP {Math.min(displayCount, dimension === "product" ? productData.length : categoryData.length)}
            </span>
          </div>
          <div style={{ height: Math.min(displayCount, dimension === "product" ? productData.length : categoryData.length) * 30 + 36 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  tickFormatter={(v) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : String(v)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={84}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [sortField === "sales" ? `${value}件` : `¥${value.toLocaleString()}`, sortLabel]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="px-4 pb-4">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">排名</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {dimension === "product" ? "商品名称" : "品类名称"}
                  </th>
                  {dimension === "product" && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">商品编码</th>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">销量</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">销售额</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利润</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">毛利率</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">订单数</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">客户数</th>
                </tr>
              </thead>
              <tbody>
                {(dimension === "product" ? productData : categoryData).map((item) => (
                  <tr key={item.rank} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-sm">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        item.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                        item.rank === 2 ? "bg-gray-200 text-gray-600" :
                        item.rank === 3 ? "bg-orange-100 text-orange-700" :
                        "text-gray-500"
                      }`}>
                        {item.rank <= 3 ? MEDALS[item.rank - 1] : item.rank}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.name}</td>
                    {dimension === "product" && (
                      <td className="px-4 py-2.5 text-sm text-gray-500">{(item as ProductRankItem).code}</td>
                    )}
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{item.sales}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-800 text-right font-medium">{formatAmount(item.revenue)}</td>
                    <td className="px-4 py-2.5 text-sm text-blue-600 text-right">{formatAmount(item.profit)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{item.profitRate.toFixed(2)}%</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{item.orderCount}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{item.customerCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(dimension === "product" ? productData : categoryData).length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">暂无数据</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

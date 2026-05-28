import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Tab 1: 新客成交比 ────────────────────────────────────────────────────────

interface NewCustomerStat {
  newCount: number;
  dealCount: number;
}

const DONUT_COLORS = ["#3B82F6", "#F97316"];

function NewCustomerRatioTab() {
  const [startDate, setStartDate] = useState("2026-04-27");
  const [endDate, setEndDate] = useState("2026-05-26");
  const [salesperson, setSalesperson] = useState("");
  const [stat, setStat] = useState<NewCustomerStat>({ newCount: 1, dealCount: 0 });

  const handleQuery = () => {
    // mock refresh
    setStat({ newCount: 1, dealCount: 0 });
  };

  const ratio = stat.newCount > 0 ? Math.round((stat.dealCount / stat.newCount) * 100) : 0;
  const pieData = [
    { name: "有成交", value: stat.dealCount === 0 && stat.newCount === 0 ? 0 : stat.dealCount },
    { name: "未成交", value: stat.newCount - stat.dealCount },
  ];
  // avoid empty chart when both 0
  const chartData =
    pieData[0].value === 0 && pieData[1].value === 0
      ? [{ name: "未成交", value: 1 }]
      : pieData;

  return (
    <div className="p-5">
      {/* Filter row */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-700 shrink-0">创建时间</span>
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
          />
          <span className="text-sm text-gray-500">至</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
          />
        </div>
        <span className="text-sm text-gray-700 shrink-0 ml-2">业务员</span>
        <FauxSelect
          value={salesperson}
          onChange={(e) => setSalesperson(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm min-w-[120px]"
        >
          <option value="">全部</option>
          <option value="张明">张明</option>
          <option value="李红">李红</option>
          <option value="王强">王强</option>
          <option value="陈静">陈静</option>
          <option value="刘洋">刘洋</option>
        </FauxSelect>
        <button
          onClick={handleQuery}
          className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
        >
          <SearchIcon sx={{ fontSize: 16 }} />
          查询
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-700">
        <span>
          新建客户{" "}
          <span className="font-semibold text-blue-600">{stat.newCount}</span>
        </span>
        <span>
          有成交{" "}
          <span className="font-semibold text-blue-600">{stat.dealCount}</span>
        </span>
        <span>
          占比{" "}
          <span className="font-semibold text-blue-600">{ratio}%</span>
        </span>
      </div>

      {/* Donut chart */}
      <div style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={100}
              outerRadius={160}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}\n${(percent * 100).toFixed(0)}%`
              }
              labelLine={true}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
            />
            <Legend
              iconType="square"
              iconSize={12}
              formatter={(value) => (
                <span className="text-sm text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Tab 2: 近期采购客户 ──────────────────────────────────────────────────────

interface RecentCustomer {
  id: number;
  name: string;
  phone: string;
  noConsumeDays: number;
  totalCount: number;
  totalAmount: number;
  totalDebt: number;
  lastConsumeTime: string;
}

const mockRecentCustomers: RecentCustomer[] = [
  {
    id: 1,
    name: "昆明创安汽修",
    phone: "13888818596",
    noConsumeDays: 7,
    totalCount: 1,
    totalAmount: 0.0,
    totalDebt: 0.0,
    lastConsumeTime: "2026-05-19 15:48:31",
  },
  {
    id: 2,
    name: "广州恒达汽配行",
    phone: "02088123456",
    noConsumeDays: 3,
    totalCount: 48,
    totalAmount: 368500.0,
    totalDebt: 1200.0,
    lastConsumeTime: "2026-05-23 09:32:00",
  },
  {
    id: 3,
    name: "深圳鑫源汽配店",
    phone: "07556654321",
    noConsumeDays: 5,
    totalCount: 32,
    totalAmount: 98400.0,
    totalDebt: 0.0,
    lastConsumeTime: "2026-05-21 08:15:00",
  },
  {
    id: 4,
    name: "东莞汇美汽配城",
    phone: "07692233445",
    noConsumeDays: 1,
    totalCount: 65,
    totalAmount: 892000.0,
    totalDebt: 5800.0,
    lastConsumeTime: "2026-05-25 16:48:00",
  },
  {
    id: 5,
    name: "佛山通达汽车配件",
    phone: "07575567890",
    noConsumeDays: 12,
    totalCount: 18,
    totalAmount: 32600.0,
    totalDebt: 0.0,
    lastConsumeTime: "2026-05-14 14:22:00",
  },
  {
    id: 6,
    name: "中山荣兴汽配商行",
    phone: "07603344556",
    noConsumeDays: 8,
    totalCount: 29,
    totalAmount: 185000.0,
    totalDebt: 2400.0,
    lastConsumeTime: "2026-05-18 11:05:00",
  },
];

function RecentPurchaseTab() {
  const [days, setDays] = useState(30);
  const [keyword, setKeyword] = useState("");
  const [filtered, setFiltered] = useState<RecentCustomer[]>(
    mockRecentCustomers.filter((c) => c.noConsumeDays <= 30)
  );

  const handleSearch = () => {
    const result = mockRecentCustomers.filter((c) => {
      const matchDays = c.noConsumeDays <= days;
      const kw = keyword.toLowerCase();
      const matchKw =
        !kw ||
        c.name.toLowerCase().includes(kw) ||
        c.phone.includes(kw);
      return matchDays && matchKw;
    });
    setFiltered(result);
  };

  const handleReset = () => {
    setDays(30);
    setKeyword("");
    setFiltered(mockRecentCustomers.filter((c) => c.noConsumeDays <= 30));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter row */}
      <div className="px-5 py-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 shrink-0">几天内有采购</span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              type="number"
              value={days}
              min={1}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-24 px-3 py-1.5 text-sm focus:outline-none text-center"
            />
            <div className="flex flex-col border-l border-gray-200">
              <button
                onClick={() => setDays((d) => d + 1)}
                className="px-1.5 py-0.5 hover:bg-gray-50 text-gray-500 leading-none text-xs"
              >
                ▲
              </button>
              <button
                onClick={() => setDays((d) => Math.max(1, d - 1))}
                className="px-1.5 py-0.5 hover:bg-gray-50 text-gray-500 leading-none text-xs border-t border-gray-200"
              >
                ▼
              </button>
            </div>
          </div>

          <span className="text-sm text-gray-700 shrink-0 ml-2">客户查询</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入名称电话/备注"
            className="w-56 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            onClick={handleSearch}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
          >
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

          <div className="flex-1" />

          <button className="px-3 py-1.5 bg-white text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors border border-blue-400 flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 16 }} />
            导出Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-16">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">联系电话</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">未消费天数</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">总消费次数</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">总消费金额</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">总欠款金额</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">最近消费时间</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              filtered.map((c, idx) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.noConsumeDays}天</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.totalCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{c.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{c.totalDebt.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {c.lastConsumeTime}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function RecentPurchaseCustomers() {
  const [activeTab, setActiveTab] = useState<"ratio" | "recent">("ratio");

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Page Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">近期采购客户</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex items-center gap-2 py-2">
          {(
            [
              { key: "ratio", label: "新客成交比" },
              { key: "recent", label: "近期采购客户" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto min-h-0">
        {activeTab === "ratio" ? (
          <NewCustomerRatioTab />
        ) : (
          <div className="h-full flex flex-col">
            <RecentPurchaseTab />
          </div>
        )}
      </div>
    </div>
  );
}

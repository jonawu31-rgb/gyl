import { useState } from "react";
import {
  Notifications as NotificationsIcon,
  Fullscreen as FullscreenIcon,
  ExpandMore as ExpandMoreIcon,
  AttachMoney as MoneyIcon,
  Inventory2 as InventoryIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { StatsCard } from "./components/StatsCard";
import { QuickOperations } from "./components/QuickOperations";
import { InventoryStats } from "./components/InventoryStats";
import { SalesRecords } from "./components/SalesRecords";
import { SalesRanking } from "./components/SalesRanking";
import { SalesAmountChart } from "./components/SalesAmountChart";
import { Announcements } from "./components/Announcements";
import { TodoList } from "./components/TodoList";
import { Sidebar } from "./components/Sidebar";
import { TabBar } from "./components/TabBar";
import { Login } from "./components/Login";
import { PartsData } from "./components/PartsData";
import { SalesOrder } from "./components/SalesOrder";
import { QuotationOrder } from "./components/QuotationOrder";
import { SalesCart } from "./components/SalesCart";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("首页");

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="h-screen flex bg-[#f0f2f5] overflow-hidden">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-2 h-14 shrink-0">
          <div className="flex items-center justify-between gap-4 h-full">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索订单、客户、商品..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <NotificationsIcon sx={{ fontSize: 20 }} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <FullscreenIcon sx={{ fontSize: 20 }} />
              </button>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-md shrink-0">
                  黄
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-gray-800">黄伟霆</div>
                  <div className="text-[11px] text-gray-400">超级管理员</div>
                </div>
                <ExpandMoreIcon sx={{ fontSize: 16 }} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <TabBar />

        {/* Content — overflow-auto allows scroll when window is very small */}
        <main className="flex-1 overflow-auto p-2 xl:p-4 min-h-0">
          {currentPage === "首页" ? (
            <div className="h-full flex gap-2 xl:gap-4 min-h-0">
              {/* ── Left column ── */}
              <div className="flex-1 flex flex-col gap-2 xl:gap-3 min-w-0 min-h-0">
                {/* Stats cards: 2-col below xl, 4-col at xl+ */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 xl:gap-3 shrink-0">
                  <StatsCard title="今日销售额" value="723,200" subtitle="¥元" trend="neutral" color="blue"   icon={<MoneyIcon sx={{ fontSize: 22 }} />} />
                  <StatsCard title="今日营业额" value="856,533" subtitle="¥元" trend="neutral" color="blue"  icon={<ReceiptIcon sx={{ fontSize: 22 }} />} />
                  <StatsCard title="商品种类"   value="12,457"  subtitle="个"  trend="neutral" color="blue" icon={<InventoryIcon sx={{ fontSize: 22 }} />} />
                  <StatsCard title="库存金额"   value="51,200"  subtitle="¥元" trend="neutral" color="blue" icon={<ShoppingCartIcon sx={{ fontSize: 22 }} />} />
                </div>

                {/* Quick Operations */}
                <div className="shrink-0">
                  <QuickOperations />
                </div>

                {/* Charts row — height clamps to viewport height */}
                <div
                  className="shrink-0 grid grid-cols-2 gap-2 xl:gap-3 min-w-0"
                  style={{ height: 'clamp(180px, 22vh, 260px)' }}
                >
                  <InventoryStats />
                  <SalesRanking />
                </div>

                {/* Area chart — clamp height matches other charts rhythm */}
                <div className="shrink-0" style={{ height: 'clamp(254px, 22vh, 314px)' }}>
                  <SalesAmountChart />
                </div>
              </div>

              {/* ── Right sidebar — narrows at smaller screens ── */}
              <div className="w-[220px] lg:w-[260px] xl:w-[300px] 2xl:w-[360px] shrink-0 flex flex-col gap-2 xl:gap-3 overflow-y-auto min-h-0">
                <SalesRecords />
                <Announcements />
                <TodoList />
              </div>
            </div>
          ) : currentPage === "配件资料" ? (
            <div className="h-full">
              <PartsData />
            </div>
          ) : currentPage === "销售单" ? (
            <div className="h-full">
              <SalesOrder />
            </div>
          ) : currentPage === "报价订单" ? (
            <div className="h-full">
              <QuotationOrder />
            </div>
          ) : currentPage === "销售手推车" ? (
            <div className="h-full">
              <SalesCart />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentPage}</h2>
                <p className="text-gray-500">此功能正在开发中...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

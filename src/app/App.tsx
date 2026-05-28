import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
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
import { SalesHistory } from "./components/SalesHistory";
import { SalesQuotation } from "./components/SalesQuotation";
import { CustomerData } from "./components/CustomerData";
import { PartTagManagement } from "./components/PartTagManagement";
import { DepartmentManagement } from "./components/DepartmentManagement";
import { EmployeeManagement } from "./components/EmployeeManagement";
import { RoleManagement } from "./components/RoleManagement";
import { SystemConfig } from "./components/SystemConfig";
import { UnitManagement } from "./components/UnitManagement";
import { VehicleTypeManagement } from "./components/VehicleTypeManagement";
import { CategoryManagement } from "./components/CategoryManagement";
import { OriginManagement } from "./components/OriginManagement";
import { BrandManagement } from "./components/BrandManagement";
import { CategoryTypeManagement } from "./components/CategoryTypeManagement";
import { RecentPurchaseCustomers } from "./components/RecentPurchaseCustomers";
import { PrintTemplateManagement } from "./components/PrintTemplateManagement";
import { AccrualRecords } from "./components/AccrualRecords";
import { RuleSettings } from "./components/RuleSettings";
import { RepaymentRecords } from "./components/RepaymentRecords";
import { CustomerRefund } from "./components/CustomerRefund";
import { CustomerAdvance } from "./components/CustomerAdvance";
import { TemplateManagement } from "./components/TemplateManagement";
import { CategorySummary } from "./components/CategorySummary";
import KitDisassembly from "./components/KitDisassembly";
import KitAssembly from "./components/KitAssembly";
import { PaymentManagement } from "./components/PaymentManagement";
import { VoidRecords } from "./components/VoidRecords";
import MaterialOutbound from "./components/MaterialOutbound";
import LossManagement from "./components/LossManagement";
import InventoryCheck from "./components/InventoryCheck";
import SupplierReturn from "./components/SupplierReturn";
import TransferManagement from "./components/TransferManagement";
import PurchaseManagement from "./components/PurchaseManagement";
import RevenueSummary from "./components/RevenueSummary";
import CustomerDebt from "./components/CustomerDebt";

type SearchTarget = {
  label: string;
  page: string;
  category: string;
  keywords?: string[];
};

const searchTargets: SearchTarget[] = [
  { label: "首页", page: "首页", category: "首页" },
  {
    label: "配件资料",
    page: "配件资料",
    category: "商品/仓库",
    keywords: ["配件", "商品资料", "库存"],
  },
  {
    label: "销售/报价开单",
    page: "销售/报价开单",
    category: "客户/销售",
    keywords: ["销售单", "报价开单", "开单"],
  },
  {
    label: "销售历史订单",
    page: "销售历史订单",
    category: "客户/销售",
    keywords: ["历史订单", "订单查询"],
  },
  {
    label: "销售手推车",
    page: "销售手推车",
    category: "客户/销售",
    keywords: ["购物车", "手推车"],
  },
  {
    label: "报价/草稿单据",
    page: "报价订单",
    category: "客户/销售",
    keywords: ["报价订单", "草稿单据", "报价单"],
  },
  {
    label: "作废单据",
    page: "作废单据",
    category: "客户/销售",
    keywords: ["作废", "废单"],
  },
  {
    label: "挂账/欠款记录",
    page: "挂账/欠款记录",
    category: "客户/销售",
    keywords: ["挂账", "欠款"],
  },
  {
    label: "还款记录",
    page: "还款记录",
    category: "客户/销售",
    keywords: ["还款", "回款"],
  },
  {
    label: "客户退货",
    page: "客户退货",
    category: "客户/销售",
    keywords: ["退货", "售后"],
  },
  {
    label: "客户资料",
    page: "客户资料",
    category: "客户/销售",
    keywords: ["客户", "客户档案"],
  },
  {
    label: "近期采购客户",
    page: "近期采购客户",
    category: "客户/销售",
    keywords: ["近期客户", "采购客户"],
  },
  {
    label: "客户预收款",
    page: "客户预收款",
    category: "财务/资金",
    keywords: ["预收款", "预收", "客户资金"],
  },
  {
    label: "品类汇总",
    page: "品类汇总",
    category: "财务/资金",
    keywords: ["品类", "汇总"],
  },
  {
    label: "支付管理",
    page: "支付管理",
    category: "资料/设置",
    keywords: ["支付", "收款方式"],
  },
  {
    label: "规则设置",
    page: "规则设置",
    category: "资料/设置",
    keywords: ["规则", "配置"],
  },
  {
    label: "打印模版",
    page: "打印模版",
    category: "资料/设置",
    keywords: ["打印模板", "模版", "模板"],
  },
  {
    label: "系统配置",
    page: "系统配置",
    category: "资料/设置",
    keywords: ["系统", "配置"],
  },
  {
    label: "单位管理",
    page: "单位管理",
    category: "资料/设置",
    keywords: ["单位", "单位设置"],
  },
  {
    label: "车型管理",
    page: "车型管理",
    category: "资料/设置",
    keywords: ["车型", "车系"],
  },
  {
    label: "类别管理",
    page: "类别管理",
    category: "资料/设置",
    keywords: ["分类", "类别"],
  },
  {
    label: "产地管理",
    page: "产地管理",
    category: "商品/仓库",
    keywords: ["产地", "原产地"],
  },
  {
    label: "品牌管理",
    page: "品牌管理",
    category: "商品/仓库",
    keywords: ["品牌"],
  },
  {
    label: "品类管理",
    page: "品类管理",
    category: "商品/仓库",
    keywords: ["品类", "分类管理"],
  },
  {
    label: "配件标签管理",
    page: "配件标签管理",
    category: "商品/仓库",
    keywords: ["标签", "配件标签"],
  },
  {
    label: "模版管理",
    page: "模版管理",
    category: "套件管理",
    keywords: ["模板管理", "模板", "模版"],
  },
  {
    label: "套件组装",
    page: "套件组装",
    category: "套件管理",
    keywords: ["组装"],
  },
  {
    label: "套件拆装",
    page: "套件拆装",
    category: "套件管理",
    keywords: ["拆装", "拆件"],
  },
  {
    label: "领料出库",
    page: "领料出库",
    category: "商品/仓库",
    keywords: ["领料", "出库", "仓库"],
  },
  {
    label: "报损管理",
    page: "报损管理",
    category: "商品/仓库",
    keywords: ["报损", "损坏", "核减"],
  },
  {
    label: "库存盘点",
    page: "库存盘点",
    category: "商品/仓库",
    keywords: ["盘点", "库存", "盘查"],
  },
  {
    label: "供应商退货",
    page: "供应商退货",
    category: "商品/仓库",
    keywords: ["退货", "供应商", "退换"],
  },
  {
    label: "调拨管理",
    page: "调拨管理",
    category: "商品/仓库",
    keywords: ["调拨", "仓库调拨", "转仓"],
  },
  {
    label: "采购管理",
    page: "采购管理",
    category: "商品/仓库",
    keywords: ["采购", "采购下单", "进货", "供应商采购"],
  },
  {
    label: "营收汇总",
    page: "营收汇总",
    category: "财务/资金",
    keywords: ["营收", "应收", "毛利", "收入汇总"],
  },
  {
    label: "客户欠款",
    page: "客户欠款",
    category: "财务/资金",
    keywords: ["欠款", "还款", "客户债务"],
  },
  {
    label: "部门管理",
    page: "部门管理",
    category: "员工/绩效",
    keywords: ["部门", "组织"],
  },
  {
    label: "员工管理",
    page: "员工管理",
    category: "员工/绩效",
    keywords: ["员工", "人员"],
  },
  {
    label: "角色管理",
    page: "角色管理",
    category: "员工/绩效",
    keywords: ["角色", "权限"],
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("首页");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const searchResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return [];

    return searchTargets.filter((target) => {
      const haystacks = [
        target.label,
        target.page,
        target.category,
        ...(target.keywords ?? []),
      ];

      return haystacks.some((text) =>
        text.toLowerCase().includes(query),
      );
    });
  }, [searchValue]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!searchBoxRef.current) return;
      if (
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () =>
      document.removeEventListener(
        "pointerdown",
        onPointerDown,
      );
  }, []);

  const handleSearchSelect = (page: string, label: string) => {
    setCurrentPage(page);
    setSearchValue(label);
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") return;

    if (searchResults.length > 0) {
      handleSearchSelect(
        searchResults[0].page,
        searchResults[0].label,
      );
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="h-screen flex bg-[#f0f2f5] overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-2 h-14 shrink-0">
          <div className="flex items-center justify-between gap-4 h-full">
            <div
              ref={searchBoxRef}
              className="flex-1 max-w-sm relative"
            >
              <div className="relative">
                <SearchIcon
                  sx={{ fontSize: 16 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="搜索订单、客户、商品..."
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                />
              </div>
              {isSearchOpen && searchValue.trim() && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-200/70">
                  {searchResults.length > 0 ? (
                    <div className="max-h-72 overflow-auto py-1">
                      {searchResults.map((item) => (
                        <button
                          key={`${item.page}-${item.label}`}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleSearchSelect(
                              item.page,
                              item.label,
                            );
                          }}
                          className="flex w-full items-start gap-3 px-3 py-2 text-left transition-colors hover:bg-blue-50"
                        >
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#18b7de] to-[#2e63ff] text-[11px] font-semibold text-white">
                            {item.label.slice(0, 2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-800">
                              {item.label}
                            </div>
                            <div className="mt-0.5 text-[11px] text-gray-400">
                              {item.category}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-4 text-sm text-gray-500">
                      未找到相关页面，请换个关键词试试。
                    </div>
                  )}
                </div>
              )}
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
                  <div className="text-xs font-semibold text-gray-800">
                    黄伟霆
                  </div>
                  <div className="text-[11px] text-gray-400">
                    超级管理员
                  </div>
                </div>
                <ExpandMoreIcon
                  sx={{ fontSize: 16 }}
                  className="text-gray-400"
                />
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
                  <StatsCard
                    title="今日销售额"
                    value="723,200"
                    subtitle="¥元"
                    trend="neutral"
                    color="blue"
                    icon={<MoneyIcon sx={{ fontSize: 22 }} />}
                  />
                  <StatsCard
                    title="今日营业额"
                    value="856,533"
                    subtitle="¥元"
                    trend="neutral"
                    color="blue"
                    icon={<ReceiptIcon sx={{ fontSize: 22 }} />}
                  />
                  <StatsCard
                    title="商品种类"
                    value="12,457"
                    subtitle="个"
                    trend="neutral"
                    color="blue"
                    icon={
                      <InventoryIcon sx={{ fontSize: 22 }} />
                    }
                  />
                  <StatsCard
                    title="库存金额"
                    value="51,200"
                    subtitle="¥元"
                    trend="neutral"
                    color="blue"
                    icon={
                      <ShoppingCartIcon sx={{ fontSize: 22 }} />
                    }
                  />
                </div>

                {/* Quick Operations */}
                <div className="shrink-0">
                  <QuickOperations
                    onPageChange={setCurrentPage}
                  />
                </div>

                {/* Charts row — height clamps to viewport height */}
                <div
                  className="shrink-0 grid grid-cols-2 gap-2 xl:gap-3 min-w-0"
                  style={{
                    height: "clamp(180px, 22vh, 260px)",
                  }}
                >
                  <InventoryStats />
                  <SalesRanking />
                </div>

                {/* Area chart — clamp height matches other charts rhythm */}
                <div
                  className="shrink-0"
                  style={{
                    height: "clamp(254px, 22vh, 314px)",
                  }}
                >
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
          ) : currentPage === "销售历史订单" ? (
            <div className="h-full">
              <SalesHistory />
            </div>
          ) : currentPage === "销售/报价开单" ? (
            <div className="h-full">
              <SalesQuotation />
            </div>
          ) : currentPage === "客户资料" ? (
            <div className="h-full">
              <CustomerData />
            </div>
          ) : currentPage === "配件标签管理" ? (
            <div className="h-full">
              <PartTagManagement />
            </div>
          ) : currentPage === "部门管理" ? (
            <div className="h-full">
              <DepartmentManagement />
            </div>
          ) : currentPage === "员工管理" ? (
            <div className="h-full">
              <EmployeeManagement />
            </div>
          ) : currentPage === "角色管理" ? (
            <div className="h-full">
              <RoleManagement />
            </div>
          ) : currentPage === "系统配置" ? (
            <div className="h-full">
              <SystemConfig />
            </div>
          ) : currentPage === "单位管理" ? (
            <div className="h-full">
              <UnitManagement />
            </div>
          ) : currentPage === "车型管理" ? (
            <div className="h-full">
              <VehicleTypeManagement />
            </div>
          ) : currentPage === "类别管理" ? (
            <div className="h-full">
              <CategoryManagement />
            </div>
          ) : currentPage === "产地管理" ? (
            <div className="h-full">
              <OriginManagement />
            </div>
          ) : currentPage === "品牌管理" ? (
            <div className="h-full">
              <BrandManagement />
            </div>
          ) : currentPage === "品类管理" ? (
            <div className="h-full">
              <CategoryTypeManagement />
            </div>
          ) : currentPage === "近期采购客户" ? (
            <div className="h-full">
              <RecentPurchaseCustomers />
            </div>
          ) : currentPage === "打印模版" ? (
            <div className="h-full">
              <PrintTemplateManagement />
            </div>
          ) : currentPage === "挂账/欠款记录" ? (
            <div className="h-full">
              <AccrualRecords />
            </div>
          ) : currentPage === "规则设置" ? (
            <div className="h-full">
              <RuleSettings />
            </div>
          ) : currentPage === "还款记录" ? (
            <div className="h-full">
              <RepaymentRecords />
            </div>
          ) : currentPage === "客户退货" ? (
            <div className="h-full">
              <CustomerRefund />
            </div>
          ) : currentPage === "客户预收款" ? (
            <div className="h-full">
              <CustomerAdvance />
            </div>
          ) : currentPage === "模版管理" ? (
            <div className="h-full">
              <TemplateManagement />
            </div>
          ) : currentPage === "套件组装" ? (
            <div className="h-full">
              <KitAssembly />
            </div>
          ) : currentPage === "套件拆装" ? (
            <div className="h-full">
              <KitDisassembly />
            </div>
          ) : currentPage === "品类汇总" ? (
            <div className="h-full">
              <CategorySummary />
            </div>
          ) : currentPage === "支付管理" ? (
            <div className="h-full">
              <PaymentManagement />
            </div>
          ) : currentPage === "作废单据" ? (
            <div className="h-full">
              <VoidRecords />
            </div>
          ) : currentPage === "领料出库" ? (
            <div className="h-full">
              <MaterialOutbound />
            </div>
          ) : currentPage === "报损管理" ? (
            <div className="h-full">
              <LossManagement />
            </div>
          ) : currentPage === "库存盘点" ? (
            <div className="h-full">
              <InventoryCheck />
            </div>
          ) : currentPage === "供应商退货" ? (
            <div className="h-full">
              <SupplierReturn />
            </div>
          ) : currentPage === "调拨管理" ? (
            <div className="h-full">
              <TransferManagement />
            </div>
          ) : currentPage === "采购管理" ? (
            <div className="h-full">
              <PurchaseManagement />
            </div>
          ) : currentPage === "营收汇总" ? (
            <div className="h-full">
              <RevenueSummary />
            </div>
          ) : currentPage === "客户欠款" ? (
            <div className="h-full">
              <CustomerDebt />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentPage}
                </h2>
                <p className="text-gray-500">
                  此功能正在开发中...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
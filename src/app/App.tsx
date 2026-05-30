import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
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
import { DebtRecord } from "./components/DebtRecord";
import { PartsData } from "./components/PartsData";
import { SalesQuotation } from "./components/SalesQuotation";
import { QuotationOrder } from "./components/QuotationOrder";
import { SalesHistory } from "./components/SalesHistory";
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
import SlowInventory from "./components/SlowInventory";
import { ProductSalesRanking } from "./components/ProductSalesRanking";
import { InventoryTurnover } from "./components/InventoryTurnover";
import { PurchaseLossRatio } from "./components/PurchaseLossRatio";
import { InventoryWarning } from "./components/InventoryWarning";
import { LogisticsCompany } from "./components/LogisticsCompany";
import { DeliveryVehicles } from "./components/DeliveryVehicles";
import { PickingManagement } from "./components/PickingManagement";
import { PackagingManagement } from "./components/PackagingManagement";
import { ShippingManagement } from "./components/ShippingManagement";
import { PurchaseAmountRanking } from "./components/PurchaseAmountRanking";
import { CommissionSettings } from "./components/CommissionSettings";
import { CategoryCommission } from "./components/CategoryCommission";
import { SalaryReport } from "./components/SalaryReport";
import { CustomerVisitRecord } from "./components/CustomerVisitRecord";
import { CustomerVisitApproval } from "./components/CustomerVisitApproval";
import { RecentPurchaseCustomers } from "./components/RecentPurchaseCustomers";
import { CustomerContribution } from "./components/CustomerContribution";
import { UniversalPartManagement } from "./components/UniversalPartManagement";
import { MessageList } from "./components/MessageList";
import { MessageSettings } from "./components/MessageSettings";
import { WarehouseManagement } from "./components/WarehouseManagement";
import { SupplierManagement } from "./components/SupplierManagement";
import { SupplierPrepayment } from "./components/SupplierPrepayment";
import { StockQuery } from "./components/StockQuery";
import { GrossProfitStats } from "./components/GrossProfitStats";
import { ProcurementStats } from "./components/ProcurementStats";
import { ProcurementPayable } from "./components/ProcurementPayable";
import { ExpenseOutlay } from "./components/ExpenseOutlay";
import { IncomeExpense } from "./components/IncomeExpense";
import { ExpenseReimbursement } from "./components/ExpenseReimbursement";
import { buildSearchTargets, menuItems, type SearchTarget } from "./navigation";

const searchTargets: SearchTarget[] = [
  { label: "首页", page: "首页", category: "首页" },
  ...buildSearchTargets(menuItems),
];

const pageComponents: Record<string, ComponentType> = {
  "账单明细": DebtRecord,
  "配件资料": PartsData,
  "销售/报价开单": SalesQuotation,
  "销售历史订单": SalesHistory,
  "报价/草稿单据": QuotationOrder,
  "客户资料": CustomerData,
  "配件标签管理": PartTagManagement,
  "部门管理": DepartmentManagement,
  "员工管理": EmployeeManagement,
  "角色管理": RoleManagement,
  "系统配置": SystemConfig,
  "单位管理": UnitManagement,
  "车型管理": VehicleTypeManagement,
  "类别管理": CategoryManagement,
  "产地管理": OriginManagement,
  "品牌管理": BrandManagement,
  "品类管理": CategoryTypeManagement,
  "打印模版": PrintTemplateManagement,
  "挂账/欠款记录": AccrualRecords,
  "规则设置": RuleSettings,
  "还款记录": RepaymentRecords,
  "客户退货": CustomerRefund,
  "客户预收款": CustomerAdvance,
  "模版管理": TemplateManagement,
  "套件组装": KitAssembly,
  "套件拆装": KitDisassembly,
  "品类汇总": CategorySummary,
  "支付管理": PaymentManagement,
  "作废单据": VoidRecords,
  "领料出库": MaterialOutbound,
  "报损管理": LossManagement,
  "库存盘点": InventoryCheck,
  "供应商退货": SupplierReturn,
  "调拨管理": TransferManagement,
  "采购管理": PurchaseManagement,
  "营收汇总": RevenueSummary,
  "客户欠款": CustomerDebt,
  "采购流失比": PurchaseLossRatio,
  "库存预警": InventoryWarning,
  "滞销库存": SlowInventory,
  "采购金额排行": PurchaseAmountRanking,
  "单据提成设置": CommissionSettings,
  "分类提成设置": CategoryCommission,
  "工资报表": SalaryReport,
  "物流公司资料": LogisticsCompany,
  "配送车辆": DeliveryVehicles,
  "拣货管理": PickingManagement,
  "打包装箱": PackagingManagement,
  "发货管理": ShippingManagement,
  "客户拜访登记": CustomerVisitRecord,
  "客户拜访审核": CustomerVisitApproval,
  "近期采购客户": RecentPurchaseCustomers,
  "客户贡献率": CustomerContribution,
  "通用件管理": UniversalPartManagement,
  "消息列表": MessageList,
  "消息设置": MessageSettings,
  "仓库管理": WarehouseManagement,
  "供应商管理": SupplierManagement,
  "供应商预付款": SupplierPrepayment,
  "库存查询": StockQuery,
  "毛利统计": GrossProfitStats,
  "采购统计": ProcurementStats,
  "采购应付": ProcurementPayable,
  "商品销售排行": ProductSalesRanking,
  "库存周转率": InventoryTurnover,
  "支出费用": ExpenseOutlay,
  "收入费用": IncomeExpense,
  "费用报销": ExpenseReimbursement,
};

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

      return haystacks.some((text) => text.toLowerCase().includes(query));
    });
  }, [searchValue]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleSearchSelect = (page: string, label: string) => {
    setCurrentPage(page);
    setSearchValue(label);
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0].page, searchResults[0].label);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const ActivePage = pageComponents[currentPage];

  return (
    <div className="h-screen flex bg-[#f0f2f5] overflow-hidden">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-2 h-14 shrink-0">
          <div className="flex items-center justify-between gap-4 h-full">
            <div ref={searchBoxRef} className="flex-1 max-w-sm relative">
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
                            handleSearchSelect(item.page, item.label);
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

        <main className="flex-1 overflow-auto p-2 xl:p-4 min-h-0">
          {currentPage === "首页" ? (
            <div className="h-full flex gap-2 xl:gap-4 min-h-0">
              <div className="flex-1 flex flex-col gap-2 xl:gap-3 min-w-0 min-h-0">
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
                    icon={<InventoryIcon sx={{ fontSize: 22 }} />}
                  />
                  <StatsCard
                    title="库存金额"
                    value="51,200"
                    subtitle="¥元"
                    trend="neutral"
                    color="blue"
                    icon={<ShoppingCartIcon sx={{ fontSize: 22 }} />}
                  />
                </div>

                <div className="shrink-0">
                  <QuickOperations onPageChange={setCurrentPage} />
                </div>

                <div
                  className="shrink-0 grid grid-cols-2 gap-2 xl:gap-3 min-w-0"
                  style={{ height: "clamp(180px, 22vh, 260px)" }}
                >
                  <InventoryStats />
                  <SalesRanking />
                </div>

                <div
                  className="shrink-0"
                  style={{ height: "clamp(254px, 22vh, 314px)" }}
                >
                  <SalesAmountChart />
                </div>
              </div>

              <div className="w-[220px] lg:w-[260px] xl:w-[300px] 2xl:w-[360px] shrink-0 flex flex-col gap-2 xl:gap-3 overflow-y-auto min-h-0">
                <SalesRecords />
                <Announcements />
                <TodoList />
              </div>
            </div>
          ) : ActivePage ? (
            <div className="h-full">
              <ActivePage />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentPage}
                </h2>
                <p className="text-gray-500">此功能正在开发中...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

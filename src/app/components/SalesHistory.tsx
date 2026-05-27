import { useState } from "react";
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { SalesHistoryDetailDialog } from "./SalesHistoryDetailDialog";
import { SalesHistoryEditSalespersonDialog } from "./SalesHistoryEditSalespersonDialog";
import { SalesHistoryVoidDialog } from "./SalesHistoryVoidDialog";
import { SalesHistoryPrintDialog } from "./SalesHistoryPrintDialog";

interface SalesOrderItem {
  id: string;
  saleTime: string;
  orderNo: string;
  source: string;
  customerName: string;
  fulfillmentStatus: string;
  cost: number;
  salePrice: number;
  profitAmount: number;
  profitRate: number;
  freight: number;
  discount: number;
  deduction: number;
  payable: number;
  actualPayment: number;
  onAccount: number;
  advancePayment: number;
  otherPayment: number;
  deliveryMethod: string;
  repaymentStatus: string;
  deliveryVehicle: string;
  deliveryCompany: string;
  deliveryAddress: string;
  contactPerson: string;
  contactPhone: string;
  creator: string;
  salesperson: string;
  isMallOrder: string;
}

interface SalesDetailItem {
  id: string;
  saleTime: string;
  orderNo: string;
  source: string;
  customerName: string;
  category: string;
  partName: string;
  specification: string;
  partCode: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  deduction: number;
  amount: number;
  unitCost: number;
  totalCost: number;
  creator: string;
  origin: string;
  supplier: string;
  warehouse: string;
  type: string;
  remark: string;
}

const mockOrderData: SalesOrderItem[] = [
  {
    id: "1",
    saleTime: "2026-05-22 18:19:59",
    orderNo: "SY20260522001",
    source: "电脑",
    customerName: "黄山佳辉汽配",
    fulfillmentStatus: "待拣货",
    cost: 1200.00,
    salePrice: 1500.00,
    profitAmount: 300.00,
    profitRate: 25.00,
    freight: 50.00,
    discount: 20.00,
    deduction: 10.00,
    payable: 1520.00,
    actualPayment: 1000.00,
    onAccount: 520.00,
    advancePayment: 0,
    otherPayment: 0,
    deliveryMethod: "自配送",
    repaymentStatus: "已挂账",
    deliveryVehicle: "浙A12345",
    deliveryCompany: "",
    deliveryAddress: "杭州市西湖区文三路123号",
    contactPerson: "张三",
    contactPhone: "13800138000",
    creator: "管理员",
    salesperson: "李销售",
    isMallOrder: "否",
  },
  {
    id: "2",
    saleTime: "2026-05-21 15:30:22",
    orderNo: "SY20260521002",
    source: "商城",
    customerName: "济南恒通汽车",
    fulfillmentStatus: "已完成",
    cost: 2800.00,
    salePrice: 3500.00,
    profitAmount: 700.00,
    profitRate: 25.00,
    freight: 80.00,
    discount: 50.00,
    deduction: 0,
    payable: 3530.00,
    actualPayment: 3530.00,
    onAccount: 0,
    advancePayment: 0,
    otherPayment: 0,
    deliveryMethod: "物流配送",
    repaymentStatus: "未挂账",
    deliveryVehicle: "",
    deliveryCompany: "顺丰速运",
    deliveryAddress: "济南市历下区经十路456号",
    contactPerson: "王五",
    contactPhone: "13900139000",
    creator: "管理员",
    salesperson: "张销售",
    isMallOrder: "是",
  },
];

const mockDetailData: SalesDetailItem[] = [
  {
    id: "1",
    saleTime: "2026-05-22 18:19:59",
    orderNo: "SY20260522001",
    source: "电脑",
    customerName: "黄山佳辉汽配",
    category: "A001",
    partName: "刹车片",
    specification: "前片",
    partCode: "BP001",
    unitPrice: 150.00,
    quantity: 10,
    discount: 20.00,
    deduction: 10.00,
    amount: 1470.00,
    unitCost: 120.00,
    totalCost: 1200.00,
    creator: "管理员",
    origin: "国产",
    supplier: "A供应商",
    warehouse: "主仓",
    type: "销售",
    remark: "",
  },
  {
    id: "2",
    saleTime: "2026-05-21 15:30:22",
    orderNo: "SY20260521002",
    source: "商城",
    customerName: "济南恒通汽车",
    category: "A002",
    partName: "机油滤清器",
    specification: "标准",
    partCode: "OF001",
    unitPrice: 35.00,
    quantity: 100,
    discount: 50.00,
    deduction: 0,
    amount: 3450.00,
    unitCost: 28.00,
    totalCost: 2800.00,
    creator: "管理员",
    origin: "进口",
    supplier: "B供应商",
    warehouse: "主仓",
    type: "销售",
    remark: "批量采购",
  },
];

export function SalesHistory() {
  const [activeTab, setActiveTab] = useState<"orders" | "details">("orders");
  const [searchFilters, setSearchFilters] = useState({
    customer: "",
    part: "",
    salesperson: "",
    startDate: "",
    endDate: "",
    mallOrder: "",
  });

  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editSalespersonDialogOpen, setEditSalespersonDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSearch = () => {
    console.log("搜索", searchFilters);
  };

  const handleReset = () => {
    setSearchFilters({
      customer: "",
      part: "",
      salesperson: "",
      startDate: "",
      endDate: "",
      mallOrder: "",
    });
  };

  const handleViewDetail = (order: SalesOrderItem) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleEditSalesperson = (order: SalesOrderItem) => {
    setSelectedOrder(order);
    setEditSalespersonDialogOpen(true);
  };

  const handleVoid = (order: SalesOrderItem) => {
    setSelectedOrder(order);
    setVoidDialogOpen(true);
  };

  const handlePrint = (order: SalesOrderItem) => {
    setSelectedOrder(order);
    setPrintDialogOpen(true);
  };

  const handleFulfillmentClick = (status: string) => {
    // Navigate to respective pages based on status
    console.log("跳转至", status);
  };

  // Calculate totals for orders
  const orderTotals = {
    cost: mockOrderData.reduce((sum, item) => sum + item.cost, 0),
    salePrice: mockOrderData.reduce((sum, item) => sum + item.salePrice, 0),
    profitAmount: mockOrderData.reduce((sum, item) => sum + item.profitAmount, 0),
    profitRate: 0,
    freight: mockOrderData.reduce((sum, item) => sum + item.freight, 0),
    discount: mockOrderData.reduce((sum, item) => sum + item.discount, 0),
    deduction: mockOrderData.reduce((sum, item) => sum + item.deduction, 0),
    payable: mockOrderData.reduce((sum, item) => sum + item.payable, 0),
    actualPayment: mockOrderData.reduce((sum, item) => sum + item.actualPayment, 0),
    onAccount: mockOrderData.reduce((sum, item) => sum + item.onAccount, 0),
    advancePayment: mockOrderData.reduce((sum, item) => sum + item.advancePayment, 0),
    otherPayment: mockOrderData.reduce((sum, item) => sum + item.otherPayment, 0),
  };
  orderTotals.profitRate = orderTotals.cost > 0 ? (orderTotals.profitAmount / orderTotals.cost) * 100 : 0;

  // Calculate totals for details
  const detailTotals = {
    quantity: mockDetailData.reduce((sum, item) => sum + item.quantity, 0),
    discount: mockDetailData.reduce((sum, item) => sum + item.discount, 0),
    deduction: mockDetailData.reduce((sum, item) => sum + item.deduction, 0),
    amount: mockDetailData.reduce((sum, item) => sum + item.amount, 0),
  };

  return (
    <>
      <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">销售历史订单</h2>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <ExportIcon sx={{ fontSize: 16 }} />
              导出
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === "orders"
                  ? "text-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              销售单据
              {activeTab === "orders" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === "details"
                  ? "text-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              销售明细
              {activeTab === "details" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="space-y-3">
            {/* First Row */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <label className="col-span-1 text-sm font-medium text-gray-700">客户查询</label>
              <input
                type="text"
                placeholder="姓名/电话/VIN码"
                value={searchFilters.customer}
                onChange={(e) => setSearchFilters({ ...searchFilters, customer: e.target.value })}
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />

              <label className="col-span-1 text-sm font-medium text-gray-700">配件查询</label>
              <input
                type="text"
                placeholder="名称/规格/编码/OE码/备注"
                value={searchFilters.part}
                onChange={(e) => setSearchFilters({ ...searchFilters, part: e.target.value })}
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />

              <label className="col-span-1 text-sm font-medium text-gray-700">销售员</label>
              <select
                value={searchFilters.salesperson}
                onChange={(e) => setSearchFilters({ ...searchFilters, salesperson: e.target.value })}
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              >
                <option value="">请选择</option>
                <option value="李销售">李销售</option>
                <option value="张销售">张销售</option>
              </select>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <label className="col-span-1 text-sm font-medium text-gray-700">销售时间</label>
              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="date"
                  placeholder="开始日期"
                  value={searchFilters.startDate}
                  onChange={(e) => setSearchFilters({ ...searchFilters, startDate: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                />
                <span className="text-sm text-gray-500">至</span>
                <input
                  type="date"
                  placeholder="结束日期"
                  value={searchFilters.endDate}
                  onChange={(e) => setSearchFilters({ ...searchFilters, endDate: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </div>

              {activeTab === "orders" && (
                <>
                  <label className="col-span-1 text-sm font-medium text-gray-700">商城单据</label>
                  <select
                    value={searchFilters.mallOrder}
                    onChange={(e) => setSearchFilters({ ...searchFilters, mallOrder: e.target.value })}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="">请选择</option>
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </>
              )}

              <div className={activeTab === "orders" ? "col-span-4 flex items-center justify-end gap-2" : "col-span-8 flex items-center justify-end gap-2"}>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
                >
                  <SearchIcon sx={{ fontSize: 16 }} />
                  搜索
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5"
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                  重置
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {activeTab === "orders" ? (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">销售时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">来源</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">履约状态</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">售价</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">利润金额</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">利润率</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">运费</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">优惠</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">减收</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">应付</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">实付</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">挂账</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">预付款</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">其他支付</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送方式</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">还款状态</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送车辆</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送公司</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货地址</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货联系人</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货联系电话</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">建立人</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">销售员</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">商城订单</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gray-50 z-20" style={{ boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.15)' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {mockOrderData.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.saleTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.orderNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.customerName}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {item.fulfillmentStatus !== "已完成" ? (
                        <button
                          onClick={() => handleFulfillmentClick(item.fulfillmentStatus)}
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            item.fulfillmentStatus === "待拣货"
                              ? "bg-blue-100 text-blue-700"
                              : item.fulfillmentStatus === "待打包"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.fulfillmentStatus === "待发货"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          } hover:opacity-80 transition-opacity`}
                        >
                          {item.fulfillmentStatus}
                        </button>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {item.fulfillmentStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.salePrice.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-sm text-right whitespace-nowrap ${item.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.profitAmount.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right whitespace-nowrap ${item.profitRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.profitRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.freight.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.discount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.deduction.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.payable.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.actualPayment.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.onAccount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.advancePayment.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.otherPayment.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.deliveryMethod}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        item.repaymentStatus === "已挂账"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.repaymentStatus === "未挂账"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {item.repaymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.deliveryVehicle}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.deliveryCompany}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.deliveryAddress}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.contactPerson}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.contactPhone}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.creator}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.salesperson}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.isMallOrder}</td>
                    <td className="px-4 py-3 text-sm sticky right-0 bg-white group-hover:bg-blue-50/50 transition-colors z-[5] whitespace-nowrap" style={{ boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.15)' }}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditSalesperson(item)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors px-1 py-0.5 whitespace-nowrap"
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                          <span className="text-xs">修改销售员</span>
                        </button>
                        <button
                          onClick={() => handleVoid(item)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors px-1 py-0.5 whitespace-nowrap"
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                          <span className="text-xs">作废</span>
                        </button>
                        <button
                          onClick={() => handlePrint(item)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors px-1 py-0.5 whitespace-nowrap"
                        >
                          <PrintIcon sx={{ fontSize: 16 }} />
                          <span className="text-xs">打印</span>
                        </button>
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors px-1 py-0.5 whitespace-nowrap"
                        >
                          <ViewIcon sx={{ fontSize: 16 }} />
                          <span className="text-xs">查看</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-blue-50 border-t-2 border-blue-200 font-semibold">
                  <td className="px-4 py-3 text-sm text-gray-900" colSpan={6}>合计</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.salePrice.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-sm text-right ${orderTotals.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {orderTotals.profitAmount.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right ${orderTotals.profitRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {orderTotals.profitRate.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.freight.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.discount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.deduction.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.payable.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.actualPayment.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.onAccount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.advancePayment.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{orderTotals.otherPayment.toFixed(2)}</td>
                  <td className="px-4 py-3" colSpan={10}></td>
                  <td className="px-4 py-3 sticky right-0 bg-blue-50 z-[5]" style={{ boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.15)' }}></td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">序号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">销售时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">来源</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品类</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">编码</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">单价</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">数量</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">优惠</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">减收</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">金额</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">总成本</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">建立人</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">产地</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">供应商</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">备注</th>
                </tr>
              </thead>
              <tbody>
                {mockDetailData.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.saleTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.orderNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.partName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.specification}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.partCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.discount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.deduction.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.unitCost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right whitespace-nowrap">{item.totalCost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.creator}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.origin}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.supplier}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.warehouse}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.remark}</td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-blue-50 border-t-2 border-blue-200 font-semibold">
                  <td className="px-4 py-3 text-sm text-gray-900" colSpan={10}>合计</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{detailTotals.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{detailTotals.discount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{detailTotals.deduction.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{detailTotals.amount.toFixed(2)}</td>
                  <td className="px-4 py-3" colSpan={8}></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              共 <span className="font-semibold text-gray-800">{activeTab === "orders" ? mockOrderData.length : mockDetailData.length}</span> 条数据
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">
                {currentPage}
              </button>
              <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {detailDialogOpen && selectedOrder && (
        <SalesHistoryDetailDialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          order={selectedOrder}
        />
      )}
      {editSalespersonDialogOpen && selectedOrder && (
        <SalesHistoryEditSalespersonDialog
          open={editSalespersonDialogOpen}
          onClose={() => setEditSalespersonDialogOpen(false)}
          order={selectedOrder}
        />
      )}
      {voidDialogOpen && selectedOrder && (
        <SalesHistoryVoidDialog
          open={voidDialogOpen}
          onClose={() => setVoidDialogOpen(false)}
          order={selectedOrder}
        />
      )}
      {printDialogOpen && selectedOrder && (
        <SalesHistoryPrintDialog
          open={printDialogOpen}
          onClose={() => setPrintDialogOpen(false)}
          order={selectedOrder}
        />
      )}
    </>
  );
}

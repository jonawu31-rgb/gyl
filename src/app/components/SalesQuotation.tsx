import { useState } from "react";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";
import { ManagerReminderDialog } from "./ManagerReminderDialog";
import {
  MoreQueriesModal,
  QueryFilters,
} from "./MoreQueriesModal";
import { PartSettingsDialog } from "./PartSettingsDialog";
import { FauxSelect } from "./ui/FauxSelect";

interface Part {
  id: string;
  partName: string;
  partCode: string;
  spec: string;
  drawingNo: string;
  category: string;
  sellPrice: number;
  costPrice: number;
  stock: number;
  origin: string;
  supplier: string;
  warehouse: string;
  lastPurchasePrice?: number;
}

interface OrderItem {
  id: string;
  partName: string;
  partSpec: string;
  partCode: string;
  stock: number;
  cost: number;
  lastSellPrice: number;
  quantity: number;
  sellPrice: number;
  discount: number;
  amount: number;
  type: string;
  origin: string;
  supplier: string;
  warehouse: string;
  rowRemark: string;
}

interface PurchaseItem {
  id: string;
  partName: string;
  partSpec: string;
  partCode: string;
  origin: string;
  lastPurchasePrice: number;
  quantity: number;
  purchasePrice: number;
  packingFee: number;
  total: number;
  gift: boolean;
  rowRemark: string;
  warehouse: string;
}

export function SalesQuotation() {
  const [activeTab, setActiveTab] = useState<
    "sales" | "purchase"
  >("sales");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [vinCode, setVinCode] = useState("");
  const [
    showManagerReminderDialog,
    setShowManagerReminderDialog,
  ] = useState(false);
  const [moreQueriesOpen, setMoreQueriesOpen] = useState(false);
  const [partSettingsOpen, setPartSettingsOpen] =
    useState(false);

  // 销售开单表单字段
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [priceLevel, setPriceLevel] = useState("零售价");
  const [deliveryMethod, setDeliveryMethod] =
    useState("自配送");
  const [deliveryVehicle, setDeliveryVehicle] = useState("");
  const [areaSelect, setAreaSelect] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [remark, setRemark] = useState("");
  const [managerReminder, setManagerReminder] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [customerError, setCustomerError] = useState(false);

  // 采购入库表单字段
  const [saleOrderNo, setSaleOrderNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaser, setPurchaser] = useState("");
  const [purchaseWarehouse, setPurchaseWarehouse] =
    useState("");
  const [purchaseRemark, setPurchaseRemark] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [prepayment, setPrepayment] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [freight, setFreight] = useState("");

  // 模拟配件数据
  const [parts] = useState<Part[]>([
    {
      id: "1",
      partName: "机油滤芯",
      partCode: "352+656",
      spec: "标准型",
      drawingNo: "24125",
      category: "滤清器",
      sellPrice: 10.0,
      costPrice: 5,
      stock: 8,
      origin: "",
      supplier: "",
      warehouse: "星油柜",
      lastPurchasePrice: 58,
    },
    {
      id: "2",
      partName: "刹车片",
      partCode: "SP000003",
      spec: "前轮",
      drawingNo: "",
      category: "油品",
      sellPrice: 10.0,
      costPrice: 2.5,
      stock: 2,
      origin: "",
      supplier: "供应商",
      warehouse: "星兴仓",
      lastPurchasePrice: 195,
    },
  ]);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<
    PurchaseItem[]
  >([]);

  // 添加配件到销售订单
  const handleAddPartToOrder = (part: Part) => {
    const existingItem = orderItems.find(
      (item) => item.partCode === part.partCode,
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.partCode === part.partCode
            ? {
                ...item,
                quantity: item.quantity + 1,
                amount:
                  (item.quantity + 1) * item.sellPrice -
                  item.discount,
              }
            : item,
        ),
      );
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        partName: part.partName,
        partSpec: part.spec,
        partCode: part.partCode,
        stock: part.stock,
        cost: part.costPrice,
        lastSellPrice: part.sellPrice,
        quantity: 1,
        sellPrice: part.sellPrice,
        discount: 0,
        amount: part.sellPrice,
        type: part.category,
        origin: part.origin,
        supplier: part.supplier,
        warehouse: part.warehouse,
        rowRemark: "",
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  // 添加配件到采购单
  const handleAddPartToPurchase = (part: Part) => {
    const existingItem = purchaseItems.find(
      (item) => item.partCode === part.partCode,
    );
    if (existingItem) {
      setPurchaseItems(
        purchaseItems.map((item) =>
          item.partCode === part.partCode
            ? {
                ...item,
                quantity: item.quantity + 1,
                total:
                  (item.quantity + 1) * item.purchasePrice +
                  item.packingFee,
              }
            : item,
        ),
      );
    } else {
      const newItem: PurchaseItem = {
        id: Date.now().toString(),
        partName: part.partName,
        partSpec: part.spec,
        partCode: part.partCode,
        origin: part.origin,
        lastPurchasePrice: part.lastPurchasePrice || 0,
        quantity: 1,
        purchasePrice: part.lastPurchasePrice || 0,
        packingFee: 0,
        total: part.lastPurchasePrice || 0,
        gift: false,
        rowRemark: "",
        warehouse: part.warehouse,
      };
      setPurchaseItems([...purchaseItems, newItem]);
    }
  };

  // 更新订单明细
  const handleUpdateOrderItem = (
    id: string,
    field: keyof OrderItem,
    value: any,
  ) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (
            field === "quantity" ||
            field === "sellPrice" ||
            field === "discount"
          ) {
            updatedItem.amount =
              updatedItem.quantity * updatedItem.sellPrice -
              updatedItem.discount;
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  // 更新采购明细
  const handleUpdatePurchaseItem = (
    id: string,
    field: keyof PurchaseItem,
    value: any,
  ) => {
    setPurchaseItems(
      purchaseItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (
            field === "quantity" ||
            field === "purchasePrice" ||
            field === "packingFee"
          ) {
            updatedItem.total =
              updatedItem.quantity * updatedItem.purchasePrice +
              updatedItem.packingFee;
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  // 删除订单明细
  const handleDeleteOrderItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // 删除采购明细
  const handleDeletePurchaseItem = (id: string) => {
    setPurchaseItems(
      purchaseItems.filter((item) => item.id !== id),
    );
  };

  // 重置销售表单
  const handleResetSales = () => {
    setSelectedCustomer("");
    setSalesPerson("");
    setPriceLevel("零售价");
    setDeliveryMethod("自配送");
    setDeliveryVehicle("");
    setAreaSelect("");
    setAddress("");
    setContactPerson("");
    setContactPhone("");
    setRemark("");
    setManagerReminder("");
    setInternalNote("");
    setOrderItems([]);
    setCustomerError(false);
  };

  // 重置采购表单
  const handleResetPurchase = () => {
    setSaleOrderNo("");
    setSupplier("");
    setPurchaser("");
    setPurchaseWarehouse("");
    setPurchaseRemark("");
    setCashAmount("");
    setPaymentMethod("");
    setPrepayment("");
    setCreditAmount("");
    setFreight("");
    setPurchaseItems([]);
  };

  // 保存报价/草稿
  const handleSaveDraft = () => {
    if (!selectedCustomer) {
      setCustomerError(true);
      return;
    }
    if (orderItems.length === 0) {
      alert("请添加配件到订单");
      return;
    }
    alert("报价/草稿已保存");
  };

  // 结算/打包/发货
  const handleCheckout = () => {
    if (!selectedCustomer) {
      setCustomerError(true);
      return;
    }
    if (orderItems.length === 0) {
      alert("请添加配件到订单");
      return;
    }
    alert("订单已提交");
  };

  // 采购草稿
  const handlePurchaseDraft = () => {
    if (!supplier || !purchaser) {
      alert("请选择供应商和采购员");
      return;
    }
    if (purchaseItems.length === 0) {
      alert("请添加配件到采购单");
      return;
    }
    alert("采购草稿已保存");
  };

  // 采购在途
  const handlePurchaseInTransit = () => {
    if (!supplier || !purchaser) {
      alert("请选择供应商和采购员");
      return;
    }
    if (purchaseItems.length === 0) {
      alert("请添加配件到采购单");
      return;
    }
    alert("采购单已标记为在途");
  };

  // 采购入库
  const handlePurchaseReceive = () => {
    if (!supplier || !purchaser) {
      alert("请选择供应商和采购员");
      return;
    }
    if (purchaseItems.length === 0) {
      alert("请添加配件到采购单");
      return;
    }
    alert("采购单已入库");
  };

  // 导入销售单
  const handleImportSaleOrder = () => {
    if (!saleOrderNo) {
      alert("请输入销售单号");
      return;
    }
    alert(`已导入销售单 ${saleOrderNo} 的配件`);
  };

  // 更多查询
  const handleMoreQuery = (filters: QueryFilters) => {
    console.log("执行更多查询:", filters);
    // TODO: 根据筛选条件查询配件
  };

  // 计算总金额
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalDiscount = orderItems.reduce(
    (sum, item) => sum + item.discount,
    0,
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          销售/报价开单
        </h2>
      </div>

      {/* Tab 切换 */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "sales"
                ? "text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            销售开单
            {activeTab === "sales" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("purchase")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "purchase"
                ? "text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            采购入库
            {activeTab === "purchase" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "sales" ? (
          // ============ 销售开单 Tab ============
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
              {/* 配件搜索区 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                {/* 搜索工具栏 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="名称/规格/编码/OE码/车型/品牌/图号"
                      value={searchKeyword}
                      onChange={(e) =>
                        setSearchKeyword(e.target.value)
                      }
                      className="w-full pl-3 pr-16 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => setPartSettingsOpen(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                      新增
                    </button>
                  </div>
                  <FauxSelect
                    required
                    placeholder="请选择"
                    containerClassName="w-[120px]"
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="">请选择</option>
                    <option value="option1">选项1</option>
                  </FauxSelect>
                  <FauxSelect
                    required
                    placeholder="请选择适用车型"
                    containerClassName="w-[150px]"
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="">请选择适用车型</option>
                    <option value="bmw">宝马</option>
                    <option value="benz">奔驰</option>
                  </FauxSelect>
                  <FauxSelect
                    required
                    placeholder="请选择默认仓库"
                    className="sales-faux-select px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="">请选择默认仓库</option>
                    <option value="main">主仓库</option>
                    <option value="sub">副仓库</option>
                  </FauxSelect>
                  <input
                    type="text"
                    placeholder="请输入VIN码"
                    value={vinCode}
                    onChange={(e) => setVinCode(e.target.value)}
                    className="w-[180px] px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                  />
                  <button
                    disabled={!vinCode}
                    className="px-3 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    解析
                  </button>
                  <button
                    onClick={() => setMoreQueriesOpen(true)}
                    className="px-3 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    更多查询
                  </button>
                </div>

                {/* 配件列表 */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            配件名称
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            编码
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            规格
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            图号
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            品类
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            售价
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            成本价
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            库存
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            产地
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            供应商
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            仓库
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((part) => (
                          <tr
                            key={part.id}
                            className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                            onClick={() =>
                              handleAddPartToOrder(part)
                            }
                          >
                            <td className="px-4 py-3 text-sm text-blue-600 hover:underline whitespace-nowrap">
                              {part.partName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.partCode}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.spec}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.drawingNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.category}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.sellPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.costPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.stock}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.origin}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.supplier}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.warehouse}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 分页 */}
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-gray-600">
                    共 {parts.length} 条数据
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      上一页
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">
                      1
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      2
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      下一页
                    </button>
                  </div>
                </div>
              </div>

              {/* 订单信息区 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="space-y-3">
                  {/* 第一行 */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      选择客户
                    </label>
                    <input
                      type="text"
                      placeholder="请选择客户"
                      value={selectedCustomer}
                      onChange={(e) => {
                        setSelectedCustomer(e.target.value);
                        setCustomerError(false);
                      }}
                      required
                      className={`sales-faux-select col-span-2 px-3 py-2 border ${
                        customerError
                          ? "border-red-400"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400`}
                    />

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      销售员
                    </label>
                    <FauxSelect
                      value={salesPerson}
                      onChange={(e) =>
                        setSalesPerson(e.target.value)
                      }
                      required
                      placeholder="请选择销售员"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择销售员</option>
                      <option value="张三">张三</option>
                      <option value="李四">李四</option>
                    </FauxSelect>

                    <label className="col-span-1 text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      价格级别
                    </label>
                    <FauxSelect
                      value={priceLevel}
                      onChange={(e) =>
                        setPriceLevel(e.target.value)
                      }
                      required
                      placeholder="请选择价格级别"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择价格级别</option>
                      <option value="零售价">零售价</option>
                      <option value="批发价">批发价</option>
                      <option value="VIP价">VIP价</option>
                    </FauxSelect>

                    <label className="col-span-1 text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      配送方式
                    </label>
                    <FauxSelect
                      value={deliveryMethod}
                      onChange={(e) =>
                        setDeliveryMethod(e.target.value)
                      }
                      required
                      placeholder="请选择配送方式"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择配送方式</option>
                      <option value="自配送">自配送</option>
                      <option value="快递">快递</option>
                      <option value="自提">自提</option>
                    </FauxSelect>
                  </div>

                  {/* 第二行 */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      配送车辆
                    </label>
                    <FauxSelect
                      value={deliveryVehicle}
                      onChange={(e) =>
                        setDeliveryVehicle(e.target.value)
                      }
                      required
                      placeholder="请选择车辆"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择车辆</option>
                      <option value="粤A12345">粤A12345</option>
                      <option value="粤B67890">粤B67890</option>
                    </FauxSelect>

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      选择地区
                    </label>
                    <FauxSelect
                      value={areaSelect}
                      onChange={(e) =>
                        setAreaSelect(e.target.value)
                      }
                      required
                      placeholder="请选择地区"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择地区</option>
                      <option value="广东">广东</option>
                      <option value="湖南">湖南</option>
                    </FauxSelect>

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      详细地址
                    </label>
                    <input
                      type="text"
                      placeholder="请输入详细地址"
                      value={address}
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      联系人
                    </label>
                    <input
                      type="text"
                      placeholder="请输入联系人"
                      value={contactPerson}
                      onChange={(e) =>
                        setContactPerson(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />
                  </div>

                  {/* 第三行 */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      联系电话
                    </label>
                    <div className="col-span-2 relative">
                      <input
                        type="text"
                        placeholder="请输入联系电话"
                        value={contactPhone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 11) {
                            setContactPhone(value);
                          }
                        }}
                        className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        {contactPhone.length}/11
                      </span>
                    </div>

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      备注
                    </label>
                    <input
                      type="text"
                      placeholder="请输入备注"
                      value={remark}
                      onChange={(e) =>
                        setRemark(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />

                    <label className="col-span-1 text-sm font-medium text-gray-700 whitespace-nowrap">
                      店长提醒
                    </label>
                    <div className="col-span-2 flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="按住期期提醒的提醒将弹出"
                        value={managerReminder}
                        onChange={(e) =>
                          setManagerReminder(e.target.value)
                        }
                        className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                      />
                      <button
                        onClick={() =>
                          setShowManagerReminderDialog(true)
                        }
                        className="shrink-0 px-3 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 whitespace-nowrap"
                      >
                        配置
                      </button>
                    </div>

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      内部说明
                    </label>
                    <input
                      type="text"
                      placeholder="请输入内部说明"
                      value={internalNote}
                      onChange={(e) =>
                        setInternalNote(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* 订单明细区 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          配件名称
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          配件规格
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          配件编码
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          库存
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          成本
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          上次售价
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          数量
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          售价
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          优惠
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          金额
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          类型
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          产地
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          供应商
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          仓库
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          备注
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {orderItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={16}
                            className="px-4 py-8 text-center text-sm text-gray-400"
                          >
                            暂无数据
                          </td>
                        </tr>
                      ) : (
                        orderItems.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                          >
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.partName}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.partSpec}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.partCode}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.stock}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.cost.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.lastSellPrice.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateOrderItem(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value) ||
                                      1,
                                  )
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.sellPrice}
                                onChange={(e) =>
                                  handleUpdateOrderItem(
                                    item.id,
                                    "sellPrice",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.discount}
                                onChange={(e) =>
                                  handleUpdateOrderItem(
                                    item.id,
                                    "discount",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 font-medium whitespace-nowrap">
                              {item.amount.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.type}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.origin}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.supplier}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.warehouse}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="text"
                                value={item.rowRemark}
                                onChange={(e) =>
                                  handleUpdateOrderItem(
                                    item.id,
                                    "rowRemark",
                                    e.target.value,
                                  )
                                }
                                placeholder="请输入"
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  handleDeleteOrderItem(item.id)
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <DeleteIcon
                                  sx={{ fontSize: 18 }}
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 底部操作区 - 固定在底部 */}
            <div className="shrink-0 flex items-center justify-between bg-gray-50 border-t border-gray-200 px-4 py-3">
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="text-gray-600">优惠：</span>
                  <span className="font-semibold text-gray-800">
                    ¥{totalDiscount.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">
                    总金额：
                  </span>
                  <span className="font-semibold text-red-600 text-lg">
                    ¥ {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSales}
                  className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5"
                >
                  <RefreshIcon sx={{ fontSize: 16 }} />
                  重置 (F2)
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  报价/草稿 (F4)
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow"
                >
                  结算/打包/发货 (F8)
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ============ 采购入库 Tab ============
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
              {/* 配件搜索区 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                {/* 搜索工具栏 */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="名称/规格/编码/图号"
                      value={searchKeyword}
                      onChange={(e) =>
                        setSearchKeyword(e.target.value)
                      }
                      className="w-full pl-3 pr-16 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => setPartSettingsOpen(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                      新增
                    </button>
                  </div>
                  <FauxSelect
                    required
                    placeholder="请选择"
                    className="sales-faux-select px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="">请选择</option>
                    <option value="option1">选项1</option>
                  </FauxSelect>
                  <FauxSelect
                    required
                    placeholder="请选择适用车型"
                    className="sales-faux-select px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="">请选择适用车型</option>
                    <option value="bmw">宝马</option>
                    <option value="benz">奔驰</option>
                  </FauxSelect>
                  <FauxSelect
                    required
                    placeholder="请选择默认入库"
                    className="sales-faux-select px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="">请选择默认入库</option>
                    <option value="main">主仓库</option>
                    <option value="sub">副仓库</option>
                  </FauxSelect>
                </div>

                {/* 配件列表 */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            配件名称
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            配件编码
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            配件规格
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            图号
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            品类
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            售价
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            库存数量
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            成本价
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            上次进价
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            产地
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            默认仓库
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((part) => (
                          <tr
                            key={part.id}
                            className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                            onClick={() =>
                              handleAddPartToPurchase(part)
                            }
                          >
                            <td className="px-4 py-3 text-sm text-blue-600 hover:underline whitespace-nowrap">
                              {part.partName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.partCode}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.spec}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.drawingNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.category}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.sellPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.stock}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.costPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.lastPurchasePrice?.toFixed(
                                2,
                              ) || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.origin}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                              {part.warehouse}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 分页 */}
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-gray-600">
                    共 {parts.length} 条数据
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      上一页
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">
                      1
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      2
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      下一页
                    </button>
                  </div>
                </div>
              </div>

              {/* 采购信息区 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="space-y-3">
                  {/* 第一行 */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      销售单号
                    </label>
                    <div className="col-span-2 relative">
                      <input
                        type="text"
                        placeholder="请输入入销售单号"
                        value={saleOrderNo}
                        onChange={(e) =>
                          setSaleOrderNo(e.target.value)
                        }
                        className="w-full pl-3 pr-14 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                      />
                      <button
                        onClick={handleImportSaleOrder}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        导入
                      </button>
                    </div>

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      供应商
                    </label>
                    <FauxSelect
                      value={supplier}
                      onChange={(e) =>
                        setSupplier(e.target.value)
                      }
                      required
                      placeholder="请选择供应商"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择供应商</option>
                      <option value="博世">博世</option>
                      <option value="曼牌">曼牌</option>
                    </FauxSelect>

                    <label className="col-span-1 text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span>
                      采购员
                    </label>
                    <FauxSelect
                      value={purchaser}
                      onChange={(e) =>
                        setPurchaser(e.target.value)
                      }
                      required
                      placeholder="请选择采购员"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择采购员</option>
                      <option value="王娟">王娟</option>
                      <option value="虎宝">虎宝</option>
                    </FauxSelect>

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      仓库
                    </label>
                    <FauxSelect
                      value={purchaseWarehouse}
                      onChange={(e) =>
                        setPurchaseWarehouse(e.target.value)
                      }
                      required
                      placeholder="请选择仓库"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择仓库</option>
                      <option value="主仓库">主仓库</option>
                      <option value="副仓库">副仓库</option>
                    </FauxSelect>
                  </div>

                  {/* 第二行 */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      备注
                    </label>
                    <input
                      type="text"
                      placeholder="请输入备注"
                      value={purchaseRemark}
                      onChange={(e) =>
                        setPurchaseRemark(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      现款金额
                    </label>
                    <input
                      type="text"
                      placeholder="现款实付金额"
                      value={cashAmount}
                      onChange={(e) =>
                        setCashAmount(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      支付方式
                    </label>
                    <FauxSelect
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      required
                      placeholder="请选择支付方式"
                      className="sales-faux-select col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">请选择支付方式</option>
                      <option value="现金">现金</option>
                      <option value="转账">转账</option>
                      <option value="支付宝">支付宝</option>
                      <option value="微信">微信</option>
                    </FauxSelect>

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      预付款
                    </label>
                    <input
                      type="text"
                      placeholder="预付款数组合金额"
                      value={prepayment}
                      onChange={(e) =>
                        setPrepayment(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />
                  </div>

                  {/* 第三行 */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      挂帐金额
                    </label>
                    <input
                      type="text"
                      placeholder="挂帐金额"
                      value={creditAmount}
                      onChange={(e) =>
                        setCreditAmount(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />

                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      运费
                    </label>
                    <input
                      type="text"
                      placeholder="请输入运费"
                      value={freight}
                      onChange={(e) =>
                        setFreight(e.target.value)
                      }
                      className="col-span-2 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* 采购明细区 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          配件名称
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          配件规格
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          配件编码
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          产地
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          上次进价
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          数量
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          <span className="text-red-500">
                            *
                          </span>
                          本次进价
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          包装费
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          合计
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          赠品
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          备注
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          仓库
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {purchaseItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={13}
                            className="px-4 py-8 text-center text-sm text-gray-400"
                          >
                            暂无数据
                          </td>
                        </tr>
                      ) : (
                        purchaseItems.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                          >
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.partName}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.partSpec}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.partCode}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.origin}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.lastPurchasePrice.toFixed(
                                2,
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdatePurchaseItem(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value) ||
                                      1,
                                  )
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.purchasePrice}
                                onChange={(e) =>
                                  handleUpdatePurchaseItem(
                                    item.id,
                                    "purchasePrice",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.packingFee}
                                onChange={(e) =>
                                  handleUpdatePurchaseItem(
                                    item.id,
                                    "packingFee",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 font-medium whitespace-nowrap">
                              {item.total.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={item.gift}
                                onChange={(e) =>
                                  handleUpdatePurchaseItem(
                                    item.id,
                                    "gift",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="text"
                                value={item.rowRemark}
                                onChange={(e) =>
                                  handleUpdatePurchaseItem(
                                    item.id,
                                    "rowRemark",
                                    e.target.value,
                                  )
                                }
                                placeholder="请输入"
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                              {item.warehouse}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  handleDeletePurchaseItem(
                                    item.id,
                                  )
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <DeleteIcon
                                  sx={{ fontSize: 18 }}
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 底部操作区 - 固定在底部 */}
            <div className="shrink-0 flex items-center justify-between bg-gray-50 border-t border-gray-200 px-4 py-3">
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="text-gray-600">
                    项目数量：
                  </span>
                  <span className="font-semibold text-gray-800">
                    {purchaseItems.length}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">
                    采购数量：
                  </span>
                  <span className="font-semibold text-gray-800">
                    {purchaseItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    )}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">总价：</span>
                  <span className="font-semibold text-gray-800">
                    ¥
                    {purchaseItems
                      .reduce(
                        (sum, item) =>
                          sum +
                          item.quantity * item.purchasePrice,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">
                    采购总价(含包装费)：
                  </span>
                  <span className="font-semibold text-red-600 text-lg">
                    ¥
                    {purchaseItems
                      .reduce(
                        (sum, item) => sum + item.total,
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePurchaseDraft}
                  className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  草稿
                </button>
                <button
                  onClick={handlePurchaseInTransit}
                  className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  在途
                </button>
                <button
                  onClick={handleResetPurchase}
                  className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  重置
                </button>
                <button
                  onClick={handlePurchaseReceive}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
                >
                  入库
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 店长提醒维护弹框 */}
      {showManagerReminderDialog && (
        <ManagerReminderDialog
          onClose={() => setShowManagerReminderDialog(false)}
        />
      )}

      {/* 更多查询弹框 */}
      <MoreQueriesModal
        open={moreQueriesOpen}
        onClose={() => setMoreQueriesOpen(false)}
        onQuery={handleMoreQuery}
      />

      {/* 配件设置弹框 */}
      <PartSettingsDialog
        open={partSettingsOpen}
        onClose={() => setPartSettingsOpen(false)}
        onSave={(data) => {
          console.log("保存配件设置:", data);
          // TODO: 实际保存逻辑
        }}
      />
    </div>
  );
}
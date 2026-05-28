import { useState } from "react";
import {
  Add as AddIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Remove as MinusIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";
import { CustomerDataDialog, CustomerFormData } from "./CustomerDataDialog";

interface Customer {
  id: string;
  customerName: string;
  gender: string;
  phone: string;
  firstConsumeTime: string;
  lastConsumeTime: string;
  inactiveDays: number;
  totalConsumeCount: number;
  totalConsumeAmount: number;
  totalDiscountAmount: number;
  initialDebt: number;
  totalDebtAmount: number;
  creditLimit: number;
  paymentCycle: string;
  accountManager: string;
  remark: string;
  tags: string[];
  createTime: string;
  tradeCategory: string;
  settlementMethod: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    customerName: "吴辉标龙鼎汽修",
    gender: "男",
    phone: "13888818596",
    firstConsumeTime: "2026-05-19 15:48:31",
    lastConsumeTime: "2026-05-19 15:48:31",
    inactiveDays: 6,
    totalConsumeCount: 1,
    totalConsumeAmount: 0,
    totalDiscountAmount: 0,
    initialDebt: 0,
    totalDebtAmount: 0,
    creditLimit: 0,
    paymentCycle: "现结",
    accountManager: "黄伟霆",
    remark: "",
    tags: ["VIP客户"],
    createTime: "2026-05-19 15:48:31",
    tradeCategory: "客户",
    settlementMethod: "现结",
  },
  {
    id: "2",
    customerName: "宣城双河乡洪众汽修",
    gender: "男",
    phone: "13769522893",
    firstConsumeTime: "",
    lastConsumeTime: "",
    inactiveDays: 0,
    totalConsumeCount: 0,
    totalConsumeAmount: 0,
    totalDiscountAmount: 0,
    initialDebt: 0,
    totalDebtAmount: 0,
    creditLimit: 5000,
    paymentCycle: "月结",
    accountManager: "李明",
    remark: "老客户",
    tags: [],
    createTime: "2026-05-18 10:22:15",
    tradeCategory: "客户",
    settlementMethod: "月结",
  },
  {
    id: "3",
    customerName: "广州天河速修汽车服务",
    gender: "男",
    phone: "18920356712",
    firstConsumeTime: "2026-04-10 09:30:00",
    lastConsumeTime: "2026-05-20 14:20:00",
    inactiveDays: 5,
    totalConsumeCount: 8,
    totalConsumeAmount: 12800,
    totalDiscountAmount: 320,
    initialDebt: 0,
    totalDebtAmount: 1500,
    creditLimit: 10000,
    paymentCycle: "月结",
    accountManager: "黄伟霆",
    remark: "大客户，按时结款",
    tags: ["优质客户"],
    createTime: "2026-04-01 08:00:00",
    tradeCategory: "客户",
    settlementMethod: "月结",
  },
  {
    id: "4",
    customerName: "深圳南山精修汽车",
    gender: "女",
    phone: "13512345678",
    firstConsumeTime: "2026-03-15 11:00:00",
    lastConsumeTime: "2026-05-10 16:45:00",
    inactiveDays: 15,
    totalConsumeCount: 12,
    totalConsumeAmount: 25600,
    totalDiscountAmount: 860,
    initialDebt: 500,
    totalDebtAmount: 2800,
    creditLimit: 20000,
    paymentCycle: "季结",
    accountManager: "王芳",
    remark: "",
    tags: ["VIP客户", "优质客户"],
    createTime: "2026-03-10 09:15:00",
    tradeCategory: "即客即供",
    settlementMethod: "季结",
  },
];

const ALL_TAGS = ["VIP客户", "优质客户", "新客户", "潜力客户", "重点维护", "欠款客户"];

type DialogType = "addEdit" | "tag" | "reconcile" | "repayment" | "documents" | "delete" | "employee" | null;

interface RepaymentRecord {
  id: string;
  time: string;
  amount: number;
  status: string;
  remark: string;
}

interface EmployeeAccount {
  id: string;
  phone: string;
  name: string;
  accountName: string;
  isMain: boolean;
  status: string;
  hasAdmin: boolean;
  source: string;
  createTime: string;
}

export function CustomerData() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterTradeCategory, setFilterTradeCategory] = useState("");
  const [filterSettlement, setFilterSettlement] = useState("");
  const [filterDeal, setFilterDeal] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editData, setEditData] = useState<Partial<CustomerFormData> | null>(null);

  // 打标 state
  const [availableTags, setAvailableTags] = useState<string[]>(ALL_TAGS);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 期初还款 state
  const [repayAmount, setRepayAmount] = useState("0");
  const [repayRemark, setRepayRemark] = useState("");
  const [repayRecords] = useState<RepaymentRecord[]>([
    { id: "1", time: "2026-05-10 10:30:00", amount: 500, status: "已还款", remark: "部分还款" },
    { id: "2", time: "2026-04-15 14:20:00", amount: 1000, status: "已还款", remark: "" },
  ]);

  // 单据 state
  const [docTab, setDocTab] = useState<"sales" | "debt" | "prepay">("sales");
  const [docSearch, setDocSearch] = useState("");

  // 员工账号 state
  const [showCreateEmployee, setShowCreateEmployee] = useState(false);
  const [empPhone, setEmpPhone] = useState("");
  const [empName, setEmpName] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  const [employeeAccounts] = useState<EmployeeAccount[]>([
    {
      id: "1",
      phone: "13888818596",
      name: "吴辉标",
      accountName: "whb001",
      isMain: true,
      status: "启用",
      hasAdmin: true,
      source: "后台创建",
      createTime: "2026-05-19 15:48:31",
    },
  ]);

  // 分页
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("1");

  const handleSearch = () => setCurrentPage(1);

  const handleReset = () => {
    setSearchKeyword("");
    setFilterGender("");
    setFilterTag("");
    setFilterTradeCategory("");
    setFilterSettlement("");
    setFilterDeal("");
    setMinAmount("");
    setMaxAmount("");
    setFilterLocation("");
    setCurrentPage(1);
  };

  const openTagDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    const tagsInUse = customer.tags;
    setSelectedTags([...tagsInUse]);
    setAvailableTags(ALL_TAGS.filter((t) => !tagsInUse.includes(t)));
    setOpenDialog("tag");
  };

  const openAddDialog = () => {
    setEditData(null);
    setOpenDialog("addEdit");
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditData({
      customerName: customer.customerName,
      phone: customer.phone,
      gender: customer.gender,
      accountManager: customer.accountManager,
      tradeCategory: customer.tradeCategory,
      settlementMethod: customer.settlementMethod,
      paymentCycle: customer.paymentCycle,
      remark: customer.remark,
      creditLimit: String(customer.creditLimit),
      initialDebt: String(customer.initialDebt),
    });
    setOpenDialog("addEdit");
  };

  const handleSaveCustomer = (data: CustomerFormData) => {
    if (editData && selectedCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                customerName: data.customerName,
                phone: data.phone,
                gender: data.gender,
                accountManager: data.accountManager,
                tradeCategory: data.tradeCategory,
                settlementMethod: data.settlementMethod,
                paymentCycle: data.paymentCycle,
                remark: data.remark,
                creditLimit: Number(data.creditLimit) || 0,
                initialDebt: Number(data.initialDebt) || 0,
              }
            : c
        )
      );
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        customerName: data.customerName,
        gender: data.gender || "男",
        phone: data.phone,
        firstConsumeTime: "",
        lastConsumeTime: "",
        inactiveDays: 0,
        totalConsumeCount: 0,
        totalConsumeAmount: 0,
        totalDiscountAmount: 0,
        initialDebt: Number(data.initialDebt) || 0,
        totalDebtAmount: 0,
        creditLimit: Number(data.creditLimit) || 0,
        paymentCycle: data.paymentCycle,
        accountManager: data.accountManager,
        remark: data.remark,
        tags: [],
        createTime: new Date().toISOString().replace("T", " ").slice(0, 19),
        tradeCategory: data.tradeCategory || "客户",
        settlementMethod: data.settlementMethod,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }
    setOpenDialog(null);
  };

  const handleSaveTags = () => {
    if (!selectedCustomer) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === selectedCustomer.id ? { ...c, tags: [...selectedTags] } : c
      )
    );
    setOpenDialog(null);
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
    setOpenDialog(null);
  };

  const totalConsumeCount = customers.reduce((s, c) => s + c.totalConsumeCount, 0);
  const totalConsumeAmount = customers.reduce((s, c) => s + c.totalConsumeAmount, 0);
  const totalDiscountAmount = customers.reduce((s, c) => s + c.totalDiscountAmount, 0);
  const totalInitialDebt = customers.reduce((s, c) => s + c.initialDebt, 0);
  const totalDebtAmount = customers.reduce((s, c) => s + c.totalDebtAmount, 0);

  const totalPages = Math.max(1, Math.ceil(customers.length / pageSize));
  const pagedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Sale orders mock data
  const salesOrders = [
    { id: "1", salesTime: "2026-05-19 15:48:31", orderNo: "XS2026051900001", source: "前台", payable: 1200, paid: 1200, debt: 0, status: "未挂账", remark: "" },
    { id: "2", salesTime: "2026-04-10 09:30:00", orderNo: "XS2026041000003", source: "前台", payable: 580, paid: 0, debt: 580, status: "已挂账", remark: "月底结款" },
  ];
  const debtOrders = [
    { id: "1", orderNo: "XS2026041000003", settleTime: "2026-04-10 09:30:00", debtAmount: 580, paid: 0, unpaid: 580 },
  ];
  const prepayRecords = [
    { id: "1", type: "充值", createTime: "2026-03-01 10:00:00", orderNo: "CZ2026030100001", source: "前台", deductAmount: 0, payable: 500, flowTime: "2026-03-01 10:00:00" },
    { id: "2", type: "销售", createTime: "2026-05-19 15:48:31", orderNo: "XS2026051900001", source: "前台", deductAmount: 200, payable: 1200, flowTime: "2026-05-19 15:48:31" },
  ];

  const inputCls =
    "px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-white";
  const selectCls =
    "px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-600 bg-white";

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 页面标题 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">客户资料</h2>
      </div>

      {/* 搜索筛选区 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-x-3 gap-y-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">客户查询</span>
            <input
              type="text"
              placeholder="名称/电话/备注"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className={`flex-1 min-w-0 ${inputCls}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">性别</span>
            <FauxSelect value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className={`flex-1 min-w-0 ${selectCls}`}>
              <option value="">请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">标签</span>
            <FauxSelect value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className={`flex-1 min-w-0 ${selectCls}`}>
              <option value="">请选择标签</option>
              {ALL_TAGS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">往来类别</span>
            <FauxSelect value={filterTradeCategory} onChange={(e) => setFilterTradeCategory(e.target.value)} className={`flex-1 min-w-0 ${selectCls}`}>
              <option value="">请选择</option>
              <option value="客户">客户</option>
              <option value="供应商">供应商</option>
              <option value="即客即供">即客即供</option>
            </FauxSelect>
          </div>
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-4 gap-x-3 gap-y-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">结算方式</span>
            <FauxSelect value={filterSettlement} onChange={(e) => setFilterSettlement(e.target.value)} className={`flex-1 min-w-0 ${selectCls}`}>
              <option value="">请选择</option>
              <option value="现结">现结</option>
              <option value="月结">月结</option>
              <option value="季结">季结</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">是否成交</span>
            <FauxSelect value={filterDeal} onChange={(e) => setFilterDeal(e.target.value)} className={`flex-1 min-w-0 ${selectCls}`}>
              <option value="">请选择</option>
              <option value="有成交">有成交</option>
              <option value="无成交">无成交</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">消费金额</span>
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <input
                type="number"
                placeholder="最小"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-0 flex-1 px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-white"
              />
              <span className="text-gray-400 shrink-0">~</span>
              <input
                type="number"
                placeholder="最大"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-0 flex-1 px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">所在地</span>
            <input
              type="text"
              placeholder="请选择省市区"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className={`flex-1 min-w-0 ${inputCls}`}
            />
          </div>
        </div>
        {/* Buttons row */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
          >
            <SearchIcon sx={{ fontSize: 16 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            重置
          </button>
        </div>
      </div>

      {/* 操作按钮区 */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={openAddDialog}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            新增
          </button>
          <div className="w-px h-5 bg-gray-300" />
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ExportIcon sx={{ fontSize: 16 }} />
            导出
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ExportIcon sx={{ fontSize: 16 }} />
            模版下载
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ImportIcon sx={{ fontSize: 16 }} />
            导入
          </button>
        </div>
      </div>

      {/* 数据列表区 */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">序号</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">性别</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">联系电话</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">首次消费时间</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">最近消费时间</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">未消费天数</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">总消费次数</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">总消费金额</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">总优惠金额</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">期初欠款</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">总欠款金额</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">信用额度</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">结款周期</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户经理</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">备注</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">标签</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gray-50">操作</th>
            </tr>
          </thead>
          <tbody>
            {pagedCustomers.map((customer, index) => (
              <tr
                key={customer.id}
                className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
              >
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer hover:underline">
                    {customer.customerName}
                  </span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center justify-center px-2 py-0.5 text-xs rounded ${
                      customer.gender === "女"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {customer.gender}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{customer.phone}</td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                  {customer.firstConsumeTime || "0"}
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                  {customer.lastConsumeTime || "0"}
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{customer.inactiveDays}</td>
                <td className="px-3 py-2.5 text-sm text-blue-600 whitespace-nowrap">{customer.totalConsumeCount}</td>
                <td className="px-3 py-2.5 text-sm text-gray-900 whitespace-nowrap">{customer.totalConsumeAmount}</td>
                <td className="px-3 py-2.5 text-sm text-gray-900 whitespace-nowrap">{customer.totalDiscountAmount}</td>
                <td className="px-3 py-2.5 text-sm text-gray-900 whitespace-nowrap">{customer.initialDebt}</td>
                <td className="px-3 py-2.5 text-sm text-gray-900 whitespace-nowrap">{customer.totalDebtAmount}</td>
                <td className="px-3 py-2.5 text-sm text-gray-900 whitespace-nowrap">{customer.creditLimit}</td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{customer.paymentCycle}</td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{customer.accountManager}</td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap max-w-[120px] truncate">
                  {customer.remark || "-"}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.length > 0
                      ? customer.tags.map((tag) => (
                          <span key={tag} className="inline-flex px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700">
                            {tag}
                          </span>
                        ))
                      : <span className="text-gray-400 text-sm">-</span>}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{customer.createTime}</td>
                <td className="px-3 py-2.5 whitespace-nowrap sticky right-0 bg-white border-l border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => { setSelectedCustomer(customer); setOpenDialog("employee"); }}
                      
                      className="text-blue-600 hover:text-blue-800 hover:underline text-[14px]"
                    >
                      员工账号
                    </button>
                    <button
                      onClick={() => openEditDialog(customer)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-[14px]"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => openTagDialog(customer)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-[14px]"
                    >
                      打标
                    </button>
                    <button
                      onClick={() => { setSelectedCustomer(customer); setOpenDialog("reconcile"); }}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-[14px]"
                    >
                      对账
                    </button>
                    <button
                      onClick={() => { setSelectedCustomer(customer); setRepayAmount("0"); setRepayRemark(""); setOpenDialog("repayment"); }}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-[14px]"
                    >
                      期初还款
                    </button>
                    <button
                      onClick={() => { setSelectedCustomer(customer); setDocTab("sales"); setDocSearch(""); setOpenDialog("documents"); }}
                      className="text-gray-600 hover:text-gray-800 hover:underline text-[14px]"
                    >
                      单据
                    </button>
                    <button
                      onClick={() => { setSelectedCustomer(customer); setOpenDialog("delete"); }}
                      className="text-red-500 hover:text-red-700 hover:underline"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 合计行 + 分页 */}
      <div className="shrink-0 border-t border-gray-200">
        {/* 合计行 */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <span className="font-semibold text-gray-700">合计</span>
            <span>总消费次数：<span className="font-semibold text-gray-800">{totalConsumeCount}</span></span>
            <span>总消费金额：<span className="font-semibold text-gray-800">{totalConsumeAmount.toFixed(2)}</span></span>
            <span>总优惠金额：<span className="font-semibold text-gray-800">{totalDiscountAmount.toFixed(2)}</span></span>
            <span>期初欠款：<span className="font-semibold text-gray-800">{totalInitialDebt.toFixed(2)}</span></span>
            <span>总欠款金额：<span className="font-semibold text-gray-800">{totalDebtAmount.toFixed(2)}</span></span>
          </div>
        </div>
        {/* 分页 */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{customers.length}</span> 条数据
          </div>
          <div className="flex items-center gap-2">
            <FauxSelect
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400"
            >
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
              <option value={100}>100条/页</option>
            </FauxSelect>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, i, arr) => (
                <span key={p}>
                  {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-400 px-1">...</span>}
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      currentPage === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              下一页
            </button>
            <span className="text-sm text-gray-600">前往</span>
            <input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const p = Math.min(totalPages, Math.max(1, Number(jumpPage)));
                  setCurrentPage(p);
                  setJumpPage(String(p));
                }
              }}
              className="w-14 px-2 py-1.5 text-center bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
            />
            <span className="text-sm text-gray-600">页</span>
          </div>
        </div>
      </div>

      {/* ========== 新增/编辑弹框 ========== */}
      <CustomerDataDialog
        open={openDialog === "addEdit"}
        onClose={() => setOpenDialog(null)}
        editData={editData}
        onSave={handleSaveCustomer}
      />

      {/* ========== 打标弹框 ========== */}
      {openDialog === "tag" && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 560, maxHeight: "80vh" }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">打标</h2>
              <button onClick={() => setOpenDialog(null)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <div className="flex gap-4 h-full">
                {/* 左侧可选标签 */}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-2 pb-2 border-b border-gray-200">打标名称</div>
                  <div className="space-y-1">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags((prev) => [...prev, tag]);
                          setAvailableTags((prev) => prev.filter((t) => t !== tag));
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                      >
                        {tag}
                      </button>
                    ))}
                    {availableTags.length === 0 && (
                      <p className="text-xs text-gray-400 py-2 text-center">暂无可选标签</p>
                    )}
                  </div>
                </div>
                {/* 分隔线 */}
                <div className="w-px bg-gray-200" />
                {/* 右侧已选标签 */}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-2 pb-2 border-b border-gray-200">已打标名称</div>
                  <div className="space-y-1">
                    {selectedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setAvailableTags((prev) => [...prev, tag]);
                          setSelectedTags((prev) => prev.filter((t) => t !== tag));
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                      >
                        {tag}
                      </button>
                    ))}
                    {selectedTags.length === 0 && (
                      <p className="text-xs text-gray-400 py-2 text-center">暂无已打标签</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <button onClick={() => setOpenDialog(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                取消
              </button>
              <button onClick={handleSaveTags} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 对账弹框 ========== */}
      {openDialog === "reconcile" && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 700, maxHeight: "85vh" }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">{selectedCustomer.customerName} - 往来对账</h2>
              <button onClick={() => setOpenDialog(null)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {/* 客户信息 */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {[
                      ["客户名称", selectedCustomer.customerName],
                      ["联系人", "--"],
                      ["联系电话", selectedCustomer.phone],
                      ["往来类别", selectedCustomer.tradeCategory],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center">
                        <span className="text-sm text-gray-500 w-24">{label}：</span>
                        <span className="text-sm text-gray-800 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">对账汇总</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">总销售金额</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedCustomer.totalConsumeAmount.toFixed(2)} 元</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">总欠款金额</span>
                      <span className="text-sm font-semibold text-red-600">{selectedCustomer.totalDebtAmount.toFixed(2)} 元</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">信用额度</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedCustomer.creditLimit.toFixed(2)} 元</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedCustomer.tradeCategory !== "即客即供" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  当前客户不是"即是客户又是供应商"
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end shrink-0">
              <button onClick={() => setOpenDialog(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 期初还款弹框 ========== */}
      {openDialog === "repayment" && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 700, maxHeight: "85vh" }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">期初还款</h2>
              <button onClick={() => setOpenDialog(null)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {/* 还款表单 */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    还款金额 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setRepayAmount((prev) => String(Math.max(0, Number(prev) - 1)))}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border-r border-gray-300"
                    >
                      <MinusIcon sx={{ fontSize: 16 }} />
                    </button>
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm text-center focus:outline-none placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => setRepayAmount((prev) => String(Number(prev) + 1))}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border-l border-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <input
                    type="text"
                    placeholder="请输入备注"
                    value={repayRemark}
                    onChange={(e) => setRepayRemark(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="mb-4">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
                  确认还款
                </button>
              </div>
              {/* 还款记录 */}
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-3">还款记录</div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        {["还款时间", "金额", "状态", "备注", "操作"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {repayRecords.map((rec) => (
                        <tr key={rec.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-2.5 text-sm text-gray-600">{rec.time}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-900">{rec.amount}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">{rec.status}</span>
                          </td>
                          <td className="px-4 py-2.5 text-sm text-gray-600">{rec.remark || "-"}</td>
                          <td className="px-4 py-2.5">
                            <button className="text-xs text-red-500 hover:text-red-700 hover:underline">删除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end shrink-0">
              <button onClick={() => setOpenDialog(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 单据弹框 ========== */}
      {openDialog === "documents" && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 1000, height: 600 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">{selectedCustomer.customerName} - 单据</h2>
              <button onClick={() => setOpenDialog(null)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
              <div className="flex gap-1">
                {(["sales", "debt", "prepay"] as const).map((tab) => {
                  const labels = { sales: "销售单据", debt: "欠款单据", prepay: "预存款流水" };
                  return (
                    <button
                      key={tab}
                      onClick={() => setDocTab(tab)}
                      className={`px-5 py-2.5 text-sm font-medium transition-all relative ${
                        docTab === tab ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {labels[tab]}
                      {docTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 overflow-auto flex flex-col">
              {docTab === "sales" && (
                <>
                  <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <div className="relative w-72">
                      <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="单号/VIN/电话/姓名"
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr className="border-b border-gray-200">
                          {["序号", "销售时间", "订单号", "来源", "应付", "实付", "挂账", "还款状态", "备注", "操作"].map((h) => (
                            <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {salesOrders.map((o, i) => (
                          <tr key={o.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                            <td className="px-4 py-2.5 text-sm text-gray-600">{i + 1}</td>
                            <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{o.salesTime}</td>
                            <td className="px-4 py-2.5 text-sm text-blue-600 whitespace-nowrap">{o.orderNo}</td>
                            <td className="px-4 py-2.5 text-sm text-gray-600">{o.source}</td>
                            <td className="px-4 py-2.5 text-sm text-gray-900">{o.payable}</td>
                            <td className="px-4 py-2.5 text-sm text-gray-900">{o.paid}</td>
                            <td className="px-4 py-2.5 text-sm text-red-600">{o.debt}</td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                o.status === "未挂账" ? "bg-gray-100 text-gray-700" :
                                o.status === "已挂账" ? "bg-yellow-100 text-yellow-700" :
                                "bg-green-100 text-green-700"
                              }`}>{o.status}</span>
                            </td>
                            <td className="px-4 py-2.5 text-sm text-gray-600">{o.remark || "-"}</td>
                            <td className="px-4 py-2.5">
                              <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline">查看</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {docTab === "debt" && (
                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="border-b border-gray-200">
                        {["序号", "单号", "结算时间", "挂账金额", "已还", "未还", "操作"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {debtOrders.map((o, i) => (
                        <tr key={o.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                          <td className="px-4 py-2.5 text-sm text-gray-600">{i + 1}</td>
                          <td className="px-4 py-2.5 text-sm text-blue-600 whitespace-nowrap">{o.orderNo}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{o.settleTime}</td>
                          <td className="px-4 py-2.5 text-sm text-red-600">{o.debtAmount}</td>
                          <td className="px-4 py-2.5 text-sm text-green-600">{o.paid}</td>
                          <td className="px-4 py-2.5 text-sm text-red-600">{o.unpaid}</td>
                          <td className="px-4 py-2.5">
                            <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline">还款</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {docTab === "prepay" && (
                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="border-b border-gray-200">
                        {["序号", "单据类型", "开单时间", "订单号", "来源", "抵扣金额", "应付", "流水时间", "操作"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {prepayRecords.map((r, i) => (
                        <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                          <td className="px-4 py-2.5 text-sm text-gray-600">{i + 1}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                              r.type === "充值" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            }`}>{r.type}</span>
                          </td>
                          <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{r.createTime}</td>
                          <td className="px-4 py-2.5 text-sm text-blue-600 whitespace-nowrap">{r.orderNo}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-600">{r.source}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-900">{r.deductAmount}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-900">{r.payable}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{r.flowTime}</td>
                          <td className="px-4 py-2.5">
                            <button className="text-xs text-blue-600 hover:text-blue-800 hover:underline">查看</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end shrink-0">
              <button onClick={() => setOpenDialog(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 删除确认弹框 ========== */}
      {openDialog === "delete" && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 420 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">删除确认</h2>
              <button onClick={() => setOpenDialog(null)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-lg font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">确认删除客户？</p>
                  <p className="text-sm text-gray-600">
                    您将删除客户 <span className="font-semibold text-gray-800">「{selectedCustomer.customerName}」</span>，此操作不可恢复，请谨慎操作。
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <button onClick={() => setOpenDialog(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                取消
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-sm"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 员工账号弹框 ========== */}
      {openDialog === "employee" && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 1000, height: 600 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">{selectedCustomer.customerName} - 员工账号管理</h2>
              <button onClick={() => setOpenDialog(null)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 bg-white shrink-0">
                <button
                  onClick={() => setShowCreateEmployee(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                  创建账号
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="border-b border-gray-200">
                      {["手机号", "姓名", "账号名称", "主账号", "状态", "管理", "来源", "创建时间", "操作"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employeeAccounts.map((acc) => (
                      <tr key={acc.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                        <td className="px-4 py-2.5 text-sm text-gray-600">{acc.phone}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-800">{acc.name}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{acc.accountName}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${acc.isMain ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                            {acc.isMain ? "是" : "否"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${acc.status === "启用" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {acc.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${acc.hasAdmin ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                            {acc.hasAdmin ? "管理员" : "普通"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{acc.source}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{acc.createTime}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2 text-xs">
                            <button className="text-blue-600 hover:text-blue-800 hover:underline">编辑</button>
                            <button className="text-red-500 hover:text-red-700 hover:underline">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end shrink-0">
              <button onClick={() => setOpenDialog(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 创建员工账号子弹框 ========== */}
      {showCreateEmployee && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 460 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">新增员工账号</h2>
              <button onClick={() => setShowCreateEmployee(false)} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    手机号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="请输入手机号"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    placeholder="请输入员工姓名"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">初始密码</label>
                  <input
                    type="password"
                    placeholder="请输入初始密码"
                    value={empPassword}
                    onChange={(e) => setEmpPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => { setShowCreateEmployee(false); setEmpPhone(""); setEmpName(""); setEmpPassword(""); }}
                className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                取消
              </button>
              <button
                onClick={() => { setShowCreateEmployee(false); setEmpPhone(""); setEmpName(""); setEmpPassword(""); }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

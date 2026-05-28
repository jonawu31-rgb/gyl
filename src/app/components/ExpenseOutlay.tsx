import { useState } from "react";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  Close as CloseIcon,
  Add as PlusIcon,
  Remove as MinusIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

const PAYMENT_METHODS = ["银行转账", "现金", "支票", "电汇", "网银"];
const ACCOUNTS_MAP: Record<string, string[]> = {
  "银行转账": ["工商银行账户", "建设银行账户", "招商银行账户"],
  "现金": ["现金账户"],
  "支票": ["支票账户"],
  "电汇": ["电汇账户", "外汇账户"],
  "网银": ["网银账户"],
};
const DEPARTMENTS = ["研发部", "销售部", "运营部", "财务部", "人事部", "市场部"];
const EMPLOYEES = ["张伟", "李娜", "王芳", "刘洋", "陈静", "黄伟霆", "赵磊", "孙佳"];
const EXPENSE_TYPES = ["水电费", "办公费", "差旅费", "招待费", "通讯费", "维修费", "运输费"];
const OUTLAY_TYPES = ["日常支出", "项目支出", "营销支出", "行政支出"];
const BILL_TYPES = ["增值税发票", "普通发票", "收据", "其他凭证"];
const CUSTOMERS = ["上海华力汽配", "广州粤通配件", "北京汽车城", "成都蜀道配件", "深圳速达汽配"];
const EXPENSE_PROJECTS = [
  { code: "ZC001", name: "办公用品费" },
  { code: "ZC002", name: "水电气费" },
  { code: "ZC003", name: "差旅交通费" },
  { code: "ZC004", name: "业务招待费" },
  { code: "ZC005", name: "通讯网络费" },
  { code: "ZC006", name: "设备维修费" },
  { code: "ZC007", name: "快递运输费" },
];
const SALESPEOPLE = ["张伟", "李娜", "王芳", "刘洋"];

type Status = "待提交" | "待审核" | "已审核" | "已拒绝";

interface DetailItem {
  id: number;
  projectCode: string;
  projectName: string;
  amount: number;
  billCount: number;
  remark: string;
  customer: string;
  invoiceNo: string;
  department: string;
  occurDate: string;
  salesperson: string;
  taxRate: number;
  images: string[];
}

interface OutlayRecord {
  id: number;
  billNo: string;
  date: string;
  paymentMethod: string;
  account: string;
  totalAmount: number;
  department: string;
  handler: string;
  status: Status;
  reviewTime: string;
  reviewer: string;
  details: DetailItem[];
  voucherNo: string;
  expenseType: string;
  outlayType: string;
  billType: string;
  remark: string;
}

const today = "2026-05-28";

function genBillNo(index: number) {
  return `ZC20260528${String(index).padStart(3, "0")}`;
}

const MOCK_DATA: OutlayRecord[] = [
  {
    id: 1, billNo: genBillNo(1), date: "2026-05-20", paymentMethod: "银行转账",
    account: "工商银行账户", totalAmount: 3500, department: "运营部", handler: "张伟",
    status: "已审核", reviewTime: "2026-05-21 10:30", reviewer: "黄伟霆",
    voucherNo: "PZ2026001", expenseType: "办公费", outlayType: "日常支出", billType: "增值税发票",
    remark: "5月办公用品采购",
    details: [
      { id: 1, projectCode: "ZC001", projectName: "办公用品费", amount: 2000, billCount: 2,
        remark: "", customer: "", invoiceNo: "INV001", department: "运营部",
        occurDate: "2026-05-20", salesperson: "张伟", taxRate: 13, images: [] },
      { id: 2, projectCode: "ZC002", projectName: "水电气费", amount: 1500, billCount: 1,
        remark: "", customer: "", invoiceNo: "INV002", department: "运营部",
        occurDate: "2026-05-20", salesperson: "", taxRate: 0, images: [] },
    ],
  },
  {
    id: 2, billNo: genBillNo(2), date: "2026-05-22", paymentMethod: "现金",
    account: "现金账户", totalAmount: 1200, department: "销售部", handler: "李娜",
    status: "待审核", reviewTime: "", reviewer: "",
    voucherNo: "", expenseType: "差旅费", outlayType: "项目支出", billType: "普通发票",
    remark: "客户拜访差旅报销",
    details: [
      { id: 1, projectCode: "ZC003", projectName: "差旅交通费", amount: 1200, billCount: 3,
        remark: "高铁+住宿", customer: "上海华力汽配", invoiceNo: "INV003", department: "销售部",
        occurDate: "2026-05-22", salesperson: "李娜", taxRate: 6, images: [] },
    ],
  },
  {
    id: 3, billNo: genBillNo(3), date: "2026-05-25", paymentMethod: "银行转账",
    account: "招商银行账户", totalAmount: 5800, department: "市场部", handler: "王芳",
    status: "待提交", reviewTime: "", reviewer: "",
    voucherNo: "PZ2026003", expenseType: "招待费", outlayType: "营销支出", billType: "增值税发票",
    remark: "客户招待",
    details: [
      { id: 1, projectCode: "ZC004", projectName: "业务招待费", amount: 5800, billCount: 1,
        remark: "", customer: "广州粤通配件", invoiceNo: "INV004", department: "市场部",
        occurDate: "2026-05-25", salesperson: "王芳", taxRate: 6, images: [] },
    ],
  },
  {
    id: 4, billNo: genBillNo(4), date: "2026-05-26", paymentMethod: "网银",
    account: "网银账户", totalAmount: 800, department: "财务部", handler: "刘洋",
    status: "已拒绝", reviewTime: "2026-05-27 09:00", reviewer: "黄伟霆",
    voucherNo: "", expenseType: "通讯费", outlayType: "行政支出", billType: "收据",
    remark: "",
    details: [
      { id: 1, projectCode: "ZC005", projectName: "通讯网络费", amount: 800, billCount: 2,
        remark: "", customer: "", invoiceNo: "", department: "财务部",
        occurDate: "2026-05-26", salesperson: "", taxRate: 0, images: [] },
    ],
  },
];

const STATUS_STYLES: Record<Status, string> = {
  "待提交": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "待审核": "bg-orange-100 text-orange-700 border border-orange-200",
  "已审核": "bg-blue-100 text-blue-700 border border-blue-200",
  "已拒绝": "bg-red-100 text-red-700 border border-red-200",
};

interface AddDetailDialogProps {
  onClose: () => void;
  onConfirm: (item: Omit<DetailItem, "id">) => void;
}

function AddDetailDialog({ onClose, onConfirm }: AddDetailDialogProps) {
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState(0);
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [billCount, setBillCount] = useState(0);
  const [department, setDepartment] = useState("");
  const [occurDate, setOccurDate] = useState(today);
  const [salesperson, setSalesperson] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [remark, setRemark] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const selectedProject = EXPENSE_PROJECTS.find(p => p.name === project);

  const handleConfirm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!project) newErrors.project = true;
    if (!department) newErrors.department = true;
    if (!occurDate) newErrors.occurDate = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onConfirm({
      projectCode: selectedProject?.code ?? "",
      projectName: project,
      amount,
      billCount,
      remark,
      customer,
      invoiceNo,
      department,
      occurDate,
      salesperson,
      taxRate,
      images: [],
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-[560px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">添加支出明细</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs text-gray-600 mb-1">项目 <span className="text-red-500">*</span></label>
              <FauxSelect value={project} onChange={e => { setProject(e.target.value); setErrors(v => ({ ...v, project: false })); }} placeholder="请选择费用项目" className={`w-full ${errors.project ? "border-red-400" : ""}`}>
                {EXPENSE_PROJECTS.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
              </FauxSelect>
              {errors.project && <p className="text-red-500 text-xs mt-0.5">请选择项目</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">金额 <span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setAmount(v => Math.max(0, parseFloat((v - 1).toFixed(2))))} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 border-r border-gray-200 transition-colors">
                  <MinusIcon sx={{ fontSize: 14 }} />
                </button>
                <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="flex-1 text-center text-sm py-1.5 focus:outline-none min-w-0" />
                <button onClick={() => setAmount(v => parseFloat((v + 1).toFixed(2)))} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 border-l border-gray-200 transition-colors">
                  <PlusIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">对象（客户）</label>
              <FauxSelect value={customer} onChange={e => setCustomer(e.target.value)} placeholder="请选择客户" className="w-full">
                {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
              </FauxSelect>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">发票号</label>
              <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="请输入发票号"
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">单据数量</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setBillCount(v => Math.max(0, v - 1))} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 border-r border-gray-200 transition-colors">
                  <MinusIcon sx={{ fontSize: 14 }} />
                </button>
                <input type="number" value={billCount} onChange={e => setBillCount(parseInt(e.target.value) || 0)}
                  className="flex-1 text-center text-sm py-1.5 focus:outline-none min-w-0" />
                <button onClick={() => setBillCount(v => v + 1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 border-l border-gray-200 transition-colors">
                  <PlusIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">部门 <span className="text-red-500">*</span></label>
              <FauxSelect value={department} onChange={e => { setDepartment(e.target.value); setErrors(v => ({ ...v, department: false })); }} placeholder="请选择部门" className={`w-full ${errors.department ? "border-red-400" : ""}`}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </FauxSelect>
              {errors.department && <p className="text-red-500 text-xs mt-0.5">请选择部门</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">发生日期 <span className="text-red-500">*</span></label>
              <input type="date" value={occurDate} onChange={e => setOccurDate(e.target.value)}
                className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all ${errors.occurDate ? "border-red-400" : "border-gray-200"}`} />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">业务员</label>
              <FauxSelect value={salesperson} onChange={e => setSalesperson(e.target.value)} placeholder="请选择业务员" className="w-full">
                {SALESPEOPLE.map(s => <option key={s} value={s}>{s}</option>)}
              </FauxSelect>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">税率（%）</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setTaxRate(v => Math.max(0, v - 1))} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 border-r border-gray-200 transition-colors">
                  <MinusIcon sx={{ fontSize: 14 }} />
                </button>
                <input type="number" value={taxRate} onChange={e => setTaxRate(parseInt(e.target.value) || 0)}
                  className="flex-1 text-center text-sm py-1.5 focus:outline-none min-w-0" />
                <button onClick={() => setTaxRate(v => v + 1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 border-l border-gray-200 transition-colors">
                  <PlusIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">备注</label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="请输入备注"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all resize-none placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">图片</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <UploadIcon sx={{ fontSize: 28 }} className="text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-400">点击或拖拽上传图片</p>
              <p className="text-xs text-gray-300 mt-0.5">最多10张，单张不超过5MB，支持jpg/png/bmp</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={handleConfirm} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

interface AddOutlayDialogProps {
  onClose: () => void;
  onSave: (record: Omit<OutlayRecord, "id" | "billNo">) => void;
  editRecord?: OutlayRecord | null;
}

function AddOutlayDialog({ onClose, onSave, editRecord }: AddOutlayDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState(editRecord?.paymentMethod ?? "");
  const [account, setAccount] = useState(editRecord?.account ?? "");
  const [voucherNo, setVoucherNo] = useState(editRecord?.voucherNo ?? "");
  const [expenseType, setExpenseType] = useState(editRecord?.expenseType ?? "");
  const [department, setDepartment] = useState(editRecord?.department ?? "");
  const [handler, setHandler] = useState(editRecord?.handler ?? "黄伟霆");
  const [outlayType, setOutlayType] = useState(editRecord?.outlayType ?? "");
  const [billType, setBillType] = useState(editRecord?.billType ?? "");
  const [remark, setRemark] = useState(editRecord?.remark ?? "");
  const [details, setDetails] = useState<DetailItem[]>(editRecord?.details ?? []);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const availableAccounts = paymentMethod ? (ACCOUNTS_MAP[paymentMethod] ?? []) : [];
  const totalAmount = details.reduce((sum, d) => sum + d.amount, 0);

  const handlePaymentMethodChange = (val: string) => {
    setPaymentMethod(val);
    setAccount("");
  };

  const handleAddDetail = (item: Omit<DetailItem, "id">) => {
    setDetails(prev => [...prev, { ...item, id: Date.now() }]);
    setShowDetailDialog(false);
  };

  const handleDeleteDetail = (id: number) => {
    setDetails(prev => prev.filter(d => d.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    if (!paymentMethod) newErrors.paymentMethod = true;
    if (!account) newErrors.account = true;
    if (!department) newErrors.department = true;
    if (!handler) newErrors.handler = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave({
      date: today, paymentMethod, account, totalAmount, department, handler,
      status: "待提交", reviewTime: "", reviewer: "",
      voucherNo, expenseType, outlayType, billType, remark, details,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">{editRecord ? "编辑费用支出单" : "新增费用支出单"}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3.5">
            <div>
              <label className="block text-xs text-gray-600 mb-1">结算方式 <span className="text-red-500">*</span></label>
              <FauxSelect value={paymentMethod} onChange={e => { handlePaymentMethodChange(e.target.value); setErrors(v => ({ ...v, paymentMethod: false })); }} placeholder="请选择结算方式" className={`w-full ${errors.paymentMethod ? "border-red-400" : ""}`}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </FauxSelect>
              {errors.paymentMethod && <p className="text-red-500 text-xs mt-0.5">请选择结算方式</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">结算账户 <span className="text-red-500">*</span></label>
              <FauxSelect value={account} onChange={e => { setAccount(e.target.value); setErrors(v => ({ ...v, account: false })); }} placeholder="请选择结算账户" className={`w-full ${errors.account ? "border-red-400" : ""}`}>
                {availableAccounts.map(a => <option key={a} value={a}>{a}</option>)}
              </FauxSelect>
              {errors.account && <p className="text-red-500 text-xs mt-0.5">请选择结算账户</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">凭证号</label>
              <input type="text" value={voucherNo} onChange={e => setVoucherNo(e.target.value)} placeholder="请输入凭证号"
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">费用类型</label>
              <FauxSelect value={expenseType} onChange={e => setExpenseType(e.target.value)} placeholder="请选择费用类型" className="w-full">
                {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </FauxSelect>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">总金额</label>
              <div className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                ¥{totalAmount.toFixed(2)}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">部门 <span className="text-red-500">*</span></label>
              <FauxSelect value={department} onChange={e => { setDepartment(e.target.value); setErrors(v => ({ ...v, department: false })); }} placeholder="请选择部门" className={`w-full ${errors.department ? "border-red-400" : ""}`}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </FauxSelect>
              {errors.department && <p className="text-red-500 text-xs mt-0.5">请选择部门</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">经手人 <span className="text-red-500">*</span></label>
              <FauxSelect value={handler} onChange={e => { setHandler(e.target.value); setErrors(v => ({ ...v, handler: false })); }} placeholder="请选择经手人" className={`w-full ${errors.handler ? "border-red-400" : ""}`}>
                {EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
              </FauxSelect>
              {errors.handler && <p className="text-red-500 text-xs mt-0.5">请选择经手人</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">支出类型</label>
              <FauxSelect value={outlayType} onChange={e => setOutlayType(e.target.value)} placeholder="请选择支出类型" className="w-full">
                {OUTLAY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </FauxSelect>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">单据类型</label>
              <FauxSelect value={billType} onChange={e => setBillType(e.target.value)} placeholder="请选择单据类型" className="w-full">
                {BILL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </FauxSelect>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">备注</label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="请输入备注"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all resize-none placeholder:text-gray-400" />
          </div>

          {/* Detail section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">支出明细</span>
              <button onClick={() => setShowDetailDialog(true)}
                className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1">
                <AddIcon sx={{ fontSize: 14 }} />添加明细
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-gray-600 font-medium w-10">项次</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">项目编码</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">费用项目</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">单据张数</th>
                    <th className="px-3 py-2 text-right text-gray-600 font-medium">金额</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">备注</th>
                    <th className="px-3 py-2 text-center text-gray-600 font-medium w-12">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {details.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-400">暂无明细，请点击"添加明细"</td></tr>
                  ) : (
                    details.map((d, idx) => (
                      <tr key={d.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-3 py-2 text-gray-600">{d.projectCode}</td>
                        <td className="px-3 py-2 text-gray-800">{d.projectName}</td>
                        <td className="px-3 py-2 text-gray-600">{d.billCount}</td>
                        <td className="px-3 py-2 text-right text-gray-800">¥{d.amount.toFixed(2)}</td>
                        <td className="px-3 py-2 text-gray-500">{d.remark || "-"}</td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => setDeleteConfirmId(d.id)} className="text-red-400 hover:text-red-600 transition-colors">
                            <DeleteIcon sx={{ fontSize: 14 }} />
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

        <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={handleSave} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">保存</button>
        </div>
      </div>

      {showDetailDialog && (
        <AddDetailDialog onClose={() => setShowDetailDialog(false)} onConfirm={handleAddDetail} />
      )}

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <p className="text-sm text-gray-700 mb-4">确认删除该明细吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={() => handleDeleteDetail(deleteConfirmId)} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ViewDialogProps {
  record: OutlayRecord;
  onClose: () => void;
}

function ViewDialog({ record, onClose }: ViewDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">查看费用支出单 — {record.billNo}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
            {[
              ["单号", record.billNo], ["日期", record.date], ["状态", ""],
              ["结算方式", record.paymentMethod], ["结算账户", record.account], ["凭证号", record.voucherNo || "-"],
              ["费用类型", record.expenseType || "-"], ["总金额", `¥${record.totalAmount.toFixed(2)}`], ["部门", record.department],
              ["经手人", record.handler], ["支出类型", record.outlayType || "-"], ["单据类型", record.billType || "-"],
              ["审核时间", record.reviewTime || "-"], ["审核人", record.reviewer || "-"], ["备注", record.remark || "-"],
            ].map(([label, val], i) => (
              <div key={i}>
                <span className="text-gray-500 text-xs">{label}</span>
                <div className="mt-0.5 text-gray-800">
                  {label === "状态" ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[record.status]}`}>{record.status}</span>
                  ) : val}
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">支出明细</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">项次</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">项目编码</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">费用项目</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">单据张数</th>
                    <th className="px-3 py-2 text-right text-gray-600 font-medium">金额</th>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">备注</th>
                  </tr>
                </thead>
                <tbody>
                  {record.details.map((d, idx) => (
                    <tr key={d.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-gray-600">{d.projectCode}</td>
                      <td className="px-3 py-2 text-gray-800">{d.projectName}</td>
                      <td className="px-3 py-2 text-gray-600">{d.billCount}</td>
                      <td className="px-3 py-2 text-right text-gray-800">¥{d.amount.toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-500">{d.remark || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 py-3 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">关闭</button>
        </div>
      </div>
    </div>
  );
}

export function ExpenseOutlay() {
  const [records, setRecords] = useState<OutlayRecord[]>(MOCK_DATA);
  const [searchBillNo, setSearchBillNo] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchHandler, setSearchHandler] = useState("");
  const [searchDept, setSearchDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editRecord, setEditRecord] = useState<OutlayRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<OutlayRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [submitConfirmId, setSubmitConfirmId] = useState<number | null>(null);
  const [approveConfirmId, setApproveConfirmId] = useState<number | null>(null);
  const pageSize = 20;

  const filtered = records.filter(r => {
    if (searchBillNo && !r.billNo.includes(searchBillNo)) return false;
    if (searchStatus && r.status !== searchStatus) return false;
    if (searchHandler && r.handler !== searchHandler) return false;
    if (searchDept && r.department !== searchDept) return false;
    if (searchDateFrom && r.date < searchDateFrom) return false;
    if (searchDateTo && r.date > searchDateTo) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => {
    setSearchBillNo(""); setSearchDateFrom(""); setSearchDateTo("");
    setSearchStatus(""); setSearchHandler(""); setSearchDept(""); setCurrentPage(1);
  };

  const handleSave = (data: Omit<OutlayRecord, "id" | "billNo">) => {
    if (editRecord) {
      setRecords(prev => prev.map(r => r.id === editRecord.id ? { ...r, ...data } : r));
      setEditRecord(null);
    } else {
      const newId = Math.max(0, ...records.map(r => r.id)) + 1;
      setRecords(prev => [...prev, { ...data, id: newId, billNo: `ZC20260528${String(newId).padStart(3, "0")}` }]);
      setShowAddDialog(false);
    }
  };

  const handleDelete = (id: number) => {
    const r = records.find(r => r.id === id);
    if (r?.status === "已审核") { alert("已审核的单据不可删除"); return; }
    setRecords(prev => prev.filter(r => r.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSubmit = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "待审核" } : r));
    setSubmitConfirmId(null);
  };

  const handleApprove = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "已审核", reviewTime: "2026-05-28 14:00", reviewer: "黄伟霆" } : r));
    setApproveConfirmId(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          <h1 className="text-sm font-semibold text-gray-800">支出费用</h1>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <input type="text" placeholder="单号" value={searchBillNo} onChange={e => setSearchBillNo(e.target.value)}
            className="w-36 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400" />
          <input type="date" value={searchDateFrom} onChange={e => setSearchDateFrom(e.target.value)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-gray-600" />
          <span className="text-gray-400 text-sm">～</span>
          <input type="date" value={searchDateTo} onChange={e => setSearchDateTo(e.target.value)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-gray-600" />
          <FauxSelect value={searchStatus} onChange={e => { setSearchStatus(e.target.value); setCurrentPage(1); }} placeholder="请选择状态" className="w-28">
            <option value="待提交">待提交</option>
            <option value="待审核">待审核</option>
            <option value="已审核">已审核</option>
            <option value="已拒绝">已拒绝</option>
          </FauxSelect>
          <FauxSelect value={searchHandler} onChange={e => { setSearchHandler(e.target.value); setCurrentPage(1); }} placeholder="请选择经手人" className="w-32">
            {EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
          </FauxSelect>
          <FauxSelect value={searchDept} onChange={e => { setSearchDept(e.target.value); setCurrentPage(1); }} placeholder="请选择部门" className="w-28">
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FauxSelect>
          <button onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 shrink-0">
            <SearchIcon sx={{ fontSize: 15 }} />搜索
          </button>
          <button onClick={handleReset}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shrink-0">
            重置
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddDialog(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />新增费用支出单
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ExportIcon sx={{ fontSize: 16 }} />导出
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-xs min-w-[1100px]">
          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              {["序号", "单号", "日期", "结算方式", "结算账户", "总金额", "部门", "经手人", "状态", "审核时间", "审核人", "操作"].map(h => (
                <th key={h} className={`px-3 py-2.5 text-left text-gray-600 font-medium whitespace-nowrap ${h === "操作" ? "sticky right-0 bg-gray-50" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={12} className="px-3 py-12 text-center text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, idx) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                <td className="px-3 py-2.5 text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-3 py-2.5 text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => setViewRecord(r)}>{r.billNo}</td>
                <td className="px-3 py-2.5 text-gray-700">{r.date}</td>
                <td className="px-3 py-2.5 text-gray-700">{r.paymentMethod}</td>
                <td className="px-3 py-2.5 text-gray-700">{r.account}</td>
                <td className="px-3 py-2.5 text-gray-800">¥{r.totalAmount.toFixed(2)}</td>
                <td className="px-3 py-2.5 text-gray-700">{r.department}</td>
                <td className="px-3 py-2.5 text-gray-700">{r.handler}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-3 py-2.5 text-gray-500">{r.reviewTime || "-"}</td>
                <td className="px-3 py-2.5 text-gray-700">{r.reviewer || "-"}</td>
                <td className="px-3 py-2.5 sticky right-0 bg-white">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button onClick={() => setViewRecord(r)} className="text-blue-500 hover:text-blue-700 transition-colors">查看</button>
                    {r.status === "待提交" && (
                      <button onClick={() => setEditRecord(r)} className="text-orange-500 hover:text-orange-700 transition-colors">编辑</button>
                    )}
                    {r.status === "待提交" && (
                      <button onClick={() => setSubmitConfirmId(r.id)} className="text-green-600 hover:text-green-800 transition-colors">提交审核</button>
                    )}
                    {r.status === "待审核" && (
                      <button onClick={() => setApproveConfirmId(r.id)} className="text-blue-500 hover:text-blue-700 transition-colors">审核</button>
                    )}
                    {r.status !== "已审核" && (
                      <button onClick={() => setDeleteConfirmId(r.id)} className="text-red-500 hover:text-red-700 transition-colors">删除</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0 flex items-center justify-between">
        <span className="text-xs text-gray-500">共 {filtered.length} 条</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1 text-xs border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">上一页</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, i, arr) => (
            <span key={p}>
              {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
              <button onClick={() => setCurrentPage(p)} className={`w-7 h-7 text-xs rounded-lg border transition-colors ${currentPage === p ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"}`}>{p}</button>
            </span>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">下一页</button>
        </div>
      </div>

      {/* Dialogs */}
      {(showAddDialog || editRecord) && (
        <AddOutlayDialog onClose={() => { setShowAddDialog(false); setEditRecord(null); }} onSave={handleSave} editRecord={editRecord} />
      )}
      {viewRecord && <ViewDialog record={viewRecord} onClose={() => setViewRecord(null)} />}

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <p className="text-sm text-gray-700 mb-4">确认删除该费用支出单吗？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">删除</button>
            </div>
          </div>
        </div>
      )}

      {submitConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <p className="text-sm text-gray-700 mb-4">确认提交该费用支出单审核？提交后将无法修改。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSubmitConfirmId(null)} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={() => handleSubmit(submitConfirmId)} className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">确认提交</button>
            </div>
          </div>
        </div>
      )}

      {approveConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <p className="text-sm text-gray-700 mb-4">确认审核通过该费用支出单？</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setApproveConfirmId(null)} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={() => handleApprove(approveConfirmId)} className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">确认审核</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

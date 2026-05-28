import React, { useState } from "react";
import {
  Search as SearchIcon, Add as AddIcon, Delete as DeleteIcon,
  Visibility as VisibilityIcon, Print as PrintIcon,
  FileDownload as FileDownloadIcon, Upload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";
import { PartSettingsDialog } from "./PartSettingsDialog";

interface CatalogPart {
  partsId: string; partsName: string; code: string; spec: string;
  drawingNo: string; category: string; salePrice: number; stock: number;
  costPrice: number; lastPurchasePrice: number; origin: string; warehouse: string;
}

interface OrderItem {
  partsId: string; partsName: string; code: string; spec: string;
  origin: string; lastPurchasePrice: number; quantity: number;
  purchasePrice: number; packageFee: number; total: number;
  isGift: boolean; remark: string; warehouse: string;
}

interface PurchaseRecord {
  id: string; orderNo: string; salesNo: string; createTime: string;
  orderMethod: string; hasCredit: boolean; amount: number; freight: number;
  purchaser: string; creator: string; supplier: string; remark: string;
  cashAmount: number; prepayment: number; unpaid: number; paid: number;
  repayStatus: "已还清" | "未还清" | "部分还款"; returnAmount: number;
}

const mockCatalog: CatalogPart[] = [
  { partsId: "P001", partsName: "壳牌机油", code: "SP000003", spec: "5W-40", drawingNo: "", category: "油品", salePrice: 10.00, stock: 2, costPrice: 68.00, lastPurchasePrice: 68.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P002", partsName: "转向头", code: "SP000004", spec: "", drawingNo: "", category: "耗材", salePrice: 0.00, stock: 0, costPrice: 0.00, lastPurchasePrice: 0.00, origin: "", warehouse: "嘉兴仓" },
  { partsId: "P003", partsName: "下轴", code: "L034200J00", spec: "", drawingNo: "", category: "配件", salePrice: 150.00, stock: 0, costPrice: 120.00, lastPurchasePrice: 120.00, origin: "原厂", warehouse: "嘉兴仓" },
  { partsId: "P004", partsName: "卡扣系列", code: "MHJKKE", spec: "E", drawingNo: "E", category: "配件", salePrice: 1.00, stock: 0, costPrice: 0.00, lastPurchasePrice: 0.00, origin: "", warehouse: "嘉兴仓" },
  { partsId: "P005", partsName: "机油滤清器", code: "SP000010", spec: "标准型", drawingNo: "F-001", category: "耗材", salePrice: 35.00, stock: 8, costPrice: 22.00, lastPurchasePrice: 22.00, origin: "国产", warehouse: "嘉兴仓" },
  { partsId: "P006", partsName: "空气滤清器", code: "SP000011", spec: "高效型", drawingNo: "F-002", category: "耗材", salePrice: 45.00, stock: 5, costPrice: 30.00, lastPurchasePrice: 30.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P007", partsName: "刹车片（前）", code: "SP000020", spec: "通用型", drawingNo: "B-001", category: "制动系统", salePrice: 180.00, stock: 10, costPrice: 95.00, lastPurchasePrice: 95.00, origin: "原厂", warehouse: "嘉兴仓" },
  { partsId: "P008", partsName: "刹车片（后）", code: "SP000021", spec: "通用型", drawingNo: "B-002", category: "制动系统", salePrice: 150.00, stock: 8, costPrice: 80.00, lastPurchasePrice: 80.00, origin: "原厂", warehouse: "嘉兴仓" },
  { partsId: "P009", partsName: "火花塞", code: "SP000030", spec: "铂金型", drawingNo: "I-001", category: "点火系统", salePrice: 55.00, stock: 20, costPrice: 28.00, lastPurchasePrice: 28.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P010", partsName: "节气门", code: "SP000035", spec: "电子控制", drawingNo: "T-001", category: "进气系统", salePrice: 320.00, stock: 3, costPrice: 210.00, lastPurchasePrice: 205.00, origin: "原厂", warehouse: "嘉兴仓" },
  { partsId: "P011", partsName: "冷却液", code: "SP000040", spec: "防冻型", drawingNo: "", category: "油品", salePrice: 28.00, stock: 15, costPrice: 18.00, lastPurchasePrice: 18.00, origin: "国产", warehouse: "嘉兴仓" },
  { partsId: "P012", partsName: "雨刮器（前）", code: "SP000050", spec: "24英寸", drawingNo: "W-001", category: "配件", salePrice: 65.00, stock: 6, costPrice: 38.00, lastPurchasePrice: 38.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P013", partsName: "轮胎气门嘴", code: "SP000055", spec: "标准", drawingNo: "", category: "配件", salePrice: 8.00, stock: 50, costPrice: 3.00, lastPurchasePrice: 3.00, origin: "国产", warehouse: "嘉兴仓" },
  { partsId: "P014", partsName: "转向拉杆", code: "SP000060", spec: "内球头", drawingNo: "S-001", category: "转向系统", salePrice: 220.00, stock: 4, costPrice: 145.00, lastPurchasePrice: 145.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P015", partsName: "减震器（前）", code: "SP000070", spec: "气压式", drawingNo: "D-001", category: "悬挂系统", salePrice: 580.00, stock: 2, costPrice: 360.00, lastPurchasePrice: 355.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P016", partsName: "皮带张紧轮", code: "SP000080", spec: "通用", drawingNo: "E-002", category: "发动机", salePrice: 125.00, stock: 3, costPrice: 75.00, lastPurchasePrice: 75.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P017", partsName: "曲轴箱通风管", code: "SP000085", spec: "专用", drawingNo: "E-003", category: "发动机", salePrice: 95.00, stock: 5, costPrice: 55.00, lastPurchasePrice: 55.00, origin: "原厂", warehouse: "嘉兴仓" },
  { partsId: "P018", partsName: "凸轮轴油封", code: "SP000090", spec: "标准", drawingNo: "E-004", category: "发动机", salePrice: 35.00, stock: 8, costPrice: 18.00, lastPurchasePrice: 18.00, origin: "国产", warehouse: "嘉兴仓" },
  { partsId: "P019", partsName: "水泵", code: "SP000095", spec: "带密封", drawingNo: "C-001", category: "冷却系统", salePrice: 265.00, stock: 2, costPrice: 165.00, lastPurchasePrice: 160.00, origin: "进口", warehouse: "嘉兴仓" },
  { partsId: "P020", partsName: "节温器", code: "SP000096", spec: "87°开启", drawingNo: "C-002", category: "冷却系统", salePrice: 85.00, stock: 4, costPrice: 45.00, lastPurchasePrice: 45.00, origin: "国产", warehouse: "嘉兴仓" },
];

const mockSuppliers = ["博世供应商", "曼牌供应商", "NGK供应商", "壳牌供应商", "德尔福供应商"];
const mockEmployees = ["张三", "李四", "王五", "赵六"];
const mockWarehouses = ["嘉兴仓", "总仓库", "副仓库", "东区仓库"];
const mockPaymentMethods = ["现金", "银行转账", "支票", "微信", "支付宝"];
const mockVehicleTypes = ["宝马3系", "奔驰C级", "丰田凯美瑞", "大众帕萨特", "本田雅阁"];

const mockRecords: PurchaseRecord[] = [
  { id: "1", orderNo: "CG260522332480037", salesNo: "", createTime: "2026-05-22 10:30", orderMethod: "手动开单", hasCredit: false, amount: 4.00, freight: 0, purchaser: "张三", creator: "操作员A", supplier: "博世供应商", remark: "", cashAmount: 0, prepayment: 0, unpaid: 0, paid: 0, repayStatus: "已还清", returnAmount: 0 },
  { id: "2", orderNo: "CG260520118360022", salesNo: "S20260520", createTime: "2026-05-20 14:20", orderMethod: "手动开单", hasCredit: true, amount: 3.00, freight: 0, purchaser: "李四", creator: "操作员B", supplier: "曼牌供应商", remark: "急购", cashAmount: 0, prepayment: 0, unpaid: 3.00, paid: 0, repayStatus: "未还清", returnAmount: 0 },
];

const mockDrafts: PurchaseRecord[] = [
  { id: "D1", orderNo: "CG260528001", salesNo: "", createTime: "2026-05-28 09:00", orderMethod: "手动开单", hasCredit: false, amount: 860.00, freight: 20, purchaser: "王五", creator: "操作员A", supplier: "NGK供应商", remark: "", cashAmount: 0, prepayment: 0, unpaid: 0, paid: 0, repayStatus: "已还清", returnAmount: 0 },
];

const mockTransit: PurchaseRecord[] = [
  { id: "T1", orderNo: "CG260525001", salesNo: "", createTime: "2026-05-25 15:00", orderMethod: "手动开单", hasCredit: false, amount: 1280.00, freight: 30, purchaser: "张三", creator: "操作员A", supplier: "壳牌供应商", remark: "在途中", cashAmount: 0, prepayment: 0, unpaid: 0, paid: 0, repayStatus: "已还清", returnAmount: 0 },
];

const mockVoided: PurchaseRecord[] = [
  { id: "V1", orderNo: "CG260510001", salesNo: "", createTime: "2026-05-10 11:00", orderMethod: "手动开单", hasCredit: false, amount: 500.00, freight: 0, purchaser: "赵六", creator: "操作员B", supplier: "德尔福供应商", remark: "", cashAmount: 0, prepayment: 0, unpaid: 0, paid: 0, repayStatus: "已还清", returnAmount: 0 },
];

const repayStatusColors: Record<string, string> = {
  "已还清": "bg-green-100 text-green-700",
  "未还清": "bg-red-100 text-red-700",
  "部分还款": "bg-yellow-100 text-yellow-700",
};

// ── 还款弹框 ──────────────────────────────────────────────────────
function RepayDialog({ record, onClose }: { record: PurchaseRecord; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [remark, setRemark] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-md">
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-gray-800">还款</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-600">订单号：</span>
            <span className="text-sm font-medium text-blue-600">{record.orderNo}</span>
            <span className="ml-auto text-sm text-gray-600">未还金额：<span className="text-red-600 font-semibold">¥{record.unpaid.toFixed(2)}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[72px] text-right text-sm text-gray-600 shrink-0"><span className="text-red-500">*</span> 还款金额</span>
            <input type="number" min={0} placeholder="请输入还款金额" value={amount} onChange={e => setAmount(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[72px] text-right text-sm text-gray-600 shrink-0">还款方式</span>
            <FauxSelect value={method} onChange={e => setMethod(e.target.value)} className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 bg-white">
              <option value="">请选择</option>
              {mockPaymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[72px] text-right text-sm text-gray-600 shrink-0">备注</span>
            <input type="text" placeholder="请输入备注" value={remark} onChange={e => setRemark(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
        </div>
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={() => { alert("还款成功！"); onClose(); }} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确认还款</button>
        </div>
      </div>
    </div>
  );
}

// ── 查看弹框 ──────────────────────────────────────────────────────
function ViewDialog({ record, onClose }: { record: PurchaseRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 720, maxHeight: "80vh" }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-base font-bold text-gray-800">采购订单详情</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200"><span className="text-xs font-semibold text-gray-700">基本信息</span></div>
            <div className="p-3 grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
              {[
                ["订单号", record.orderNo], ["销售单号", record.salesNo || "-"], ["开单时间", record.createTime],
                ["开单方式", record.orderMethod], ["供应商", record.supplier], ["采购员", record.purchaser],
                ["开单员", record.creator], ["运费", `¥${record.freight.toFixed(2)}`], ["备注", record.remark || "-"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-1 min-w-0">
                  <span className="w-[60px] text-right text-gray-500 shrink-0 text-xs">{label}</span>
                  <span className="text-gray-800 truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200"><span className="text-xs font-semibold text-gray-700">费用信息</span></div>
            <div className="p-3 grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
              {[
                ["采购金额", `¥${record.amount.toFixed(2)}`], ["现款", `¥${record.cashAmount.toFixed(2)}`],
                ["预付款", `¥${record.prepayment.toFixed(2)}`], ["未还金额", `¥${record.unpaid.toFixed(2)}`],
                ["已还金额", `¥${record.paid.toFixed(2)}`], ["退货金额", `¥${record.returnAmount.toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-1">
                  <span className="text-gray-500 text-xs shrink-0">{label}：</span>
                  <span className="text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200"><span className="text-xs font-semibold text-gray-700">配件明细</span></div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {["配件名称","规格","编码","数量","进价","合计"].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-400">（模拟数据）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2 shrink-0">
          <button className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <PrintIcon sx={{ fontSize: 15 }} />打印
          </button>
          <button onClick={onClose} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">关闭</button>
        </div>
      </div>
    </div>
  );
}

// ── 作废确认 ──────────────────────────────────────────────────────
function VoidConfirmDialog({ orderNo, onClose, onConfirm }: { orderNo: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-5">
        <h3 className="text-base font-bold text-gray-800 mb-2">确认作废</h3>
        <p className="text-sm text-gray-600 mb-4">确认作废采购订单 <span className="font-medium text-blue-600">{orderNo}</span> 吗？作废后不可恢复。</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确认作废</button>
        </div>
      </div>
    </div>
  );
}

// ── 采购开单 Tab ──────────────────────────────────────────────────
const CreateTab: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [catalogWarehouse, setCatalogWarehouse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [salesNo, setSalesNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaser, setPurchaser] = useState("");
  const [orderWarehouse, setOrderWarehouse] = useState("");
  const [remark, setRemark] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [prepayment, setPrepayment] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [freight, setFreight] = useState("");

  const pageSize = 10;
  const filteredCatalog = mockCatalog.filter(p =>
    (!searchText || p.partsName.includes(searchText) || p.code.toLowerCase().includes(searchText.toLowerCase()) || p.spec.includes(searchText) || p.drawingNo.includes(searchText)) &&
    (!catalogWarehouse || p.warehouse === catalogWarehouse)
  );
  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / pageSize));
  const pagedCatalog = filteredCatalog.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const addToOrder = (part: CatalogPart) => {
    if (orderItems.find(i => i.partsId === part.partsId)) return;
    setOrderItems(prev => [...prev, {
      partsId: part.partsId, partsName: part.partsName, code: part.code,
      spec: part.spec, origin: part.origin, lastPurchasePrice: part.lastPurchasePrice,
      quantity: 1, purchasePrice: part.lastPurchasePrice, packageFee: 0,
      total: part.lastPurchasePrice, isGift: false, remark: "", warehouse: part.warehouse,
    }]);
  };

  const updateItem = (id: string, field: keyof OrderItem, val: number | boolean | string) => {
    setOrderItems(prev => prev.map(item => {
      if (item.partsId !== id) return item;
      const ni = { ...item, [field]: val };
      ni.total = +(ni.purchasePrice * ni.quantity + ni.packageFee).toFixed(2);
      return ni;
    }));
  };

  const removeItem = (id: string) => setOrderItems(prev => prev.filter(i => i.partsId !== id));

  const handleReset = () => {
    setOrderItems([]); setSalesNo(""); setSupplier(""); setPurchaser("");
    setOrderWarehouse(""); setRemark(""); setCashAmount(""); setPaymentMethod("");
    setPrepayment(""); setCreditAmount(""); setFreight("");
  };

  const totalItems = orderItems.length;
  const totalQty = orderItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = orderItems.reduce((s, i) => s + i.purchasePrice * i.quantity, 0);
  const totalWithPkg = orderItems.reduce((s, i) => s + i.total, 0);

  const handleSubmit = (type: "草稿" | "在途" | "入库") => {
    if (orderItems.length === 0) { alert("请至少添加一种配件"); return; }
    if (!supplier) { alert("请选择供应商"); return; }
    if (!purchaser) { alert("请选择采购员"); return; }
    alert(`${type}成功！`);
    handleReset();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="名称/编码/规格/图号" value={searchText}
              onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <FauxSelect value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="w-36 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
            <option value="">请选择适用车型</option>
            {mockVehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </FauxSelect>
          <FauxSelect value={catalogWarehouse} onChange={e => { setCatalogWarehouse(e.target.value); setCurrentPage(1); }} className="w-32 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
            <option value="">请选择默认仓库</option>
            {mockWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
          </FauxSelect>
        </div>
      </div>
      {/* Action bar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setSettingsOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1 shadow-sm">
            <AddIcon sx={{ fontSize: 16 }} />新增
          </button>
          <div className="w-px h-5 bg-gray-300" />
          <button onClick={() => alert("下载模板")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 15 }} />下载模板
          </button>
          <button onClick={() => alert("导入Excel")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <UploadIcon sx={{ fontSize: 15 }} />导入Excel
          </button>
        </div>
      </div>

      {/* Scrollable main area */}
      <div className="flex-1 overflow-auto min-h-0">
        {/* Parts catalog table */}
        <div className="border-b border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {["配件名称","配件编码","配件规格","图号","品类","售价","库存数量","成本价","上次进价","产地","默认仓库"].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedCatalog.length === 0 ? (
                <tr><td colSpan={11} className="px-4 py-6 text-center text-sm text-gray-400">暂无配件数据</td></tr>
              ) : pagedCatalog.map(part => (
                <tr key={part.partsId} onClick={() => addToOrder(part)}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${orderItems.find(i => i.partsId === part.partsId) ? "bg-blue-50" : "hover:bg-blue-50/50"}`}>
                  <td className="px-3 py-2 text-sm text-blue-600 font-medium whitespace-nowrap">{part.partsName}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.code}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.spec || "-"}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.drawingNo || "-"}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.category}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.salePrice.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.stock}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.costPrice.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.lastPurchasePrice.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.origin || "-"}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{part.warehouse}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Catalog pagination */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">共 {filteredCatalog.length} 条配件数据，点击行添加到开单明细</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-2.5 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">上一页</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 text-xs rounded border transition-all ${currentPage === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-2.5 py-1 bg-white text-gray-700 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">下一页</button>
            </div>
          </div>
        </div>

        {/* Order form */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">销售单号</label>
              <input type="text" placeholder="请输入" value={salesNo} onChange={e => setSalesNo(e.target.value)}
                className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap"><span className="text-red-500">*</span> 供应商</label>
              <FauxSelect value={supplier} onChange={e => setSupplier(e.target.value)} className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-400">
                <option value="">请选择</option>
                {mockSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
              </FauxSelect>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap"><span className="text-red-500">*</span> 采购员</label>
              <FauxSelect value={purchaser} onChange={e => setPurchaser(e.target.value)} className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-400">
                <option value="">请选择</option>
                {mockEmployees.map(e => <option key={e} value={e}>{e}</option>)}
              </FauxSelect>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">仓库</label>
              <FauxSelect value={orderWarehouse} onChange={e => setOrderWarehouse(e.target.value)} className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-400">
                <option value="">请选择</option>
                {mockWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
              </FauxSelect>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">备注</label>
              <input type="text" placeholder="请输入" value={remark} onChange={e => setRemark(e.target.value)}
                className="w-36 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">现款金额</label>
              <input type="number" min={0} placeholder="0.00" value={cashAmount} onChange={e => setCashAmount(e.target.value)}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">支付方式</label>
              <FauxSelect value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-blue-400">
                <option value="">请选择</option>
                {mockPaymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </FauxSelect>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">预付款</label>
              <input type="number" min={0} placeholder="0.00" value={prepayment} onChange={e => setPrepayment(e.target.value)}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">挂帐金额</label>
              <input type="number" min={0} placeholder="0.00" value={creditAmount} onChange={e => setCreditAmount(e.target.value)}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-600 shrink-0 whitespace-nowrap">运费</label>
              <input type="number" min={0} placeholder="0.00" value={freight} onChange={e => setFreight(e.target.value)}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
          </div>
        </div>

        {/* Order details table */}
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["配件名称","规格","编码","产地","上次进价","数量","*本次进价","包装费","合计","赠品","备注","仓库","操作"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderItems.length === 0 ? (
              <tr><td colSpan={13} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据，请从上方配件列表点击行添加配件</td></tr>
            ) : orderItems.map(item => (
              <tr key={item.partsId} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                <td className="px-3 py-2 text-sm text-gray-900 font-medium whitespace-nowrap">{item.partsName}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{item.spec || "-"}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{item.code}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{item.origin || "-"}</td>
                <td className="px-3 py-2 text-sm text-gray-500">{item.lastPurchasePrice.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <input type="number" min={1} value={item.quantity}
                    onChange={e => updateItem(item.partsId, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-3 py-2">
                  <input type="number" min={0} step={0.01} value={item.purchasePrice}
                    onChange={e => updateItem(item.partsId, "purchasePrice", parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-blue-300 rounded text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-3 py-2">
                  <input type="number" min={0} step={0.01} value={item.packageFee}
                    onChange={e => updateItem(item.partsId, "packageFee", parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-gray-800">{item.total.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <input type="checkbox" checked={item.isGift} onChange={e => updateItem(item.partsId, "isGift", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400 cursor-pointer" />
                </td>
                <td className="px-3 py-2">
                  <input type="text" placeholder="备注" value={item.remark} onChange={e => updateItem(item.partsId, "remark", e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400" />
                </td>
                <td className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap">{item.warehouse}</td>
                <td className="px-3 py-2">
                  <button onClick={() => removeItem(item.partsId)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                    <Delete sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>项目数量：<span className="font-semibold text-gray-800">{totalItems}</span></span>
            <span>采购数量：<span className="font-semibold text-gray-800">{totalQty}</span></span>
            <span>总价：<span className="font-semibold text-gray-800">¥{totalPrice.toFixed(2)}</span></span>
            <span>采购总价(含包装)：<span className="font-semibold text-blue-600">¥{totalWithPkg.toFixed(2)}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleSubmit("草稿")} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">草稿</button>
            <button onClick={() => handleSubmit("在途")} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">在途</button>
            <button onClick={handleReset} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
            <button onClick={() => handleSubmit("入库")} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">入库</button>
          </div>
        </div>
      </div>

      {settingsOpen && <PartSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
};

// Need to alias DeleteIcon properly
const Delete = DeleteIcon;

// ── 通用记录列表 Tab ──────────────────────────────────────────────
interface RecordListProps {
  records: PurchaseRecord[];
  showExport?: boolean;
  showVoid?: boolean;
  showRepay?: boolean;
  showTransitEntry?: boolean;
  onTransitEntry?: (id: string) => void;
}

const RecordList: React.FC<RecordListProps> = ({ records, showExport = false, showVoid = false, showRepay = false, showTransitEntry = false, onTransitEntry }) => {
  const [keyword, setKeyword] = useState("");
  const [partQuery, setPartQuery] = useState("");
  const [orderMethod, setOrderMethod] = useState("");
  const [hasCredit, setHasCredit] = useState("");
  const [purchaser, setPurchaser] = useState("");
  const [supplier, setSupplier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState<PurchaseRecord | null>(null);
  const [repayRecord, setRepayRecord] = useState<PurchaseRecord | null>(null);
  const [voidId, setVoidId] = useState<string | null>(null);
  const [localRecords, setLocalRecords] = useState(records);

  const pageSize = 20;
  const total = localRecords.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = localRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleVoid = (id: string) => {
    setLocalRecords(prev => prev.filter(r => r.id !== id));
    setVoidId(null);
  };

  const handleTransitEntry = (id: string) => {
    if (onTransitEntry) onTransitEntry(id);
    else setLocalRecords(prev => prev.filter(r => r.id !== id));
  };

  const totalAmount = localRecords.reduce((s, r) => s + r.amount, 0);
  const totalFreight = localRecords.reduce((s, r) => s + r.freight, 0);

  const cols = showTransitEntry
    ? ["序号","订单号","开单时间","开单方式","供应商","采购员","金额","运费","备注","操作"]
    : ["序号","订单号","销售单号","开单时间","开单方式","含挂帐","金额","运费","采购员","开单员","供应商","备注","现款","预付款","未还金额","已还金额","还款状态","退货金额","操作"];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          {showExport && (
            <>
              <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
                <FileDownloadIcon sx={{ fontSize: 16 }} />导出
              </button>
              <div className="w-px h-6 bg-gray-300" />
            </>
          )}
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">关键字</label>
            <input type="text" placeholder="单号/销售单号/备注" value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          {!showTransitEntry && (
            <>
              <div className="flex items-center gap-1.5">
                <label className="text-sm text-gray-700 shrink-0">配件查询</label>
                <input type="text" placeholder="名称/规格/条码/编码" value={partQuery} onChange={e => setPartQuery(e.target.value)}
                  className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-sm text-gray-700 shrink-0">开单方式</label>
                <FauxSelect value={orderMethod} onChange={e => setOrderMethod(e.target.value)} className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
                  <option value="">全部</option>
                  <option value="手动开单">手动开单</option>
                  <option value="系统开单">系统开单</option>
                </FauxSelect>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-sm text-gray-700 shrink-0">含挂帐</label>
                <FauxSelect value={hasCredit} onChange={e => setHasCredit(e.target.value)} className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
                  <option value="">全部</option>
                  <option value="yes">是</option>
                  <option value="no">否</option>
                </FauxSelect>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">采购员</label>
            <FauxSelect value={purchaser} onChange={e => setPurchaser(e.target.value)} className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
              <option value="">全部</option>
              {mockEmployees.map(e => <option key={e} value={e}>{e}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">供应商</label>
            <FauxSelect value={supplier} onChange={e => setSupplier(e.target.value)} className="w-32 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400">
              <option value="">全部</option>
              {mockSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-gray-700 shrink-0">开单时间</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
            <span className="text-gray-400 text-sm">~</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => { setKeyword(""); setPartQuery(""); setOrderMethod(""); setHasCredit(""); setPurchaser(""); setSupplier(""); setStartDate(""); setEndDate(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {cols.map(h => <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={cols.length} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-2.5 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-2.5 text-sm text-blue-600 font-medium whitespace-nowrap">{r.orderNo}</td>
                {!showTransitEntry && <td className="px-3 py-2.5 text-sm text-gray-700">{r.salesNo || "-"}</td>}
                <td className="px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-3 py-2.5 text-sm text-gray-700">{r.orderMethod}</td>
                {!showTransitEntry && <td className="px-3 py-2.5 text-sm">{r.hasCredit ? <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-600 rounded">是</span> : <span className="text-gray-500">否</span>}</td>}
                <td className="px-3 py-2.5 text-sm font-medium text-gray-800">¥{r.amount.toFixed(2)}</td>
                <td className="px-3 py-2.5 text-sm text-gray-700">{r.freight > 0 ? `¥${r.freight.toFixed(2)}` : "-"}</td>
                {!showTransitEntry && (
                  <>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{r.purchaser}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{r.creator}</td>
                  </>
                )}
                {showTransitEntry && <td className="px-3 py-2.5 text-sm text-gray-700">{r.supplier}</td>}
                {!showTransitEntry && <td className="px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap">{r.supplier}</td>}
                <td className="px-3 py-2.5 text-sm text-gray-600">{r.remark || "-"}</td>
                {!showTransitEntry && (
                  <>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{r.cashAmount > 0 ? `¥${r.cashAmount.toFixed(2)}` : "-"}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{r.prepayment > 0 ? `¥${r.prepayment.toFixed(2)}` : "-"}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{r.unpaid > 0 ? `¥${r.unpaid.toFixed(2)}` : "-"}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{r.paid > 0 ? `¥${r.paid.toFixed(2)}` : "-"}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${repayStatusColors[r.repayStatus]}`}>{r.repayStatus}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700">{r.returnAmount > 0 ? `¥${r.returnAmount.toFixed(2)}` : "-"}</td>
                  </>
                )}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    {showTransitEntry && (
                      <button onClick={() => handleTransitEntry(r.id)}
                        className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700">入库</button>
                    )}
                    {showVoid && (
                      <button onClick={() => setVoidId(r.id)} className="text-xs text-red-500 hover:text-red-700 px-1">作废</button>
                    )}
                    {showRepay && (
                      <button onClick={() => setRepayRecord(r)} disabled={r.repayStatus === "已还清"}
                        className={`text-xs px-1 ${r.repayStatus === "已还清" ? "text-gray-300 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"}`}>还款</button>
                    )}
                    {!showTransitEntry && (
                      <>
                        <button className="text-xs text-gray-500 hover:text-gray-700 px-1"><PrintIcon sx={{ fontSize: 13 }} /></button>
                        <button onClick={() => setViewRecord(r)} className="text-xs text-blue-500 hover:text-blue-700 px-1"><VisibilityIcon sx={{ fontSize: 13 }} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paged.length > 0 && !showTransitEntry && (
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td className="px-3 py-2.5 text-sm font-semibold text-gray-800" colSpan={6}>合计</td>
                <td className="px-3 py-2.5 text-sm font-semibold text-gray-800">¥{totalAmount.toFixed(2)}</td>
                <td className="px-3 py-2.5 text-sm font-semibold text-gray-800">¥{totalFreight.toFixed(2)}</td>
                <td colSpan={11} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{total}</span> 条</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">上一页</button>
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">下一页</button>
        </div>
      </div>

      {viewRecord && <ViewDialog record={viewRecord} onClose={() => setViewRecord(null)} />}
      {repayRecord && <RepayDialog record={repayRecord} onClose={() => setRepayRecord(null)} />}
      {voidId && <VoidConfirmDialog orderNo={localRecords.find(r => r.id === voidId)?.orderNo ?? ""} onClose={() => setVoidId(null)} onConfirm={() => handleVoid(voidId)} />}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────
type TabKey = "create" | "draft" | "transit" | "records" | "voided";

const PurchaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("create");

  const tabs = [
    { key: "create" as TabKey, label: "采购开单" },
    { key: "draft" as TabKey, label: "采购草稿" },
    { key: "transit" as TabKey, label: "在途记录" },
    { key: "records" as TabKey, label: "采购记录" },
    { key: "voided" as TabKey, label: "作废记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">采购管理</h2>
      </div>
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-all relative ${activeTab === tab.key ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}`}>
              {tab.label}
              {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === "create" && <CreateTab />}
        {activeTab === "draft" && <RecordList records={mockDrafts} showVoid />}
        {activeTab === "transit" && <RecordList records={mockTransit} showTransitEntry />}
        {activeTab === "records" && <RecordList records={mockRecords} showExport showVoid showRepay />}
        {activeTab === "voided" && <RecordList records={mockVoided} />}
      </div>
    </div>
  );
};

export default PurchaseManagement;

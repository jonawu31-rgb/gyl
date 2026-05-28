import { useState } from "react";
import {
  FileDownload as ExportIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  SwapHoriz as ConvertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Quote {
  id: string;
  quoteTime: string;
  orderNo: string;
  source: string;
  customer: string;
  cost: number;
  price: number;
  freight: number;
  discount: number;
  reduction: number;
  payable: number;
  shipMethod: string;
  vehicle: string;
  company: string;
  address: string;
  contact: string;
  phone: string;
  creator: string;
  salesman: string;
}

interface QuoteDetail {
  id: string;
  orderNo: string;
  customer: string;
  partName: string;
  partCode: string;
  spec: string;
  unit: string;
  qty: number;
  costPrice: number;
  salePrice: number;
  totalCost: number;
  totalPrice: number;
  salesman: string;
  quoteTime: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockQuotes: Quote[] = [
  { id: "1", quoteTime: "2026-05-27 09:23:15", orderNo: "BJ260527001", source: "开单", customer: "昆明创安汽修", cost: 1200.00, price: 1680.00, freight: 25.00, discount: 50.00, reduction: 0, payable: 1655.00, shipMethod: "物流", vehicle: "--", company: "顺丰速运", address: "云南省昆明市盘龙区北京路88号", contact: "李总", phone: "13812345678", creator: "黄伟霆", salesman: "张三" },
  { id: "2", quoteTime: "2026-05-26 14:45:30", orderNo: "BJ260526002", source: "小程序", customer: "成都鑫达配件城", cost: 890.00, price: 1250.00, freight: 0, discount: 0, reduction: 0, payable: 1250.00, shipMethod: "配送", vehicle: "云A12345", company: "--", address: "四川省成都市武侯区天府大道100号", contact: "王经理", phone: "13987654321", creator: "黄伟霆", salesman: "李四" },
  { id: "3", quoteTime: "2026-05-25 16:10:00", orderNo: "BJ260525003", source: "开单", customer: "重庆宏远汽车服务", cost: 3200.00, price: 4500.00, freight: 60.00, discount: 200.00, reduction: 0, payable: 4360.00, shipMethod: "物流", vehicle: "--", company: "德邦物流", address: "重庆市渝北区新南路55号", contact: "赵经理", phone: "13611112222", creator: "黄伟霆", salesman: "张三" },
  { id: "4", quoteTime: "2026-05-24 11:30:00", orderNo: "BJ260524004", source: "开单", customer: "贵阳天鸿汽配", cost: 560.00, price: 780.00, freight: 0, discount: 0, reduction: 20.00, payable: 760.00, shipMethod: "配送", vehicle: "云B67890", company: "--", address: "贵州省贵阳市南明区花溪路20号", contact: "孙总", phone: "13755556666", creator: "黄伟霆", salesman: "王五" },
  { id: "5", quoteTime: "2026-05-23 08:55:00", orderNo: "BJ260523005", source: "小程序", customer: "西安汽车配件总汇", cost: 4800.00, price: 6800.00, freight: 120.00, discount: 300.00, reduction: 0, payable: 6620.00, shipMethod: "物流", vehicle: "--", company: "顺丰速运", address: "陕西省西安市雁塔区长安南路200号", contact: "陈总", phone: "13922223333", creator: "黄伟霆", salesman: "李四" },
  { id: "6", quoteTime: "2026-05-22 15:20:00", orderNo: "BJ260522006", source: "开单", customer: "郑州中联汽配", cost: 720.00, price: 980.00, freight: 0, discount: 0, reduction: 0, payable: 980.00, shipMethod: "物流", vehicle: "--", company: "韵达快递", address: "河南省郑州市金水区花园路45号", contact: "周经理", phone: "13544447777", creator: "黄伟霆", salesman: "张三" },
];

const mockDetails: QuoteDetail[] = [
  { id: "1", orderNo: "BJ260527001", customer: "昆明创安汽修", partName: "刹车片(前)", partCode: "ZP-BK001", spec: "适配雅阁2020-2023", unit: "套", qty: 4, costPrice: 200.00, salePrice: 280.00, totalCost: 800.00, totalPrice: 1120.00, salesman: "张三", quoteTime: "2026-05-27 09:23:15" },
  { id: "2", orderNo: "BJ260527001", customer: "昆明创安汽修", partName: "机油滤清器", partCode: "ZP-OF002", spec: "1.5T通用", unit: "个", qty: 2, costPrice: 35.00, salePrice: 50.00, totalCost: 70.00, totalPrice: 100.00, salesman: "张三", quoteTime: "2026-05-27 09:23:15" },
  { id: "3", orderNo: "BJ260526002", customer: "成都鑫达配件城", partName: "空气滤清器", partCode: "ZP-AF003", spec: "2.0T专用", unit: "个", qty: 5, costPrice: 80.00, salePrice: 110.00, totalCost: 400.00, totalPrice: 550.00, salesman: "李四", quoteTime: "2026-05-26 14:45:30" },
  { id: "4", orderNo: "BJ260526002", customer: "成都鑫达配件城", partName: "火花塞", partCode: "ZP-SP004", spec: "铱金型通用", unit: "组", qty: 3, costPrice: 130.00, salePrice: 180.00, totalCost: 390.00, totalPrice: 540.00, salesman: "李四", quoteTime: "2026-05-26 14:45:30" },
  { id: "5", orderNo: "BJ260525003", customer: "重庆宏远汽车服务", partName: "减震器(前)", partCode: "ZP-SH005", spec: "适配宝马3系", unit: "支", qty: 2, costPrice: 850.00, salePrice: 1200.00, totalCost: 1700.00, totalPrice: 2400.00, salesman: "张三", quoteTime: "2026-05-25 16:10:00" },
  { id: "6", orderNo: "BJ260524004", customer: "贵阳天鸿汽配", partName: "转向拉杆", partCode: "ZP-SR006", spec: "通用型", unit: "根", qty: 2, costPrice: 180.00, salePrice: 250.00, totalCost: 360.00, totalPrice: 500.00, salesman: "王五", quoteTime: "2026-05-24 11:30:00" },
];

const salesmen = ["张三", "李四", "王五", "赵六"];

// ─── Delete / Convert confirm dialogs ─────────────────────────────────────────

function ConfirmDialog({ title, message, onClose, onConfirm, confirmClass = "bg-red-500 hover:bg-red-600" }: { title: string; message: string; onClose: () => void; onConfirm: () => void; confirmClass?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        <div className="p-5 text-sm text-gray-700">{message}</div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white text-sm rounded-lg ${confirmClass}`}>确定</button>
        </div>
      </div>
    </div>
  );
}

// ─── Quotes Tab ───────────────────────────────────────────────────────────────

function QuotesTab() {
  const [data, setData] = useState(mockQuotes);
  const [kwCustomer, setKwCustomer] = useState("");
  const [kwPart, setKwPart] = useState("");
  const [salesman, setSalesman] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [convertId, setConvertId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = data.filter(q =>
    (!kwCustomer || q.customer.includes(kwCustomer) || q.orderNo.includes(kwCustomer)) &&
    (!salesman || q.salesman === salesman)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = () => {
    if (!deleteId) return;
    setData(d => d.filter(q => q.id !== deleteId));
    setDeleteId(null);
  };

  const handleConvert = () => {
    if (!convertId) return;
    setData(d => d.filter(q => q.id !== convertId));
    setConvertId(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">客户查询：</span>
            <input value={kwCustomer} onChange={(e) => setKwCustomer(e.target.value)} placeholder="姓名/电话/VIN码/单号" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">配件查询：</span>
            <input value={kwPart} onChange={(e) => setKwPart(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">销售员：</span>
            <FauxSelect className="flex-1" value={salesman} onChange={(e) => setSalesman(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              {salesmen.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">报价时间：</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <span className="text-gray-400 text-xs shrink-0">~</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="flex items-center gap-2 col-start-4 justify-end">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setKwCustomer(""); setKwPart(""); setSalesman(""); setDateFrom(""); setDateTo(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
          <ExportIcon sx={{ fontSize: 16 }} />导出
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full min-w-[1600px]">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">报价时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">来源</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">售价</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">运费</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">优惠</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">减收</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">应付</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送方式</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送车辆</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送公司</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货地址</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货联系人</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货电话</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">建立人</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">销售员</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gray-50 shadow-[-2px_0_6px_rgba(0,0,0,0.06)] w-28">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.quoteTime}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-blue-600 whitespace-nowrap">{item.orderNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.source}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.customer}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{item.cost.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{item.price.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 text-right">{item.freight > 0 ? `¥${item.freight.toFixed(2)}` : "--"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 text-right">{item.discount > 0 ? `¥${item.discount.toFixed(2)}` : "--"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 text-right">{item.reduction > 0 ? `¥${item.reduction.toFixed(2)}` : "--"}</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-800 text-right">¥{item.payable.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.shipMethod === "配送" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{item.shipMethod}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.vehicle}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.company}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[140px] truncate">{item.address}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.contact}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.phone}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.creator}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.salesman}</td>
                <td className="px-4 py-2.5 sticky right-0 bg-white shadow-[-2px_0_6px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setConvertId(item.id)} className="p-1 text-[11px] text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-0.5" title="转正式单">
                      <ConvertIcon sx={{ fontSize: 14 }} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><EditIcon sx={{ fontSize: 14 }} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><DeleteIcon sx={{ fontSize: 14 }} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{filtered.length}</span> 条</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
            <button onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))} disabled={currentPage >= (totalPages || 1)} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
          </div>
        </div>
      </div>

      {deleteId && <ConfirmDialog title="提示" message="确认删除此报价单？删除后不可恢复。" onClose={() => setDeleteId(null)} onConfirm={handleDelete} />}
      {convertId && <ConfirmDialog title="转正式单" message="确认将此报价单转为正式销售订单？" onClose={() => setConvertId(null)} onConfirm={handleConvert} confirmClass="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" />}
    </div>
  );
}

// ─── Quote Details Tab ────────────────────────────────────────────────────────

function QuoteDetailsTab() {
  const [kwCustomer, setKwCustomer] = useState("");
  const [kwPart, setKwPart] = useState("");
  const [salesman, setSalesman] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = mockDetails.filter(d =>
    (!kwCustomer || d.customer.includes(kwCustomer) || d.orderNo.includes(kwCustomer)) &&
    (!kwPart || d.partName.includes(kwPart) || d.partCode.includes(kwPart)) &&
    (!salesman || d.salesman === salesman)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">客户查询：</span>
            <input value={kwCustomer} onChange={(e) => setKwCustomer(e.target.value)} placeholder="姓名/电话/VIN码/单号" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">配件查询：</span>
            <input value={kwPart} onChange={(e) => setKwPart(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">销售员：</span>
            <FauxSelect className="flex-1" value={salesman} onChange={(e) => setSalesman(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              {salesmen.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">报价时间：</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <span className="text-gray-400 text-xs shrink-0">~</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="flex items-center gap-2 col-start-4 justify-end">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setKwCustomer(""); setKwPart(""); setSalesman(""); setDateFrom(""); setDateTo(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
          <ExportIcon sx={{ fontSize: 16 }} />导出
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">报价时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件编码</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单位</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">数量</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本价</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">售价</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">总成本</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">总售价</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">销售员</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.quoteTime}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-blue-600 whitespace-nowrap">{item.orderNo}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.customer}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.partName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.partCode}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.spec}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.unit}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{item.qty}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{item.costPrice.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{item.salePrice.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700 text-right">¥{item.totalCost.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-800 text-right">¥{item.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.salesman}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{filtered.length}</span> 条</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
            <button onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))} disabled={currentPage >= (totalPages || 1)} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabKey = "quotes" | "details";

export function QuotationOrder() {
  const [activeTab, setActiveTab] = useState<TabKey>("quotes");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "quotes", label: "报价单据" },
    { key: "details", label: "报价明细" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">报价/草稿单据</h2>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex items-center">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === tab.key ? "text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              {tab.label}
              {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "quotes" && <QuotesTab />}
      {activeTab === "details" && <QuoteDetailsTab />}
    </div>
  );
}

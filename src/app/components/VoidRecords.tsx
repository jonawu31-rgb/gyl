import { useState } from "react";
import {
  Search as SearchIcon, Refresh as RefreshIcon,
  Visibility as ViewIcon, Close as CloseIcon,
} from "@mui/icons-material";

interface VoidDetail {
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface VoidRecord {
  voidId: string;
  documentId: string;
  documentType: "sale" | "quote" | "repayment" | "purchase";
  customerOrSupplier: string;
  voidDate: string;
  voidReason: string;
  operator: string;
  originalAmount: number;
  details: VoidDetail[];
}

const DOC_TYPE_LABELS: Record<string, string> = {
  sale: "销售单", quote: "报价单", repayment: "还款记录", purchase: "采购单",
};

const DOC_TYPE_COLORS: Record<string, string> = {
  sale: "bg-blue-100 text-blue-700",
  quote: "bg-purple-100 text-purple-700",
  repayment: "bg-green-100 text-green-700",
  purchase: "bg-orange-100 text-orange-700",
};

const initRecords: VoidRecord[] = [
  {
    voidId: "V001", documentId: "XS20260510-008", documentType: "sale",
    customerOrSupplier: "广州正大汽配有限公司", voidDate: "2026-05-12 14:23",
    voidReason: "重复开单，已另行补开", operator: "张伟", originalAmount: 5820,
    details: [
      { productName: "刹车片（前轮）", quantity: 4, unitPrice: 320, amount: 1280 },
      { productName: "机油滤清器", quantity: 10, unitPrice: 68, amount: 680 },
      { productName: "空气滤清器", quantity: 8, unitPrice: 98, amount: 784 },
      { productName: "机油 5W-30", quantity: 12, unitPrice: 256, amount: 3072 },
    ],
  },
  {
    voidId: "V002", documentId: "BJ20260515-003", documentType: "quote",
    customerOrSupplier: "深圳汽配城贸易有限公司", voidDate: "2026-05-16 10:08",
    voidReason: "客户取消询价，双方协商终止", operator: "李明", originalAmount: 23600,
    details: [
      { productName: "减震器（前）", quantity: 20, unitPrice: 580, amount: 11600 },
      { productName: "刹车盘", quantity: 20, unitPrice: 380, amount: 7600 },
      { productName: "轮毂轴承", quantity: 20, unitPrice: 220, amount: 4400 },
    ],
  },
  {
    voidId: "V003", documentId: "HK20260518-001", documentType: "repayment",
    customerOrSupplier: "东莞德顺配件商行", voidDate: "2026-05-18 16:40",
    voidReason: "还款金额录入有误，已重新开还款单", operator: "王芳", originalAmount: 8000,
    details: [],
  },
  {
    voidId: "V004", documentId: "CG20260520-005", documentType: "purchase",
    customerOrSupplier: "上海汇众汽配供应商", voidDate: "2026-05-20 09:15",
    voidReason: "供应商无货，取消此次采购", operator: "张伟", originalAmount: 45000,
    details: [
      { productName: "发动机总成", quantity: 3, unitPrice: 8500, amount: 25500 },
      { productName: "变速箱总成", quantity: 2, unitPrice: 9750, amount: 19500 },
    ],
  },
  {
    voidId: "V005", documentId: "XS20260522-012", documentType: "sale",
    customerOrSupplier: "佛山荣华汽配行", voidDate: "2026-05-22 11:30",
    voidReason: "客户退单，商品尚未发货", operator: "李明", originalAmount: 3560,
    details: [
      { productName: "蓄电池 12V/60Ah", quantity: 4, unitPrice: 580, amount: 2320 },
      { productName: "火花塞（铂金）", quantity: 16, unitPrice: 78, amount: 1248 },
    ],
  },
];

export function VoidRecords() {
  const [records] = useState<VoidRecord[]>(initRecords);
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewDetail, setViewDetail] = useState<VoidRecord | null>(null);

  const filtered = records.filter((r) =>
    (!keyword || r.documentId.toLowerCase().includes(keyword.toLowerCase()) || r.customerOrSupplier.includes(keyword)) &&
    (!filterType || r.documentType === filterType) &&
    (!startDate || r.voidDate >= startDate) &&
    (!endDate || r.voidDate <= endDate + " 99")
  );

  const totalAmount = filtered.reduce((s, r) => s + r.originalAmount, 0);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">作废记录</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <button onClick={() => { setKeyword(""); setFilterType(""); setStartDate(""); setEndDate(""); }}
          className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
          <RefreshIcon sx={{ fontSize: 16 }} />重置筛选
        </button>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-56">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="单据编号/客户名称..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700">
            <option value="">全部单据类型</option>
            {Object.entries(DOC_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <div className="flex items-center gap-1.5">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700" />
            <span className="text-gray-400 text-sm">至</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700" />
          </div>
          <span className="text-xs text-gray-400">共 {filtered.length} 条</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["单据编号", "单据类型", "客户/供应商", "作废日期", "作废原因", "操作人", "原单金额", "操作"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.voidId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-600">{r.documentId}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${DOC_TYPE_COLORS[r.documentType]}`}>
                    {DOC_TYPE_LABELS[r.documentType]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{r.customerOrSupplier}</td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.voidDate}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px]">
                  <span className="truncate block">{r.voidReason}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.operator}</td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">¥{r.originalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button title="查看详情" onClick={() => setViewDetail(r)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ViewIcon sx={{ fontSize: 16 }} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0 flex items-center justify-between">
        <p className="text-xs text-gray-400">共 {records.length} 条作废记录 · 作废记录不可编辑或恢复</p>
        <p className="text-xs text-gray-500">当前筛选金额合计：<span className="font-semibold text-red-600">¥{totalAmount.toLocaleString()}</span></p>
      </div>

      {viewDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 760, maxHeight: 580 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-800">作废单据详情</h3>
                <p className="text-xs text-gray-400 mt-0.5">{viewDetail.documentId}</p>
              </div>
              <button onClick={() => setViewDetail(null)} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
            </div>

            {/* Basic info */}
            <div className="px-5 py-3 border-b border-gray-200 shrink-0">
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-xs text-gray-500">单据类型</p>
                  <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${DOC_TYPE_COLORS[viewDetail.documentType]}`}>{DOC_TYPE_LABELS[viewDetail.documentType]}</span>
                </div>
                <div><p className="text-xs text-gray-500">客户/供应商</p><p className="text-sm font-medium text-gray-800 mt-0.5">{viewDetail.customerOrSupplier}</p></div>
                <div><p className="text-xs text-gray-500">原单金额</p><p className="text-sm font-bold text-red-600 mt-0.5">¥{viewDetail.originalAmount.toLocaleString()}</p></div>
              </div>
            </div>

            {/* Void info */}
            <div className="px-5 py-3 bg-red-50 border-b border-red-100 shrink-0">
              <p className="text-xs font-semibold text-red-700 mb-2">作废信息</p>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-xs text-gray-500">作废时间</p><p className="text-sm text-gray-800 mt-0.5">{viewDetail.voidDate}</p></div>
                <div><p className="text-xs text-gray-500">操作人</p><p className="text-sm text-gray-800 mt-0.5">{viewDetail.operator}</p></div>
                <div><p className="text-xs text-gray-500">作废原因</p><p className="text-sm text-gray-800 mt-0.5">{viewDetail.voidReason}</p></div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 overflow-auto">
              {viewDetail.details.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-sm text-gray-400">该单据类型无商品明细记录</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="border-b border-gray-200">
                      {["商品名称", "数量", "单价", "金额"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viewDetail.details.map((d, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-sm text-gray-800">{d.productName}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-700">{d.quantity}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-700">¥{d.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-800">¥{d.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td colSpan={3} className="px-4 py-2.5 text-sm font-bold text-gray-700">合计</td>
                      <td className="px-4 py-2.5 text-sm font-bold text-red-600">
                        ¥{viewDetail.details.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex justify-end shrink-0">
              <button onClick={() => setViewDetail(null)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

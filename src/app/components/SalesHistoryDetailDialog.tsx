import { Close as CloseIcon } from "@mui/icons-material";

interface SalesHistoryDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: any;
}

interface DetailItem {
  id: string;
  settlementTime: string;
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

const mockDetailData: DetailItem[] = [
  {
    id: "1",
    settlementTime: "2026-05-22 18:19:59",
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
    settlementTime: "2026-05-22 18:19:59",
    orderNo: "SY20260522001",
    source: "电脑",
    customerName: "黄山佳辉汽配",
    category: "A002",
    partName: "机油滤清器",
    specification: "标准",
    partCode: "OF001",
    unitPrice: 35.00,
    quantity: 5,
    discount: 5.00,
    deduction: 0,
    amount: 170.00,
    unitCost: 28.00,
    totalCost: 140.00,
    creator: "管理员",
    origin: "进口",
    supplier: "B供应商",
    warehouse: "主仓",
    type: "销售",
    remark: "",
  },
];

export function SalesHistoryDetailDialog({ open, onClose, order }: SalesHistoryDetailDialogProps) {
  if (!open) return null;

  // Calculate totals
  const totals = {
    quantity: mockDetailData.reduce((sum, item) => sum + item.quantity, 0),
    discount: mockDetailData.reduce((sum, item) => sum + item.discount, 0),
    deduction: mockDetailData.reduce((sum, item) => sum + item.deduction, 0),
    amount: mockDetailData.reduce((sum, item) => sum + item.amount, 0),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <h2 className="text-lg font-bold text-gray-800">明细</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">序号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">结算时间</th>
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
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.settlementTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{item.orderNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.partName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.specification}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.partCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.discount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.deduction.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.unitCost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.totalCost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.creator}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.origin}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.supplier}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.warehouse}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.remark}</td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-blue-50 border-t-2 border-blue-200 font-semibold">
                <td className="px-4 py-3 text-sm text-gray-900" colSpan={10}>合计</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{totals.quantity}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{totals.discount.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{totals.deduction.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{totals.amount.toFixed(2)}</td>
                <td className="px-4 py-3" colSpan={8}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

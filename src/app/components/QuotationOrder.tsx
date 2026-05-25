import { useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import { QuotationOrderDialog } from "./QuotationOrderDialog";

interface QuotationOrderItem {
  id: string;
  orderNo: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
  salesperson: string;
  paymentStatus: string;
  deliveryStatus: string;
  validUntil: string;
}

const mockData: QuotationOrderItem[] = [
  {
    id: "1",
    orderNo: "BJ2605220005-0012",
    date: "2026-05-22 18:19:59",
    customer: "黄山佳辉汽配",
    amount: 146.00,
    status: "审核",
    salesperson: "管理员",
    paymentStatus: "未付",
    deliveryStatus: "未发",
    validUntil: "2026-06-22",
  },
  {
    id: "2",
    orderNo: "BJ2605220004-0011",
    date: "2026-05-22 15:30:22",
    customer: "济南恒通汽车",
    amount: 2380.50,
    status: "审核",
    salesperson: "张三",
    paymentStatus: "已付",
    deliveryStatus: "已发",
    validUntil: "2026-06-15",
  },
  {
    id: "3",
    orderNo: "BJ2605220003-0010",
    date: "2026-05-22 14:12:15",
    customer: "深圳明辉配件",
    amount: 1256.80,
    status: "草稿",
    salesperson: "李四",
    paymentStatus: "部分付",
    deliveryStatus: "未发",
    validUntil: "2026-06-10",
  },
];

export function QuotationOrder() {
  const [searchText, setSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<QuotationOrderItem | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(mockData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleAddNew = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  const handleEdit = (order: QuotationOrderItem) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">报价订单</h2>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddNew}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <AddIcon sx={{ fontSize: 16 }} />
              新增报价单
            </button>
            <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <EditIcon sx={{ fontSize: 16 }} />
              编辑
            </button>
            <button className="px-3 py-1.5 bg-white text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors border border-gray-200 flex items-center gap-1.5">
              <DeleteIcon sx={{ fontSize: 16 }} />
              删除
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <PrintIcon sx={{ fontSize: 16 }} />
              打印
            </button>
            <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <ExportIcon sx={{ fontSize: 16 }} />
              导出
            </button>
            <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />
              刷新
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <SearchIcon sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索单据编号、客户..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm placeholder:text-gray-400"
                />
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-2">
              <FilterIcon sx={{ fontSize: 18 }} />
              高级筛选
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === mockData.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单据编号</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">日期</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">金额</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">业务员</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">有效期至</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">付款状态</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">发货状态</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer ${
                    selectedItems.includes(item.id) ? "bg-blue-50/30" : ""
                  }`}
                  onClick={() => handleEdit(item)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">{item.orderNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium text-right">¥{item.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.status === "审核"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.salesperson}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.validUntil}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.paymentStatus === "已付"
                        ? "bg-green-100 text-green-700"
                        : item.paymentStatus === "部分付"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {item.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.deliveryStatus === "已发"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {item.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-700 text-xs transition-colors"
                      >
                        查看
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-xs transition-colors">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              已选择 <span className="font-semibold text-gray-800">{selectedItems.length}</span> 项 / 共 <span className="font-semibold text-gray-800">{mockData.length}</span> 项
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                上一页
              </button>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">1</button>
                <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">2</button>
                <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">3</button>
              </div>
              <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <QuotationOrderDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          orderData={selectedOrder}
        />
      )}
    </>
  );
}

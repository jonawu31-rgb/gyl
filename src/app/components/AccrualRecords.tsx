import { useState, useMemo } from "react";
import {
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface AccrualRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  accrualDate: string;
  accrualAmount: number;
  repaidAmount: number;
  balance: number;
  status: "未结清" | "已结清";
  expectedRepayDate: string;
  details: AccrualDetail[];
}

interface AccrualDetail {
  id: string;
  accrualDate: string;
  accrualAmount: number;
  repaidAmount: number;
  balance: number;
  status: "未结清" | "已结清";
  expectedRepayDate: string;
}

const mockAccruals: AccrualRecord[] = [
  {
    id: "1",
    customerId: "C001",
    customerName: "张三汽修",
    customerPhone: "13800138000",
    accrualDate: "2024-05-15",
    accrualAmount: 15000,
    repaidAmount: 8000,
    balance: 7000,
    status: "未结清",
    expectedRepayDate: "2024-06-15",
    details: [
      {
        id: "D1",
        accrualDate: "2024-05-15",
        accrualAmount: 8000,
        repaidAmount: 5000,
        balance: 3000,
        status: "未结清",
        expectedRepayDate: "2024-06-15",
      },
      {
        id: "D2",
        accrualDate: "2024-05-20",
        accrualAmount: 7000,
        repaidAmount: 3000,
        balance: 4000,
        status: "未结清",
        expectedRepayDate: "2024-06-15",
      },
    ],
  },
  {
    id: "2",
    customerId: "C002",
    customerName: "李四汽配",
    customerPhone: "13900139000",
    accrualDate: "2024-05-10",
    accrualAmount: 12000,
    repaidAmount: 12000,
    balance: 0,
    status: "已结清",
    expectedRepayDate: "2024-06-10",
    details: [
      {
        id: "D3",
        accrualDate: "2024-05-10",
        accrualAmount: 12000,
        repaidAmount: 12000,
        balance: 0,
        status: "已结清",
        expectedRepayDate: "2024-06-10",
      },
    ],
  },
  {
    id: "3",
    customerId: "C003",
    customerName: "王五修理厂",
    customerPhone: "13700137000",
    accrualDate: "2024-05-18",
    accrualAmount: 20000,
    repaidAmount: 5000,
    balance: 15000,
    status: "未结清",
    expectedRepayDate: "2024-06-20",
    details: [
      {
        id: "D4",
        accrualDate: "2024-05-18",
        accrualAmount: 20000,
        repaidAmount: 5000,
        balance: 15000,
        status: "未结清",
        expectedRepayDate: "2024-06-20",
      },
    ],
  },
];

// 欠款明细弹框
function AccrualDetailDialog({
  open,
  onClose,
  record,
}: {
  open: boolean;
  onClose: () => void;
  record: AccrualRecord | null;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!open || !record) return null;

  const filteredDetails = useMemo(() => {
    return record.details.filter((detail) => {
      if (startDate && detail.accrualDate < startDate) return false;
      if (endDate && detail.accrualDate > endDate) return false;
      return true;
    });
  }, [record.details, startDate, endDate]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">
            欠款明细 - {record.customerName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 whitespace-nowrap">日期范围:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
            <span className="text-sm text-gray-500">至</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">挂账日期</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700">挂账金额</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700">已还金额</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-700">欠款余额</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700">状态</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">预还款日</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((detail) => (
                <tr key={detail.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2 text-sm text-gray-700">{detail.accrualDate}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">¥{detail.accrualAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-right">¥{detail.repaidAmount.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-red-600 text-right font-medium">¥{detail.balance.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      detail.status === "已结清" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {detail.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{detail.expectedRepayDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

// 批量还款弹框
function BatchRepayDialog({
  open,
  onClose,
  selectedRecords,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  selectedRecords: AccrualRecord[];
  onConfirm: (amount: number, method: string, remark: string) => void;
}) {
  const [repayAmount, setRepayAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [remark, setRemark] = useState("");

  if (!open) return null;

  const totalBalance = selectedRecords.reduce((sum, r) => sum + r.balance, 0);

  const handleConfirm = () => {
    const amount = parseFloat(repayAmount);
    if (!amount || amount <= 0) {
      alert("请输入有效的还款金额");
      return;
    }
    if (amount > totalBalance) {
      alert("还款金额不能超过欠款余额");
      return;
    }
    if (!paymentMethod) {
      alert("请选择还款方式");
      return;
    }
    onConfirm(amount, paymentMethod, remark);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">批量还款</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">选中记录</h3>
            <div className="space-y-1">
              {selectedRecords.map((record) => (
                <div key={record.id} className="text-sm text-gray-600">
                  {record.customerName} - 欠款余额: ¥{record.balance.toFixed(2)}
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-800">
                合计欠款余额: <span className="text-red-600 text-base">¥{totalBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
              <span className="text-red-500">*</span> 还款金额:
            </label>
            <div className="flex-1 flex items-center gap-1">
              <span className="text-sm text-gray-500">¥</span>
              <input
                type="number"
                placeholder="0.00"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
              <span className="text-red-500">*</span> 还款方式:
            </label>
            <FauxSelect
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">请选择</option>
              <option value="现金">现金</option>
              <option value="银行转账">银行转账</option>
              <option value="微信">微信</option>
              <option value="支付宝">支付宝</option>
              <option value="其他">其他</option>
            </FauxSelect>
          </div>

          <div className="flex items-start gap-2">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0 pt-1.5">备注:</label>
            <textarea
              placeholder="请输入"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            确认还款
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

export function AccrualRecords() {
  const [searchCustomer, setSearchCustomer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [data, setData] = useState<AccrualRecord[]>(mockAccruals);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AccrualRecord | null>(null);
  const [batchRepayOpen, setBatchRepayOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchCustomer = !searchCustomer || 
        item.customerName.includes(searchCustomer) || 
        item.customerPhone.includes(searchCustomer);
      const matchDate = (!startDate || item.accrualDate >= startDate) && 
                       (!endDate || item.accrualDate <= endDate);
      const matchStatus = !searchStatus || item.status === searchStatus;
      return matchCustomer && matchDate && matchStatus;
    });
  }, [data, searchCustomer, startDate, endDate, searchStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const selectedRecords = data.filter((r) => selectedIds.has(r.id));

  const handleReset = () => {
    setSearchCustomer("");
    setStartDate("");
    setEndDate("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(pagedData.filter(r => r.status === "未结清").map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleViewDetail = (record: AccrualRecord) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  };

  const handleBatchRepay = () => {
    if (selectedIds.size === 0) {
      alert("请先选择欠款记录");
      return;
    }
    // 检查是否为同一客户
    const customerIds = new Set(selectedRecords.map(r => r.customerId));
    if (customerIds.size > 1) {
      alert("批量还款只能选择同一客户的欠款记录");
      return;
    }
    setBatchRepayOpen(true);
  };

  const handleConfirmRepay = (amount: number, method: string, remark: string) => {
    // 这里应该调用API进行还款操作
    alert(`还款成功！金额: ¥${amount.toFixed(2)}, 方式: ${method}`);
    setSelectedIds(new Set());
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">挂账/欠款记录</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-16">
              客户:
            </label>
            <input
              type="text"
              placeholder="客户名称/手机号"
              value={searchCustomer}
              onChange={(e) => {
                setSearchCustomer(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0">
              挂账日期:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
            <span className="text-sm text-gray-500">至</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-12">
              状态:
            </label>
            <FauxSelect
              value={searchStatus}
              onChange={(e) => {
                setSearchStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-36 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
            >
              <option value="">全部</option>
              <option value="未结清">未结清</option>
              <option value="已结清">已结清</option>
            </FauxSelect>
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1.5 shrink-0"
          >
            <SearchIcon sx={{ fontSize: 15 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shrink-0"
          >
            重置
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBatchRepay}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
            disabled={selectedIds.size === 0}
          >
            批量还款
          </button>
          <span className="text-sm text-gray-600">
            已选择 {selectedIds.size} 项
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full" style={{ minWidth: "1200px" }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-12">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedIds.size > 0 && selectedIds.size === pagedData.filter(r => r.status === "未结清").length}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                客户名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                挂账日期
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">
                挂账金额
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">
                已还金额
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">
                欠款余额
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                状态
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                预还款日
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              pagedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                      disabled={item.status === "已结清"}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {item.customerName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.accrualDate}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900 text-right font-medium">
                    ¥{item.accrualAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 text-right">
                    ¥{item.repaidAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-red-600 text-right font-medium">
                    ¥{item.balance.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "已结清"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.expectedRepayDate}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      欠款明细
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{filteredData.length}</span> 条数据
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{pageSize}条/页</span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              前往
              <input
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = parseInt((e.target as HTMLInputElement).value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }
                }}
                className="w-12 px-2 py-1 text-center border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
              />
              页
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AccrualDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        record={selectedRecord}
      />

      <BatchRepayDialog
        open={batchRepayOpen}
        onClose={() => setBatchRepayOpen(false)}
        selectedRecords={selectedRecords}
        onConfirm={handleConfirmRepay}
      />
    </div>
  );
}

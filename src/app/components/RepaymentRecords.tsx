import { useState, useMemo } from "react";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface RepaymentRecord {
  id: string;
  customerId: string;
  customerName: string;
  repaymentDate: string;
  amount: number;
  method: string;
  relatedAccrual: string;
  operator: string;
  status: "正常" | "已作废";
  voidReason?: string;
  createTime: string;
}

const mockRepayments: RepaymentRecord[] = [
  {
    id: "1",
    customerId: "C001",
    customerName: "张三汽修",
    repaymentDate: "2024-05-20",
    amount: 5000,
    method: "银行转账",
    relatedAccrual: "ACC001",
    operator: "王萌(虎盟)",
    status: "正常",
    createTime: "2024-05-20 10:30",
  },
  {
    id: "2",
    customerId: "C001",
    customerName: "张三汽修",
    repaymentDate: "2024-05-25",
    amount: 3000,
    method: "现金",
    relatedAccrual: "ACC001",
    operator: "王萌(虎盟)",
    status: "正常",
    createTime: "2024-05-25 14:20",
  },
  {
    id: "3",
    customerId: "C002",
    customerName: "李四汽配",
    repaymentDate: "2024-05-15",
    amount: 12000,
    method: "银行转账",
    relatedAccrual: "ACC002",
    operator: "张敏",
    status: "正常",
    createTime: "2024-05-15 09:15",
  },
  {
    id: "4",
    customerId: "C003",
    customerName: "王五修理厂",
    repaymentDate: "2024-05-22",
    amount: 5000,
    method: "微信",
    relatedAccrual: "ACC003",
    operator: "李强",
    status: "正常",
    createTime: "2024-05-22 16:45",
  },
  {
    id: "5",
    customerId: "C001",
    customerName: "张三汽修",
    repaymentDate: "2024-05-18",
    amount: 2000,
    method: "现金",
    relatedAccrual: "ACC001",
    operator: "王萌(虎盟)",
    status: "已作废",
    voidReason: "客户要求作废，重新开单",
    createTime: "2024-05-18 11:00",
  },
];

// 作废确认弹框
function VoidConfirmDialog({
  open,
  onClose,
  onConfirm,
  record,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  record: RepaymentRecord | null;
}) {
  const [voidReason, setVoidReason] = useState("");

  if (!open || !record) return null;

  const handleConfirm = () => {
    if (!voidReason.trim()) {
      alert("请输入作废原因");
      return;
    }
    onConfirm(voidReason);
    setVoidReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">作废还款记录</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <WarningIcon sx={{ fontSize: 20 }} className="text-yellow-600" />
            <div className="text-sm text-yellow-800">
              作废后将恢复相关挂账的欠款余额，且不可撤销
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">客户:</span> {record.customerName}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">还款金额:</span> ¥{record.amount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">还款日期:</span> {record.repaymentDate}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> 作废原因
            </label>
            <textarea
              placeholder="请输入作废原因"
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            确认作废
          </button>
        </div>
      </div>
    </div>
  );
}

export function RepaymentRecords() {
  const [searchCustomer, setSearchCustomer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [data, setData] = useState<RepaymentRecord[]>(mockRepayments);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RepaymentRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchCustomer = !searchCustomer || 
        item.customerName.includes(searchCustomer);
      const matchDate = (!startDate || item.repaymentDate >= startDate) && 
                       (!endDate || item.repaymentDate <= endDate);
      const matchStatus = !searchStatus || item.status === searchStatus;
      return matchCustomer && matchDate && matchStatus;
    });
  }, [data, searchCustomer, startDate, endDate, searchStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReset = () => {
    setSearchCustomer("");
    setStartDate("");
    setEndDate("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleVoid = (record: RepaymentRecord) => {
    setSelectedRecord(record);
    setVoidDialogOpen(true);
  };

  const confirmVoid = (reason: string) => {
    if (selectedRecord) {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id
            ? { ...item, status: "已作废", voidReason: reason }
            : item
        )
      );
      alert("作废成功");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">还款记录</h2>
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
              placeholder="客户名称"
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
              还款日期:
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
              <option value="正常">正常</option>
              <option value="已作废">已作废</option>
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

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full" style={{ minWidth: "1200px" }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                客户名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                还款日期
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">
                还款金额
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                还款方式
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                关联挂账
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                操作人
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                状态
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                创建时间
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
                  <td className="px-4 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {item.customerName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.repaymentDate}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900 text-right font-medium">
                    ¥{item.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">
                    {item.method}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.relatedAccrual}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">
                    {item.operator}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "正常"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">
                    {item.createTime}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    {item.status === "正常" ? (
                      <button
                        onClick={() => handleVoid(item)}
                        className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        作废
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
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
      <VoidConfirmDialog
        open={voidDialogOpen}
        onClose={() => setVoidDialogOpen(false)}
        onConfirm={confirmVoid}
        record={selectedRecord}
      />
    </div>
  );
}

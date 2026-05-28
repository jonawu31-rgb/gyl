import { useState } from "react";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface BillRow {
  id: string;
  repaymentStatus: "unpaid" | "paid";
  preRepayTime: string;
  openTime: string;
  orderNo: string;
  source: string;
  customerName: string;
  cost: number;
  salePrice: number;
  freight: number;
  discount: number;
}

interface DetailRow {
  id: string;
  repaymentStatus: "unpaid" | "paid";
  salesTime: string;
  orderNo: string;
  source: string;
  customerName: string;
  category: string;
  partName: string;
  spec: string;
  code: string;
  unitPrice: number;
  quantity: number;
  discount: number;
}

const STATUS_LABELS: Record<
  BillRow["repaymentStatus"],
  string
> = {
  unpaid: "未结清",
  paid: "已结清",
};

const STATUS_COLORS: Record<
  BillRow["repaymentStatus"],
  string
> = {
  unpaid: "bg-red-100 text-red-700",
  paid: "bg-green-100 text-green-700",
};

const billRows: BillRow[] = [
  {
    id: "B001",
    repaymentStatus: "unpaid",
    preRepayTime: "2026-06-10",
    openTime: "2026-05-10 09:12",
    orderNo: "HD20260510001",
    source: "前台",
    customerName: "广州恒达汽配行",
    cost: 1280,
    salePrice: 1850,
    freight: 0,
    discount: 50,
  },
  {
    id: "B002",
    repaymentStatus: "paid",
    preRepayTime: "2026-05-28",
    openTime: "2026-04-28 14:30",
    orderNo: "HD20260428008",
    source: "前台",
    customerName: "深圳鑫源汽配店",
    cost: 820,
    salePrice: 1180,
    freight: 20,
    discount: 0,
  },
  {
    id: "B003",
    repaymentStatus: "unpaid",
    preRepayTime: "2026-06-15",
    openTime: "2026-05-15 16:20",
    orderNo: "HD20260515003",
    source: "业务员",
    customerName: "东莞汇美汽配城",
    cost: 2500,
    salePrice: 3680,
    freight: 30,
    discount: 100,
  },
];

const detailRows: DetailRow[] = [
  {
    id: "D001",
    repaymentStatus: "unpaid",
    salesTime: "2026-05-10 09:12",
    orderNo: "HD20260510001",
    source: "前台",
    customerName: "广州恒达汽配行",
    category: "制动系统",
    partName: "刹车片",
    spec: "前轮",
    code: "SP00123",
    unitPrice: 320,
    quantity: 4,
    discount: 20,
  },
  {
    id: "D002",
    repaymentStatus: "unpaid",
    salesTime: "2026-05-10 09:12",
    orderNo: "HD20260510001",
    source: "前台",
    customerName: "广州恒达汽配行",
    category: "润滑系统",
    partName: "机油滤清器",
    spec: "通用",
    code: "SP00456",
    unitPrice: 68,
    quantity: 10,
    discount: 30,
  },
  {
    id: "D003",
    repaymentStatus: "paid",
    salesTime: "2026-04-28 14:30",
    orderNo: "HD20260428008",
    source: "前台",
    customerName: "深圳鑫源汽配店",
    category: "悬挂系统",
    partName: "减震器",
    spec: "前",
    code: "SP00988",
    unitPrice: 580,
    quantity: 20,
    discount: 0,
  },
];

const METHOD_OPTIONS = [
  "现金",
  "微信支付",
  "支付宝",
  "银行转账",
  "其他",
];

function DetailDialog({
  bill,
  onClose,
}: {
  bill: BillRow;
  onClose: () => void;
}) {
  const rows = detailRows.filter(
    (item) => item.orderNo === bill.orderNo,
  );
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: 1000, height: 600 }}
      >
        <div
          className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              挂账明细
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {bill.customerName} · {bill.orderNo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {[
                  "挂账日期",
                  "挂账金额",
                  "已还金额",
                  "欠款余额",
                  "预还款日",
                  "状态",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.salesTime.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ¥{row.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-700">
                    ¥0
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">
                    ¥{row.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {bill.preRepayTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[row.repaymentStatus]}`}
                    >
                      {STATUS_LABELS[row.repaymentStatus]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-sm text-gray-600">
            共{" "}
            <span className="font-semibold">{rows.length}</span>{" "}
            笔 · 总欠款余额
            <span className="font-semibold text-red-600 ml-1">
              ¥
              {rows
                .reduce((sum, row) => sum + row.unitPrice, 0)
                .toLocaleString()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function BatchRepayDialog({
  rows,
  onClose,
  onConfirm,
}: {
  rows: BillRow[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
}) {
  const [method, setMethod] = useState("现金");
  const [remark, setRemark] = useState("");
  const total = rows.reduce(
    (sum, row) => sum + row.salePrice,
    0,
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: 1000, height: 600 }}
      >
        <div
          className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">
            批量还款
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5 min-h-0">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-4">
            <span className="text-sm text-gray-700">
              已选{" "}
              <span className="font-semibold text-blue-600">
                {rows.length}
              </span>{" "}
              条欠款记录
            </span>
            <span className="text-sm text-gray-700">
              合计还款金额：
              <span className="font-semibold text-red-600 text-base">
                ¥
                {total.toLocaleString("zh-CN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </span>
          </div>
          <table className="w-full mb-5">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                {[
                  "客户名称",
                  "挂账日期",
                  "挂账金额",
                  "已还金额",
                  "欠款余额",
                  "预还款日",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100"
                >
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                    {row.customerName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">
                    {row.openTime.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900">
                    ¥{row.cost.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-green-700">
                    ¥0
                  </td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-red-600">
                    ¥{row.salePrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">
                    {row.preRepayTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                还款方式 <span className="text-red-500">*</span>
              </label>
              <FauxSelect
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              >
                {METHOD_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </FauxSelect>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                备注
              </label>
              <input
                type="text"
                placeholder="请输入备注"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm(rows.map((row) => row.id));
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            确认还款
          </button>
        </div>
      </div>
    </div>
  );
}

export function DebtRecord() {
  const [tab, setTab] = useState<"bill" | "detail">("bill");
  const [bills, setBills] = useState<BillRow[]>(billRows);
  const [detailItems] = useState<DetailRow[]>(detailRows);
  const [keyword, setKeyword] = useState("");
  const [repaymentStatus, setRepaymentStatus] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailTarget, setDetailTarget] =
    useState<BillRow | null>(null);
  const [batchRepayOpen, setBatchRepayOpen] = useState(false);

  const filteredBills = bills.filter((row) => {
    const kw = keyword.toLowerCase();
    const matchKw =
      !kw ||
      row.customerName.toLowerCase().includes(kw) ||
      row.orderNo.toLowerCase().includes(kw);
    const matchStatus =
      !repaymentStatus ||
      row.repaymentStatus === repaymentStatus;
    const matchSalesperson =
      !salesperson || row.source === salesperson;
    const matchStart =
      !startDate || row.openTime.slice(0, 10) >= startDate;
    const matchEnd =
      !endDate || row.openTime.slice(0, 10) <= endDate;
    return (
      matchKw &&
      matchStatus &&
      matchSalesperson &&
      matchStart &&
      matchEnd
    );
  });

  const filteredDetails = detailItems.filter((row) => {
    const kw = keyword.toLowerCase();
    const matchKw =
      !kw ||
      row.customerName.toLowerCase().includes(kw) ||
      row.orderNo.toLowerCase().includes(kw);
    const matchStatus =
      !repaymentStatus ||
      row.repaymentStatus === repaymentStatus;
    const matchSalesperson =
      !salesperson || row.source === salesperson;
    const matchStart =
      !startDate || row.salesTime.slice(0, 10) >= startDate;
    const matchEnd =
      !endDate || row.salesTime.slice(0, 10) <= endDate;
    return (
      matchKw &&
      matchStatus &&
      matchSalesperson &&
      matchStart &&
      matchEnd
    );
  });

  const visibleRows =
    tab === "bill" ? filteredBills : filteredDetails;
  const selectedBills = bills.filter((row) =>
    selectedIds.includes(row.id),
  );
  const allChecked =
    tab === "bill" &&
    filteredBills.length > 0 &&
    filteredBills.every((row) => selectedIds.includes(row.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !filteredBills.some((row) => row.id === id),
        ),
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([
          ...prev,
          ...filteredBills.map((row) => row.id),
        ]),
      ]);
    }
  };

  const handleConfirmRepay = (ids: string[]) => {
    setBills((prev) =>
      prev.map((row) =>
        ids.includes(row.id)
          ? { ...row, repaymentStatus: "paid" }
          : row,
      ),
    );
    setSelectedIds([]);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          挂账/欠款记录
        </h2>
      </div>

      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-3 gap-y-2.5 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">
              客户查询
            </span>
            <div className="relative flex-1 min-w-0">
              <SearchIcon
                sx={{ fontSize: 16 }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="名称/电话/VIN/牌号"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">
              还款状态
            </span>
            <FauxSelect
              value={repaymentStatus}
              onChange={(e) =>
                setRepaymentStatus(e.target.value)
              }
              className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-gray-700"
            >
              <option value="">请选择</option>
              <option value="unpaid">未结清</option>
              <option value="paid">已结清</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">
              来源
            </span>
            <FauxSelect
              value={salesperson}
              onChange={(e) => setSalesperson(e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-gray-700"
            >
              <option value="">请选择</option>
              <option value="前台">前台</option>
              <option value="业务员">业务员</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">
              销售时间
            </span>
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-0 flex-1 px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm bg-white"
              />
              <span className="text-gray-400 text-xs shrink-0">
                至
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-0 flex-1 px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm bg-white"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {}}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5 whitespace-nowrap"
          >
            <SearchIcon sx={{ fontSize: 16 }} />
            搜索
          </button>
          <button
            onClick={() => {
              setKeyword("");
              setRepaymentStatus("");
              setSalesperson("");
              setStartDate("");
              setEndDate("");
            }}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5 whitespace-nowrap"
          >
            <RefreshIcon sx={{ fontSize: 16 }} />
            重置
          </button>
          <span className="text-xs text-gray-400 self-center">
            共 {visibleRows.length} 条
          </span>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (selectedBills.length) setBatchRepayOpen(true);
            }}
            disabled={!selectedIds.length}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <PaymentIcon sx={{ fontSize: 16 }} />
            批量还款
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5 whitespace-nowrap">
            <FileDownloadIcon sx={{ fontSize: 16 }} />
            导出
          </button>
          {selectedIds.length > 0 && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
              已选 {selectedIds.length} 项
            </span>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("bill")}
            className={`px-5 py-2.5 text-sm font-medium transition-all relative ${
              tab === "bill"
                ? "text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            挂账账单
            {tab === "bill" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setTab("detail")}
            className={`px-5 py-2.5 text-sm font-medium transition-all relative ${
              tab === "detail"
                ? "text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            挂账明细
            {tab === "detail" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {tab === "bill" && (
                <th className="px-4 py-3 w-10" />
              )}
              {tab === "bill"
                ? [
                    "序号",
                    "还款状态",
                    "预还款时间",
                    "开单时间",
                    "订单号",
                    "来源",
                    "客户名称",
                    "成本",
                    "售价",
                    "运费",
                    "优惠",
                    "操作",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap ${h === "操作" ? "sticky right-0 z-20 bg-gray-50 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]" : ""}`}
                    >
                      {h}
                    </th>
                  ))
                : [
                    "序号",
                    "还款状态",
                    "销售时间",
                    "订单号",
                    "来源",
                    "客户名称",
                    "品类",
                    "配件名称",
                    "规格",
                    "编码",
                    "单价",
                    "数量",
                    "优惠",
                    "操作",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap ${h === "操作" ? "sticky right-0 z-20 bg-gray-50 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={tab === "bill" ? 13 : 14}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  暂无数据
                </td>
              </tr>
            ) : tab === "bill" ? (
              (visibleRows as BillRow[]).map((row, index) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.includes(row.id) ? "bg-blue-50/30" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(row.id)
                            ? prev.filter((id) => id !== row.id)
                            : [...prev, row.id],
                        )
                      }
                      className="rounded border-gray-300 text-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[row.repaymentStatus]}`}
                    >
                      {STATUS_LABELS[row.repaymentStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {row.preRepayTime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {row.openTime}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">
                    {row.orderNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.source}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {row.customerName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{row.cost.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{row.salePrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{row.freight.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{row.discount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 sticky right-0 bg-white z-10 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailTarget(row)}
                        className="px-2 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium whitespace-nowrap"
                        title="明细"
                      >
                        明细
                      </button>
                      {row.repaymentStatus === "unpaid" && (
                        <button
                          onClick={() => {
                            setSelectedIds([row.id]);
                            setBatchRepayOpen(true);
                          }}
                          className="px-2 py-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors text-xs font-medium whitespace-nowrap"
                          title="还款"
                        >
                          还款
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              (visibleRows as DetailRow[]).map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[row.repaymentStatus]}`}
                    >
                      {STATUS_LABELS[row.repaymentStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {row.salesTime}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">
                    {row.orderNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.source}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {row.customerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.partName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.spec}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {row.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{row.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {row.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ¥{row.discount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 sticky right-0 bg-white z-10 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]">
                    <button
                      onClick={() =>
                        setDetailTarget(
                          bills.find(
                            (bill) =>
                              bill.orderNo === row.orderNo,
                          ) ?? bills[0],
                        )
                      }
                      className="px-2 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium whitespace-nowrap"
                      title="明细"
                    >
                      明细
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            总欠款余额：
            <span className="font-semibold text-red-600">
              ¥
              {filteredBills
                .reduce((sum, row) => sum + row.salePrice, 0)
                .toLocaleString()}
            </span>
          </span>
          <span>共 {visibleRows.length} 条记录</span>
        </div>
      </div>

      {detailTarget && (
        <DetailDialog
          bill={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}
      {batchRepayOpen && (
        <BatchRepayDialog
          rows={selectedBills}
          onClose={() => setBatchRepayOpen(false)}
          onConfirm={handleConfirmRepay}
        />
      )}
    </div>
  );
}
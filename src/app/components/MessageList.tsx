import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface MessageRecord {
  id: string;
  type: string;
  title: string;
  customerName: string;
  orderNo: string;
  time: string;
  status: "已读" | "未读";
}

const mockData: MessageRecord[] = [
  { id: "1",  type: "订单", title: "新订单待处理",       customerName: "广州宏达汽配", orderNo: "SO2026052801", time: "2026-05-28 09:15:00", status: "未读" },
  { id: "2",  type: "售后", title: "售后申请待审核",     customerName: "深圳联合汽配", orderNo: "SO2026052701", time: "2026-05-28 08:40:00", status: "未读" },
  { id: "3",  type: "订单", title: "订单配货完成",       customerName: "东莞盛达零部件", orderNo: "SO2026052601", time: "2026-05-27 17:30:00", status: "未读" },
  { id: "4",  type: "订单", title: "新订单待处理",       customerName: "佛山鑫源汽配", orderNo: "SO2026052501", time: "2026-05-27 14:20:00", status: "已读" },
  { id: "5",  type: "售后", title: "售后申请已处理",     customerName: "惠州天驰配件", orderNo: "SO2026052401", time: "2026-05-26 11:00:00", status: "已读" },
  { id: "6",  type: "订单", title: "订单已发货通知",     customerName: "中山汽配城",   orderNo: "SO2026052301", time: "2026-05-26 09:45:00", status: "已读" },
  { id: "7",  type: "订单", title: "新订单待处理",       customerName: "珠海明达汽配", orderNo: "SO2026052201", time: "2026-05-25 16:30:00", status: "已读" },
  { id: "8",  type: "售后", title: "售后申请待审核",     customerName: "广州宏达汽配", orderNo: "SO2026052101", time: "2026-05-25 10:15:00", status: "已读" },
];

function DetailDialog({ record, onClose }: { record: MessageRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">消息详情</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {[
            ["类型", record.type],
            ["标题", record.title],
            ["客户名称", record.customerName],
            ["订单编号", record.orderNo],
            ["时间", record.time],
            ["状态", record.status],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3">
              <span className="text-sm text-gray-500 w-20 shrink-0">{label}：</span>
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
        </div>
      </div>
    </div>
  );
}

export function MessageList() {
  const [data, setData] = useState(mockData);
  const [searchType, setSearchType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [viewRecord, setViewRecord] = useState<MessageRecord | null>(null);

  const filtered = data.filter(r =>
    (!searchType || r.type === searchType) &&
    (!searchStatus || r.status === searchStatus)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchType(""); setSearchStatus(""); setCurrentPage(1); };

  const handleView = (record: MessageRecord) => {
    setData(prev => prev.map(r => r.id === record.id ? { ...r, status: "已读" } : r));
    setViewRecord({ ...record, status: "已读" });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">消息列表</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">类型：</span>
            <FauxSelect className="w-28" value={searchType} onChange={e => { setSearchType(e.target.value); setCurrentPage(1); }} placeholder="全部">
              <option value="">全部</option>
              <option value="订单">订单</option>
              <option value="售后">售后</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">状态：</span>
            <FauxSelect className="w-28" value={searchStatus} onChange={e => { setSearchStatus(e.target.value); setCurrentPage(1); }} placeholder="全部">
              <option value="">全部</option>
              <option value="未读">未读</option>
              <option value="已读">已读</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">标题</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单编号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${item.status === "未读" ? "bg-blue-50/30" : ""}`}>
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${item.type === "订单" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-orange-100 text-orange-700 border border-orange-200"}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-800">
                  {item.status === "未读" && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 align-middle" />}
                  {item.title}
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.customerName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 font-mono">{item.orderNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.time}</td>
                <td className="px-4 py-2.5">
                  {item.status === "未读"
                    ? <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 border border-red-200">未读</span>
                    : <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200">已读</span>}
                </td>
                <td className="px-4 py-2.5">
                  <button onClick={() => handleView(item)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                    <ViewIcon sx={{ fontSize: 13 }} />查看详情
                  </button>
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

      {viewRecord && <DetailDialog record={viewRecord} onClose={() => setViewRecord(null)} />}
    </div>
  );
}

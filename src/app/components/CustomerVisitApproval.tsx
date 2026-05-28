import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface ApprovalRecord {
  id: string;
  customerName: string;
  visitTime: string;
  visitor: string;
  approvalStatus: "待审批" | "已通过" | "已驳回";
  visitNote: string;
}

const mockData: ApprovalRecord[] = [
  { id: "1", customerName: "广州宏达汽配", visitTime: "2026-05-25 14:30", visitor: "黄伟霆", approvalStatus: "待审批", visitNote: "客户对近期采购表示满意，有意增加订单量，下次拜访重点介绍新品" },
  { id: "2", customerName: "惠州天驰配件", visitTime: "2026-05-18 14:00", visitor: "张三", approvalStatus: "待审批", visitNote: "开发新客户，对方已有合作意向，需要进一步跟进" },
  { id: "3", customerName: "深圳联合汽配", visitTime: "2026-05-24 10:00", visitor: "张三", approvalStatus: "已通过", visitNote: "与客户确认了Q3采购计划，主要涉及刹车系统配件" },
  { id: "4", customerName: "佛山鑫源汽配", visitTime: "2026-05-20 09:30", visitor: "黄伟霆", approvalStatus: "已通过", visitNote: "回访老客户，确认售后问题处理情况，客户满意度良好" },
  { id: "5", customerName: "中山汽配城", visitTime: "2026-05-15 11:00", visitor: "李四", approvalStatus: "已通过", visitNote: "例行拜访，了解客户库存情况，推荐季节性配件" },
  { id: "6", customerName: "东莞盛达零部件", visitTime: "2026-05-22 16:00", visitor: "李四", approvalStatus: "已驳回", visitNote: "介绍了新款滤清器系列，客户有意向，约定下周发报价" },
];

const statusBadge = (status: ApprovalRecord["approvalStatus"]) => {
  if (status === "待审批") return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 border border-yellow-200">待审批</span>;
  if (status === "已通过") return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">已通过</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 border border-red-200">已驳回</span>;
};

function ApproveConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">提示</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-6 text-sm text-gray-700">确认通过该拜访记录？</div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

function RejectDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = () => {
    if (!reason.trim()) { setError("请填写驳回原因"); return; }
    onConfirm(reason);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">驳回拜访记录</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block"><span className="text-red-500">*</span> 驳回原因</label>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setError(""); }}
              rows={4}
              placeholder="请输入驳回原因"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

export function CustomerVisitApproval() {
  const [data, setData] = useState(mockData);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchStatus, setSearchStatus] = useState("待审批");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const filtered = data.filter(r =>
    (!searchCustomer || r.customerName.includes(searchCustomer)) &&
    (!searchStatus || r.approvalStatus === searchStatus)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchCustomer(""); setSearchStatus("待审批"); setCurrentPage(1); };

  const handleApprove = () => {
    if (approveId) { setData(prev => prev.map(r => r.id === approveId ? { ...r, approvalStatus: "已通过" } : r)); setApproveId(null); }
  };

  const handleReject = (_reason: string) => {
    if (rejectId) { setData(prev => prev.map(r => r.id === rejectId ? { ...r, approvalStatus: "已驳回" } : r)); setRejectId(null); }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">拜访审批</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">客户名称：</span>
            <input value={searchCustomer} onChange={e => { setSearchCustomer(e.target.value); setCurrentPage(1); }} placeholder="请输入客户名称" className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">状态：</span>
            <FauxSelect className="w-32" value={searchStatus} onChange={e => { setSearchStatus(e.target.value); setCurrentPage(1); }} placeholder="请选择状态">
              <option value="">全部</option>
              <option value="待审批">待审批</option>
              <option value="已通过">已通过</option>
              <option value="已驳回">已驳回</option>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拜访时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拜访人</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">审批状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">拜访说明</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.customerName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.visitTime}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.visitor}</td>
                <td className="px-4 py-2.5">{statusBadge(item.approvalStatus)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 max-w-[240px]">
                  <span className="line-clamp-2">{item.visitNote}</span>
                </td>
                <td className="px-4 py-2.5">
                  {item.approvalStatus === "待审批" ? (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button onClick={() => setApproveId(item.id)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                        <ApproveIcon sx={{ fontSize: 13 }} />审批通过
                      </button>
                      <button onClick={() => setRejectId(item.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                        <RejectIcon sx={{ fontSize: 13 }} />驳回
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
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

      {approveId && <ApproveConfirm onClose={() => setApproveId(null)} onConfirm={handleApprove} />}
      {rejectId && <RejectDialog onClose={() => setRejectId(null)} onConfirm={handleReject} />}
    </div>
  );
}

import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface VisitRecord {
  id: string;
  customerName: string;
  visitTime: string;
  manager: string;
  approvalStatus: "待审批" | "已通过" | "已驳回";
  visitNote: string;
  photoCount: number;
  createdAt: string;
}

const mockData: VisitRecord[] = [
  { id: "1", customerName: "广州宏达汽配", visitTime: "2026-05-25 14:30", manager: "黄伟霆", approvalStatus: "待审批", visitNote: "客户对近期采购表示满意，有意增加订单量，下次拜访重点介绍新品", photoCount: 3, createdAt: "2026-05-25 15:00:00" },
  { id: "2", customerName: "深圳联合汽配", visitTime: "2026-05-24 10:00", manager: "张三", approvalStatus: "已通过", visitNote: "与客户确认了Q3采购计划，主要涉及刹车系统配件", photoCount: 2, createdAt: "2026-05-24 10:45:00" },
  { id: "3", customerName: "东莞盛达零部件", visitTime: "2026-05-22 16:00", manager: "李四", approvalStatus: "已驳回", visitNote: "介绍了新款滤清器系列，客户有意向，约定下周发报价", photoCount: 1, createdAt: "2026-05-22 17:00:00" },
  { id: "4", customerName: "佛山鑫源汽配", visitTime: "2026-05-20 09:30", manager: "黄伟霆", approvalStatus: "已通过", visitNote: "回访老客户，确认售后问题处理情况，客户满意度良好", photoCount: 4, createdAt: "2026-05-20 10:00:00" },
  { id: "5", customerName: "惠州天驰配件", visitTime: "2026-05-18 14:00", manager: "张三", approvalStatus: "待审批", visitNote: "开发新客户，对方已有合作意向，需要进一步跟进", photoCount: 2, createdAt: "2026-05-18 15:30:00" },
  { id: "6", customerName: "中山汽配城", visitTime: "2026-05-15 11:00", manager: "李四", approvalStatus: "已通过", visitNote: "例行拜访，了解客户库存情况，推荐季节性配件", photoCount: 3, createdAt: "2026-05-15 12:00:00" },
];

const customers = ["广州宏达汽配", "深圳联合汽配", "东莞盛达零部件", "佛山鑫源汽配", "惠州天驰配件", "中山汽配城", "珠海明达汽配"];

const statusBadge = (status: VisitRecord["approvalStatus"]) => {
  if (status === "待审批") return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 border border-yellow-200">待审批</span>;
  if (status === "已通过") return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">已通过</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 border border-red-200">已驳回</span>;
};

interface DialogProps {
  mode: "add" | "edit" | "view";
  record?: VisitRecord;
  onClose: () => void;
  onSave: (data: Partial<VisitRecord>) => void;
}

function VisitDialog({ mode, record, onClose, onSave }: DialogProps) {
  const [customerType, setCustomerType] = useState<"老客户" | "新客户">("老客户");
  const [customer, setCustomer] = useState(record?.customerName ?? "");
  const [note, setNote] = useState(record?.visitNote ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const title = mode === "add" ? "新增拜访记录" : mode === "edit" ? "编辑拜访记录" : "查看拜访记录";
  const readonly = mode === "view";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customer) e.customer = "请选择客户";
    if (!note.trim()) e.note = "请输入拜访说明";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ customerName: customer, visitNote: note });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* 客户类型 */}
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">客户选择</label>
            <div className="flex gap-4">
              {(["老客户", "新客户"] as const).map(t => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={customerType === t}
                    onChange={() => !readonly && setCustomerType(t)}
                    disabled={readonly}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 选择客户 */}
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block"><span className="text-red-500">*</span> 选择客户</label>
            {readonly ? (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">{customer || "—"}</div>
            ) : (
              <>
                <FauxSelect className="w-full" value={customer} onChange={e => { setCustomer(e.target.value); setErrors(p => ({ ...p, customer: "" })); }} placeholder="请选择客户">
                  {customers.map(c => <option key={c} value={c}>{c}</option>)}
                </FauxSelect>
                {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
              </>
            )}
          </div>

          {/* 拜访照片 */}
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block"><span className="text-red-500">*</span> 拜访照片</label>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: record?.photoCount ?? 2 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 relative overflow-hidden">
                  <ImageIcon sx={{ fontSize: 24 }} className="text-gray-400" />
                  {!readonly && (
                    <button className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center leading-none">×</button>
                  )}
                </div>
              ))}
              {!readonly && (readonly ? null : (
                <div className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                  <AddIcon sx={{ fontSize: 20 }} className="text-gray-400" />
                  <span className="text-xs text-gray-400 mt-0.5">添加</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">至少1张，最多9张，支持JPG/PNG/JPEG</p>
          </div>

          {/* 拜访说明 */}
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block"><span className="text-red-500">*</span> 拜访说明</label>
            {readonly ? (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200 min-h-[80px]">{note || "—"}</div>
            ) : (
              <>
                <textarea
                  value={note}
                  onChange={e => { setNote(e.target.value.slice(0, 500)); setErrors(p => ({ ...p, note: "" })); }}
                  rows={4}
                  placeholder="请输入拜访说明"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <div className="flex justify-between items-center mt-0.5">
                  {errors.note ? <p className="text-xs text-red-500">{errors.note}</p> : <span />}
                  <span className="text-xs text-gray-400">{note.length}/500</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            {readonly ? "关闭" : "取消"}
          </button>
          {!readonly && (
            <button onClick={handleSave} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">
              确定
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">提示</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-6 text-sm text-gray-700">此操作将永久删除该数据, 是否继续?</div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确定</button>
        </div>
      </div>
    </div>
  );
}

export function CustomerVisitRecord() {
  const [data, setData] = useState(mockData);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [dialog, setDialog] = useState<{ mode: "add" | "edit" | "view"; record?: VisitRecord } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = data.filter(r =>
    (!searchCustomer || r.customerName.includes(searchCustomer)) &&
    (!searchStart || r.visitTime >= searchStart) &&
    (!searchEnd || r.visitTime <= searchEnd + " 99")
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchCustomer(""); setSearchStart(""); setSearchEnd(""); setCurrentPage(1); };

  const handleSave = (d: Partial<VisitRecord>) => {
    if (dialog?.mode === "add") {
      const newRecord: VisitRecord = {
        id: String(Date.now()),
        customerName: d.customerName ?? "",
        visitTime: new Date().toISOString().slice(0, 16).replace("T", " "),
        manager: "黄伟霆",
        approvalStatus: "待审批",
        visitNote: d.visitNote ?? "",
        photoCount: 1,
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      setData(prev => [newRecord, ...prev]);
    } else if (dialog?.mode === "edit" && dialog.record) {
      setData(prev => prev.map(r => r.id === dialog.record!.id ? { ...r, ...d } : r));
    }
  };

  const handleDelete = () => {
    if (deleteId) { setData(prev => prev.filter(r => r.id !== deleteId)); setDeleteId(null); }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">客户拜访登记</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">客户名称：</span>
            <input value={searchCustomer} onChange={e => { setSearchCustomer(e.target.value); setCurrentPage(1); }} placeholder="请输入客户名称" className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">开始日期：</span>
            <input type="date" value={searchStart} onChange={e => { setSearchStart(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">结束日期：</span>
            <input type="date" value={searchEnd} onChange={e => { setSearchEnd(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
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

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => setDialog({ mode: "add" })} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增拜访
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拜访时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">业务经理</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">审批状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">拜访说明</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拜访照片</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.customerName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.visitTime}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.manager}</td>
                <td className="px-4 py-2.5">{statusBadge(item.approvalStatus)}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 max-w-[220px]">
                  <span className="line-clamp-2">{item.visitNote}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <ImageIcon sx={{ fontSize: 16 }} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{item.photoCount}张</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.createdAt}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {item.approvalStatus === "待审批" && (
                      <>
                        <button onClick={() => setDialog({ mode: "edit", record: item })} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                          <EditIcon sx={{ fontSize: 13 }} />编辑
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                          <DeleteIcon sx={{ fontSize: 13 }} />删除
                        </button>
                      </>
                    )}
                    <button onClick={() => setDialog({ mode: "view", record: item })} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                      <ViewIcon sx={{ fontSize: 13 }} />查看
                    </button>
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

      {dialog && (
        <VisitDialog mode={dialog.mode} record={dialog.record} onClose={() => setDialog(null)} onSave={handleSave} />
      )}
      {deleteId && <DeleteConfirm onClose={() => setDeleteId(null)} onConfirm={handleDelete} />}
    </div>
  );
}

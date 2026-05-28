import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PickDetail {
  name: string;
  code: string;
  qty: number;
  picked: number;
}

interface PickTask {
  id: string;
  orderNo: string;
  customer: string;
  picker: string;
  pickedQty: number;
  totalQty: number;
  createdAt: string;
  details: PickDetail[];
}

interface PickRecord {
  id: string;
  orderNo: string;
  taskId: string;
  customer: string;
  opType: string;
  pickQty: number;
  operator: string;
  createdAt: string;
}

const mockTasks: PickTask[] = [
  {
    id: "T001", orderNo: "SY260519568850026", customer: "昆明创安汽修", picker: "李仓管", pickedQty: 3, totalQty: 5, createdAt: "2026-05-28 09:15:00",
    details: [
      { name: "博世机油滤清器", code: "SP000012", qty: 2, picked: 2 },
      { name: "NGK火花塞", code: "SP000034", qty: 2, picked: 1 },
      { name: "刹车片（前）", code: "SP000056", qty: 1, picked: 0 },
    ],
  },
  {
    id: "T002", orderNo: "SY260519568850027", customer: "嘉兴新龙汽修", picker: "", pickedQty: 0, totalQty: 8, createdAt: "2026-05-28 10:30:00",
    details: [
      { name: "空气滤清器", code: "SP000078", qty: 3, picked: 0 },
      { name: "机油5W-40", code: "SP000023", qty: 5, picked: 0 },
    ],
  },
  {
    id: "T003", orderNo: "SY260519568850028", customer: "龙华汽配城", picker: "张仓管", pickedQty: 10, totalQty: 10, createdAt: "2026-05-27 14:00:00",
    details: [
      { name: "雨刮器（前）", code: "SP000089", qty: 5, picked: 5 },
      { name: "冷却液", code: "SP000101", qty: 5, picked: 5 },
    ],
  },
];

const mockRecords: PickRecord[] = [
  { id: "R001", orderNo: "SY260519568850025", taskId: "T0099", customer: "博远汽车服务", opType: "确认拣货", pickQty: 6, operator: "张仓管", createdAt: "2026-05-27 16:45:00" },
  { id: "R002", orderNo: "SY260519568850024", taskId: "T0098", customer: "华鑫汽修中心", opType: "确认拣货", pickQty: 12, operator: "李仓管", createdAt: "2026-05-27 11:20:00" },
  { id: "R003", orderNo: "SY260519568850023", taskId: "T0097", customer: "联众汽配商行", opType: "确认拣货", pickQty: 4, operator: "张仓管", createdAt: "2026-05-26 17:00:00" },
];

const pickers = ["李仓管", "张仓管", "王仓管", "赵仓管"];

interface EditPickerDialogProps {
  task: PickTask;
  onClose: () => void;
  onSave: (taskId: string, picker: string) => void;
}

function EditPickerDialog({ task, onClose, onSave }: EditPickerDialogProps) {
  const [picker, setPicker] = useState(task.picker);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">修改拣货员</h2>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="p-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">拣货员 <span className="text-red-500">*</span></label>
          <FauxSelect className="w-full" value={picker} onChange={(e) => setPicker(e.target.value)} placeholder="请选择拣货员">
            {pickers.map(p => <option key={p} value={p}>{p}</option>)}
          </FauxSelect>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={() => { onSave(task.id, picker); onClose(); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700">确定</button>
        </div>
      </div>
    </div>
  );
}

export function PickingManagement() {
  const [activeTab, setActiveTab] = useState<"manage" | "records">("manage");
  const [orderKw, setOrderKw] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tasks, setTasks] = useState(mockTasks);
  const [editingTask, setEditingTask] = useState<PickTask | null>(null);
  const [recordDateStart, setRecordDateStart] = useState("");
  const [recordDateEnd, setRecordDateEnd] = useState("");
  const [opType, setOpType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredTasks = tasks.filter(t => !orderKw || t.orderNo.includes(orderKw) || t.customer.includes(orderKw));

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedIds(next);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleSavePicker = (taskId: string, picker: string) => {
    setTasks(t => t.map(r => r.id === taskId ? { ...r, picker } : r));
  };

  const totalPages = Math.ceil(mockRecords.length / pageSize);
  const pagedRecords = mockRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">拣货管理</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex gap-1">
          {(["manage", "records"] as const).map(tab => {
            const label = tab === "manage" ? "拣货管理" : "拣货记录";
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-5 py-2.5 text-sm font-medium transition-all relative ${active ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}`}>
                {label}
                {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "manage" ? (
        <>
          {/* Manage toolbar + filters */}
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
                <CheckIcon sx={{ fontSize: 16 }} />确认拣货
              </button>
            </div>
            <div className="grid grid-cols-4 gap-x-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">单据编号：</span>
                <input value={orderKw} onChange={(e) => setOrderKw(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
                  <SearchIcon sx={{ fontSize: 16 }} />搜索
                </button>
                <button onClick={() => setOrderKw("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
                  <RefreshIcon sx={{ fontSize: 16 }} />重置
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-3 w-8"></th>
                  <th className="px-3 py-3 w-10">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单单据</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拣货员</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">拣货进度</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-20">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const expanded = expandedIds.has(task.id);
                  const progress = task.totalQty > 0 ? task.pickedQty / task.totalQty : 0;
                  const done = task.pickedQty === task.totalQty;
                  return [
                    <tr key={task.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selectedIds.has(task.id) ? "bg-blue-50/30" : ""}`}>
                      <td className="px-3 py-2.5">
                        <button onClick={() => toggleExpand(task.id)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          {expanded ? <ExpandMoreIcon sx={{ fontSize: 18 }} /> : <ChevronRightIcon sx={{ fontSize: 18 }} />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <input type="checkbox" checked={selectedIds.has(task.id)} onChange={() => toggleSelect(task.id)} className="w-4 h-4 rounded border-gray-300 accent-blue-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{task.orderNo}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-800">{task.customer}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{task.picker || <span className="text-gray-400">未分配</span>}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 min-w-[60px]">
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress * 100}%`, backgroundColor: done ? "#10B981" : "#3B82F6" }} />
                          </div>
                          <span className={`text-xs font-medium whitespace-nowrap ${done ? "text-emerald-600" : "text-gray-600"}`}>{task.pickedQty}/{task.totalQty}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{task.createdAt}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button onClick={() => setEditingTask(task)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <EditIcon sx={{ fontSize: 16 }} />
                        </button>
                      </td>
                    </tr>,
                    expanded && (
                      <tr key={`${task.id}-detail`}>
                        <td colSpan={8} className="px-0 py-0 bg-blue-50/20 border-b border-gray-100">
                          <div className="pl-16 pr-4 py-2">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">配件名称</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">配件编码</th>
                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">需拣数量</th>
                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">已拣数量</th>
                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">状态</th>
                                </tr>
                              </thead>
                              <tbody>
                                {task.details.map((d, i) => (
                                  <tr key={i} className="border-b border-gray-100 last:border-0">
                                    <td className="px-3 py-1.5 text-sm text-gray-700">{d.name}</td>
                                    <td className="px-3 py-1.5 text-sm text-gray-500">{d.code}</td>
                                    <td className="px-3 py-1.5 text-sm text-gray-700 text-center">{d.qty}</td>
                                    <td className="px-3 py-1.5 text-sm text-gray-700 text-center">{d.picked}</td>
                                    <td className="px-3 py-1.5 text-center">
                                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${d.picked >= d.qty ? "bg-emerald-100 text-emerald-700" : d.picked > 0 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                                        {d.picked >= d.qty ? "已完成" : d.picked > 0 ? "拣货中" : "待拣货"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    ),
                  ];
                })}
              </tbody>
            </table>
            {filteredTasks.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
          </div>
        </>
      ) : (
        <>
          {/* Records filters */}
          <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
            <div className="grid grid-cols-4 gap-x-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">创建时间：</span>
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <input type="date" value={recordDateStart} onChange={(e) => setRecordDateStart(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                  <span className="text-gray-400 text-xs shrink-0">至</span>
                  <input type="date" value={recordDateEnd} onChange={(e) => setRecordDateEnd(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">操作类型：</span>
                <FauxSelect className="flex-1" value={opType} onChange={(e) => setOpType(e.target.value)} placeholder="请选择">
                  <option value="">全部</option>
                  <option value="确认拣货">确认拣货</option>
                  <option value="部分拣货">部分拣货</option>
                </FauxSelect>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
                  <SearchIcon sx={{ fontSize: 16 }} />搜索
                </button>
                <button onClick={() => { setRecordDateStart(""); setRecordDateEnd(""); setOpType(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单据编号</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">任务ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作类型</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">拣货数量</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作员</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-16">操作</th>
                </tr>
              </thead>
              <tbody>
                {pagedRecords.map((r, idx) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{r.orderNo}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{r.taskId}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-800">{r.customer}</td>
                    <td className="px-4 py-2.5 text-sm">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">{r.opType}</span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-right">{r.pickQty}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{r.operator}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{r.createdAt}</td>
                    <td className="px-4 py-2.5 text-center">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ViewIcon sx={{ fontSize: 16 }} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagedRecords.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{mockRecords.length}</span> 条</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
                <button onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))} disabled={currentPage >= (totalPages || 1)} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
              </div>
            </div>
          </div>
        </>
      )}

      {editingTask && <EditPickerDialog task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSavePicker} />}
    </div>
  );
}

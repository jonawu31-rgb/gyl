import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Block as VoidIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface DisassembledPart {
  partId: string;
  partName: string;
  partCode: string;
  spec: string;
  quantity: number;
  warehouse: string;
}

interface DisassemblyRecord {
  disassemblyId: string;
  kitId: string;
  kitName: string;
  quantity: number;
  disassemblyDate: string;
  operator: string;
  status: "已拆装" | "已作废";
  remark: string;
  parts: DisassembledPart[];
}

interface Kit {
  kitId: string;
  kitName: string;
  stock: number;
  parts: Omit<DisassembledPart, "warehouse">[];
}

const mockKits: Kit[] = [
  {
    kitId: "KIT001",
    kitName: "标准套件A",
    stock: 25,
    parts: [
      { partId: "P001", partName: "前刹车片", partCode: "BRK001", spec: "通用型", quantity: 4 },
      { partId: "P002", partName: "机油滤清器", partCode: "OIL001", spec: "标准型", quantity: 1 },
    ],
  },
  {
    kitId: "KIT002",
    kitName: "高级套件B",
    stock: 15,
    parts: [
      { partId: "P003", partName: "空气滤清器", partCode: "AIR001", spec: "高效型", quantity: 1 },
      { partId: "P004", partName: "火花塞", partCode: "SPK001", spec: "铂金", quantity: 4 },
    ],
  },
  {
    kitId: "KIT003",
    kitName: "经济套件C",
    stock: 30,
    parts: [
      { partId: "P005", partName: "后刹车片", partCode: "BRK002", spec: "通用型", quantity: 4 },
    ],
  },
];

const mockRecords: DisassemblyRecord[] = [
  {
    disassemblyId: "DIS20260528001",
    kitId: "KIT001",
    kitName: "标准套件A",
    quantity: 5,
    disassemblyDate: "2026-05-28",
    operator: "张三",
    status: "已拆装",
    remark: "客户退货拆解",
    parts: [
      { partId: "P001", partName: "前刹车片", partCode: "BRK001", spec: "通用型", quantity: 20, warehouse: "主仓库" },
      { partId: "P002", partName: "机油滤清器", partCode: "OIL001", spec: "标准型", quantity: 5, warehouse: "主仓库" },
    ],
  },
  {
    disassemblyId: "DIS20260527001",
    kitId: "KIT002",
    kitName: "高级套件B",
    quantity: 3,
    disassemblyDate: "2026-05-27",
    operator: "李四",
    status: "已拆装",
    remark: "",
    parts: [
      { partId: "P003", partName: "空气滤清器", partCode: "AIR001", spec: "高效型", quantity: 3, warehouse: "主仓库" },
      { partId: "P004", partName: "火花塞", partCode: "SPK001", spec: "铂金", quantity: 12, warehouse: "主仓库" },
    ],
  },
  {
    disassemblyId: "DIS20260526001",
    kitId: "KIT003",
    kitName: "经济套件C",
    quantity: 2,
    disassemblyDate: "2026-05-26",
    operator: "王五",
    status: "已作废",
    remark: "操作失误，已作废",
    parts: [
      { partId: "P005", partName: "后刹车片", partCode: "BRK002", spec: "通用型", quantity: 8, warehouse: "主仓库" },
    ],
  },
];

function VoidConfirm({ record, onConfirm, onCancel }: { record: DisassemblyRecord; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">作废确认</h3>
          <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="px-5 py-4 text-sm text-gray-700">
          确定要作废拆装单 <span className="font-semibold text-gray-900">{record.disassemblyId}</span> 吗？此操作不可撤销。
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确定作废</button>
        </div>
      </div>
    </div>
  );
}

function AddDisassemblyDialog({ onClose, onSave }: { onClose: () => void; onSave: (record: DisassemblyRecord) => void }) {
  const [kitId, setKitId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [warehouse, setWarehouse] = useState("主仓库");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  const selectedKit = mockKits.find(k => k.kitId === kitId) ?? null;

  const calculateParts = (): DisassembledPart[] => {
    if (!selectedKit) return [];
    return selectedKit.parts.map(p => ({ ...p, quantity: p.quantity * quantity, warehouse }));
  };

  const handleSubmit = () => {
    if (!kitId || !selectedKit) { setError("请选择套件"); return; }
    if (quantity < 1) { setError("拆装数量不能小于1"); return; }
    if (quantity > selectedKit.stock) { setError(`拆装数量不能超过库存量（当前库存：${selectedKit.stock}）`); return; }
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const newRecord: DisassemblyRecord = {
      disassemblyId: `DIS${date}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      kitId,
      kitName: selectedKit.kitName,
      quantity,
      disassemblyDate: new Date().toISOString().slice(0, 10),
      operator: "当前用户",
      status: "已拆装",
      remark,
      parts: calculateParts(),
    };
    onSave(newRecord);
  };

  const parts = calculateParts();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">新增拆装</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">套件选择</label>
            <FauxSelect
              className="flex-1"
              value={kitId}
              onChange={e => { setKitId(e.target.value); setError(""); }}
              placeholder="请选择套件..."
            >
              {mockKits.map(k => (
                <option key={k.kitId} value={k.kitId}>{k.kitName}（库存：{k.stock}）</option>
              ))}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">拆装数量</label>
            <input
              type="number"
              min={1}
              max={selectedKit?.stock ?? 999}
              value={quantity}
              onChange={e => { setQuantity(parseInt(e.target.value) || 1); setError(""); }}
              disabled={!selectedKit}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
            />
            {selectedKit && <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">最大可拆：{selectedKit.stock}</span>}
          </div>
          <div className="flex items-center gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600">入仓仓库</label>
            <FauxSelect
              className="flex-1"
              value={warehouse}
              onChange={e => setWarehouse(e.target.value)}
            >
              <option value="主仓库">主仓库</option>
              <option value="副仓库">副仓库</option>
              <option value="A仓">A仓</option>
              <option value="B仓">B仓</option>
            </FauxSelect>
          </div>
          {parts.length > 0 && (
            <div className="flex items-start gap-3">
              <label className="w-20 shrink-0 text-sm text-gray-600 pt-2">还原配件</label>
              <div className="flex-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">配件编码</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">配件名称</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">规格</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">获得数量</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">入仓仓库</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {parts.map(part => (
                        <tr key={part.partId}>
                          <td className="px-3 py-2 text-gray-600 font-mono">{part.partCode}</td>
                          <td className="px-3 py-2 text-gray-800">{part.partName}</td>
                          <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                          <td className="px-3 py-2 text-blue-600">+{part.quantity}</td>
                          <td className="px-3 py-2 text-gray-600">{part.warehouse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">拆解后将获得 <span className="font-semibold text-blue-600">{parts.length}</span> 种配件</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <label className="w-20 shrink-0 text-sm text-gray-600 pt-1.5">备注</label>
            <textarea
              value={remark}
              onChange={e => setRemark(e.target.value)}
              rows={3}
              placeholder="选填"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

function DetailDialog({ record, onClose }: { record: DisassemblyRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">拆装单详情</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["拆装单号", record.disassemblyId],
              ["套件名称", record.kitName],
              ["拆装数量", String(record.quantity)],
              ["拆装日期", record.disassemblyDate],
              ["操作人", record.operator],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <span className="text-gray-500 w-20 shrink-0">{label}：</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
            <div className="flex gap-3">
              <span className="text-gray-500 w-20 shrink-0">状态：</span>
              <span className={`px-2 py-0.5 rounded-full text-xs self-start ${record.status === "已拆装" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                {record.status}
              </span>
            </div>
            {record.remark && (
              <div className="flex gap-3 col-span-2">
                <span className="text-gray-500 w-20 shrink-0">备注：</span>
                <span className="text-gray-800">{record.remark}</span>
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">拆解获得配件</div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">配件编码</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">配件名称</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">规格</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">获得数量</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">入仓仓库</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {record.parts.map(part => (
                    <tr key={part.partId}>
                      <td className="px-3 py-2 text-gray-600 font-mono">{part.partCode}</td>
                      <td className="px-3 py-2 text-gray-800">{part.partName}</td>
                      <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                      <td className="px-3 py-2 text-blue-600">+{part.quantity}</td>
                      <td className="px-3 py-2 text-gray-600">{part.warehouse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
        </div>
      </div>
    </div>
  );
}

export default function KitDisassembly() {
  const [records, setRecords] = useState<DisassemblyRecord[]>(mockRecords);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewRecord, setViewRecord] = useState<DisassemblyRecord | null>(null);
  const [voidTarget, setVoidTarget] = useState<DisassemblyRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = records.filter(r => {
    const matchesSearch = !searchText || r.kitName.includes(searchText) || r.disassemblyId.includes(searchText);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesDate = (!startDate || r.disassemblyDate >= startDate) && (!endDate || r.disassemblyDate <= endDate);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchText(""); setStartDate(""); setEndDate(""); setStatusFilter(""); setCurrentPage(1); };

  const handleVoidConfirm = () => {
    if (!voidTarget) return;
    setRecords(prev => prev.map(r => r.disassemblyId === voidTarget.disassemblyId ? { ...r, status: "已作废" } : r));
    setVoidTarget(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">套件拆装</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">关键词：</span>
            <input
              type="text"
              placeholder="套件名称/拆装单号"
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="w-44 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">拆装日期：</span>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
            <span className="text-gray-400 text-sm">至</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">状态：</span>
            <FauxSelect className="w-28" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} placeholder="全部">
              <option value="">全部</option>
              <option value="已拆装">已拆装</option>
              <option value="已作废">已作废</option>
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

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5"
        >
          <AddIcon sx={{ fontSize: 16 }} />新增拆装
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拆装单号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">套件名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拆装数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">拆装日期</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((record, idx) => (
              <tr key={record.disassemblyId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 font-mono">{record.disassemblyId}</td>
                <td className="px-4 py-2.5 text-sm text-gray-800">{record.kitName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-800">{record.quantity}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{record.disassemblyDate}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{record.operator}</td>
                <td className="px-4 py-2.5">
                  {record.status === "已拆装"
                    ? <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">已拆装</span>
                    : <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 border border-red-200">已作废</span>}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewRecord(record)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                      <ViewIcon sx={{ fontSize: 13 }} />查看
                    </button>
                    {record.status === "已拆装" && (
                      <button onClick={() => setVoidTarget(record)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                        <VoidIcon sx={{ fontSize: 13 }} />作废
                      </button>
                    )}
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

      {showAddDialog && (
        <AddDisassemblyDialog
          onClose={() => setShowAddDialog(false)}
          onSave={record => { setRecords(prev => [record, ...prev]); setShowAddDialog(false); }}
        />
      )}
      {viewRecord && <DetailDialog record={viewRecord} onClose={() => setViewRecord(null)} />}
      {voidTarget && <VoidConfirm record={voidTarget} onConfirm={handleVoidConfirm} onCancel={() => setVoidTarget(null)} />}
    </div>
  );
}

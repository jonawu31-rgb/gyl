import { useState } from "react";
import {
  Add as AddIcon, Search as SearchIcon, Refresh as RefreshIcon,
  Visibility as ViewIcon, Block as VoidIcon, Close as CloseIcon,
} from "@mui/icons-material";

interface DisassemblyPart {
  partId: string;
  partName: string;
  spec: string;
  quantity: number;
  warehouse: string;
}

interface DisassemblyRecord {
  id: string;
  kitId: string;
  kitName: string;
  quantity: number;
  disassemblyDate: string;
  operator: string;
  status: "completed" | "voided";
  remark: string;
  parts: DisassemblyPart[];
}

const KIT_OPTIONS = [
  { id: "KT001", name: "刹车系统保养套件", parts: [
    { partId: "P001", partName: "刹车片", spec: "前轮/通用", quantity: 2, warehouse: "主仓库" },
    { partId: "P002", partName: "刹车盘", spec: "280mm", quantity: 1, warehouse: "主仓库" },
    { partId: "P003", partName: "刹车油", spec: "DOT4/500ml", quantity: 1, warehouse: "主仓库" },
  ]},
  { id: "KT002", name: "发动机维保套件", parts: [
    { partId: "P005", partName: "机油滤清器", spec: "标准型", quantity: 1, warehouse: "主仓库" },
    { partId: "P007", partName: "机油", spec: "5W-30/4L", quantity: 4, warehouse: "主仓库" },
    { partId: "P008", partName: "火花塞", spec: "铂金型", quantity: 4, warehouse: "主仓库" },
  ]},
  { id: "KT003", name: "空调系统清洁套件", parts: [
    { partId: "P010", partName: "空调滤清器", spec: "标准型", quantity: 2, warehouse: "主仓库" },
    { partId: "P011", partName: "空调压缩机油", spec: "PAG46/250ml", quantity: 1, warehouse: "主仓库" },
  ]},
];

const initRecords: DisassemblyRecord[] = [
  { id: "DC001", kitId: "KT001", kitName: "刹车系统保养套件", quantity: 3, disassemblyDate: "2026-05-10 14:32", operator: "张伟", status: "completed", remark: "退库拆装",
    parts: [{ partId: "P001", partName: "刹车片", spec: "前轮/通用", quantity: 6, warehouse: "主仓库" }, { partId: "P002", partName: "刹车盘", spec: "280mm", quantity: 3, warehouse: "主仓库" }, { partId: "P003", partName: "刹车油", spec: "DOT4/500ml", quantity: 3, warehouse: "主仓库" }] },
  { id: "DC002", kitId: "KT002", kitName: "发动机维保套件", quantity: 2, disassemblyDate: "2026-05-15 09:18", operator: "李明", status: "completed", remark: "",
    parts: [{ partId: "P005", partName: "机油滤清器", spec: "标准型", quantity: 2, warehouse: "主仓库" }, { partId: "P007", partName: "机油", spec: "5W-30/4L", quantity: 8, warehouse: "主仓库" }, { partId: "P008", partName: "火花塞", spec: "铂金型", quantity: 8, warehouse: "主仓库" }] },
  { id: "DC003", kitId: "KT003", kitName: "空调系统清洁套件", quantity: 5, disassemblyDate: "2026-05-20 11:05", operator: "王芳", status: "voided", remark: "误操作作废",
    parts: [{ partId: "P010", partName: "空调滤清器", spec: "标准型", quantity: 10, warehouse: "主仓库" }, { partId: "P011", partName: "空调压缩机油", spec: "PAG46/250ml", quantity: 5, warehouse: "主仓库" }] },
];

const nowStr = () => new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);

function AddDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (r: Omit<DisassemblyRecord, "id">) => void }) {
  const [kitId, setKitId] = useState(KIT_OPTIONS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [remark, setRemark] = useState("");

  if (!open) return null;
  const kit = KIT_OPTIONS.find((k) => k.id === kitId)!;
  const parts = kit.parts.map((p) => ({ ...p, quantity: p.quantity * quantity }));

  const handleSave = () => {
    onSave({ kitId, kitName: kit.name, quantity, disassemblyDate: nowStr(), operator: "黄伟霆", status: "completed", remark, parts });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 580 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">新增套件拆装</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-hidden flex min-h-0">
          <div className="w-80 shrink-0 border-r border-gray-200 overflow-auto p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">选择套件 <span className="text-red-500">*</span></label>
              <select value={kitId} onChange={(e) => setKitId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm">
                {KIT_OPTIONS.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">拆装数量 <span className="text-red-500">*</span></label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea rows={4} value={remark} placeholder="可选备注..." onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400 resize-none" />
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs text-orange-700">拆装后套件库存 <span className="font-semibold">-{quantity}</span>，相关配件库存恢复。</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <span className="text-sm font-medium text-gray-700">拆装后获得配件（自动计算）</span>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    {["配件名称", "规格", "获得数量（单套 × 拆装数量）", "入仓仓库"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p) => (
                    <tr key={p.partId} className="border-b border-gray-100 hover:bg-green-50/40">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{p.partName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{p.spec}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-sm font-semibold text-green-700">+{p.quantity}</span>
                        <span className="text-xs text-gray-400 ml-1">({p.quantity / quantity} × {quantity})</span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{p.warehouse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确认拆装</button>
        </div>
      </div>
    </div>
  );
}

export function KitDisassembly() {
  const [records, setRecords] = useState<DisassemblyRecord[]>(initRecords);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewDetail, setViewDetail] = useState<DisassemblyRecord | null>(null);
  const [voidId, setVoidId] = useState<string | null>(null);

  const filtered = records.filter((r) =>
    (!keyword || r.kitName.includes(keyword) || r.id.includes(keyword)) &&
    (!filterStatus || r.status === filterStatus)
  );

  const handleAdd = (data: Omit<DisassemblyRecord, "id">) => {
    setRecords((prev) => [{ id: `DC${Date.now()}`, ...data }, ...prev]);
  };

  const handleVoid = (id: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "voided" as const } : r));
    setVoidId(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">套件拆装</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setAddOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />新增拆装
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button onClick={() => { setKeyword(""); setFilterStatus(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative w-60">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索套件名称/拆装单号..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700">
            <option value="">全部状态</option>
            <option value="completed">已拆装</option>
            <option value="voided">已作废</option>
          </select>
          <span className="text-xs text-gray-400">共 {filtered.length} 条</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["拆装单号", "套件名称", "拆装数量", "拆装日期", "操作人", "状态", "操作"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${r.status === "voided" ? "opacity-60" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{r.id}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{r.kitName}</div>
                  {r.remark && <div className="text-xs text-gray-400 mt-0.5">{r.remark}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.quantity} 套</td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.disassemblyDate}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.operator}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${r.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {r.status === "completed" ? "已拆装" : "已作废"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button title="查看详情" onClick={() => setViewDetail(r)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ViewIcon sx={{ fontSize: 16 }} /></button>
                    {r.status === "completed" && (
                      <button title="作废" onClick={() => setVoidId(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><VoidIcon sx={{ fontSize: 16 }} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400">共 {records.length} 条拆装记录</p>
      </div>

      <AddDialog open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />

      {/* Detail dialog */}
      {viewDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 640, maxHeight: 500 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-800">拆装详情</h3>
                <p className="text-xs text-gray-400 mt-0.5">{viewDetail.id} · {viewDetail.kitName} · ×{viewDetail.quantity}套</p>
              </div>
              <button onClick={() => setViewDetail(null)} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-3 shrink-0">
              <div><p className="text-xs text-gray-500">操作人</p><p className="text-sm font-medium text-gray-800 mt-0.5">{viewDetail.operator}</p></div>
              <div><p className="text-xs text-gray-500">拆装日期</p><p className="text-sm font-medium text-gray-800 mt-0.5">{viewDetail.disassemblyDate}</p></div>
              <div><p className="text-xs text-gray-500">状态</p>
                <span className={`inline-flex mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full ${viewDetail.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {viewDetail.status === "completed" ? "已拆装" : "已作废"}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    {["配件名称", "规格", "获得数量", "入仓仓库"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewDetail.parts.map((p) => (
                    <tr key={p.partId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-sm text-gray-800">{p.partName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{p.spec}</td>
                      <td className="px-4 py-2.5 text-sm font-semibold text-green-700">+{p.quantity}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{p.warehouse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end shrink-0">
              <button onClick={() => setViewDetail(null)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* Void confirm */}
      {voidId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认作废</h3>
            <p className="text-sm text-gray-600 mb-4">作废后套件库存将恢复，配件库存将扣除。此操作不可撤销。</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setVoidId(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
              <button onClick={() => handleVoid(voidId)} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确认作废</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

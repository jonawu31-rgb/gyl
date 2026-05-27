import { useState } from "react";
import {
  Add as AddIcon, Search as SearchIcon, Refresh as RefreshIcon,
  Visibility as ViewIcon, Block as VoidIcon, Close as CloseIcon,
} from "@mui/icons-material";

interface AssemblyPart {
  partId: string;
  partName: string;
  spec: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

interface AssemblyRecord {
  id: string;
  kitName: string;
  templateId: string;
  quantity: number;
  assemblyDate: string;
  totalCost: number;
  operator: string;
  status: "completed" | "voided";
  remark: string;
  parts: AssemblyPart[];
}

const KIT_TEMPLATES = [
  { id: "KT001", name: "刹车系统保养套件", parts: [
    { partId: "P001", partName: "刹车片", spec: "前轮/通用", quantity: 2, unitCost: 85 },
    { partId: "P002", partName: "刹车盘", spec: "280mm", quantity: 1, unitCost: 120 },
    { partId: "P003", partName: "刹车油", spec: "DOT4/500ml", quantity: 1, unitCost: 35 },
  ]},
  { id: "KT002", name: "发动机维保套件", parts: [
    { partId: "P005", partName: "机油滤清器", spec: "标准型", quantity: 1, unitCost: 28 },
    { partId: "P006", partName: "空气滤清器", spec: "标准型", quantity: 1, unitCost: 45 },
    { partId: "P007", partName: "机油", spec: "5W-30/4L", quantity: 4, unitCost: 180 },
    { partId: "P008", partName: "火花塞", spec: "铂金型", quantity: 4, unitCost: 65 },
  ]},
  { id: "KT003", name: "空调系统清洁套件", parts: [
    { partId: "P010", partName: "空调滤清器", spec: "标准型", quantity: 2, unitCost: 38 },
    { partId: "P011", partName: "空调压缩机油", spec: "PAG46/250ml", quantity: 1, unitCost: 68 },
  ]},
];

const initRecords: AssemblyRecord[] = [
  { id: "AS001", kitName: "刹车系统保养套件", templateId: "KT001", quantity: 5, assemblyDate: "2026-05-08 10:22", totalCost: 1675, operator: "张伟", status: "completed", remark: "备库存",
    parts: [{ partId: "P001", partName: "刹车片", spec: "前轮/通用", quantity: 10, unitCost: 85, subtotal: 850 }, { partId: "P002", partName: "刹车盘", spec: "280mm", quantity: 5, unitCost: 120, subtotal: 600 }, { partId: "P003", partName: "刹车油", spec: "DOT4/500ml", quantity: 5, unitCost: 35, subtotal: 175 }] },
  { id: "AS002", kitName: "空调系统清洁套件", templateId: "KT003", quantity: 10, assemblyDate: "2026-05-12 14:30", totalCost: 1440, operator: "李明", status: "completed", remark: "夏季备货",
    parts: [{ partId: "P010", partName: "空调滤清器", spec: "标准型", quantity: 20, unitCost: 38, subtotal: 760 }, { partId: "P011", partName: "空调压缩机油", spec: "PAG46/250ml", quantity: 10, unitCost: 68, subtotal: 680 }] },
  { id: "AS003", kitName: "发动机维保套件", templateId: "KT002", quantity: 3, assemblyDate: "2026-05-18 09:00", totalCost: 1179, operator: "王芳", status: "completed", remark: "",
    parts: [{ partId: "P005", partName: "机油滤清器", spec: "标准型", quantity: 3, unitCost: 28, subtotal: 84 }, { partId: "P006", partName: "空气滤清器", spec: "标准型", quantity: 3, unitCost: 45, subtotal: 135 }, { partId: "P007", partName: "机油", spec: "5W-30/4L", quantity: 12, unitCost: 180, subtotal: 2160 }, { partId: "P008", partName: "火花塞", spec: "铂金型", quantity: 12, unitCost: 65, subtotal: 780 }] },
  { id: "AS004", kitName: "刹车系统保养套件", templateId: "KT001", quantity: 2, assemblyDate: "2026-05-20 16:15", totalCost: 670, operator: "张伟", status: "voided", remark: "误操作",
    parts: [] },
];

const nowStr = () => new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);

function AddDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (r: Omit<AssemblyRecord, "id">) => void }) {
  const [templateId, setTemplateId] = useState(KIT_TEMPLATES[0].id);
  const [kitName, setKitName] = useState(KIT_TEMPLATES[0].name);
  const [useTemplate, setUseTemplate] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [remark, setRemark] = useState("");

  if (!open) return null;
  const tpl = KIT_TEMPLATES.find((k) => k.id === templateId)!;
  const parts: AssemblyPart[] = tpl.parts.map((p) => ({
    ...p, quantity: p.quantity * quantity, subtotal: p.unitCost * p.quantity * quantity,
  }));
  const totalCost = parts.reduce((s, p) => s + p.subtotal, 0);

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const found = KIT_TEMPLATES.find((k) => k.id === id);
    if (found) setKitName(found.name);
  };

  const handleSave = () => {
    onSave({ kitName, templateId: useTemplate ? templateId : "", quantity, assemblyDate: nowStr(), totalCost, operator: "黄伟霆", status: "completed", remark, parts });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 600 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">新增套件组装</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-hidden flex min-h-0">
          <div className="w-80 shrink-0 border-r border-gray-200 overflow-auto p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">套件名称 <span className="text-red-500">*</span></label>
              <input type="text" value={kitName} onChange={(e) => setKitName(e.target.value)}
                placeholder="输入套件名称或从模版选择"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">从模版选择</label>
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setUseTemplate(!useTemplate)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${useTemplate ? "bg-blue-500" : "bg-gray-200"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${useTemplate ? "translate-x-4" : "translate-x-0"}`} />
                </button>
                <span className="text-xs text-gray-600">{useTemplate ? "引用模版" : "手动填写"}</span>
              </div>
              {useTemplate && (
                <select value={templateId} onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm">
                  {KIT_TEMPLATES.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">组装数量 <span className="text-red-500">*</span></label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea rows={3} value={remark} placeholder="可选备注..." onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm placeholder:text-gray-400 resize-none" />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 mb-0.5">成本合计</p>
              <p className="text-base font-bold text-blue-700">¥{totalCost.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <span className="text-sm font-medium text-gray-700">配件用料清单（自动计算）</span>
            </div>
            <div className="flex-1 overflow-auto">
              {parts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">请选择模版或添加配件</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="border-b border-gray-200">
                      {["配件名称", "规格", "单套用量", "组装数量", "单价", "小计"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((p) => (
                      <tr key={p.partId} className="border-b border-gray-100 hover:bg-orange-50/40">
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{p.partName}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-500">{p.spec}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{p.quantity / quantity}</td>
                        <td className="px-4 py-2.5">
                          <span className="text-sm font-semibold text-orange-600">-{p.quantity}</span>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-700">¥{p.unitCost}</td>
                        <td className="px-4 py-2.5 text-sm font-medium text-gray-800">¥{p.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50 border-t border-gray-200">
                      <td colSpan={5} className="px-4 py-2.5 text-sm font-bold text-gray-700">成本合计</td>
                      <td className="px-4 py-2.5 text-sm font-bold text-blue-600">¥{totalCost.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确认组装</button>
        </div>
      </div>
    </div>
  );
}

export function KitAssembly() {
  const [records, setRecords] = useState<AssemblyRecord[]>(initRecords);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewDetail, setViewDetail] = useState<AssemblyRecord | null>(null);
  const [voidId, setVoidId] = useState<string | null>(null);

  const filtered = records.filter((r) =>
    (!keyword || r.kitName.includes(keyword) || r.id.includes(keyword)) &&
    (!filterStatus || r.status === filterStatus)
  );

  const handleAdd = (data: Omit<AssemblyRecord, "id">) => {
    setRecords((prev) => [{ id: `AS${Date.now()}`, ...data }, ...prev]);
  };

  const handleVoid = (id: string) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, status: "voided" as const } : r));
    setVoidId(null);
  };

  const totalCost = records.filter((r) => r.status === "completed").reduce((s, r) => s + r.totalCost, 0);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">套件组装</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setAddOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />新增组装
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
            <input type="text" placeholder="搜索套件名称/组装单号..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700">
            <option value="">全部状态</option>
            <option value="completed">已组装</option>
            <option value="voided">已作废</option>
          </select>
          <span className="text-xs text-gray-400">共 {filtered.length} 条</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["组装单号", "套件名称", "组装数量", "组装日期", "成本合计", "操作人", "状态", "操作"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${r.status === "voided" ? "opacity-60" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{r.id}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{r.kitName}</div>
                  {r.remark && <div className="text-xs text-gray-400 mt-0.5">{r.remark}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.quantity} 套</td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.assemblyDate}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">¥{r.totalCost.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.operator}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${r.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {r.status === "completed" ? "已组装" : "已作废"}
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

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0 flex items-center justify-between">
        <p className="text-xs text-gray-400">共 {records.length} 条记录</p>
        <p className="text-xs text-gray-500">有效组装成本合计：<span className="font-semibold text-gray-700">¥{totalCost.toLocaleString()}</span></p>
      </div>

      <AddDialog open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />

      {viewDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 640, maxHeight: 500 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0 bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-800">组装详情</h3>
                <p className="text-xs text-gray-400 mt-0.5">{viewDetail.id} · {viewDetail.kitName} · ×{viewDetail.quantity}套</p>
              </div>
              <button onClick={() => setViewDetail(null)} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-3 gap-3 shrink-0">
              <div><p className="text-xs text-gray-500">操作人</p><p className="text-sm font-medium text-gray-800 mt-0.5">{viewDetail.operator}</p></div>
              <div><p className="text-xs text-gray-500">组装日期</p><p className="text-sm font-medium text-gray-800 mt-0.5">{viewDetail.assemblyDate}</p></div>
              <div><p className="text-xs text-gray-500">成本合计</p><p className="text-sm font-bold text-blue-600 mt-0.5">¥{viewDetail.totalCost.toLocaleString()}</p></div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b border-gray-200">
                    {["配件名称", "规格", "用料数量", "单价", "小计"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewDetail.parts.map((p) => (
                    <tr key={p.partId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-sm text-gray-800">{p.partName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{p.spec}</td>
                      <td className="px-4 py-2.5 text-sm font-semibold text-orange-600">-{p.quantity}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">¥{p.unitCost}</td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800">¥{p.subtotal.toLocaleString()}</td>
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

      {voidId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认作废</h3>
            <p className="text-sm text-gray-600 mb-4">作废后套件库存将减少，配件库存将恢复。此操作不可撤销。</p>
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

import { useState } from "react";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Star as StarIcon, StarBorder as StarBorderIcon, TextFields as TextFieldsIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { PrintTemplateDialog, DOC_TYPE_LABELS } from "./PrintTemplateDialog";
import type { PrintTemplate } from "./PrintTemplateDialog";
import { PrintTextSettingDialog } from "./PrintTextSettingDialog";

const DOC_TYPE_COLORS: Record<string, string> = {
  sale: "bg-blue-100 text-blue-700",
  quote: "bg-purple-100 text-purple-700",
  purchase: "bg-orange-100 text-orange-700",
  inbound: "bg-green-100 text-green-700",
  outbound: "bg-yellow-100 text-yellow-700",
};

const PAPER_SIZE_LABELS: Record<string, string> = {
  a4: "A4", a5: "A5", thermal_80: "热敏纸 80mm", thermal_58: "热敏纸 58mm",
};

const initTemplates: PrintTemplate[] = [
  { id: "T001", name: "销售单标准模版", documentType: "sale", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "{companyName}销售单", headerInfo: "公司：{companyName}\n电话：020-88888888", footerNote: "感谢惠顾！", fontSize: 10, showPrice: true, remark: "日常销售开单打印", updatedAt: "2026-05-20 14:32" },
  { id: "T002", name: "销售单简洁版", documentType: "sale", paperSize: "a5", orientation: "portrait", marginTop: 8, marginBottom: 8, marginLeft: 10, marginRight: 10, isDefault: false, title: "销售单", headerInfo: "", footerNote: "商品售出，概不退换。", fontSize: 9, showPrice: true, remark: "小票打印用", updatedAt: "2026-05-15 09:18" },
  { id: "T003", name: "报价单标准模版", documentType: "quote", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "{companyName}报价单", headerInfo: "联系人：{salesperson}\n日期：{date}", footerNote: "本报价有效期7天。", fontSize: 10, showPrice: true, remark: "", updatedAt: "2026-05-18 11:05" },
  { id: "T004", name: "采购单模版", documentType: "purchase", paperSize: "a4", orientation: "landscape", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "采购订单", headerInfo: "供应商：{customer}\n单号：{orderNo}", footerNote: "请按时供货。", fontSize: 10, showPrice: true, remark: "横向打印", updatedAt: "2026-05-10 16:40" },
  { id: "T005", name: "入库单热敏模版", documentType: "inbound", paperSize: "thermal_80", orientation: "portrait", marginTop: 5, marginBottom: 5, marginLeft: 5, marginRight: 5, isDefault: true, title: "入库单", headerInfo: "", footerNote: "已验收", fontSize: 9, showPrice: false, remark: "仓库热敏打印机", updatedAt: "2026-04-28 08:55" },
  { id: "T006", name: "出库单模版", documentType: "outbound", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "出库单", headerInfo: "单号：{orderNo}\n经办人：{salesperson}", footerNote: "请核对数量，签字后方可出库。", fontSize: 10, showPrice: false, remark: "", updatedAt: "2026-04-15 10:22" },
];

const nowStr = () => new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);

export function PrintTemplateManagement() {
  const [templates, setTemplates] = useState<PrintTemplate[]>(initTemplates);
  const [keyword, setKeyword] = useState("");
  const [filterDocType, setFilterDocType] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PrintTemplate | null>(null);
  const [textSettingOpen, setTextSettingOpen] = useState(false);
  const [textTarget, setTextTarget] = useState<PrintTemplate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = templates.filter((t) =>
    (!keyword || t.name.toLowerCase().includes(keyword.toLowerCase())) &&
    (!filterDocType || t.documentType === filterDocType)
  );

  const handleSave = (data: Omit<PrintTemplate, "id" | "updatedAt">) => {
    if (editTarget) {
      setTemplates((prev) => prev.map((t) => t.id === editTarget.id ? { ...t, ...data, updatedAt: nowStr() } : t));
    } else {
      setTemplates((prev) => [...prev, { id: `T${Date.now()}`, ...data, updatedAt: nowStr() }]);
    }
    setEditTarget(null);
  };

  const handleTextSave = (data: Partial<PrintTemplate>) => {
    if (!textTarget) return;
    setTemplates((prev) => prev.map((t) => t.id === textTarget.id ? { ...t, ...data, updatedAt: nowStr() } : t));
  };

  const handleSetDefault = (id: string, docType: string) =>
    setTemplates((prev) => prev.map((t) => ({ ...t, isDefault: t.id === id ? true : t.documentType === docType ? false : t.isDefault })));

  const handleDelete = (id: string) => { setTemplates((prev) => prev.filter((t) => t.id !== id)); setDeleteId(null); };

  const deleteTarget = templates.find((t) => t.id === deleteId);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">打印模版</h2>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditTarget(null); setAddOpen(true); }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />新增模版
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button onClick={() => { setKeyword(""); setFilterDocType(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索模版名称..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
          </div>
          <select value={filterDocType} onChange={(e) => setFilterDocType(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm bg-gray-50 text-gray-700">
            <option value="">全部单据类型</option>
            {Object.entries(DOC_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <span className="text-xs text-gray-400">共 {filtered.length} 个</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["模版名称", "单据类型", "是否默认", "纸张大小", "打印方向", "显示价格", "更新时间", "操作"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{t.name}</div>
                  {t.remark && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{t.remark}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${DOC_TYPE_COLORS[t.documentType]}`}>{DOC_TYPE_LABELS[t.documentType]}</span>
                </td>
                <td className="px-4 py-3">
                  {t.isDefault
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700"><StarIcon sx={{ fontSize: 12 }} />默认</span>
                    : <span className="inline-flex px-2 py-0.5 text-xs text-gray-400 rounded-full bg-gray-100">—</span>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{PAPER_SIZE_LABELS[t.paperSize]}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.orientation === "portrait" ? "纵向" : "横向"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${t.showPrice ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{t.showPrice ? "显示" : "隐藏"}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{t.updatedAt}</td>
                <td className="px-4 py-3 sticky right-0 bg-white">
                  <div className="flex items-center gap-1">
                    <button title="文案设置" onClick={() => { setTextTarget(t); setTextSettingOpen(true); }} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"><TextFieldsIcon sx={{ fontSize: 16 }} /></button>
                    <button title="编辑" onClick={() => { setEditTarget(t); setAddOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><EditIcon sx={{ fontSize: 16 }} /></button>
                    {!t.isDefault && <button title="设为默认" onClick={() => handleSetDefault(t.id, t.documentType)} className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"><StarBorderIcon sx={{ fontSize: 16 }} /></button>}
                    <button title="删除" onClick={() => setDeleteId(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><DeleteIcon sx={{ fontSize: 16 }} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400">共 {templates.length} 个模版 · 每种单据类型仅一个默认模版</p>
      </div>

      <PrintTemplateDialog open={addOpen} onClose={() => { setAddOpen(false); setEditTarget(null); }} onSave={handleSave} editData={editTarget} />
      <PrintTextSettingDialog open={textSettingOpen} onClose={() => { setTextSettingOpen(false); setTextTarget(null); }} onSave={handleTextSave} template={textTarget} />

      {deleteId && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
            <p className="text-sm text-gray-600 mb-1">确定删除「<span className="font-semibold text-gray-800">{deleteTarget.name}</span>」吗？</p>
            {deleteTarget.isDefault && <p className="text-sm text-red-500 mb-4">注意：该模版为默认模版，删除后请重新设置默认。</p>}
            {!deleteTarget.isDefault && <div className="mb-4" />}
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

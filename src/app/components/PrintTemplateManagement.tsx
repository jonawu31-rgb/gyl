import { useState } from "react";
import { Add as AddIcon, Search as SearchIcon, Refresh as RefreshIcon, TextFields as TextFieldsIcon } from "@mui/icons-material";
import { PrintTemplateDialog } from "./PrintTemplateDialog";
import type { PrintTemplate } from "./PrintTemplateDialog";
import { PrintTextSettingDialog } from "./PrintTextSettingDialog";

const TEMPLATE_TYPE_COLORS: Record<string, string> = {
  A4: "bg-blue-100 text-blue-700",
  三联单: "bg-purple-100 text-purple-700",
  二联单: "bg-orange-100 text-orange-700",
};

const STATUS_COLORS: Record<string, string> = {
  enabled: "bg-green-100 text-green-700",
  disabled: "bg-gray-100 text-gray-500",
};

const initTemplates: PrintTemplate[] = [
  { id: "T001", name: "结算/维修单据-A4模板", documentType: "sale", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "结算单", headerInfo: "公司：{companyName}", footerNote: "感谢惠顾！", fontSize: 10, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "A4", status: "enabled" },
  { id: "T002", name: "结算/维修单据-三联单模板", documentType: "sale", paperSize: "a5", orientation: "portrait", marginTop: 8, marginBottom: 8, marginLeft: 10, marginRight: 10, isDefault: false, title: "结算单", headerInfo: "", footerNote: "商品售出，概不退换。", fontSize: 9, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "三联单", status: "enabled" },
  { id: "T003", name: "结算/维修单据-小票模板", documentType: "sale", paperSize: "thermal_80", orientation: "portrait", marginTop: 5, marginBottom: 5, marginLeft: 5, marginRight: 5, isDefault: false, title: "结算单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: false, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "二联单", status: "enabled" },
  { id: "T004", name: "待结单据-A4模板", documentType: "quote", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "待结单", headerInfo: "", footerNote: "", fontSize: 10, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "A4", status: "enabled" },
  { id: "T005", name: "待结单据-三联单模板", documentType: "quote", paperSize: "a5", orientation: "portrait", marginTop: 8, marginBottom: 8, marginLeft: 10, marginRight: 10, isDefault: false, title: "待结单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "三联单", status: "enabled" },
  { id: "T006", name: "待结单据-小票模板", documentType: "quote", paperSize: "thermal_80", orientation: "portrait", marginTop: 5, marginBottom: 5, marginLeft: 5, marginRight: 5, isDefault: false, title: "待结单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: false, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "二联单", status: "enabled" },
  { id: "T007", name: "报价单-A4模板", documentType: "purchase", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "报价单", headerInfo: "", footerNote: "", fontSize: 10, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "A4", status: "enabled" },
  { id: "T008", name: "报价单-三联单模板", documentType: "purchase", paperSize: "a5", orientation: "portrait", marginTop: 8, marginBottom: 8, marginLeft: 10, marginRight: 10, isDefault: false, title: "报价单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "三联单", status: "enabled" },
  { id: "T009", name: "报价单-小票模板", documentType: "purchase", paperSize: "thermal_80", orientation: "portrait", marginTop: 5, marginBottom: 5, marginLeft: 5, marginRight: 5, isDefault: false, title: "报价单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: false, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "二联单", status: "enabled" },
  { id: "T010", name: "办卡单-A4模板", documentType: "inbound", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "办卡单", headerInfo: "", footerNote: "", fontSize: 10, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "A4", status: "enabled" },
  { id: "T011", name: "办卡单-三联单模板", documentType: "inbound", paperSize: "a5", orientation: "portrait", marginTop: 8, marginBottom: 8, marginLeft: 10, marginRight: 10, isDefault: false, title: "办卡单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "三联单", status: "enabled" },
  { id: "T012", name: "办卡单-小票模板", documentType: "inbound", paperSize: "thermal_80", orientation: "portrait", marginTop: 5, marginBottom: 5, marginLeft: 5, marginRight: 5, isDefault: false, title: "办卡单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: false, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "二联单", status: "enabled" },
  { id: "T013", name: "施工单-A4模板", documentType: "outbound", paperSize: "a4", orientation: "portrait", marginTop: 10, marginBottom: 10, marginLeft: 15, marginRight: 15, isDefault: true, title: "施工单", headerInfo: "", footerNote: "", fontSize: 10, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "A4", status: "enabled" },
  { id: "T014", name: "施工单-三联单模板", documentType: "outbound", paperSize: "a5", orientation: "portrait", marginTop: 8, marginBottom: 8, marginLeft: 10, marginRight: 10, isDefault: false, title: "施工单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: true, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "三联单", status: "enabled" },
  { id: "T015", name: "施工单-小票模板", documentType: "outbound", paperSize: "thermal_80", orientation: "portrait", marginTop: 5, marginBottom: 5, marginLeft: 5, marginRight: 5, isDefault: false, title: "施工单", headerInfo: "", footerNote: "", fontSize: 9, showPrice: false, remark: "行业大部分门店通用模板", updatedAt: "2026-01-09 11:50:36", templateType: "二联单", status: "enabled" },
];

const nowStr = () => new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-").slice(0, 16);

export function PrintTemplateManagement() {
  const [templates, setTemplates] = useState<PrintTemplate[]>(initTemplates);
  const [keyword, setKeyword] = useState("");
  const [filterDocType, setFilterDocType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PrintTemplate | null>(null);
  const [textSettingOpen, setTextSettingOpen] = useState(false);
  const [textTarget, setTextTarget] = useState<PrintTemplate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = templates.filter((t) =>
    (!keyword || t.name.toLowerCase().includes(keyword.toLowerCase())) &&
    (!filterDocType || t.documentType === filterDocType) &&
    (!filterStatus || t.status === filterStatus)
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
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <AddIcon sx={{ fontSize: 16 }} />新增
          </button>
          <button onClick={() => { setTextTarget(templates[0] ?? null); setTextSettingOpen(true); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5 whitespace-nowrap">
            <TextFieldsIcon sx={{ fontSize: 16 }} />
            打印文案设计
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button onClick={() => { setKeyword(""); setFilterDocType(""); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5 whitespace-nowrap">
            <RefreshIcon sx={{ fontSize: 16 }} />重置
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-3 gap-y-2.5 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">模版名称</span>
            <div className="relative flex-1 min-w-0">
              <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="搜索模版名称..." value={keyword} onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">模板类型</span>
            <select value={filterDocType} onChange={(e) => setFilterDocType(e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-gray-700">
              <option value="">全部模板类型</option>
              {["A4", "三联单", "二联单"].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-600 shrink-0 w-16 whitespace-nowrap">状态</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-gray-700">
              <option value="">全部状态</option>
              <option value="enabled">启用</option>
              <option value="disabled">停用</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {}}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5 whitespace-nowrap"
            >
              <SearchIcon sx={{ fontSize: 16 }} />
              搜索
            </button>
            <button onClick={() => { setKeyword(""); setFilterDocType(""); setFilterStatus(""); }}
              className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5 whitespace-nowrap">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
            <span className="text-xs text-gray-400">共 {filtered.length} 条</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号", "模板名称", "模板类型", "状态", "备注", "创建时间", "操作"].map((h) => (
                <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap ${h === "操作" ? "sticky right-0 z-20 bg-gray-50 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{filtered.indexOf(t) + 1}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{t.name}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${TEMPLATE_TYPE_COLORS[t.templateType]}`}>{t.templateType}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[t.status]}`}>{t.status === "enabled" ? "启用" : "停用"}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="truncate block max-w-[260px]">{t.remark}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{t.updatedAt}</td>
                <td className="px-4 py-3 sticky right-0 bg-white z-10 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-1">
                    <button title="编辑" onClick={() => { setEditTarget(t); setAddOpen(true); }} className="px-2 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium whitespace-nowrap">
                      编辑
                    </button>
                    <button title="删除" onClick={() => setDeleteId(t.id)} className="px-2 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium whitespace-nowrap">
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400">共 {templates.length} 条模板记录 · 每种模板类型仅一个默认模板</p>
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

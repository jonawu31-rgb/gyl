import { useState, useEffect } from "react";
import { Close as CloseIcon, Info as InfoIcon } from "@mui/icons-material";
import type { PrintTemplate } from "./PrintTemplateDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<PrintTemplate>) => void;
  template: PrintTemplate | null;
}

const VAR_HINTS = [
  { var: "{companyName}", desc: "公司名称" },
  { var: "{date}", desc: "单据日期" },
  { var: "{orderNo}", desc: "单据编号" },
  { var: "{salesperson}", desc: "业务员" },
  { var: "{customer}", desc: "客户名称" },
  { var: "{totalAmount}", desc: "总金额" },
  { var: "{remark}", desc: "备注" },
];

type FocusField = "title" | "headerInfo" | "footerNote";

export function PrintTextSettingDialog({ open, onClose, onSave, template }: Props) {
  const [form, setForm] = useState({ title: "", headerInfo: "", footerNote: "", fontSize: 10, showPrice: true });
  const [activeField, setActiveField] = useState<FocusField | null>(null);

  useEffect(() => {
    if (open && template) {
      setForm({ title: template.title, headerInfo: template.headerInfo, footerNote: template.footerNote, fontSize: template.fontSize, showPrice: template.showPrice });
      setActiveField(null);
    }
  }, [open, template]);

  if (!open || !template) return null;

  const set = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const insertVar = (v: string) => {
    if (!activeField) return;
    set(activeField, (form[activeField] as string) + v);
  };

  const fieldLabel: Record<FocusField, string> = { title: "打印标题", headerInfo: "表头信息", footerNote: "表尾备注" };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 600 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
          <div>
            <h2 className="text-lg font-bold text-gray-800">打印文案设置</h2>
            <p className="text-xs text-gray-400 mt-0.5">模版：{template.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex min-h-0">
          {/* Left form */}
          <div className="flex-1 overflow-auto p-5 border-r border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">打印标题</label>
                <input type="text" placeholder="请输入打印标题，如：销售单 / {companyName}销售单"
                  value={form.title} onFocus={() => setActiveField("title")}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">表头信息</label>
                <p className="text-xs text-gray-400 mb-1.5">显示在单据顶部，可填写公司名称、地址、联系方式等</p>
                <textarea rows={4} placeholder={"公司：{companyName}\n地址：广州市天河区xxx路\n电话：020-88888888"}
                  value={form.headerInfo} onFocus={() => setActiveField("headerInfo")}
                  onChange={(e) => set("headerInfo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">表尾备注</label>
                <p className="text-xs text-gray-400 mb-1.5">显示在单据底部，如退换货说明、收款信息等</p>
                <textarea rows={4} placeholder="感谢您的惠顾！如有疑问请致电 020-88888888。"
                  value={form.footerNote} onFocus={() => setActiveField("footerNote")}
                  onChange={(e) => set("footerNote", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
                  <select value={form.fontSize} onChange={(e) => set("fontSize", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                    {[8, 9, 10, 11, 12, 14].map((s) => <option key={s} value={s}>{s}pt</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">打印显示价格</label>
                  <div className="flex items-center gap-3 mt-1">
                    <button type="button" onClick={() => set("showPrice", !form.showPrice)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${form.showPrice ? "bg-blue-500" : "bg-gray-200"}`}>
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${form.showPrice ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                    <span className="text-sm text-gray-600">{form.showPrice ? "显示" : "隐藏"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right variable panel */}
          <div className="w-60 shrink-0 flex flex-col overflow-hidden bg-gray-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <InfoIcon sx={{ fontSize: 16 }} className="text-blue-500" />变量占位符
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {activeField ? `点击插入到「${fieldLabel[activeField]}」` : "先点击左侧输入框，再点击插入"}
              </p>
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-1.5">
              {VAR_HINTS.map(({ var: v, desc }) => (
                <button key={v} onClick={() => insertVar(v)} disabled={!activeField}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left border bg-white transition-colors ${activeField ? "border-blue-200 hover:bg-blue-50 hover:border-blue-400 cursor-pointer" : "border-gray-200 opacity-50 cursor-not-allowed"}`}>
                  <span className="text-xs font-mono text-blue-600">{v}</span>
                  <span className="text-xs text-gray-400 ml-2 shrink-0">{desc}</span>
                </button>
              ))}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-700 font-medium mb-1">示例</p>
                <p className="text-xs text-blue-600 leading-relaxed">标题填 <span className="font-mono">{"{companyName}"}销售单</span><br />打印时自动替换为「车配智数销售单」</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">取消</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">保存设置</button>
        </div>
      </div>
    </div>
  );
}

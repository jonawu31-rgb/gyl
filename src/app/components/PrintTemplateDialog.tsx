import { useState, useEffect } from "react";
import { Close as CloseIcon } from "@mui/icons-material";

export interface PrintTemplate {
  id: string;
  name: string;
  documentType: "sale" | "quote" | "purchase" | "inbound" | "outbound";
  paperSize: "a4" | "a5" | "thermal_80" | "thermal_58";
  orientation: "portrait" | "landscape";
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  isDefault: boolean;
  title: string;
  headerInfo: string;
  footerNote: string;
  fontSize: number;
  showPrice: boolean;
  remark: string;
  updatedAt: string;
}

export const DOC_TYPE_LABELS: Record<string, string> = {
  sale: "销售单",
  quote: "报价单",
  purchase: "采购单",
  inbound: "入库单",
  outbound: "出库单",
};

const PAPER_SIZE_LABELS: Record<string, string> = {
  a4: "A4",
  a5: "A5",
  thermal_80: "热敏纸 80mm",
  thermal_58: "热敏纸 58mm",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<PrintTemplate, "id" | "updatedAt">) => void;
  editData?: PrintTemplate | null;
}

const defaultForm = (): Omit<PrintTemplate, "id" | "updatedAt"> => ({
  name: "",
  documentType: "sale",
  paperSize: "a4",
  orientation: "portrait",
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
  isDefault: false,
  title: "",
  headerInfo: "",
  footerNote: "",
  fontSize: 10,
  showPrice: true,
  remark: "",
});

export function PrintTemplateDialog({ open, onClose, onSave, editData }: Props) {
  const [form, setForm] = useState(defaultForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (editData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, updatedAt: _u, ...rest } = editData;
        setForm(rest);
      } else {
        setForm(defaultForm());
      }
      setErrors({});
    }
  }, [open, editData]);

  if (!open) return null;

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim()) { setErrors({ name: "请填写模版名称" }); return; }
    onSave(form);
    onClose();
  };

  const marginInput = (label: string, field: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <input
          type="number" min={0}
          value={(form as Record<string, unknown>)[field] as number}
          onChange={(e) => set(field, Number(e.target.value))}
          className="w-full px-3 py-2 text-sm focus:outline-none text-center"
        />
        <span className="px-2 text-xs text-gray-400 bg-gray-50 border-l border-gray-200 py-2 shrink-0">mm</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 1000, height: 600 }}>
        <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑打印模版" : "新增打印模版"}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">模版名称 <span className="text-red-500">*</span></label>
              <input type="text" placeholder="请输入模版名称" value={form.name}
                onChange={(e) => { set("name", e.target.value); setErrors({}); }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单据类型 <span className="text-red-500">*</span></label>
              <select value={form.documentType} onChange={(e) => set("documentType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                {Object.entries(DOC_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">纸张大小</label>
              <select value={form.paperSize} onChange={(e) => set("paperSize", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                {Object.entries(PAPER_SIZE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">打印方向</label>
              <div className="flex items-center gap-4 mt-2">
                {[{ v: "portrait", l: "纵向" }, { v: "landscape", l: "横向" }].map(({ v, l }) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="orientation" value={v} checked={form.orientation === v}
                      onChange={() => set("orientation", v)} className="text-blue-500 focus:ring-blue-200" />
                    <span className="text-sm text-gray-700">{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
              <select value={form.fontSize} onChange={(e) => set("fontSize", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
                {[8, 9, 10, 11, 12, 14].map((s) => <option key={s} value={s}>{s}pt</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">页边距（mm）</label>
              <div className="grid grid-cols-4 gap-3">
                {marginInput("上边距", "marginTop")}
                {marginInput("下边距", "marginBottom")}
                {marginInput("左边距", "marginLeft")}
                {marginInput("右边距", "marginRight")}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">是否设为默认</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => set("isDefault", !form.isDefault)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${form.isDefault ? "bg-blue-500" : "bg-gray-200"}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${form.isDefault ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-gray-600">{form.isDefault ? "是" : "否"}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">打印显示价格</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => set("showPrice", !form.showPrice)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${form.showPrice ? "bg-blue-500" : "bg-gray-200"}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${form.showPrice ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-gray-600">{form.showPrice ? "显示" : "隐藏"}</span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea rows={3} placeholder="请输入备注说明" value={form.remark}
                onChange={(e) => set("remark", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none" />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">取消</button>
          <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">保存</button>
        </div>
      </div>
    </div>
  );
}

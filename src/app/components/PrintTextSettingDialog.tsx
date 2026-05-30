import { useState, useEffect } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import type { PrintTemplate } from "./PrintTemplateDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<PrintTemplate>) => void;
  template: PrintTemplate | null;
}

export function PrintTextSettingDialog({
  open,
  onClose,
  onSave,
  template,
}: Props) {
  const [form, setForm] = useState({
    headerInfo: "",
    footerNote: "",
  });

  useEffect(() => {
    if (open && template) {
      setForm({
        headerInfo: template.headerInfo,
        footerNote: template.footerNote,
      });
    }
  }, [open, template]);

  if (!open || !template) return null;

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-2xl">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-lg font-bold text-gray-800">
            打印文案设置
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <label className="w-20 pt-2 text-sm text-gray-700 text-right whitespace-nowrap shrink-0">
                标语内容
              </label>
              <input
                type="text"
                value={form.headerInfo}
                onChange={(e) =>
                  set("headerInfo", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-start gap-3">
              <label className="w-20 pt-2 text-sm text-gray-700 text-right whitespace-nowrap shrink-0">
                售后事项内容
              </label>
              <textarea
                rows={5}
                value={form.footerNote}
                onChange={(e) =>
                  set("footerNote", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onSave({ ...template, ...form });
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

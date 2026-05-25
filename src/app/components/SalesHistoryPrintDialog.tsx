import { useState } from "react";
import { Close as CloseIcon, Print as PrintIcon } from "@mui/icons-material";

interface SalesHistoryPrintDialogProps {
  open: boolean;
  onClose: () => void;
  order: any;
}

export function SalesHistoryPrintDialog({ open, onClose, order }: SalesHistoryPrintDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("A4");

  if (!open) return null;

  const handlePrint = () => {
    console.log("打印订单", { orderNo: order.orderNo, template: selectedTemplate });
    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <h2 className="text-lg font-bold text-gray-800">选择打印模板</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="template"
                value="A4"
                checked={selectedTemplate === "A4"}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">A4</div>
                <div className="text-xs text-gray-500">A4标准纸张打印格式</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="template"
                value="三联单"
                checked={selectedTemplate === "三联单"}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">三联单</div>
                <div className="text-xs text-gray-500">三联单据打印格式</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="template"
                value="二联单"
                checked={selectedTemplate === "二联单"}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">二联单</div>
                <div className="text-xs text-gray-500">二联单据打印格式</div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            取消
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center gap-1.5"
          >
            <PrintIcon sx={{ fontSize: 16 }} />
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

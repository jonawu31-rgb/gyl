import { useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface SalesHistoryEditSalespersonDialogProps {
  open: boolean;
  onClose: () => void;
  order: any;
}

export function SalesHistoryEditSalespersonDialog({
  open,
  onClose,
  order,
}: SalesHistoryEditSalespersonDialogProps) {
  const [selectedSalesperson, setSelectedSalesperson] = useState(order?.salesperson || "");

  if (!open) return null;

  const handleSubmit = () => {
    if (!selectedSalesperson) {
      alert("请选择销售员");
      return;
    }
    console.log("修改销售员", { orderNo: order.orderNo, salesperson: selectedSalesperson });
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
          <h2 className="text-lg font-bold text-gray-800">修改销售单</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              销售员 <span className="text-red-500">*</span>
            </label>
            <FauxSelect
              value={selectedSalesperson}
              onChange={(e) => setSelectedSalesperson(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
            >
              <option value="">请选择</option>
              <option value="李销售">李销售</option>
              <option value="张销售">张销售</option>
              <option value="王销售">王销售</option>
              <option value="赵销售">赵销售</option>
            </FauxSelect>
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
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

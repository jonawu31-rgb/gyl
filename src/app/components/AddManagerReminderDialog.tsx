import { useState, useEffect } from "react";
import { Close as CloseIcon } from "@mui/icons-material";

interface AddManagerReminderDialogProps {
  initialData?: {
    startDate: string;
    endDate: string;
    content: string;
  } | null;
  onClose: () => void;
  onSave: (data: { startDate: string; endDate: string; content: string }) => void;
}

export function AddManagerReminderDialog({ initialData, onClose, onSave }: AddManagerReminderDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialData) {
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSave = () => {
    // 校验必填项
    if (!startDate) {
      alert("请选择开始日期");
      return;
    }
    if (!endDate) {
      alert("请选择结束日期");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("开始日期不能晚于结束日期");
      return;
    }

    onSave({ startDate, endDate, content });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">{initialData ? "编辑店长提醒" : "新增店长提醒"}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          <div className="space-y-4">
            {/* 开始日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>

            {/* 结束日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>

            {/* 提醒内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">提醒内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm resize-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

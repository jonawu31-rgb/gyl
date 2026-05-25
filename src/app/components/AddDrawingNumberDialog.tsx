import { useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";

interface AddDrawingNumberDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export function AddDrawingNumberDialog({ open, onClose, onSave }: AddDrawingNumberDialogProps) {
  const [activeTab, setActiveTab] = useState(0); // 0: 添加OE, 1: 通过车架号添加
  const [oeNumbers, setOeNumbers] = useState("");
  const [conversionOptions, setConversionOptions] = useState({
    code: "",
    name: "",
    feature: "",
    drawingNumber: "",
    manufacturerCode: "",
    spec: "",
  });

  if (!open) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({ oeNumbers, conversionOptions });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab(0)}
              className={`px-4 py-1 text-sm font-medium transition-colors ${
                activeTab === 0
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              添加OE
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-4 py-1 text-sm font-medium transition-colors ${
                activeTab === 1
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              通过车架号添加
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {activeTab === 0 && (
            <div className="space-y-4">
              {/* OE规则说明 */}
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                OE规则：OE号超过50位，或去除特殊符号与OE少于2位会被删除
              </div>

              {/* OE号输入 */}
              <div>
                <textarea
                  value={oeNumbers}
                  onChange={(e) => setOeNumbers(e.target.value)}
                  placeholder="请输入oe号，支持复制粘贴输入，以换行分割"
                  rows={8}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none placeholder:text-gray-400"
                />
                <div className="mt-2 text-xs text-gray-500 leading-relaxed">
                  示例：<br />
                  03C 115 561 B<br />
                  L 03C 115 561 B<br />
                  106H 905 601 B
                </div>
              </div>

              {/* 转换选项 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">您想将哪些信息转换为图号？</span>
                  <span className="text-sm text-gray-400">●</span>
                  <a href="#" className="text-sm text-blue-600 hover:underline">配件显示设置</a>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="编码:"
                      value={conversionOptions.code}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, code: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="名称:"
                      value={conversionOptions.name}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="特征码:"
                      value={conversionOptions.feature}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, feature: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="图号:"
                      value={conversionOptions.drawingNumber}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, drawingNumber: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="厂家编码:"
                      value={conversionOptions.manufacturerCode}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, manufacturerCode: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="规格:"
                      value={conversionOptions.spec}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, spec: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="text-center py-12 text-gray-500">
              通过车架号添加功能开发中...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 rounded-b-xl flex items-center justify-end gap-2 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            取消
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-sm hover:shadow text-sm">
            匹配改造
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow text-sm"
          >
            敬请添加
          </button>
        </div>
      </div>
    </div>
  );
}

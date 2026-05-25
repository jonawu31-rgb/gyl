import { useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";

interface SalesCartDialogProps {
  open: boolean;
  onClose: () => void;
  cartData?: any;
}

export function SalesCartDialog({ open, onClose, cartData }: SalesCartDialogProps) {
  const [formData, setFormData] = useState({
    customer: cartData?.customer || "",
    cartNo: cartData?.cartNo || "",
    date: cartData?.date || "",
    salesperson: cartData?.salesperson || "",
    vin: "",
    notes: cartData?.notes || "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
          <h2 className="text-lg font-bold text-gray-800">
            {cartData ? "编辑销售手推车" : "新增销售手推车"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-3 gap-4">
            {/* 客户 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                客户 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              >
                <option value="">请选择</option>
                <option value="黄山佳辉汽配">黄山佳辉汽配</option>
                <option value="济南恒通汽车">济南恒通汽车</option>
                <option value="深圳明辉配件">深圳明辉配件</option>
              </select>
            </div>

            {/* 手推车编号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                手推车编号
              </label>
              <input
                type="text"
                value={formData.cartNo}
                onChange={(e) => setFormData({ ...formData, cartNo: e.target.value })}
                placeholder="请输入"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />
            </div>

            {/* 日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>

            {/* 业务员 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                业务员
              </label>
              <select
                value={formData.salesperson}
                onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              >
                <option value="">请选择</option>
                <option value="管理员">管理员</option>
                <option value="张三">张三</option>
                <option value="李四">李四</option>
              </select>
            </div>

            {/* 车架号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                车架号
              </label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="请输入"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />
            </div>

            {/* 备注 - Full width */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                备注
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="请输入"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 rounded-b-xl flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">提示：</span>填写完基本信息后，点击"添加商品"按钮添加商品
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              关闭
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow text-sm">
              添加商品
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow text-sm">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

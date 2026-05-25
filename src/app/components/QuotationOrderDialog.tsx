import { useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";

interface QuotationOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderData?: any;
}

export function QuotationOrderDialog({ open, onClose, orderData }: QuotationOrderDialogProps) {
  const [formData, setFormData] = useState({
    customer: orderData?.customer || "",
    orderNo: orderData?.orderNo || "",
    date: orderData?.date || "",
    validUntil: orderData?.validUntil || "",
    paymentMethod: "",
    deliveryMethod: "",
    salesperson: orderData?.salesperson || "",
    vin: "",
    notes: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
          <h2 className="text-lg font-bold text-gray-800">
            {orderData ? "编辑报价单" : "新增报价单"}
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

            {/* 单据编号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                单据编号
              </label>
              <input
                type="text"
                value={formData.orderNo}
                onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
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

            {/* 有效期至 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                有效期至
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              />
            </div>

            {/* 收款方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收款方式
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              >
                <option value="">请选择</option>
                <option value="现金">现金</option>
                <option value="转账">转账</option>
                <option value="支付宝">支付宝</option>
                <option value="微信">微信</option>
              </select>
            </div>

            {/* 配送方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                配送方式
              </label>
              <select
                value={formData.deliveryMethod}
                onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
              >
                <option value="">请选择</option>
                <option value="快递">快递</option>
                <option value="物流">物流</option>
                <option value="自提">自提</option>
                <option value="送货">送货</option>
              </select>
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
            <span className="font-semibold">提示：</span>填写完基本信息后，点击"添加明细"按钮添加商品
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              关闭
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow text-sm">
              添加明细(PgDn)
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

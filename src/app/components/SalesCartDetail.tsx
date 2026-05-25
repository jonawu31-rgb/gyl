import { useState } from "react";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

interface SalesCartDetailProps {
  open: boolean;
  onClose: () => void;
  cartData: any;
}

export function SalesCartDetail({ open, onClose, cartData }: SalesCartDetailProps) {
  const [activeTab, setActiveTab] = useState("详细信息");

  const tabs = ["详细信息", "备注信息", "操作日志"];

  const mockProducts = [
    {
      id: "1",
      partCode: "P001-2024",
      partName: "前刹车片",
      brand: "博世",
      vehicleType: "奥迪A6",
      quantity: 2,
      unit: "套",
      price: 680.00,
      discount: 0.95,
      amount: 1292.00,
      stock: 50,
      warehouse: "主仓库",
    },
    {
      id: "2",
      partCode: "P002-2024",
      partName: "机油滤清器",
      brand: "曼牌",
      vehicleType: "大众速腾",
      quantity: 5,
      unit: "个",
      price: 65.00,
      discount: 1.0,
      amount: 325.00,
      stock: 200,
      warehouse: "主仓库",
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
        <h2 className="text-lg font-bold text-gray-800">
          销售手推车详情 - {cartData.cartNo}
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
            <SettingsIcon sx={{ fontSize: 20 }} className="text-gray-600" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1 px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />
            添加商品
          </button>
          <button className="px-3 py-1.5 bg-white text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors border border-gray-200 flex items-center gap-1.5">
            <RemoveIcon sx={{ fontSize: 16 }} />
            删除行
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <PrintIcon sx={{ fontSize: 16 }} />
            打印
          </button>
          <button className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5">
            转为销售单
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "详细信息" && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">基本信息</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">客户</label>
                  <div className="text-sm font-medium text-gray-900">{cartData.customer}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">手推车编号</label>
                  <div className="text-sm font-medium text-gray-900">{cartData.cartNo}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">日期</label>
                  <div className="text-sm text-gray-700">{cartData.date}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">业务员</label>
                  <div className="text-sm text-gray-700">{cartData.salesperson}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">状态</label>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    cartData.status === "已转单"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {cartData.status}
                  </span>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">商品数量</label>
                  <div className="text-sm text-gray-700">{cartData.itemCount} 项</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">备注</label>
                  <div className="text-sm text-gray-700">{cartData.notes || "无"}</div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#E8F5E9' }}>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2.5 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                        />
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">序号</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件编码</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品牌</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">适用车型</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">数量</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单位</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">单价</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">折扣</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">金额</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">库存</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">仓库</th>
                      <th className="px-3 py-2.5 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducts.map((product, index) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-3 py-2.5 text-sm text-blue-600 font-medium">{product.partCode}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-900 font-medium">{product.partName}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-600">{product.brand}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-600">{product.vehicleType}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{product.quantity}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-600">{product.unit}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700 text-right">¥{product.price.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{product.discount}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-900 font-medium text-right">¥{product.amount.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{product.stock}</td>
                        <td className="px-3 py-2.5 text-sm text-gray-600">{product.warehouse}</td>
                        <td className="px-3 py-2.5">
                          <button className="text-red-600 hover:text-red-700 transition-colors">
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  共 <span className="font-semibold text-gray-800">{mockProducts.length}</span> 项商品
                </div>
                <div className="text-lg font-bold text-gray-900">
                  总计: <span className="text-blue-600">¥{cartData.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "备注信息" && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <textarea
              placeholder="请输入备注信息"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none"
              defaultValue={cartData.notes}
            />
          </div>
        )}

        {activeTab === "操作日志" && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-900 font-medium">创建手推车</div>
                  <div className="text-xs text-gray-500 mt-1">
                    操作人: {cartData.salesperson} | 时间: {cartData.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 rounded-b-xl flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            创建时间: {cartData.date} | 业务员: {cartData.salesperson}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              关闭
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow text-sm flex items-center gap-1.5">
              <SaveIcon sx={{ fontSize: 16 }} />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

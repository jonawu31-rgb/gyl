import { useState } from "react";
import { Close as CloseIcon, CalendarToday as CalendarIcon } from "@mui/icons-material";

interface PartSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export function PartSettingsDialog({ open, onClose, onSave }: PartSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<"attribute" | "detail" | "stock" | "image">("attribute");

  // 配件属性表单字段
  const [formData, setFormData] = useState({
    partNumber: "",
    partName: "",
    remark: "",
    commonName: "",
    spec: "",
    model: "",
    auxInfo: "",
    category: "",
    vehicleType: "",
    brand: "",
    invoiceNumber: "",
    foreignCode: "",
    deliveryDate: "",
    serialNumber: "",
    productionDate: "",
    productNote: "",
    difference: "",
    manufacturerCode: "",
    manufacturerCategory: "",
    suggestedRetail: "",
    delivery: "",
    qyo: "",
    management: "",
    notice: "",
    modification: "",
  });

  const [imageFiles, setImageFiles] = useState([
    { id: 1, name: "", price: "", description: "" },
    { id: 2, name: "", price: "", description: "" },
    { id: 3, name: "", price: "", description: "" },
    { id: 4, name: "", price: "", description: "" },
    { id: 5, name: "", price: "", description: "" },
  ]);

  if (!open) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ width: "1000px", height: "600px" }}>
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-gray-800">设置应件</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 shrink-0">
          <div className="flex gap-2 px-5 py-3">
            <button
              onClick={() => setActiveTab("attribute")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
                activeTab === "attribute"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              配件属性
            </button>
            <button
              onClick={() => setActiveTab("detail")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
                activeTab === "detail"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              配件详情
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
                activeTab === "stock"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              配件库存
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all ${
                activeTab === "image"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              称图管理
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {activeTab === "attribute" && (
            <div className="space-y-4">
              {/* 基础信息区域 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">基础信息</h3>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">番号</label>
                    <input
                      type="text"
                      placeholder="请输入配件子番号(Y字头)"
                      value={formData.partNumber}
                      onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">零件名称</label>
                    <input
                      type="text"
                      placeholder="请输入零件名称"
                      value={formData.partName}
                      onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">备注</label>
                    <input
                      type="text"
                      placeholder="请输入备注"
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">通用名称</label>
                    <select
                      value={formData.commonName}
                      onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    >
                      <option value="">请选择通用名称</option>
                      <option value="滤清器">滤清器</option>
                      <option value="刹车系统">刹车系统</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">规格</label>
                    <input
                      type="text"
                      placeholder="请输入规格"
                      value={formData.spec}
                      onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">成型</label>
                    <input
                      type="text"
                      placeholder="请输入订型"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">辅助信息</label>
                    <input
                      type="text"
                      placeholder="请输入辅助"
                      value={formData.auxInfo}
                      onChange={(e) => setFormData({ ...formData, auxInfo: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">品类</label>
                    <input
                      type="text"
                      placeholder="请选择品类"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">适用车型</label>
                    <input
                      type="text"
                      placeholder="请输入适用车型"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">白号</label>
                    <input
                      type="text"
                      placeholder="请选择白号"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">发票号码</label>
                    <input
                      type="text"
                      placeholder="请输入发票号码"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">外交号</label>
                    <input
                      type="text"
                      placeholder="请输入外交号"
                      value={formData.foreignCode}
                      onChange={(e) => setFormData({ ...formData, foreignCode: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">配送日期</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="请输入配送日期"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                      />
                      <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 16 }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">商号</label>
                    <input
                      type="text"
                      placeholder="请选择商号"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">生成日期</label>
                    <input
                      type="text"
                      placeholder="请选择生成日期"
                      value={formData.productionDate}
                      onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">产品注释</label>
                    <input
                      type="text"
                      placeholder="请选择产品注释"
                      value={formData.productNote}
                      onChange={(e) => setFormData({ ...formData, productNote: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">差额</label>
                    <input
                      type="text"
                      placeholder="请选择差额"
                      value={formData.difference}
                      onChange={(e) => setFormData({ ...formData, difference: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">厂家编码</label>
                    <input
                      type="text"
                      placeholder="请输入厂家编码"
                      value={formData.manufacturerCode}
                      onChange={(e) => setFormData({ ...formData, manufacturerCode: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">厂家分类</label>
                    <input
                      type="text"
                      placeholder="请选择厂家分类"
                      value={formData.manufacturerCategory}
                      onChange={(e) => setFormData({ ...formData, manufacturerCategory: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">建议零</label>
                    <input
                      type="text"
                      placeholder="请选择建议零"
                      value={formData.suggestedRetail}
                      onChange={(e) => setFormData({ ...formData, suggestedRetail: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">送货</label>
                    <input
                      type="text"
                      placeholder="请输入送货"
                      value={formData.delivery}
                      onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Q-Y0</label>
                    <input
                      type="text"
                      placeholder="请输入Q-Y0"
                      value={formData.qyo}
                      onChange={(e) => setFormData({ ...formData, qyo: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">管理</label>
                    <input
                      type="text"
                      placeholder="请输入管理"
                      value={formData.management}
                      onChange={(e) => setFormData({ ...formData, management: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">通告</label>
                    <input
                      type="text"
                      placeholder="请选择通告"
                      value={formData.notice}
                      onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">修改</label>
                    <input
                      type="text"
                      placeholder="请输入修改"
                      value={formData.modification}
                      onChange={(e) => setFormData({ ...formData, modification: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* 图档列表 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">图档列表</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
                      新增图档
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      保存
                    </button>
                    <button className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                      取消
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">图档</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">参考价格</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">价格</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">模板</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">备注</th>
                        </tr>
                      </thead>
                      <tbody>
                        {imageFiles.map((file) => (
                          <tr key={file.id} className="border-b border-gray-100">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="请输入名称"
                                value={file.name}
                                onChange={(e) => {
                                  const newFiles = imageFiles.map((f) =>
                                    f.id === file.id ? { ...f, name: e.target.value } : f
                                  );
                                  setImageFiles(newFiles);
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <span className="text-gray-600">参考价 × 1.2</span>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="请工提供"
                                value={file.price}
                                onChange={(e) => {
                                  const newFiles = imageFiles.map((f) =>
                                    f.id === file.id ? { ...f, price: e.target.value } : f
                                  );
                                  setImageFiles(newFiles);
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <span className="text-gray-600">手工提供</span>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="商店型式标准/联络预约"
                                value={file.description}
                                onChange={(e) => {
                                  const newFiles = imageFiles.map((f) =>
                                    f.id === file.id ? { ...f, description: e.target.value } : f
                                  );
                                  setImageFiles(newFiles);
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "detail" && (
            <div className="text-center text-gray-500 py-10">配件详情功能开发中...</div>
          )}

          {activeTab === "stock" && (
            <div className="text-center text-gray-500 py-10">配件库存功能开发中...</div>
          )}

          {activeTab === "image" && (
            <div className="text-center text-gray-500 py-10">称图管理功能开发中...</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Refresh as RefreshIcon } from "@mui/icons-material";

export function SystemConfig() {
  const [formData, setFormData] = useState({
    shopName: "车配智数供应链平台",
    contactPerson: "黄伟霆",
    contactPhone: "13800138000",
    shopAddress: "成都市武侯区天府大道中段666号",
  });

  const handleSave = () => {
    // 保存逻辑
    alert("保存成功");
  };

  const handleRefresh = () => {
    // 刷新逻辑
    setFormData({
      shopName: "车配智数供应链平台",
      contactPerson: "黄伟霆",
      contactPhone: "13800138000",
      shopAddress: "成都市武侯区天府大道中段666号",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">系统配置</h2>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* 店铺名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> 店铺名称
            </label>
            <input
              type="text"
              placeholder="请输入店铺名称"
              value={formData.shopName}
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 联系人 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> 联系人
            </label>
            <input
              type="text"
              placeholder="请输入联系人"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 联系电话 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> 联系电话
            </label>
            <input
              type="text"
              placeholder="请输入联系电话"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 门店地址 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> 门店地址
            </label>
            <input
              type="text"
              placeholder="请输入门店地址"
              value={formData.shopAddress}
              onChange={(e) =>
                setFormData({ ...formData, shopAddress: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 按钮组 */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
            >
              保存
            </button>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <RefreshIcon sx={{ fontSize: 16 }} />
              刷新
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

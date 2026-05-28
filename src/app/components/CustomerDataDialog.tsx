import { useState, useEffect } from "react";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PriceCategoryItem {
  id: string;
  category: string;
  priceLevel: string;
}

export interface CustomerFormData {
  customerName: string;
  shortName: string;
  contactPerson: string;
  phone: string;
  gender: string;
  birthDate: string;
  shippingProvince: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingAddress: string;
  registeredProvince: string;
  registeredCity: string;
  registeredDistrict: string;
  registeredAddress: string;
  defaultDelivery: string;
  companyPhone: string;
  postalCode: string;
  customerSource: string;
  accountManager: string;
  tradeCategory: string;
  priceLevel: string;
  settlementMethod: string;
  paymentCycle: string;
  invoiceType: string;
  socialCreditCode: string;
  bankName: string;
  bankAccount: string;
  creditLimit: string;
  initialDebt: string;
  wubiCode: string;
  pinyinCode: string;
  customerType: string;
  remark: string;
  priceCategories: PriceCategoryItem[];
}

interface CustomerDataDialogProps {
  open: boolean;
  onClose: () => void;
  editData?: Partial<CustomerFormData> | null;
  onSave: (data: CustomerFormData) => void;
}

const EMPTY_FORM: CustomerFormData = {
  customerName: "",
  shortName: "",
  contactPerson: "",
  phone: "",
  gender: "",
  birthDate: "",
  shippingProvince: "",
  shippingCity: "",
  shippingDistrict: "",
  shippingAddress: "",
  registeredProvince: "",
  registeredCity: "",
  registeredDistrict: "",
  registeredAddress: "",
  defaultDelivery: "",
  companyPhone: "",
  postalCode: "",
  customerSource: "",
  accountManager: "",
  tradeCategory: "",
  priceLevel: "",
  settlementMethod: "",
  paymentCycle: "",
  invoiceType: "",
  socialCreditCode: "",
  bankName: "",
  bankAccount: "",
  creditLimit: "",
  initialDebt: "",
  wubiCode: "",
  pinyinCode: "",
  customerType: "",
  remark: "",
  priceCategories: [],
};

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400";
const selectCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 bg-blue-500 rounded-full" />
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    </div>
  );
}

export function CustomerDataDialog({ open, onClose, editData, onSave }: CustomerDataDialogProps) {
  const [form, setForm] = useState<CustomerFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<{ customerName?: string; phone?: string }>({});

  useEffect(() => {
    if (open) {
      setForm(editData ? { ...EMPTY_FORM, ...editData } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, editData]);

  if (!open) return null;

  const set = (field: keyof CustomerFormData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addPriceCategory = () => {
    setForm((prev) => ({
      ...prev,
      priceCategories: [
        ...prev.priceCategories,
        { id: Date.now().toString(), category: "", priceLevel: "" },
      ],
    }));
  };

  const removePriceCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      priceCategories: prev.priceCategories.filter((item) => item.id !== id),
    }));
  };

  const updatePriceCategory = (id: string, field: "category" | "priceLevel", value: string) => {
    setForm((prev) => ({
      ...prev,
      priceCategories: prev.priceCategories.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSave = () => {
    const newErrors: typeof errors = {};
    if (!form.customerName.trim()) newErrors.customerName = "客户名称不能为空";
    if (!form.phone.trim()) newErrors.phone = "联系电话不能为空";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 1000, maxHeight: "90vh" }}>
        {/* Header */}
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">
            {editData ? "编辑客户" : "新增客户"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {/* 基本信息 */}
          <div className="mb-5">
            <SectionTitle title="基本信息" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>
                  客户名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入客户名称"
                  value={form.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  className={`${inputCls} ${errors.customerName ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                />
                {errors.customerName && (
                  <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>客户简称</label>
                <input
                  type="text"
                  placeholder="请输入客户简称"
                  value={form.shortName}
                  onChange={(e) => set("shortName", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>联系人</label>
                <input
                  type="text"
                  placeholder="请输入联系人姓名"
                  value={form.contactPerson}
                  onChange={(e) => set("contactPerson", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入联系电话"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={`${inputCls} ${errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>性别</label>
                <FauxSelect
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </FauxSelect>
              </div>
              <div>
                <label className={labelCls}>出生日期</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => set("birthDate", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* 地址信息 */}
          <div className="mb-5">
            <SectionTitle title="地址信息" />
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>收货地址</label>
                <div className="flex gap-2">
                  <FauxSelect
                    value={form.shippingProvince}
                    onChange={(e) => set("shippingProvince", e.target.value)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700"
                  >
                    <option value="">省</option>
                    <option value="广东省">广东省</option>
                    <option value="浙江省">浙江省</option>
                    <option value="江苏省">江苏省</option>
                    <option value="北京市">北京市</option>
                    <option value="上海市">上海市</option>
                  </FauxSelect>
                  <FauxSelect
                    value={form.shippingCity}
                    onChange={(e) => set("shippingCity", e.target.value)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700"
                  >
                    <option value="">市</option>
                    <option value="广州市">广州市</option>
                    <option value="深圳市">深圳市</option>
                    <option value="杭州市">杭州市</option>
                    <option value="南京市">南京市</option>
                  </FauxSelect>
                  <FauxSelect
                    value={form.shippingDistrict}
                    onChange={(e) => set("shippingDistrict", e.target.value)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700"
                  >
                    <option value="">区</option>
                    <option value="天河区">天河区</option>
                    <option value="越秀区">越秀区</option>
                    <option value="福田区">福田区</option>
                  </FauxSelect>
                  <input
                    type="text"
                    placeholder="请输入详细地址"
                    value={form.shippingAddress}
                    onChange={(e) => set("shippingAddress", e.target.value)}
                    className={`flex-1 ${inputCls}`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>注册地址</label>
                <div className="flex gap-2">
                  <FauxSelect
                    value={form.registeredProvince}
                    onChange={(e) => set("registeredProvince", e.target.value)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700"
                  >
                    <option value="">省</option>
                    <option value="广东省">广东省</option>
                    <option value="浙江省">浙江省</option>
                    <option value="江苏省">江苏省</option>
                    <option value="北京市">北京市</option>
                    <option value="上海市">上海市</option>
                  </FauxSelect>
                  <FauxSelect
                    value={form.registeredCity}
                    onChange={(e) => set("registeredCity", e.target.value)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700"
                  >
                    <option value="">市</option>
                    <option value="广州市">广州市</option>
                    <option value="深圳市">深圳市</option>
                    <option value="杭州市">杭州市</option>
                    <option value="南京市">南京市</option>
                  </FauxSelect>
                  <FauxSelect
                    value={form.registeredDistrict}
                    onChange={(e) => set("registeredDistrict", e.target.value)}
                    className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-gray-700"
                  >
                    <option value="">区</option>
                    <option value="天河区">天河区</option>
                    <option value="越秀区">越秀区</option>
                    <option value="福田区">福田区</option>
                  </FauxSelect>
                  <input
                    type="text"
                    placeholder="请输入详细地址"
                    value={form.registeredAddress}
                    onChange={(e) => set("registeredAddress", e.target.value)}
                    className={`flex-1 ${inputCls}`}
                  />
                </div>
              </div>
              <div className="w-1/3">
                <label className={labelCls}>默认配送</label>
                <FauxSelect
                  value={form.defaultDelivery}
                  onChange={(e) => set("defaultDelivery", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="收货地址">收货地址</option>
                  <option value="注册地址">注册地址</option>
                </FauxSelect>
              </div>
            </div>
          </div>

          {/* 公司信息 */}
          <div className="mb-5">
            <SectionTitle title="公司信息" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>公司电话</label>
                <input
                  type="text"
                  placeholder="请输入公司电话"
                  value={form.companyPhone}
                  onChange={(e) => set("companyPhone", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>邮政编码</label>
                <input
                  type="text"
                  placeholder="请输入邮政编码"
                  value={form.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>客户来源</label>
                <FauxSelect
                  value={form.customerSource}
                  onChange={(e) => set("customerSource", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="转介绍">转介绍</option>
                  <option value="网络推广">网络推广</option>
                  <option value="门店自然客流">门店自然客流</option>
                  <option value="电话营销">电话营销</option>
                  <option value="其他">其他</option>
                </FauxSelect>
              </div>
              <div>
                <label className={labelCls}>客户经理</label>
                <FauxSelect
                  value={form.accountManager}
                  onChange={(e) => set("accountManager", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="黄伟霆">黄伟霆</option>
                  <option value="李明">李明</option>
                  <option value="王芳">王芳</option>
                </FauxSelect>
              </div>
              <div>
                <label className={labelCls}>往来类别</label>
                <FauxSelect
                  value={form.tradeCategory}
                  onChange={(e) => set("tradeCategory", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="客户">客户</option>
                  <option value="供应商">供应商</option>
                  <option value="即客即供">即客即供</option>
                </FauxSelect>
              </div>
              <div>
                <label className={labelCls}>价格级别</label>
                <FauxSelect
                  value={form.priceLevel}
                  onChange={(e) => set("priceLevel", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="零售价">零售价</option>
                  <option value="批发价">批发价</option>
                  <option value="VIP价">VIP价</option>
                  <option value="成本价">成本价</option>
                </FauxSelect>
              </div>
            </div>
          </div>

          {/* 分类价格级别 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle title="分类价格级别" />
              <button
                onClick={addPriceCategory}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
              >
                <AddIcon sx={{ fontSize: 16 }} />
                新增
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 w-[60px]">序号</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">分类</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">价格级别</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 w-[80px]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {form.priceCategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">
                        暂无数据，点击"新增"添加分类价格配置
                      </td>
                    </tr>
                  ) : (
                    form.priceCategories.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-2">
                          <FauxSelect
                            value={item.category}
                            onChange={(e) => updatePriceCategory(item.id, "category", e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-400 text-sm"
                          >
                            <option value="">请选择分类</option>
                            <option value="滤清器">滤清器</option>
                            <option value="制动系统">制动系统</option>
                            <option value="油品">油品</option>
                            <option value="点火系统">点火系统</option>
                            <option value="传动系统">传动系统</option>
                          </FauxSelect>
                        </td>
                        <td className="px-4 py-2">
                          <FauxSelect
                            value={item.priceLevel}
                            onChange={(e) => updatePriceCategory(item.id, "priceLevel", e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-400 text-sm"
                          >
                            <option value="">请选择价格级别</option>
                            <option value="零售价">零售价</option>
                            <option value="批发价">批发价</option>
                            <option value="VIP价">VIP价</option>
                            <option value="成本价">成本价</option>
                          </FauxSelect>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => removePriceCategory(item.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 财务信息 */}
          <div className="mb-5">
            <SectionTitle title="财务信息" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>结算方式</label>
                <FauxSelect
                  value={form.settlementMethod}
                  onChange={(e) => set("settlementMethod", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="现结">现结</option>
                  <option value="月结">月结</option>
                  <option value="季结">季结</option>
                  <option value="年结">年结</option>
                </FauxSelect>
              </div>
              <div>
                <label className={labelCls}>结款周期</label>
                <FauxSelect
                  value={form.paymentCycle}
                  onChange={(e) => set("paymentCycle", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="月结">月结</option>
                  <option value="季结">季结</option>
                  <option value="现结">现结</option>
                </FauxSelect>
              </div>
              <div>
                <label className={labelCls}>开票类型</label>
                <FauxSelect
                  value={form.invoiceType}
                  onChange={(e) => set("invoiceType", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="增值税专用发票">增值税专用发票</option>
                  <option value="普通发票">普通发票</option>
                  <option value="不开票">不开票</option>
                </FauxSelect>
              </div>
              <div>
                <label className={labelCls}>社会信用代码</label>
                <input
                  type="text"
                  placeholder="请输入社会信用代码"
                  value={form.socialCreditCode}
                  onChange={(e) => set("socialCreditCode", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>开户行名称</label>
                <input
                  type="text"
                  placeholder="请输入开户行名称"
                  value={form.bankName}
                  onChange={(e) => set("bankName", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>银行账号</label>
                <input
                  type="text"
                  placeholder="请输入银行账号"
                  value={form.bankAccount}
                  onChange={(e) => set("bankAccount", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>信用额度</label>
                <input
                  type="text"
                  placeholder="请输入信用额度"
                  value={form.creditLimit}
                  onChange={(e) => set("creditLimit", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>期初欠款</label>
                <input
                  type="text"
                  placeholder="请输入期初欠款"
                  value={form.initialDebt}
                  onChange={(e) => set("initialDebt", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* 其他信息 */}
          <div className="mb-2">
            <SectionTitle title="其他信息" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>五笔码</label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={form.wubiCode}
                  onChange={(e) => set("wubiCode", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>拼音码</label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={form.pinyinCode}
                  onChange={(e) => set("pinyinCode", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>客户类型</label>
                <FauxSelect
                  value={form.customerType}
                  onChange={(e) => set("customerType", e.target.value)}
                  className={selectCls}
                >
                  <option value="">请选择</option>
                  <option value="个人客户">个人客户</option>
                  <option value="企业客户">企业客户</option>
                  <option value="VIP客户">VIP客户</option>
                </FauxSelect>
              </div>
              <div className="col-span-3">
                <label className={labelCls}>备注</label>
                <input
                  type="text"
                  placeholder="请输入备注"
                  value={form.remark}
                  onChange={(e) => set("remark", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
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

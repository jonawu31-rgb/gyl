import { useState, useEffect } from "react";
import { Close as CloseIcon } from "@mui/icons-material";

export interface PrintTemplate {
  id: string;
  name: string;
  documentType:
    | "sale"
    | "quote"
    | "purchase"
    | "inbound"
    | "outbound";
  templateType: "A4" | "三联单" | "二联单";
  status: "enabled" | "disabled";
  paperSize: "a4" | "a5" | "thermal_80" | "thermal_58";
  orientation: "portrait" | "landscape";
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  isDefault: boolean;
  title: string;
  headerInfo: string;
  footerNote: string;
  fontSize: number;
  showPrice: boolean;
  remark: string;
  updatedAt: string;
  contentFields?: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<PrintTemplate, "id" | "updatedAt">,
  ) => void;
  editData?: PrintTemplate | null;
}

const defaultForm = (): Omit<
  PrintTemplate,
  "id" | "updatedAt"
> => ({
  name: "",
  documentType: "sale",
  templateType: "A4",
  status: "enabled",
  paperSize: "a4",
  orientation: "portrait",
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
  isDefault: false,
  title: "",
  headerInfo: "",
  footerNote: "",
  fontSize: 10,
  showPrice: true,
  remark: "",
  contentFields: [
    "orderNo",
    "customerName",
    "openTime",
    "printTime",
    "code",
    "name",
    "unitPrice",
    "quantity",
    "spec",
    "discount",
    "remark",
    "amount",
    "summaryTotal",
    "summaryReceived",
    "originalTotal",
    "discountAmount",
    "receivableAmount",
    "paidAmount",
    "settledAmount",
    "pendingAmount",
    "clerk",
    "picker",
    "packer",
    "shipper",
    "manager",
    "customer",
    "logistics",
    "shippingAddress",
    "documentRemark",
    "storeReminder",
    "paymentMethod",
  ],
});

type ContentFieldKey =
  | "orderNo"
  | "customerName"
  | "openTime"
  | "printTime"
  | "code"
  | "name"
  | "unitPrice"
  | "quantity"
  | "spec"
  | "discount"
  | "remark"
  | "amount"
  | "summaryTotal"
  | "summaryReceived"
  | "originalTotal"
  | "discountAmount"
  | "receivableAmount"
  | "paidAmount"
  | "settledAmount"
  | "pendingAmount"
  | "clerk"
  | "picker"
  | "packer"
  | "shipper"
  | "manager"
  | "customer"
  | "logistics"
  | "shippingAddress"
  | "documentRemark"
  | "storeReminder"
  | "paymentMethod";

const CONTENT_LABELS: Record<ContentFieldKey, string> = {
  orderNo: "单号",
  customerName: "客户",
  openTime: "开单时间",
  printTime: "打印时间",
  code: "编码",
  name: "名称",
  unitPrice: "单价",
  quantity: "数量",
  spec: "规格",
  discount: "优惠",
  remark: "备注",
  amount: "金额",
  summaryTotal: "总计",
  summaryReceived: "实收",
  originalTotal: "原价总额",
  discountAmount: "优惠金额",
  receivableAmount: "应收金额",
  paidAmount: "实付",
  settledAmount: "已结金额",
  pendingAmount: "挂账金额",
  clerk: "开单员",
  picker: "拣货员",
  packer: "打包员",
  shipper: "发货员",
  manager: "主管",
  customer: "客户",
  logistics: "物流方式",
  shippingAddress: "收货地址",
  documentRemark: "单据备注",
  storeReminder: "店长提醒",
  paymentMethod: "支付方式",
};

const CONTENT_GROUPS: Array<{
  title: string;
  fields: ContentFieldKey[];
}> = [
  {
    title: "单据信息",
    fields: [
      "orderNo",
      "customerName",
      "openTime",
      "printTime",
    ],
  },
  {
    title: "明细项目",
    fields: [
      "code",
      "name",
      "unitPrice",
      "quantity",
      "spec",
      "discount",
      "remark",
      "amount",
    ],
  },
  {
    title: "金额汇总",
    fields: [
      "summaryTotal",
      "summaryReceived",
      "originalTotal",
      "discountAmount",
      "receivableAmount",
      "paidAmount",
      "settledAmount",
      "pendingAmount",
    ],
  },
  {
    title: "人员信息",
    fields: ["clerk", "picker", "packer", "shipper", "manager"],
  },
  {
    title: "辅助信息",
    fields: [
      "customer",
      "logistics",
      "shippingAddress",
      "documentRemark",
      "storeReminder",
      "paymentMethod",
    ],
  },
];

function PrintTemplateContentDialog({
  open,
  onClose,
  onConfirm,
  value,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (fields: ContentFieldKey[]) => void;
  value: ContentFieldKey[];
}) {
  const [selected, setSelected] =
    useState<ContentFieldKey[]>(value);

  useEffect(() => {
    if (open) setSelected(value);
  }, [open, value]);

  if (!open) return null;

  const toggle = (field: ContentFieldKey) => {
    setSelected((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field],
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-5xl max-h-[92vh]">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-lg font-bold text-gray-800">
            打印单据
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 bg-white">
          <div className="space-y-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="text-4xl font-semibold text-gray-900">
                销售订单
              </div>
              <div className="text-3xl font-medium text-gray-900">
                XXX供应商
              </div>
              <div className="w-20" />
            </div>

            <div className="border border-gray-300 overflow-hidden">
              <div className="grid grid-cols-3 border-b border-gray-300">
                {[
                  { field: "orderNo", label: "单号：XXX" },
                  { field: "customerName", label: "客户：XXX" },
                  {
                    field: "openTime",
                    label: "开单时间：2026-05-27 18:18:35",
                  },
                ].map((item, index) => (
                  <div
                    key={item.field}
                    className={`px-3 py-2.5 flex items-center gap-2 ${index < 2 ? "border-r border-gray-300" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        item.field as ContentFieldKey,
                      )}
                      onChange={() =>
                        toggle(item.field as ContentFieldKey)
                      }
                      className="h-4 w-4 accent-blue-500"
                    />
                    <span className="text-gray-800">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 border-b border-gray-300">
                {[
                  {
                    field: "printTime",
                    label: "打印时间：2026-05-27 18:18:35",
                  },
                  {
                    field: "summaryTotal",
                    label: "结算时间：2026-05-27 18:18:35",
                  },
                ].map((item, index) => (
                  <div
                    key={item.field}
                    className={`px-3 py-2.5 flex items-center gap-2 ${index === 0 ? "border-r border-gray-300" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        item.field as ContentFieldKey,
                      )}
                      onChange={() =>
                        toggle(item.field as ContentFieldKey)
                      }
                      className="h-4 w-4 accent-blue-500"
                    />
                    <span className="text-gray-800">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-b border-gray-300">
                <div className="grid grid-cols-8 font-medium text-gray-900 border-b border-gray-300">
                  {[
                    "编码",
                    "名称",
                    "单价",
                    "数量",
                    "规格",
                    "优惠",
                    "备注",
                    "金额",
                  ].map((label, index) => (
                    <div
                      key={label}
                      className={`px-3 py-2.5 flex items-center justify-center gap-2 ${index < 7 ? "border-r border-gray-300" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="h-4 w-4 accent-blue-500"
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-8 text-gray-700">
                  {Array.from({ length: 3 }).map(
                    (_, rowIndex) =>
                      [
                        "XXX",
                        "XXX",
                        "XXX",
                        "XXX",
                        "XXX",
                        "XXX",
                        "XXX",
                        "XXX",
                      ].map((cell, cellIndex) => (
                        <div
                          key={`${rowIndex}-${cellIndex}`}
                          className={`px-3 py-3 ${cellIndex < 7 ? "border-r border-gray-300" : ""} ${rowIndex < 2 ? "border-b border-gray-300" : ""} text-center`}
                        >
                          {cell}
                        </div>
                      )),
                  )}
                </div>
                <div className="grid grid-cols-8 border-t border-gray-300">
                  <div className="col-span-5 px-3 py-3" />
                  <div className="col-span-1 px-3 py-3 text-gray-800 flex items-center justify-center gap-2 border-l border-gray-300">
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        "summaryTotal",
                      )}
                      onChange={() => toggle("summaryTotal")}
                      className="h-4 w-4 accent-blue-500"
                    />
                    <span>总计：XXX</span>
                  </div>
                  <div className="col-span-2 px-3 py-3 text-gray-800 flex items-center justify-center gap-2 border-l border-gray-300">
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        "summaryReceived",
                      )}
                      onChange={() => toggle("summaryReceived")}
                      className="h-4 w-4 accent-blue-500"
                    />
                    <span>实收：XXX</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 px-3 py-3 border-b border-gray-300">
                {[
                  "原价总额：XXX",
                  "优惠金额：XXX",
                  "减收金额：XXX",
                  "应收金额：XXX",
                  "实付：XXX",
                  "已结金额：XXX",
                  "挂账金额：XXX",
                  "开单员：张三",
                  "拣货员：李四",
                  "打包员：王五",
                  "发货员：赵六",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked
                      readOnly
                      className="h-4 w-4 accent-blue-500"
                    />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 border-b border-gray-300">
                <div className="px-3 py-3 border-r border-gray-300 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes("manager")}
                    onChange={() => toggle("manager")}
                    className="h-4 w-4 accent-blue-500"
                  />
                  <span>主管：</span>
                  <div className="flex-1 border-b border-gray-300 h-5" />
                </div>
                <div className="px-3 py-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes("customer")}
                    onChange={() => toggle("customer")}
                    className="h-4 w-4 accent-blue-500"
                  />
                  <span>客户：</span>
                  <div className="flex-1 border-b border-gray-300 h-5" />
                </div>
              </div>

              <div className="px-3 py-3 space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes("logistics")}
                    onChange={() => toggle("logistics")}
                    className="mt-0.5 h-4 w-4 accent-blue-500"
                  />
                  <span>
                    物流方式：物流公司：XXXXXXX
                    物流单号：XXXXXXXX
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(
                      "shippingAddress",
                    )}
                    onChange={() => toggle("shippingAddress")}
                    className="mt-0.5 h-4 w-4 accent-blue-500"
                  />
                  <span>
                    收货地址：广东省深圳市南山区XXXX路XX号
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(
                      "documentRemark",
                    )}
                    onChange={() => toggle("documentRemark")}
                    className="mt-0.5 h-4 w-4 accent-blue-500"
                  />
                  <span>单据备注：--</span>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes("storeReminder")}
                    onChange={() => toggle("storeReminder")}
                    className="mt-0.5 h-4 w-4 accent-blue-500"
                  />
                  <span>店长提醒：--</span>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    checked={selected.includes("paymentMethod")}
                    onChange={() => toggle("paymentMethod")}
                    className="mt-0.5 h-4 w-4 accent-blue-500"
                  />
                  <span className="mr-3">支付方式：</span>
                  <div className="w-32 h-24 border border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                    XXX
                  </div>
                  <span className="ml-2">XXX</span>
                </div>
              </div>

              <div className="px-3 py-3 space-y-2 border-t border-gray-300">
                <div className="flex items-center gap-2 text-gray-800">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="h-4 w-4 accent-blue-500"
                  />
                  <span>请在打印文案设置中配置标语内容</span>
                </div>
                <div className="flex items-center gap-2 text-gray-800">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="h-4 w-4 accent-blue-500"
                  />
                  <span>
                    请在打印文案设置中配置售后事项内容
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 bg-white flex items-center justify-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(selected)}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrintTemplateDialog({
  open,
  onClose,
  onSave,
  editData,
}: Props) {
  const [form, setForm] = useState(defaultForm());
  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );
  const [contentOpen, setContentOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (editData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, updatedAt: _u, ...rest } = editData;
        setForm({
          ...defaultForm(),
          ...rest,
          contentFields:
            editData.contentFields ??
            defaultForm().contentFields,
        });
      } else {
        setForm(defaultForm());
      }
      setErrors({});
      setContentOpen(false);
    }
  }, [open, editData]);

  if (!open) return null;

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim()) {
      setErrors({ name: "请填写模版名称" });
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-4xl max-h-[90vh]">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-lg font-bold text-gray-800">
            {editData ? "编辑模板" : "新增模板"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5 bg-white">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> 模板名称
              </label>
              <input
                type="text"
                placeholder="请输入模板名称"
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  setErrors({});
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模板类型
              </label>
              <div className="flex items-center gap-5">
                {(["A4", "三联单", "二联单"] as const).map(
                  (v) => (
                    <label
                      key={v}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="templateType"
                        value={v}
                        checked={form.templateType === v}
                        onChange={() => set("templateType", v)}
                        className="text-blue-500 focus:ring-blue-200"
                      />
                      <span className="text-sm text-gray-700">
                        {v}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模板内容
              </label>
              <button
                type="button"
                onClick={() => setContentOpen(true)}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm whitespace-nowrap"
              >
                筛选内容
              </button>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {(form.contentFields ?? [])
                  .slice(0, 6)
                  .map((field) => (
                    <span
                      key={field}
                      className="inline-flex items-center px-2.5 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                    >
                      {CONTENT_LABELS[field as ContentFieldKey]}
                    </span>
                  ))}
                {(form.contentFields?.length ?? 0) > 6 && (
                  <span className="text-xs text-gray-400 self-center ml-1">
                    + {(form.contentFields?.length ?? 0) - 6}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <div className="flex items-center gap-5">
                {(
                  [
                    { v: "enabled", l: "启用" },
                    { v: "disabled", l: "停用" },
                  ] as const
                ).map(({ v, l }) => (
                  <label
                    key={v}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={v}
                      checked={form.status === v}
                      onChange={() => set("status", v)}
                      className="text-blue-500 focus:ring-blue-200"
                    />
                    <span className="text-sm text-gray-700">
                      {l}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模板备注
              </label>
              <textarea
                rows={4}
                placeholder="请输入模板备注"
                value={form.remark}
                onChange={(e) => set("remark", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
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
      <PrintTemplateContentDialog
        open={contentOpen}
        onClose={() => setContentOpen(false)}
        value={(form.contentFields ?? []) as ContentFieldKey[]}
        onConfirm={(fields) => set("contentFields", fields)}
      />
    </div>
  );
}
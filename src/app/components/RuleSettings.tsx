import { useState } from "react";
import { Save as SaveIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";

interface RuleConfig {
  needPick: boolean;
  needPack: boolean;
  needDelivery: boolean;
  overdueAction: "forbid" | "warn" | "none";
  overdueNotifiers: string[];
  workStartTime: string;
  workEndTime: string;
  mallOrderOutsideWork: boolean;
  barcodePrefix: string;
  barcodeLength: number;
  partImportReview: boolean;
  purchaseImportReview: boolean;
}

const EMPLOYEES = ["张明", "李红", "王强", "陈静", "刘洋", "赵磊", "孙婷"];

const OVERDUE_OPTIONS = [
  { value: "forbid", label: "不允许开单", desc: "客户有超期未结挂账时，禁止开单/报价/结算" },
  { value: "warn", label: "开单时提醒", desc: "弹出提示，需确认后可继续操作" },
  { value: "none", label: "不做任何处理", desc: "不拦截、不提示，正常开单" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function RadioGroup({ name, value, options, onChange }: {
  name: string;
  value: string | boolean;
  options: { value: string | boolean; label: string }[];
  onChange: (v: string | boolean) => void;
}) {
  return (
    <div className="flex items-center gap-6">
      {options.map(opt => (
        <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={name} checked={value === opt.value} onChange={() => onChange(opt.value)}
            className="text-blue-500 focus:ring-blue-200" />
          <span className="text-sm text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function RuleSettings() {
  const [config, setConfig] = useState<RuleConfig>({
    needPick: true, needPack: true, needDelivery: true,
    overdueAction: "none", overdueNotifiers: [],
    workStartTime: "09:00", workEndTime: "18:00",
    mallOrderOutsideWork: true,
    barcodePrefix: "SP", barcodeLength: 6,
    partImportReview: false, purchaseImportReview: false,
  });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof RuleConfig>(key: K, val: RuleConfig[K]) =>
    setConfig(prev => ({ ...prev, [key]: val }));

  const toggleNotifier = (emp: string) => {
    set("overdueNotifiers", config.overdueNotifiers.includes(emp)
      ? config.overdueNotifiers.filter(e => e !== emp)
      : [...config.overdueNotifiers, emp]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const barcodeExample = `${config.barcodePrefix}${"0".repeat(Math.max(0, config.barcodeLength - 1))}1`;

  return (
    <div className="h-full overflow-auto bg-[#f0f2f5] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">规则设置</h2>
            <p className="text-xs text-gray-400 mt-0.5">系统全局经营规则配置，修改后点击保存生效</p>
          </div>
          <button onClick={handleSave}
            className={`px-4 py-2 text-sm rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow"}`}>
            <SaveIcon sx={{ fontSize: 16 }} />
            {saved ? "已保存 ✓" : "立即保存"}
          </button>
        </div>

        {/* 经营规则 */}
        <SectionCard title="经营规则">
          <div className="space-y-4">
            {[
              { key: "needPick" as const, label: "是否需要拣货", desc: "销售出库流程中是否启用拣货环节" },
              { key: "needPack" as const, label: "是否需要打包", desc: "销售出库流程中是否启用打包环节" },
              { key: "needDelivery" as const, label: "是否需要发货", desc: "销售出库流程中是否启用发货环节" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-700">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
                <RadioGroup name={key} value={config[key]} options={[{ value: true, label: "是" }, { value: false, label: "否" }]} onChange={v => set(key, v as boolean)} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 客户欠款超期 */}
        <SectionCard title="客户欠款超期未结开单方式">
          <div className="space-y-3">
            {OVERDUE_OPTIONS.map(opt => (
              <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${config.overdueAction === opt.value ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" name="overdueAction" value={opt.value} checked={config.overdueAction === opt.value}
                  onChange={() => set("overdueAction", opt.value as RuleConfig["overdueAction"])}
                  className="mt-0.5 text-blue-500 focus:ring-blue-200" />
                <div>
                  <div className="text-sm font-medium text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">逾期开单消息接收人 <span className="text-gray-400 font-normal text-xs">（不选则不推送通知）</span></label>
            <div className="flex flex-wrap gap-2">
              {EMPLOYEES.map(emp => (
                <button key={emp} onClick={() => toggleNotifier(emp)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${config.overdueNotifiers.includes(emp) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                  {emp}
                </button>
              ))}
            </div>
            {config.overdueNotifiers.length > 0 && (
              <p className="text-xs text-blue-600 mt-2">已选：{config.overdueNotifiers.join("、")}</p>
            )}
          </div>
        </SectionCard>

        {/* 工作时间 */}
        <SectionCard title="工作时间">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">工作时间区间 <span className="text-gray-400 font-normal text-xs">（留空表示不限制）</span></label>
              <div className="flex items-center gap-3">
                <input type="time" value={config.workStartTime} onChange={e => set("workStartTime", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                <span className="text-gray-500 text-sm">至</span>
                <input type="time" value={config.workEndTime} onChange={e => set("workEndTime", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
                <span className="text-xs text-gray-400">（支持跨天，如 22:00 ~ 06:00）</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-700">工作时间外可登录员工</div>
                <div className="text-xs text-gray-400 mt-0.5">在员工管理中为具体员工开启「工作时间外可登录」权限</div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                去设置 <OpenInNewIcon sx={{ fontSize: 14 }} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-700">工作时间外商城是否可下单</div>
              </div>
              <RadioGroup name="mallOrder" value={config.mallOrderOutsideWork} options={[{ value: true, label: "是" }, { value: false, label: "否" }]} onChange={v => set("mallOrderOutsideWork", v as boolean)} />
            </div>
          </div>
        </SectionCard>

        {/* 商品条码 */}
        <SectionCard title="商品条码">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">商品条码前缀</label>
              <input type="text" value={config.barcodePrefix} onChange={e => set("barcodePrefix", e.target.value)}
                placeholder="请输入"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">自动增长位数</label>
              <input type="number" min={1} max={12} value={config.barcodeLength} onChange={e => set("barcodeLength", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm" />
            </div>
          </div>
          <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-500">
            示例条码：<span className="font-mono font-semibold text-gray-800">{barcodeExample}</span>
            （前缀 <span className="font-mono">{config.barcodePrefix || "—"}</span> + 自动增长 {config.barcodeLength} 位）
          </div>
        </SectionCard>

        {/* 导入审核 */}
        <SectionCard title="导入审核">
          <div className="space-y-3">
            {[
              { key: "partImportReview" as const, label: "配件导入审核", desc: "导入配件时是否需要经过审核流程" },
              { key: "purchaseImportReview" as const, label: "采购导入审核", desc: "导入采购单据时是否需要经过审核流程" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-700">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
                <RadioGroup name={key} value={config[key]} options={[{ value: true, label: "需要" }, { value: false, label: "不需要" }]} onChange={v => set(key, v as boolean)} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Bottom Save */}
        <div className="flex justify-end pb-4">
          <button onClick={handleSave}
            className={`px-6 py-2.5 text-sm rounded-lg flex items-center gap-2 transition-all shadow-sm ${saved ? "bg-green-500 text-white" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow"}`}>
            <SaveIcon sx={{ fontSize: 16 }} />
            {saved ? "已保存 ✓" : "立即保存"}
          </button>
        </div>
      </div>
    </div>
  );
}

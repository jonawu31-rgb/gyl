import { useState } from "react";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

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

const OVERDUE_OPTIONS = [
  { value: "forbid", label: "不允许开单" },
  { value: "warn", label: "开单时提醒" },
  { value: "none", label: "不做任何处理" },
] as const;

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function RadioGroup({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string | boolean;
  options: { value: string | boolean; label: string }[];
  onChange: (v: string | boolean) => void;
}) {
  return (
    <div className="flex items-center gap-6">
      {options.map((opt) => (
        <label key={String(opt.value)} className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="text-blue-500 focus:ring-blue-200"
          />
          <span className="text-sm text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function RuleSettings() {
  const [config, setConfig] = useState<RuleConfig>({
    needPick: true,
    needPack: true,
    needDelivery: true,
    overdueAction: "none",
    overdueNotifiers: [],
    workStartTime: "09:00",
    workEndTime: "18:00",
    mallOrderOutsideWork: true,
    barcodePrefix: "SP",
    barcodeLength: 6,
    partImportReview: false,
    purchaseImportReview: false,
  });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof RuleConfig>(key: K, val: RuleConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const barcodeExample = `${config.barcodePrefix}${"0".repeat(Math.max(0, config.barcodeLength - 1))}1`;

  return (
    <div className="h-full overflow-hidden bg-white">
      <div className="flex h-full flex-col">
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-3 pt-2">
          <div className="flex items-center px-1 pb-2">
            <h2 className="text-lg font-bold text-gray-900">规则设置</h2>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 py-2">
          <div className="space-y-3 pb-20">
          <SectionCard title="经营规则">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                { key: "needPick" as const, label: "是否需要拣货" },
                { key: "needPack" as const, label: "是否需要打包" },
                { key: "needDelivery" as const, label: "是否需要发货" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="whitespace-nowrap text-sm text-gray-900">{label}</div>
                  <RadioGroup
                    name={key}
                    value={config[key]}
                    options={[
                      { value: true, label: "是" },
                      { value: false, label: "否" },
                    ]}
                    onChange={(v) => set(key, v as boolean)}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="客户欠款超期未结开单方式">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="whitespace-nowrap text-sm text-gray-900">开单处理方式</div>
                {OVERDUE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
                    <input
                      type="radio"
                      name="overdueAction"
                      value={opt.value}
                      checked={config.overdueAction === opt.value}
                      onChange={() => set("overdueAction", opt.value)}
                      className="text-blue-500 focus:ring-blue-200"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="pl-[88px] text-xs leading-6 text-gray-400">
                若客户存在「预还款已过」且仍有挂账未结清：选择「不允许开单」时将禁止开单/报价/结算；选择「开单时提醒」需确认后可继续；选择「不做任何处理」则不拦截、不提示。
              </div>

              <div className="grid grid-cols-[88px_1fr] items-start gap-3">
                <div className="pt-2 text-sm text-gray-900">逾期开单消息接收人</div>
                <button className="flex h-8 w-full items-center justify-between rounded-sm border border-gray-300 bg-white px-3 text-left text-sm text-gray-400">
                  <span>不选则不向员工推送系统通知</span>
                  <ExpandMoreIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </button>
              </div>
              <div className="pl-[88px] text-xs leading-6 text-gray-400">
                超期未结客户进行拣单/报价/结算开单时，将向所选员工推送供应商端系统通知；不选则不发送。
              </div>
            </div>
          </SectionCard>

          <SectionCard title="工作时间">
            <div className="space-y-3">
              <div>
                <div className="grid grid-cols-[88px_1fr_30px_1fr] items-center gap-3">
                  <div className="whitespace-nowrap text-sm text-gray-900">工作时间区间</div>
                  <input
                    type="time"
                    value={config.workStartTime}
                    onChange={(e) => set("workStartTime", e.target.value)}
                    aria-label="开始时间"
                    title="开始时间"
                    className="h-10 rounded-sm border border-gray-300 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <div className="text-center text-gray-400">~</div>
                  <input
                    type="time"
                    value={config.workEndTime}
                    onChange={(e) => set("workEndTime", e.target.value)}
                    aria-label="结束时间"
                    title="结束时间"
                    className="h-10 rounded-sm border border-gray-300 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="pl-[88px] pt-2 text-xs leading-6 text-gray-400">
                  * 为空表示不限制工作时间；支持跨天，如 22:00~06:00 表示当日22:00至次日06:00
                </div>
              </div>

              <div>
                <div className="grid grid-cols-[88px_1fr] items-start gap-3">
                  <div className="pt-2 text-sm text-gray-900">工作时间外可登录员工</div>
                  <div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">去设置</button>
                    <div className="mt-2 text-xs leading-6 text-gray-400">
                      请在员工管理&gt;编辑员工信息中为需要开通的员工开启「工作时间外可登录」。
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[88px_1fr] items-start gap-3">
                <div className="pt-1 text-sm leading-5 text-gray-900">
                  工作时间外
                  <br />
                  商城是否可下单
                </div>
                <RadioGroup
                  name="mallOrder"
                  value={config.mallOrderOutsideWork}
                  options={[
                    { value: true, label: "是" },
                    { value: false, label: "否" },
                  ]}
                  onChange={(v) => set("mallOrderOutsideWork", v as boolean)}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="商品条码">
            <div className="grid grid-cols-[88px_1fr_1fr] items-center gap-3">
              <div className="whitespace-nowrap text-sm text-gray-900">商品条码组成</div>
              <input
                type="text"
                value={config.barcodePrefix}
                onChange={(e) => set("barcodePrefix", e.target.value)}
                placeholder="SP"
                className="h-10 rounded-sm border border-gray-300 px-3 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="number"
                min={1}
                max={12}
                value={config.barcodeLength}
                onChange={(e) => set("barcodeLength", Number(e.target.value))}
                className="h-10 rounded-sm border border-gray-300 px-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="pl-[88px] pt-2 text-xs leading-6 text-gray-400">
              例如：商品条码SP00001，前缀：SP，自动增长位数：6
            </div>
            <div className="pl-[88px] pt-1 text-xs leading-6 text-gray-400">
              示例条码：<span className="font-mono text-gray-600">{barcodeExample}</span>
            </div>
          </SectionCard>

          <SectionCard title="导入审核">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {[
                { key: "partImportReview" as const, label: "配件导入审核" },
                { key: "purchaseImportReview" as const, label: "采购导入审核" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="whitespace-nowrap text-sm text-gray-900">{label}</div>
                  <RadioGroup
                    name={key}
                    value={config[key]}
                    options={[
                      { value: true, label: "是" },
                      { value: false, label: "否" },
                    ]}
                    onChange={(v) => set(key, v as boolean)}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
          </div>
        </div>

      <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/95 px-3 py-3 backdrop-blur">
        <div className="flex justify-center">
          <button
              onClick={handleSave}
              className={`inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium text-white shadow-sm transition-all ${
                saved ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600 hover:shadow"
              }`}
            >
              立即保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

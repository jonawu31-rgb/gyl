import { useState } from "react";
import { Save as SaveIcon } from "@mui/icons-material";

interface RoleCommission {
  roleCode: string;
  roleName: string;
  amount: string;
}

const initSettings: RoleCommission[] = [
  { roleCode: "salesman",    roleName: "销售员",  amount: "0.00" },
  { roleCode: "order_clerk", roleName: "接单员",  amount: "0.00" },
  { roleCode: "picker",      roleName: "拣货员",  amount: "0.00" },
  { roleCode: "packer",      roleName: "打包员",  amount: "0.00" },
  { roleCode: "shipper",     roleName: "发货员",  amount: "0.00" },
];

export function CommissionSettings() {
  const [settings, setSettings] = useState(initSettings);
  const [saved, setSaved] = useState(false);

  const setAmount = (code: string, val: string) => {
    setSaved(false);
    setSettings(prev => prev.map(r => r.roleCode === code ? { ...r, amount: val } : r));
  };

  const step = (code: string, delta: number) => {
    setSaved(false);
    setSettings(prev => prev.map(r => {
      if (r.roleCode !== code) return r;
      const next = Math.max(0, parseFloat(r.amount || "0") + delta);
      return { ...r, amount: next.toFixed(2) };
    }));
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">单据提成设置</h2>
        <p className="text-xs text-gray-400 mt-0.5">配置各业务角色每单固定提成金额，设置后即时生效</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-xl space-y-4">
          {settings.map(role => (
            <div key={role.roleCode} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-20 shrink-0">
                <span className="text-sm font-semibold text-gray-700">{role.roleName}</span>
                <div className="text-xs text-gray-400 mt-0.5">每单提成</div>
              </div>
              <div className="flex items-center gap-0 border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => step(role.roleCode, -0.01)}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-lg leading-none select-none"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={role.amount}
                  onChange={(e) => setAmount(role.roleCode, e.target.value)}
                  onBlur={() => {
                    const val = Math.max(0, parseFloat(role.amount || "0"));
                    setAmount(role.roleCode, isNaN(val) ? "0.00" : val.toFixed(2));
                  }}
                  className="w-24 text-center text-sm py-2 border-x border-gray-300 focus:outline-none focus:bg-blue-50 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  onClick={() => step(role.roleCode, 0.01)}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-lg leading-none select-none"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">元</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-2"
          >
            <SaveIcon sx={{ fontSize: 16 }} />
            保存设置
          </button>
          {saved && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-gray-200 inline-flex items-center justify-center text-gray-600 text-xs">✓</span>
              保存成功
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

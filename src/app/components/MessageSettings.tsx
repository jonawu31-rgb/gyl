import { useState } from "react";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

const scenes = [
  { code: "new_order", name: "新订单" },
  { code: "after_sale", name: "售后申请" },
];

const availableRoles = [
  { code: "admin", name: "超级管理员" },
  { code: "manager", name: "业务经理" },
  { code: "warehouse", name: "仓库管理员" },
  { code: "finance", name: "财务人员" },
  { code: "picker", name: "拣货员" },
  { code: "packer", name: "打包员" },
  { code: "driver", name: "配送员" },
];

type SceneConfig = Record<string, { code: string; name: string }[]>;

const initialConfig: SceneConfig = {
  new_order: [
    { code: "admin", name: "超级管理员" },
    { code: "manager", name: "业务经理" },
  ],
  after_sale: [
    { code: "admin", name: "超级管理员" },
  ],
};

export function MessageSettings() {
  const [activeScene, setActiveScene] = useState("new_order");
  const [config, setConfig] = useState<SceneConfig>(initialConfig);
  const [selectedRole, setSelectedRole] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);

  const currentReceivers = config[activeScene] ?? [];
  const currentScene = scenes.find(s => s.code === activeScene);

  const unusedRoles = availableRoles.filter(
    r => !currentReceivers.find(rec => rec.code === r.code)
  );

  const handleAdd = () => {
    if (!selectedRole) return;
    const role = availableRoles.find(r => r.code === selectedRole);
    if (!role) return;
    if (currentReceivers.find(r => r.code === selectedRole)) {
      setDuplicateError(true);
      return;
    }
    setConfig(prev => ({
      ...prev,
      [activeScene]: [...(prev[activeScene] ?? []), role],
    }));
    setSelectedRole("");
    setDuplicateError(false);
  };

  const handleRemove = (code: string) => {
    setConfig(prev => ({
      ...prev,
      [activeScene]: (prev[activeScene] ?? []).filter(r => r.code !== code),
    }));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">消息设置</h2>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Scene tabs */}
        <div className="w-48 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">业务场景</div>
          <div className="flex-1 overflow-y-auto py-2">
            {scenes.map(scene => (
              <button
                key={scene.code}
                onClick={() => { setActiveScene(scene.code); setSelectedRole(""); setDuplicateError(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeScene === scene.code ? "bg-white text-blue-600 font-medium border-r-2 border-blue-500" : "text-gray-600 hover:bg-white hover:text-gray-800"}`}
              >
                {scene.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Config area */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="text-sm font-semibold text-gray-700 mb-4">
            接收角色 当前：<span className="text-blue-600">{currentScene?.name}</span>
          </div>

          {/* Current receivers */}
          <div className="mb-5">
            <div className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">已配置接收角色</div>
            {currentReceivers.length > 0 ? (
              <div className="space-y-2">
                {currentReceivers.map(role => (
                  <div key={role.code} className="flex items-center justify-between px-4 py-2.5 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-gray-800">{role.name}</span>
                    <button
                      onClick={() => handleRemove(role.code)}
                      className="p-0.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                      title="移除"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-gray-400 text-center border border-dashed border-gray-300 rounded-lg">
                暂无接收角色，请添加
              </div>
            )}
          </div>

          {/* Add role */}
          <div>
            <div className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">添加角色</div>
            <div className="flex items-center gap-3">
              <FauxSelect
                className="flex-1 max-w-xs"
                value={selectedRole}
                onChange={e => { setSelectedRole(e.target.value); setDuplicateError(false); }}
                placeholder="请选择角色（可多选）"
              >
                {unusedRoles.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
              </FauxSelect>
              <button
                onClick={handleAdd}
                disabled={!selectedRole}
                className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AddIcon sx={{ fontSize: 16 }} />添加
              </button>
            </div>
            {duplicateError && (
              <p className="text-xs text-red-500 mt-1">该角色已添加</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

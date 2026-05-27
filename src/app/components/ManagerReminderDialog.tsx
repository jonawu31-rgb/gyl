import { useState } from "react";
import { Close as CloseIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AddManagerReminderDialog } from "./AddManagerReminderDialog";

interface ManagerReminder {
  id: string;
  startDate: string;
  endDate: string;
  content: string;
}

interface ManagerReminderDialogProps {
  onClose: () => void;
}

export function ManagerReminderDialog({ onClose }: ManagerReminderDialogProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ManagerReminder | null>(null);
  const [reminders, setReminders] = useState<ManagerReminder[]>([
    {
      id: "1",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      content: "注意检查库存配件有效期",
    },
    {
      id: "2",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      content: "月底做好库存盘点工作",
    },
  ]);

  const handleAddReminder = (data: { startDate: string; endDate: string; content: string }) => {
    const newReminder: ManagerReminder = {
      id: Date.now().toString(),
      ...data,
    };
    setReminders([...reminders, newReminder]);
  };

  const handleEditReminder = (data: { startDate: string; endDate: string; content: string }) => {
    if (editingReminder) {
      setReminders(
        reminders.map((r) =>
          r.id === editingReminder.id
            ? {
                ...r,
                ...data,
              }
            : r
        )
      );
      setEditingReminder(null);
    }
  };

  const handleDeleteReminder = (id: string) => {
    if (confirm("确定要删除这条提醒吗?")) {
      setReminders(reminders.filter((r) => r.id !== id));
    }
  };

  const handleEdit = (reminder: ManagerReminder) => {
    setEditingReminder(reminder);
    setShowAddDialog(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: "1000px", height: "600px" }}>
          {/* Header */}
          <div
            className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <h2 className="text-lg font-bold text-gray-800">店长提醒维护</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-5">
            <div className="mb-4">
              <button
                onClick={() => {
                  setEditingReminder(null);
                  setShowAddDialog(true);
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
              >
                <AddIcon sx={{ fontSize: 16 }} />
                新增
              </button>
            </div>

            {/* 提醒列表 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-20">
                      序号
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                      开始日期
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                      结束日期
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">提醒内容</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-32">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                        暂无提醒数据
                      </td>
                    </tr>
                  ) : (
                    reminders.map((reminder, index) => (
                      <tr key={reminder.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{reminder.startDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{reminder.endDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{reminder.content}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(reminder)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="编辑"
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </button>
                            <button
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="删除"
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 新增/编辑店长提醒弹框 */}
      {showAddDialog && (
        <AddManagerReminderDialog
          initialData={editingReminder}
          onClose={() => {
            setShowAddDialog(false);
            setEditingReminder(null);
          }}
          onSave={editingReminder ? handleEditReminder : handleAddReminder}
        />
      )}
    </>
  );
}

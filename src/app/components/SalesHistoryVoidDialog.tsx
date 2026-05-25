import { Close as CloseIcon, Warning as WarningIcon } from "@mui/icons-material";

interface SalesHistoryVoidDialogProps {
  open: boolean;
  onClose: () => void;
  order: any;
}

export function SalesHistoryVoidDialog({ open, onClose, order }: SalesHistoryVoidDialogProps) {
  if (!open) return null;

  const handleConfirm = () => {
    console.log("作废订单", order.orderNo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <h2 className="text-lg font-bold text-gray-800">作废确认</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <WarningIcon sx={{ fontSize: 28 }} className="text-yellow-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 mb-2">
                您确定要作废订单 <span className="font-semibold">{order?.orderNo}</span> 吗?
              </p>
              <p className="text-sm text-gray-600">
                作废后订单将移入"作废单据"模块，库存将自动回滚，此操作不可逆。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            确定作废
          </button>
        </div>
      </div>
    </div>
  );
}

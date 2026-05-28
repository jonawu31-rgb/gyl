import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface SalaryRecord {
  id: string;
  salary: string;
  startDate: string;
  endDate: string;
  remark: string;
}

interface Employee {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  employeeNo: string;
  gender: "男" | "女" | "";
  address: string;
  status: "在职" | "离职";
  hireDate: string;
  resignDate: string;
  isBoss: "是" | "否";
  showFullPhone: "是" | "否";
  isDriver: "是" | "否";
  canLoginOffHours: "是" | "否";
  password: string;
  deptId: string;
  deptName: string;
  supervisorId: string;
  supervisorName: string;
  roleId: string;
  roleName: string;
  workTypeId: string;
  workTypeName: string;
  remark: string;
  salaryRecords: SalaryRecord[];
  createTime: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "王萌(虎盟)",
    phone: "15198769905",
    idCard: "510104199001011234",
    employeeNo: "EMP001",
    gender: "男",
    address: "成都市锦江区",
    status: "在职",
    hireDate: "2023-01-15",
    resignDate: "",
    isBoss: "是",
    showFullPhone: "是",
    isDriver: "否",
    canLoginOffHours: "否",
    password: "",
    deptId: "1",
    deptName: "总经办",
    supervisorId: "",
    supervisorName: "",
    roleId: "1",
    roleName: "店长",
    workTypeId: "1",
    workTypeName: "管理",
    remark: "公司创始人",
    salaryRecords: [
      {
        id: "1",
        salary: "15000",
        startDate: "2023-01-01",
        endDate: "2024-12-31",
        remark: "基本工资",
      },
    ],
    createTime: "2023-01-10 09:00",
  },
  {
    id: "2",
    name: "张敏",
    phone: "13812345678",
    idCard: "",
    employeeNo: "EMP002",
    gender: "女",
    address: "成都市武侯区",
    status: "在职",
    hireDate: "2023-02-01",
    resignDate: "",
    isBoss: "否",
    showFullPhone: "是",
    isDriver: "否",
    canLoginOffHours: "否",
    password: "",
    deptId: "2",
    deptName: "财务部",
    supervisorId: "1",
    supervisorName: "王萌(虎盟)",
    roleId: "2",
    roleName: "财务",
    workTypeId: "2",
    workTypeName: "财务",
    remark: "",
    salaryRecords: [],
    createTime: "2023-01-28 10:00",
  },
  {
    id: "3",
    name: "李强",
    phone: "13698745632",
    idCard: "",
    employeeNo: "EMP003",
    gender: "男",
    address: "成都市青羊区",
    status: "在职",
    hireDate: "2023-03-10",
    resignDate: "",
    isBoss: "否",
    showFullPhone: "否",
    isDriver: "否",
    canLoginOffHours: "否",
    password: "",
    deptId: "3",
    deptName: "销售部",
    supervisorId: "1",
    supervisorName: "王萌(虎盟)",
    roleId: "4",
    roleName: "业务",
    workTypeId: "3",
    workTypeName: "销售",
    remark: "",
    salaryRecords: [],
    createTime: "2023-03-05 14:30",
  },
  {
    id: "4",
    name: "赵云",
    phone: "15812349876",
    idCard: "",
    employeeNo: "EMP004",
    gender: "男",
    address: "成都市高新区",
    status: "在职",
    hireDate: "2023-04-01",
    resignDate: "",
    isBoss: "否",
    showFullPhone: "否",
    isDriver: "是",
    canLoginOffHours: "否",
    password: "",
    deptId: "5",
    deptName: "仓储部",
    supervisorId: "1",
    supervisorName: "王萌(虎盟)",
    roleId: "5",
    roleName: "拣货发货员",
    workTypeId: "4",
    workTypeName: "物流",
    remark: "负责配送",
    salaryRecords: [],
    createTime: "2023-03-28 11:00",
  },
  {
    id: "5",
    name: "刘芳",
    phone: "13587456321",
    idCard: "",
    employeeNo: "EMP005",
    gender: "女",
    address: "成都市成华区",
    status: "离职",
    hireDate: "2022-06-01",
    resignDate: "2023-12-31",
    isBoss: "否",
    showFullPhone: "否",
    isDriver: "否",
    canLoginOffHours: "否",
    password: "",
    deptId: "3",
    deptName: "销售部",
    supervisorId: "1",
    supervisorName: "王萌(虎盟)",
    roleId: "3",
    roleName: "内勤",
    workTypeId: "5",
    workTypeName: "文员",
    remark: "已离职",
    salaryRecords: [],
    createTime: "2022-05-25 09:00",
  },
];

// 模拟部门数据
const mockDepartments = [
  { id: "1", name: "总经办" },
  { id: "2", name: "财务部" },
  { id: "3", name: "销售部" },
  { id: "4", name: "售后部" },
  { id: "5", name: "仓储部" },
];

// 模拟角色数据
const mockRoles = [
  { id: "1", name: "店长" },
  { id: "2", name: "财务" },
  { id: "3", name: "内勤" },
  { id: "4", name: "业务" },
  { id: "5", name: "拣货发货员" },
  { id: "6", name: "库管" },
];

// 模拟工种数据
const mockWorkTypes = [
  { id: "1", name: "管理" },
  { id: "2", name: "财务" },
  { id: "3", name: "销售" },
  { id: "4", name: "物流" },
  { id: "5", name: "文员" },
  { id: "6", name: "技术" },
];

// 新增/编辑员工弹框
function EmployeeDialog({
  open,
  onClose,
  onSave,
  editData,
  allEmployees,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Employee;
  allEmployees: Employee[];
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    phone: editData?.phone || "",
    idCard: editData?.idCard || "",
    employeeNo: editData?.employeeNo || "",
    gender: editData?.gender || "",
    address: editData?.address || "",
    status: editData?.status || "在职",
    hireDate: editData?.hireDate || "",
    resignDate: editData?.resignDate || "",
    isBoss: editData?.isBoss || "否",
    showFullPhone: editData?.showFullPhone || "是",
    isDriver: editData?.isDriver || "否",
    canLoginOffHours: editData?.canLoginOffHours || "否",
    password: "",
    deptId: editData?.deptId || "",
    supervisorId: editData?.supervisorId || "",
    roleId: editData?.roleId || "",
    workTypeId: editData?.workTypeId || "",
    remark: editData?.remark || "",
  });

  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(
    editData?.salaryRecords || []
  );
  const [salaryForm, setSalaryForm] = useState({
    salary: "",
    startDate: "",
    endDate: "",
    remark: "",
  });

  if (!open) return null;

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("姓名不能为空");
      return;
    }
    if (!formData.phone.trim()) {
      alert("联系电话不能为空");
      return;
    }
    if (!formData.employeeNo.trim()) {
      alert("员工工号不能为空");
      return;
    }
    onSave({ ...formData, salaryRecords });
    onClose();
  };

  const handleAddSalary = () => {
    if (!salaryForm.salary.trim()) {
      alert("员工工资不能为空");
      return;
    }
    const newRecord: SalaryRecord = {
      id: Date.now().toString(),
      ...salaryForm,
    };
    setSalaryRecords([...salaryRecords, newRecord]);
    setSalaryForm({ salary: "", startDate: "", endDate: "", remark: "" });
  };

  const handleDeleteSalary = (id: string) => {
    setSalaryRecords(salaryRecords.filter((r) => r.id !== id));
  };

  const handleResetSalaryForm = () => {
    setSalaryForm({ salary: "", startDate: "", endDate: "", remark: "" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">
            {editData ? "编辑员工" : "新增员工"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 shrink-0">
          <div className="flex gap-1">
            {["员工信息", "员工工资"].map((tab, index) => (
              <button
                key={index}
                onClick={() => setCurrentTab(index)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  currentTab === index
                    ? "text-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {tab}
                {currentTab === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {currentTab === 0 ? (
            /* 员工信息 Tab */
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              {/* 姓名 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                  <span className="text-red-500">*</span> 姓名:
                </label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* 联系电话 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                  <span className="text-red-500">*</span> 联系电话:
                </label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* 员工工号 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                  <span className="text-red-500">*</span> 员工工号:
                </label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={formData.employeeNo}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeNo: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* 身份证号 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">身份证号:</label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={formData.idCard}
                  onChange={(e) =>
                    setFormData({ ...formData, idCard: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* 性别 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">性别:</label>
                <FauxSelect
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as any,
                    })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </FauxSelect>
              </div>

              {/* 住址 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">住址:</label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* 入职日期 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">入职日期:</label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 离职日期 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">离职日期:</label>
                <input
                  type="date"
                  value={formData.resignDate}
                  onChange={(e) =>
                    setFormData({ ...formData, resignDate: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 部门 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">部门:</label>
                <FauxSelect
                  value={formData.deptId}
                  onChange={(e) =>
                    setFormData({ ...formData, deptId: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">请选择</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </FauxSelect>
              </div>

              {/* 直属上级 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">直属上级:</label>
                <FauxSelect
                  value={formData.supervisorId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supervisorId: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">请选择</option>
                  {allEmployees
                    .filter((emp) => emp.id !== editData?.id)
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                </FauxSelect>
              </div>

              {/* 所属角色 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">所属角色:</label>
                <FauxSelect
                  value={formData.roleId}
                  onChange={(e) =>
                    setFormData({ ...formData, roleId: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">请选择</option>
                  {mockRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </FauxSelect>
              </div>

              {/* 员工工种 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">员工工种:</label>
                <FauxSelect
                  value={formData.workTypeId}
                  onChange={(e) =>
                    setFormData({ ...formData, workTypeId: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">请选择</option>
                  {mockWorkTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </FauxSelect>
              </div>

              {/* 密码 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">密码:</label>
                <input
                  type="password"
                  placeholder={editData ? "留空则不修改" : "请输入"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* 状态 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                  <span className="text-red-500">*</span> 状态:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === "在职"}
                      onChange={() =>
                        setFormData({ ...formData, status: "在职" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">在职</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === "离职"}
                      onChange={() =>
                        setFormData({ ...formData, status: "离职" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">离职</span>
                  </label>
                </div>
              </div>

              {/* 是否老板 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                  <span className="text-red-500">*</span> 是否老板:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isBoss === "是"}
                      onChange={() =>
                        setFormData({ ...formData, isBoss: "是" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isBoss === "否"}
                      onChange={() =>
                        setFormData({ ...formData, isBoss: "否" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">否</span>
                  </label>
                </div>
              </div>

              {/* 是否司机 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                  <span className="text-red-500">*</span> 是否司机:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isDriver === "是"}
                      onChange={() =>
                        setFormData({ ...formData, isDriver: "是" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isDriver === "否"}
                      onChange={() =>
                        setFormData({ ...formData, isDriver: "否" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">否</span>
                  </label>
                </div>
              </div>

              {/* 显示完整客户手机号 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">显示完整手机:</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.showFullPhone === "是"}
                      onChange={() =>
                        setFormData({ ...formData, showFullPhone: "是" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.showFullPhone === "否"}
                      onChange={() =>
                        setFormData({ ...formData, showFullPhone: "否" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">否</span>
                  </label>
                </div>
              </div>

              {/* 工作时间外可登录 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0">非工时登录:</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.canLoginOffHours === "是"}
                      onChange={() =>
                        setFormData({ ...formData, canLoginOffHours: "是" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.canLoginOffHours === "否"}
                      onChange={() =>
                        setFormData({ ...formData, canLoginOffHours: "否" })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">否</span>
                  </label>
                </div>
              </div>

              {/* 备注 - 占满整行 */}
              <div className="col-span-3 flex items-start gap-2">
                <label className="text-sm font-medium text-gray-700 w-24 shrink-0 pt-1.5">备注:</label>
                <textarea
                  placeholder="请输入"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
                  }
                  rows={2}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-400"
                />
              </div>
            </div>
          ) : (
            /* 员工工资 Tab */
            <div className="space-y-4">
              {/* 工资表单 */}
              <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 w-24 shrink-0">员工工资:</label>
                  <input
                    type="text"
                    placeholder="请输入"
                    value={salaryForm.salary}
                    onChange={(e) =>
                      setSalaryForm({ ...salaryForm, salary: e.target.value })
                    }
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700 w-24 shrink-0">选择日期:</label>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="date"
                      value={salaryForm.startDate}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          startDate: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-sm text-gray-500">至</span>
                    <input
                      type="date"
                      value={salaryForm.endDate}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          endDate: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="col-span-3 flex items-start gap-2">
                  <label className="text-sm font-medium text-gray-700 w-24 shrink-0 pt-1.5">备注:</label>
                  <textarea
                    placeholder="请输入"
                    value={salaryForm.remark}
                    onChange={(e) =>
                      setSalaryForm({ ...salaryForm, remark: e.target.value })
                    }
                    rows={2}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleResetSalaryForm}
                  className="px-4 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重置
                </button>
                <button
                  onClick={handleAddSalary}
                  className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  确定
                </button>
              </div>

              {/* 工资记录列表 */}
              <div className="mt-4">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                        序号
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                        工资
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                        开始日期
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                        结束日期
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                        备注
                      </th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-sm text-gray-400"
                        >
                          暂无数据
                        </td>
                      </tr>
                    ) : (
                      salaryRecords.map((record, idx) => (
                        <tr
                          key={record.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-blue-50/40 transition-colors"
                        >
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {record.salary}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {record.startDate || "—"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {record.endDate || "—"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {record.remark || "—"}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleDeleteSalary(record.id)}
                              className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

// 删除确认弹框
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-80 overflow-hidden">
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <WarningIcon sx={{ fontSize: 28 }} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800 mb-1">
              此操作将永久删除该数据, 是否继续?
            </p>
            <p className="text-xs text-gray-500">{itemName}</p>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmployeeManagement() {
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [data, setData] = useState<Employee[]>(mockEmployees);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Employee | undefined>(
    undefined
  );
  const [deleteItem, setDeleteItem] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName = !searchName || item.name.includes(searchName);
      const matchStatus = !searchStatus || item.status === searchStatus;
      return matchName && matchStatus;
    });
  }, [data, searchName, searchStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReset = () => {
    setSearchName("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleDelete = (item: Employee) => {
    setDeleteItem(item);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      // 编辑
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                deptName:
                  mockDepartments.find((d) => d.id === formData.deptId)?.name ||
                  "",
                supervisorName:
                  data.find((e) => e.id === formData.supervisorId)?.name || "",
                roleName:
                  mockRoles.find((r) => r.id === formData.roleId)?.name || "",
                workTypeName:
                  mockWorkTypes.find((w) => w.id === formData.workTypeId)
                    ?.name || "",
              }
            : item
        )
      );
    } else {
      // 新增
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        deptName:
          mockDepartments.find((d) => d.id === formData.deptId)?.name || "",
        supervisorName:
          data.find((e) => e.id === formData.supervisorId)?.name || "",
        roleName: mockRoles.find((r) => r.id === formData.roleId)?.name || "",
        workTypeName:
          mockWorkTypes.find((w) => w.id === formData.workTypeId)?.name || "",
        createTime: (() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hour = String(now.getHours()).padStart(2, '0');
          const minute = String(now.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day} ${hour}:${minute}`;
        })(),
      };
      setData((prev) => [...prev, newEmployee]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">员工管理</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-20">
              员工姓名:
            </label>
            <input
              type="text"
              placeholder="请输入员工姓名"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-12">
              状态:
            </label>
            <FauxSelect
              value={searchStatus}
              onChange={(e) => {
                setSearchStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-36 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
            >
              <option value="">请选择状态</option>
              <option value="在职">在职</option>
              <option value="离职">离职</option>
            </FauxSelect>
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1.5 shrink-0"
          >
            <SearchIcon sx={{ fontSize: 15 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shrink-0"
          >
            重置
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingItem(undefined);
              setDialogOpen(true);
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            新增
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full" style={{ minWidth: "1300px" }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">
                序号
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                姓名
              </th>
              <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                性别
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                员工角色
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                员工工种
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                联系电话
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                入职时间
              </th>
              <th className="px-2 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                状态
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                备注
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ width: "130px" }}>
                创建时间
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap bg-gray-50 sticky right-0 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" style={{ width: "120px" }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              pagedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="group border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-3 py-2.5 text-xs text-gray-500">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-2 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.gender || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.roleName || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.workTypeName || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.phone}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.hireDate || "—"}
                  </td>
                  <td className="px-2 py-2.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "在职"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {item.remark || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-500 whitespace-nowrap">
                    {item.createTime.slice(0, 16)}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap sticky right-0 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] bg-white group-hover:bg-blue-50/40 transition-colors">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setDialogOpen(true);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共{" "}
            <span className="font-semibold text-gray-800">
              {filteredData.length}
            </span>{" "}
            条数据
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{pageSize}条/页</span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              前往
              <input
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = parseInt(
                      (e.target as HTMLInputElement).value
                    );
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }
                }}
                className="w-12 px-2 py-1 text-center border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
              />
              页
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EmployeeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        editData={editingItem}
        allEmployees={data}
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={deleteItem ? deleteItem.name : ""}
      />
    </div>
  );
}

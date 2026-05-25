# 车配智数 设计规范

## 概述

车配智数（Auto Parts Data System）是一个现代化的汽配供应链管理ERP系统。本文档定义了系统的设计语言、组件规范和交互模式，确保整个应用保持一致的视觉风格和用户体验。

---

## 色彩系统

### 主色调

- **主蓝色**: `#3B82F6` (blue-500)
- **深蓝色**: `#2563EB` (blue-600)
- **浅蓝色**: `#60A5FA` (blue-400)
- **蓝色渐变**: `from-blue-500 to-blue-600` 或 `from-blue-600 to-blue-700`

### 中性色

- **背景色**: `#F0F2F5` (主背景)
- **白色**: `#FFFFFF` (卡片、弹框背景)
- **浅灰**: `#F9FAFB` (弹框头部、次级背景)
- **边框灰**: `#E5E7EB` (gray-200)
- **文字主色**: `#1F2937` (gray-800)
- **文字次色**: `#6B7280` (gray-600)
- **文字辅助色**: `#9CA3AF` (gray-400)

### 语义色

- **成功绿**: `bg-green-100 text-green-700` (状态徽章)
- **警告黄**: `bg-yellow-100 text-yellow-700` (状态徽章)
- **危险红**: `bg-red-100 text-red-700` (状态徽章)
- **信息蓝**: `bg-blue-100 text-blue-700` (状态徽章)

### 投影与阴影

- **卡片阴影**: `shadow-sm` 或 `shadow-md`
- **弹框阴影**: `shadow-2xl`
- **侧边栏投影**: `boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'`
- **按钮悬停阴影**: `hover:shadow`

---

## 排版系统

### 字体大小

系统默认不使用 Tailwind 的字体大小类（如 text-2xl、text-xl），除非用户特别要求。依赖 `/src/styles/theme.css` 中定义的基础样式。

**例外情况**：
- 小文本: `text-xs` (12px) - 用于标签、徽章、辅助信息
- 正文: `text-sm` (14px) - 用于表单、表格内容
- 标题: `text-lg` (18px) - 用于弹框标题

### 字体粗细

- **常规**: 默认（不使用 font-bold 等类）
- **中等**: `font-medium` (500) - 用于表格标题、标签
- **加粗**: `font-semibold` (600) - 用于统计数字、重要信息
- **特粗**: `font-bold` (700) - 用于弹框标题、页面标题

### 行高

默认不使用 Tailwind 的行高类（如 leading-none），依赖主题默认设置。

---

## 间距系统

### 标准间距

- **极小**: `gap-1` (4px) - 图标与文字之间
- **小**: `gap-2` (8px) - 按钮组、卡片网格
- **中**: `gap-3` / `gap-4` (12px/16px) - 表单字段、内容区
- **大**: `gap-6` (24px) - 页面主要区块

### 内边距

- **按钮**: `px-3 py-1.5` 或 `px-4 py-2`
- **输入框**: `px-3 py-2`
- **卡片**: `p-4` 或 `p-5`
- **弹框头部**: `px-5 py-2.5`
- **弹框内容**: `p-5` 或 `p-6`

---

## 圆角系统

### 标准圆角

- **小圆角**: `rounded` (4px) - 徽章、小按钮
- **中圆角**: `rounded-lg` (8px) - 按钮、输入框、卡片
- **大圆角**: `rounded-xl` (12px) - 弹框、模态框
- **圆形**: `rounded-full` - 头像、通知点

### 组合圆角

- **顶部圆角**: `rounded-t-xl` - 弹框头部
- **底部圆角**: `rounded-b-xl` - 弹框底部

---

## 组件规范

### 1. 按钮 (Buttons)

#### 主按钮（Primary Button）
```tsx
<button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5">
  <Icon sx={{ fontSize: 16 }} />
  按钮文字
</button>
```

#### 次要按钮（Secondary Button）
```tsx
<button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
  <Icon sx={{ fontSize: 16 }} />
  按钮文字
</button>
```

#### 危险按钮（Danger Button）
```tsx
<button className="px-3 py-1.5 bg-white text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors border border-gray-200 flex items-center gap-1.5">
  <Icon sx={{ fontSize: 16 }} />
  删除
</button>
```

#### 图标按钮（Icon Button）
```tsx
<button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
  <Icon sx={{ fontSize: 20 }} />
</button>
```

### 2. 输入框 (Input Fields)

#### 输入框水印（Placeholder）规范

所有输入框必须包含占位符文本（placeholder），用于提示用户应输入的内容类型。

**标准水印文本**：
- **通用输入**: `placeholder="请输入"` - 用于普通文本输入框
- **搜索框**: `placeholder="搜索..."` 或具体说明，如 `placeholder="搜索订单、客户、商品..."`
- **选择框**: `<option value="">请选择</option>` - 下拉框的默认选项
- **特定字段**: 根据字段含义使用更具体的提示，如 `placeholder="请输入车架号"`

**水印样式**：
- 颜色: `placeholder:text-gray-400` (浅灰色，与主文字区分)
- 所有输入框都必须添加 `placeholder:text-gray-400` 类

**示例**：
```tsx
// 通用输入框
<input type="text" placeholder="请输入" className="... placeholder:text-gray-400" />

// 搜索框
<input type="text" placeholder="搜索订单、客户、商品..." className="... placeholder:text-gray-400" />

// 数字输入框
<input type="text" placeholder="0" className="... placeholder:text-gray-400" />

// 特定字段
<input type="text" placeholder="请输入车架号" className="... placeholder:text-gray-400" />
```

#### 标准输入框
```tsx
<input
  type="text"
  placeholder="请输入"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
/>
```

#### 搜索框
```tsx
<div className="relative">
  <SearchIcon sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="搜索..."
    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
  />
</div>
```

#### 下拉选择框
```tsx
<select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
  <option value="">请选择</option>
  <option value="option1">选项1</option>
</select>
```

#### 标签 + 输入框
```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    字段名称 <span className="text-red-500">*</span>
  </label>
  <input className="..." />
</div>
```

### 3. 弹框 (Dialogs/Modals)

#### 标准弹框结构
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
    {/* Header */}
    <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
      <h2 className="text-lg font-bold text-gray-800">弹框标题</h2>
      <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
        <CloseIcon sx={{ fontSize: 18 }} />
      </button>
    </div>
    
    {/* Content */}
    <div className="flex-1 overflow-auto p-5">
      {/* 内容区 */}
    </div>
    
    {/* Footer */}
    <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
      <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200">
        关闭
      </button>
      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700">
        保存
      </button>
    </div>
  </div>
</div>
```

#### 弹框设计要点
- **背景遮罩**: `bg-black/50` (50% 透明黑色)
- **弹框圆角**: `rounded-xl` (12px)
- **头部圆角**: `rounded-t-xl` (保持顶部圆角)
- **头部背景**: `#F9FAFB` (浅灰色)
- **头部间距**: `px-5 py-2.5`
- **标题样式**: `text-lg font-bold text-gray-800`
- **内容间距**: `p-5` 或 `p-6`
- **最大高度**: `max-h-[90vh]` (防止超出视口)
- **弹框层级**: `z-50`

### 4. 表格 (Tables)

#### 表格结构
```tsx
<table className="w-full">
  <thead className="bg-gray-50 sticky top-0 z-10">
    <tr className="border-b border-gray-200">
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
        列标题
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900">
        单元格内容
      </td>
    </tr>
  </tbody>
</table>
```

#### 表格设计要点
- **表头**: `bg-gray-50` 浅灰背景，`sticky top-0` 固定表头
- **表头文字**: `text-xs font-semibold text-gray-700`
- **行悬停**: `hover:bg-blue-50/50` 浅蓝色半透明
- **选中行**: `bg-blue-50/30`
- **边框**: 表头 `border-gray-200`，行 `border-gray-100`
- **单元格间距**: `px-4 py-3`
- **文字大小**: `text-sm`

### 5. 状态徽章 (Status Badges)

#### 标准徽章
```tsx
<span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
  审核
</span>
```

#### 徽章颜色映射
- **成功/已完成**: `bg-green-100 text-green-700`
- **警告/待处理**: `bg-yellow-100 text-yellow-700`
- **失败/未完成**: `bg-red-100 text-red-700`
- **信息/默认**: `bg-gray-100 text-gray-700`
- **蓝色强调**: `bg-blue-100 text-blue-700`

### 6. 卡片 (Cards)

#### 标准卡片
```tsx
<div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
  {/* 卡片内容 */}
</div>
```

#### 卡片头部
```tsx
<div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
  <h2 className="text-lg font-bold text-gray-800">卡片标题</h2>
</div>
```

### 7. 标签页 (Tabs)

#### 标签页结构
```tsx
<div className="border-b border-gray-200 bg-gray-50 px-6">
  <div className="flex gap-1">
    <button
      className={`px-6 py-3 text-sm font-medium transition-all relative ${
        isActive ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
      }`}
    >
      标签名称
      {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
    </button>
  </div>
</div>
```

#### 标签页设计要点
- **背景**: `bg-gray-50` (未激活区域)
- **激活标签**: `bg-white` + 底部蓝色指示条 `h-0.5 bg-blue-600`
- **文字颜色**: 激活 `text-blue-600`，未激活 `text-gray-600`
- **间距**: `px-6 py-3`

### 8. 侧边栏导航 (Sidebar Navigation)

#### 一级菜单（带图标）
```tsx
<button className="w-full px-4 py-2.5 flex items-center gap-3 rounded-lg transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
  <Icon sx={{ fontSize: 20 }} />
  <span className="font-medium">菜单名称</span>
</button>
```

#### 二级菜单（无图标）
```tsx
<button className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
  菜单名称
</button>
```

#### 三级菜单（无图标）
```tsx
<button className="w-full pl-12 pr-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
  菜单名称
</button>
```

#### 导航设计要点
- **一级菜单**: 有图标，激活时蓝色渐变背景
- **二级菜单**: 左边距 `pl-8`，无图标
- **三级菜单**: 左边距 `pl-12`，无图标
- **侧边栏投影**: `boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'`
- **层级**: `z-index` 高于主内容区

### 9. 分页 (Pagination)

```tsx
<div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
  <div className="flex items-center justify-between">
    <div className="text-sm text-gray-600">
      已选择 <span className="font-semibold text-gray-800">0</span> 项 / 共 <span className="font-semibold text-gray-800">10</span> 项
    </div>
    <div className="flex items-center gap-2">
      <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
        上一页
      </button>
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">1</button>
      <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
        下一页
      </button>
    </div>
  </div>
</div>
```

### 10. 工具栏 (Toolbar)

```tsx
<div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
  <div className="flex flex-wrap items-center gap-2">
    <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5">
      <AddIcon sx={{ fontSize: 16 }} />
      新增
    </button>
    <div className="w-px h-6 bg-gray-300" />
    <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
      <EditIcon sx={{ fontSize: 16 }} />
      编辑
    </button>
  </div>
</div>
```

---

## 图标系统

### 图标库
使用 `@mui/icons-material` (Material-UI Icons)

### 图标尺寸
- **小**: `sx={{ fontSize: 16 }}` - 按钮内图标
- **中**: `sx={{ fontSize: 18 }}` - 标准图标
- **大**: `sx={{ fontSize: 20 }}` - 导航图标
- **超大**: `sx={{ fontSize: 22 }}` - 统计卡片图标

### 常用图标
- 新增: `Add`
- 编辑: `Edit`
- 删除: `Delete`
- 搜索: `Search`
- 关闭: `Close`
- 设置: `Settings`
- 刷新: `Refresh`
- 筛选: `FilterList`
- 打印: `Print`
- 导出: `FileDownload`
- 导入: `FileUpload`
- 展开: `ExpandMore`
- 收起: `ChevronRight`

---

## 交互规范

### 1. 悬停效果 (Hover States)

- **按钮悬停**: 颜色加深或背景变化，添加 `transition-colors` 或 `transition-all`
- **表格行悬停**: `hover:bg-blue-50/50` 浅蓝色半透明背景
- **链接悬停**: 文字颜色加深 `hover:text-blue-700`

### 2. 焦点状态 (Focus States)

- **输入框焦点**: `focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100`
- **按钮焦点**: `focus:ring-2 focus:ring-blue-200`

### 3. 过渡动画 (Transitions)

- **标准过渡**: `transition-colors` (颜色变化)
- **全属性过渡**: `transition-all` (多属性同时变化)
- **时长**: 使用 Tailwind 默认 150ms

### 4. 禁用状态 (Disabled States)

```tsx
<button disabled className="disabled:opacity-50 disabled:cursor-not-allowed">
  禁用按钮
</button>
```

### 5. 加载状态 (Loading States)

使用旋转图标或骨架屏表示加载中。

---

## 布局规范

### 1. 页面布局

```tsx
<div className="h-screen flex bg-[#f0f2f5] overflow-hidden">
  {/* 侧边栏 */}
  <Sidebar />
  
  <div className="flex-1 flex flex-col overflow-hidden min-w-0">
    {/* 顶部导航 */}
    <Header />
    
    {/* 标签栏 */}
    <TabBar />
    
    {/* 主内容区 */}
    <main className="flex-1 overflow-auto p-2 xl:p-4 min-h-0">
      {/* 页面内容 */}
    </main>
  </div>
</div>
```

### 2. 列表页布局

```tsx
<div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
  {/* 页面标题 */}
  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
    <h2 className="text-lg font-bold text-gray-800">页面标题</h2>
  </div>
  
  {/* 工具栏 */}
  <Toolbar />
  
  {/* 搜索筛选 */}
  <SearchBar />
  
  {/* 表格 */}
  <div className="flex-1 overflow-auto">
    <Table />
  </div>
  
  {/* 分页 */}
  <Pagination />
</div>
```

### 3. 表单布局

使用栅格系统：
- **三列**: `grid grid-cols-3 gap-4`
- **两列**: `grid grid-cols-2 gap-4`
- **响应式**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

---

## 响应式设计

### 断点

Tailwind 默认断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 响应式模式

```tsx
<div className="grid grid-cols-2 xl:grid-cols-4 gap-2 xl:gap-3">
  {/* 小屏 2 列，大屏 4 列 */}
</div>

<div className="w-[220px] lg:w-[260px] xl:w-[300px] 2xl:w-[360px]">
  {/* 侧边栏响应式宽度 */}
</div>
```

---

## 数据可视化

### 图表库
使用 `recharts`

### 图表颜色
- **主色**: `#3B82F6` (蓝色)
- **辅色**: `#10B981` (绿色)、`#F59E0B` (橙色)、`#EF4444` (红色)
- **渐变**: 使用 `linearGradient` 定义 SVG 渐变

### 图表高度
- **小图表**: `h-[180px]` 到 `h-[260px]`
- **中等图表**: `h-[250px]` 到 `h-[350px]`
- **大图表**: 使用 `clamp` 函数: `height: clamp(180px, 22vh, 260px)`

---

## 开发规范

### 1. 文件组织

```
src/
├── app/
│   ├── App.tsx              # 主应用入口
│   └── components/          # 组件目录
│       ├── Login.tsx        # 登录页
│       ├── Sidebar.tsx      # 侧边栏
│       ├── Header.tsx       # 头部
│       ├── PartsData.tsx    # 配件资料页
│       ├── PartsDataDialog.tsx  # 配件弹框
│       └── ...
├── styles/
│   ├── theme.css            # 主题样式
│   └── fonts.css            # 字体导入
└── ...
```

### 2. 组件命名

- **页面组件**: `PartsData.tsx` (PascalCase)
- **弹框组件**: `PartsDataDialog.tsx` (功能名 + Dialog)
- **详情组件**: `SalesOrderDetail.tsx` (功能名 + Detail)
- **通用组件**: `StatsCard.tsx`, `Sidebar.tsx`

### 3. 导入规范

```tsx
// React
import { useState } from "react";

// Material-UI Icons
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// 本地组件
import { ComponentName } from "./components/component-name";
```

### 4. 状态管理

使用 React Hooks:
- `useState` - 本地状态
- `useEffect` - 副作用
- 父子组件通过 props 传递状态和回调

### 5. TypeScript 接口

```tsx
interface ComponentProps {
  open: boolean;
  onClose: () => void;
  data?: any;
}

interface DataItem {
  id: string;
  name: string;
  // ...
}
```

### 6. 表单处理

```tsx
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
});

const handleChange = (field: string, value: any) => {
  setFormData({ ...formData, [field]: value });
};
```

---

## 可访问性

### 1. 语义化 HTML

- 使用 `<button>` 而不是 `<div onClick>`
- 使用 `<label>` 关联表单字段
- 使用 `<table>`, `<thead>`, `<tbody>` 等语义化标签

### 2. 键盘导航

- 确保所有交互元素可以通过键盘访问
- Tab 键顺序合理
- Enter/Space 键可以激活按钮

### 3. 焦点管理

- 弹框打开时，焦点移到弹框内
- 弹框关闭时，焦点返回触发元素
- 使用 `focus:` 伪类提供明显的焦点指示

---

## 性能优化

### 1. 列表渲染

- 使用唯一 `key` 属性
- 大列表考虑虚拟滚动

### 2. 条件渲染

```tsx
{!open && return null}  // 早期返回，避免渲染
```

### 3. 防抖与节流

搜索输入使用防抖，滚动事件使用节流。

---

## 总结

本设计规范确保车配智数系统在视觉、交互和代码层面保持一致性。所有新增功能和组件都应遵循这些规范，以提供统一的用户体验。

**关键原则**:
- 简洁现代的设计语言
- 蓝色为主色调，传递专业、可靠的品牌形象
- 圆角设计增加亲和力 (`rounded-lg`, `rounded-xl`)
- 细腻的阴影和过渡效果提升质感
- 清晰的视觉层次和信息组织
- 响应式设计适配不同屏幕
- **所有输入框必须包含占位符文本 (placeholder)**，默认使用 `"请输入"`，配合 `placeholder:text-gray-400` 样式

import { useState } from "react";
import imgLoginBg from "figma:asset/2ab02ad19ae9ff8fe85aa0d60b68394c8366bad4.png";
import { Logo } from "./Logo";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.();
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Left Side - Background Image */}
      <div className="flex-1 relative overflow-hidden hidden lg:flex flex-col justify-start items-start px-16 pt-24">
        {/* Background Image */}
        <img
          src={imgLoginBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Content Overlay */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Logo />
            <h1 className="text-6xl font-bold text-gray-800 tracking-tight">车配智数</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4 font-semibold">智能 · 高效 · 可靠</p>
          <p className="text-base text-gray-500 max-w-lg leading-relaxed">
            一站式数据管理分析平台，助力企业数字化转型
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[500px] xl:w-[560px] flex items-center justify-center p-8 lg:p-12 bg-white shadow-2xl">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl rotate-12 shadow-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-lg -rotate-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">车配智数</h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">欢迎回来！</h2>
            <p className="text-base text-gray-500">请输入您的账号和密码登录系统</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                <PersonIcon sx={{ fontSize: 18 }} className="inline mr-1.5 align-text-bottom text-blue-600" />
                账号/手机号
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="请输入账号或手机号"
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                <LockIcon sx={{ fontSize: 18 }} className="inline mr-1.5 align-text-bottom text-blue-600" />
                登录密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入登录密码"
                  className="w-full px-4 py-3.5 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <VisibilityOffIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityIcon sx={{ fontSize: 20 }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">记住密码</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                忘记密码?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              登录
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <span className="text-sm text-gray-500">还没有账号? </span>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline">
                立即注册
              </a>
            </div>

            {/* Footer Note */}
            <div className="text-center pt-8 pb-4">
              <p className="text-xs text-gray-400">
                登录即表示同意 <a href="#" className="text-blue-600 hover:underline">用户协议</a> 和 <a href="#" className="text-blue-600 hover:underline">隐私政策</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* 主体车轮形状 */}
      <circle cx="16" cy="16" r="14" fill="url(#logoGradient1)" />

      {/* 内部轮辐 */}
      <circle cx="16" cy="16" r="10" fill="white" opacity="0.2" />
      <circle cx="16" cy="16" r="4" fill="white" />

      {/* 轮辐线条 */}
      <line x1="16" y1="6" x2="16" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="20" x2="16" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="16" x2="12" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="16" x2="26" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* 对角线轮辐 */}
      <line x1="10.3" y1="10.3" x2="13.9" y2="13.9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.1" y1="18.1" x2="21.7" y2="21.7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="21.7" y1="10.3" x2="18.1" y2="13.9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="13.9" y1="18.1" x2="10.3" y2="21.7" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* 高光效果 */}
      <circle cx="20" cy="12" r="3" fill="white" opacity="0.3" />
    </svg>
  );
}

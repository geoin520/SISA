import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="text-5xl">🔍</span>
      <h1 className="mt-4 text-2xl font-bold text-sisa-navy">404</h1>
      <p className="mt-2 text-sm text-sisa-muted">
        页面未找到 · Page not found
      </p>
      <Link
        href="/zh"
        className="mt-6 rounded-lg bg-sisa-brand px-4 py-2 text-sm font-semibold text-white hover:bg-sisa-brand/90"
      >
        返回首页 · Back to home
      </Link>
    </div>
  );
}

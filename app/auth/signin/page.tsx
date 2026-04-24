"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-10 text-center">
            <div className="text-2xl font-bold text-white tracking-tight mb-1">
              hoshiko<span className="text-indigo-300">.me</span>
            </div>
            <p className="text-indigo-200 text-sm mt-2">店舗レビュー管理SaaS</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">ログイン</h1>
              <p className="text-sm text-gray-500 mt-1">
                Googleアカウントで続ける
              </p>
            </div>

            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {/* Google SVG icon */}
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              Googleでログイン
            </button>

            <p className="text-center text-xs text-gray-400">
              ログインすることで
              <a href="#" className="text-indigo-500 hover:underline mx-1">利用規約</a>
              および
              <a href="#" className="text-indigo-500 hover:underline mx-1">プライバシーポリシー</a>
              に同意したものとみなします
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by{" "}
          <span className="font-medium text-indigo-400">hoshiko.me</span>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}

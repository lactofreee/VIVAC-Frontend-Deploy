import type { Metadata } from "next";

import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";

export const metadata: Metadata = {
  title: "로그인 — VIVAC",
};

export default function LoginPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          백패킹 스팟 탐색
        </p>
        <h1 className="text-5xl font-bold tracking-tight">VIVAC</h1>
        <p className="text-sm text-muted-foreground">
          어디서 자도 되는가, 신뢰할 수 있는 정보
        </p>
      </div>

      <div className="space-y-4">
        <GoogleLoginButton />
        <p className="text-center text-xs text-muted-foreground">
          계속하면{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            이용약관
          </a>
          {" "}및{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            개인정보처리방침
          </a>
          에 동의합니다.
        </p>
      </div>
    </div>
  );
}

import { signOutUser } from "@/features/auth/actions/signOut";

export function LogoutButton() {
  return (
    <form action={signOutUser}>
      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-destructive transition-colors hover:bg-muted"
      >
        로그아웃
      </button>
    </form>
  );
}

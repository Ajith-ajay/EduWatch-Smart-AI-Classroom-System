import type { Metadata } from "next";
import AuthGuard from './auth-guard';

export const metadata: Metadata = {
  title: "Customer Dashboard - EduWatch",
  description: "Manage your institution with EduWatch",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}

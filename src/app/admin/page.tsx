import AdminContent from "@/components/admin/AdminContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | byPixelTV – Software Developer",
};

export default function AdminPage() {
  return (
    <AdminContent />
  );
}
import { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | byPixelTV - Software Developer",
};

export default function AdminPage() {
  return (
    <AdminClient />
  );
}
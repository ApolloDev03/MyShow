import AdminFooter from "../components/AdminFooter";
import AdminHeader from "../components/AdminHeader";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      <main>{children}</main>
      <AdminFooter />
    </>
  );
}

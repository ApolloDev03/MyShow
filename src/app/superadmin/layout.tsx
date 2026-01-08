import RoleGuard from "../components/RoleGuard";
import SuperAdminFooter from "../components/SuperAdminFooter";
import SuperAdminHeader from "../components/SuperAdminHeader";


export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleGuard roleRequired="superadmin">
        <SuperAdminHeader />
        <main>{children}</main>
        <SuperAdminFooter />
      </RoleGuard>
    </>
  );
}

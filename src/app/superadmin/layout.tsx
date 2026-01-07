import SuperAdminFooter from "../components/SuperAdminFooter";
import SuperAdminHeader from "../components/SuperAdminHeader";


export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SuperAdminHeader />
      <main>{children}</main>
      <SuperAdminFooter />
    </>
  );
}

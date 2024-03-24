import OrgNavbar from "@/components/org-navbar";

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  // console.log(params, 'paramsfromorglayout')
  return (
    <>
      <OrgNavbar />
      <div className="h-[calc(100vh-64)] mt-16">
        {children}
      </div>
    </>
  )
}

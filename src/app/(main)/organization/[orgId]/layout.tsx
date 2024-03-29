import OrgNavbar from "@/components/org-navbar";

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  // console.log(params, 'paramsfromorglayout')
  return (
    <>
      <OrgNavbar />
      <div className="h-[calc(100vh-68px)] mt-20">
        {children}
      </div>
    </>
  )
}

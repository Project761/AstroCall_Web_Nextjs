import PlanRechargeClient from "./PlanRechargeClient";
import { serverPost } from "@/app/lib/serverApi";

export const revalidate = 3600;

export async function generateStaticParams() {
  const packages = await serverPost("WalletPackage/GetData_WalletPackage", { IsActive: "1" });
  if (!Array.isArray(packages)) return [];
  return packages
    .filter((pkg) => pkg?.PackageAmt)
    .map((pkg) => ({ "recharge-amount": `recharge-${pkg.PackageAmt}` }));
}

export async function generateMetadata({ params }) {
  const { "recharge-amount": slug } = await params;
  const amount = slug?.replace(/^recharge-/, "") || "";
  const title = amount ? `Recharge ₹${amount} - AstroCall` : "Recharge Plan - AstroCall";
  return {
    title,
    description: "Complete your wallet recharge on AstroCall",
    robots: { index: false, follow: false },
  };
}

export default function PlanRechargePage() {
  return <PlanRechargeClient />;
}

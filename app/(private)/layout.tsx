import { Footer } from "./components/footer";
import { Header, PatientBottomNav } from "./components/header";


export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-surface">
      <div aria-hidden className="absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="absolute -right-40 top-40 size-[28rem] rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative">
        <Header />
        <main className="mx-auto max-w-[1160px] px-5 pb-28 pt-8 sm:px-8 lg:pb-20">{children}</main>
        <Footer />
        <PatientBottomNav />
      </div>
    </div>
  );
}

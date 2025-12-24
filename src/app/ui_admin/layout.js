export const metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }) {
  return (
    <main className="pt-6">
      {children}
    </main>
  );
}

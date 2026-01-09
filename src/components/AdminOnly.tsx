import { useAuth } from "../context/AuthContext";

const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { role } = useAuth();

  if (role !== "admin") return null;

  return <>{children}</>;
};

export default AdminOnly;

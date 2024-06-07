import AdminForm from "../admins/component/admin-form";

export const Dashboard = () => {
  const user = {
    email: "ebba.birhanu@gmail.com",
    firstName: "Ebba",
    lastName: "Birhanu",
    password: "123456",
    phoneNumber: "0935287667",
    role: "Admin",
  };
  return (
    <div>
      <AdminForm user={user} />
    </div>
  );
};

export const adminFormFields = [
  {
    type: "text",
    label: "Full Name",
    name: "fullName",
    placeholder: "Enter Full Name",
    className: "col-span-2",
  },
  {
    type: "tel",
    label: "Phone Number",
    name: "phoneNumber",
    placeholder: "Enter Phone Number",
    className: "col-span-2",
  },
  {
    type: "email",
    label: "Email",
    name: "email",
    placeholder: "Enter Email",
    className: "col-span-2",
  },
  {
    type: "password",
    label: "Password",
    name: "password",
    placeholder: "Enter Password",
    className: "col-span-2",
  },
  {
    type: "select",
    label: "Roles",
    name: "role",
    placeholder: "Select a Role",
    className: "col-span-2",
    options: [
      { name: "Admin", value: "Admin" },
      { name: "Super Admin", value: "Super Admin" },
    ],
  },
];

export const newAdminFormFields = [
  {
    type: "text",
    label: "First Name",
    name: "firstName",
    placeholder: "Enter First Name",
    className: "col-span-2",
  },
  {
    type: "text",
    label: "Last Name",
    name: "lastName",
    placeholder: "Enter Last Name",
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

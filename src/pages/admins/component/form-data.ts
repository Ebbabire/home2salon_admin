export const adminFormFields = [
  {
    type: "text",
    label: "Full Name",
    name: "full_name",
    placeholder: "Enter Full Name",
    className: "col-span-3",
  },
  {
    type: "tel",
    label: "Phone Number",
    name: "phone_number",
    placeholder: "Enter Phone Number",
    className: "col-span-3",
  },
  
  {
    type: "password",
    label: "Password",
    name: "password",
    placeholder: "Enter Password",
    className: "col-span-3",
  },
  {
    type: "select",
    label: "Roles",
    name: "role",
    placeholder: "Select a Role",
    className: "col-span-3",
    options: [
      { name: "Admin", value: "admin" },
      { name: "Super Admin", value: "superadmin" },
    ],
  },
];

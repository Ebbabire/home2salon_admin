import { useEffect, useState } from "react";
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
  const [months, setMonths] = useState([{ name: "Jan" }]);
  const [nextSelectable, setNextSelectable] = useState(null);

  return (
    <div>
      {/* <AdminForm user={user} /> */}

      <ul>
        {months.map((month) => (
          <MonthItem
            key={month}
            month={month}
            paid={nextSelectable && month === nextSelectable}
            // onClick={() => handleMonthClick(month)}
            // disabled={!paid && month !== nextSelectable}
          />
        ))}
      </ul>
    </div>
  );
};

const MonthItem = ({ month, paid, onClick, disabled }) => {
  const handleClick = () => onClick && onClick(month);

  return (
    <li
      className={`month-item ${paid ? "paid" : "unpaid"}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {month.name}
    </li>
  );
};

export default MonthItem;

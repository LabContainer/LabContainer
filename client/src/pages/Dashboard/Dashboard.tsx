import React from "react";
import { AuthContext } from "../../components/App/AuthContext";
import InstructorDashboard from "../InstructorDashboard/InstructorDashboard";
import StudentDashboardNew from "../StudentDashboard/StudentDashboardNew";

export default function Dashboard() {
  const { user } = React.useContext(AuthContext);
  if (user)
    if (user.is_student) return <StudentDashboardNew />;
    else return <InstructorDashboard />;
  else {
  }
  return <>No Auth Context</>;
}

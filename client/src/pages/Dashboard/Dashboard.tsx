import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../components/App/AuthContext';
import InstructorDashboard from '../InstructorDashboard/InstructorDashboard';
import StudentDashboard from '../StudentDashboard/StudentDashboard';

export default function Dashboard(){
  const {user} = React.useContext(AuthContext)
  if(user.is_student)
    return <StudentDashboard />
  else
    return <InstructorDashboard />
}
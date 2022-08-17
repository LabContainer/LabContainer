import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../components/App/AuthContext';
import InstructorDashboard from '../InstructorDashboard/InstructorDashboard';
import StudentDashboard from '../StudentDashboard/StudentDashboard';
import fetchData from '../../components/App/fetch';

const auth_api_url = 'http://localhost:5000'

export default function Dashboard(){
  const {token, setToken, username, setUsername} = React.useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams();
  
  React.useEffect( () => {
    async function setParam(){
      const data = await fetchData(token, setToken, `${auth_api_url}/users/${username}`, {
        method: 'GET'
      })
      if(data?.is_student){
        setSearchParams({
          'type': 'student'
        })
      } else {
        setSearchParams({
          'type': 'staff'
        })
      }
    }
    setParam();
  }, [username, token, setToken, setSearchParams])

  const dashType = searchParams.get('type')
  if(dashType === 'student')
    return <StudentDashboard />
  else if(dashType === 'staff')
    return <InstructorDashboard />
  
  return <>Invalid Dashboard</>
}
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../components/App/AuthContext';
import InstructorDashboard from '../InstructorDashboard/InstructorDashboard';
import StudentDashboard from '../StudentDashboard/StudentDashboard';
import fetchData from '../../components/App/fetch';

const auth_api_url = 'http://localhost:5000'

export default function Dashboard(){
  const {token, setToken, refresh_token} = React.useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams();
  
  React.useEffect( () => {
    async function setParam(){
      const data = await fetchData(auth_api_url, `/users/me`, token, refresh_token, setToken, {
        method: 'GET'
      })
      if(data !== undefined)
        if(data.is_student){
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
  }, [token, setToken, refresh_token, setSearchParams])


  const dashType = searchParams.get('type')
  if(dashType === 'student')
    return <StudentDashboard />
  else if(dashType === 'staff')
    return <InstructorDashboard />
  
  return <>Invalid Dashboard</>
}
import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import DetailForm from '../components/DetailForm';

function DetailRegistration() {
  const navigate = useNavigate();
  
  return (
    <div>
        <div className='mt-12'>
            <DetailForm/>
        </div>
    </div>
  )
}

export default DetailRegistration
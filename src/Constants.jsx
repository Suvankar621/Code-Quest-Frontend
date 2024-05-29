import  { useState } from 'react'

const Constants = () => {
    const [isRegistered,setisRegistered]=useState(false)
    const [email, setEmail] = useState('');
  
    return {
    isRegistered,
    setisRegistered,
      email,
      setEmail,
    };
}

export default Constants
import React,{useEffect, useState} from 'react'
import {auth} from './Firebase'
import {useHistory} from 'react-router-dom'

function ProtectedRoutes(props) {
    const history = useHistory()

    const Comp = props.component
    const [firstReload, setFirstReload] = useState(false)


    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
          if(user){
            setFirstReload(true)
            history.push('/')
          }
          else{
            setFirstReload(true)
            history.push('/signin')
          }
        });
        
      },[])
    return (
        <>
            {
                firstReload==true 
                &&
                <Comp/>
            }
        </>
        
    )
}

export default ProtectedRoutes

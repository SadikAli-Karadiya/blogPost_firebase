import React,{useState, useEffect} from 'react'
import './Navbar.css'
import {NavLink, useHistory} from 'react-router-dom'
import {auth} from './Firebase'

function Navbar() {
    const history = useHistory()
    const [user, setUser] = useState(null)

    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
        if(user){
          setUser(user)
        }
        else{
          setUser(null)
        }
      });
      
    },[])
    return (
        <>
            <div className='nav_container '>
                <div className="nav_title">Firebase</div>
                <div className="nav_link_container">
                    {
                        user
                        &&
                           <>
                                <NavLink exact activeClassName='nav_activeLink' className='nav_link' to='/'>Home</NavLink>
                                <NavLink exact activeClassName='nav_activeLink' className='nav_link' to='/createblog'>Blog</NavLink>
                                <NavLink exact activeClassName='nav_activeLink' className='nav_link' to='/profile'>Profile</NavLink>
                                <button className='btn btn-danger mr-2' onClick={()=>{auth.signOut(); history.push('/signin') } }>Logout</button>
                           </>
                    }
                    
                </div>
            </div>
        </>
    )
}

export default Navbar

import React,{useState} from 'react'
import './Signup.css'
import {Link} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import validator from 'validator'
import {auth} from './Firebase'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [showSubmitBtn, setShowSubmitBtn] = useState('disabled')

    const getUserInput = (event) =>{
        setEmail(event.target.value) 
        validator.isEmail(event.target.value) ? setShowSubmitBtn('') : setShowSubmitBtn('disabled')
    }
    const submit = () =>{
        console.log()
        auth.sendPasswordResetEmail(email)
        .then(()=>{
            toast.success('Check you email', {position:'top-center'})
            setEmail('') 
        })
        .catch(error=>{
            if( error.code == 'auth/user-not-found'){
                toast.error('Invalid Email', {position: 'top-center'})
            }   
        })
    }

    return (
        <div className='main_div'>
            <div className="signup" style={{height:'40vh'}}>
                <h3 className='signup_title'>Reset Password</h3>
                <div className='signup_input_fields_container' style={{height:'15%', marginTop:'20px'}}>
                    <div className="signup_input_field h-100">
                        <input type="text" placeholder='Enter email' onChange={getUserInput}  name='email' value={email} />
                    </div>
                </div>
                <div className="signup_have_account" style={{marginTop:'-20px'}}>
                    <p>Do you want to Signin? <Link to='/signin'>Click Here</Link></p>
                </div>
                <div className="signup_submit_button">
                    <button className='btn btn-primary' onClick={submit} disabled={showSubmitBtn} >Submit</button>
                    <ToastContainer/>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword

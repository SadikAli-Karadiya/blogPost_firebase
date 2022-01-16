import React, {useState} from 'react'
import "./Signup.css"
import {Link, useHistory} from 'react-router-dom'
import {auth} from './Firebase'
import validator from 'validator'
import {ToastContainer, toast} from 'react-toastify'

function Signin() {
    const history = useHistory()
    const [showSubmitBtn, setShowSubmitBtn] = useState('disabled')
    const [input, setInput]= useState({email:'', password:''})

    const getUserInput = (event)=>{
        const {name, value} = event.target;
                                                                   //input.password not working properly
        if(!validator.isEmail(input.email) || (name=='email' && value == '') || (name=='password' && value == '') ){
            setShowSubmitBtn('disabled')
        }
        else{
            setShowSubmitBtn('')
        }

        setInput((prevData)=>{
            return{...prevData, [name]:value}
        })
    }
    const submit = async() =>{
        auth.signInWithEmailAndPassword(input.email, input.password)
        .then((result)=>{
            result.user.updateProfile({
                displayName:input.name
            })
            history.push('/')
        })
        .catch((error)=>{
            if(error.code == 'auth/invalid-email' || error.code == 'auth/wrong-password' || error.code == 'auth/user-not-found'){
                toast.error('Invalid Email or Password', {position: 'top-center'})
            }
        })
        
        // if(result.user.emailVerified){
        //     history.push('/')
        //     toast.success('Signin Successfully', {position: 'top-center'})
        // }
        // else{
        //     auth.signOut();
        //     history.push('/signin')
        //     toast.error('Verify your email first', {position: 'top-center'})
        // }
    }
    return (
        <div className='main_div'>
            <div className="signup">
                <h2 className='signup_title'>Signin</h2>
                <div className='signup_input_fields_container' style={{height:'20%'}}>
                    <div className="signup_input_field">
                        <input type="text" placeholder='Enter email' onChange={getUserInput} name='email' value={input.email} />
                    </div>
                    <div className="signup_input_field">
                        <input type="password" placeholder='Enter password' onChange={getUserInput} name='password' value={input.password} />
                    </div>
                </div>
                <div>
                    <p style={{fontSize:'14px'}}><Link to='forgotpassword'>Forgot Password</Link></p>
                </div>
                <div className="signup_have_account">
                    <p>Don't have an account? <Link to='/signup'>SignUp</Link></p>
                </div>
                <div className="signup_submit_button">
                    <button className='btn btn-primary' onClick={submit} disabled={showSubmitBtn}>Signin</button>
                    <ToastContainer/>
                </div>
            </div>
        </div>
    )
}

export default Signin

import React, {useState} from 'react'
import "./Signup.css"
import {Link, useHistory} from 'react-router-dom'
import {auth,db} from './Firebase'
import {ToastContainer, toast} from 'react-toastify'
import { FcGoogle } from 'react-icons/all';
import Button from '@material-ui/core/Button';
import validator from 'validator'

function Signup() {
    const history = useHistory();
    const [showSubmitBtn, setShowSubmitBtn] = useState('disabled')
    const [input, setInput]= useState({name:'', email:'', password:''})
    
    const getUserInput = (event)=>{

        const {name, value} = event.target;
        if(!validator.isEmail(input.email) || (name=='email' && value == '') || (name=='name' && value == '') || (name=='password' && value == '') ){
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
        
        const result = await auth.createUserWithEmailAndPassword(input.email, input.password)
        if(result.user){
            result.user.sendEmailVerification()
            toast.success('signup successfully', {position:'top-center'})
            history.push('/signin')
        }
        await result.user.updateProfile({
            displayName:input.name
        })
        
        await db.collection('users').doc(result.user.uid).set({
            name:result.user.displayName,
            email: result.user.email
        })
        setInput({name:'', email:'', password:''})
    }

    return (
        <div className='main_div'>
            <div className="signup">
                <h2 className='signup_title'>Signup</h2>
                <div className='signup_input_fields_container'>
                    <div className="signup_input_field">
                        <input type="text" placeholder='Enter name' onChange={getUserInput} name='name' value={input.name} />
                    </div>
                    <div className="signup_input_field">
                        <input type="text" placeholder='Enter email' onChange={getUserInput} name='email' value={input.email} />
                    </div>
                    <div className="signup_input_field">
                        <input type="password" placeholder='Enter password' onChange={getUserInput} name='password' value={input.password} />
                    </div>
                </div>
                <div className="signup_have_account">
                    <p>Already have an account? <Link to='/signin'>SignIn</Link></p>
                </div>
                <div className="signup_submit_button">
                    <button className='btn btn-primary' onClick={submit} disabled={showSubmitBtn}>Signup</button>
                    <ToastContainer/>
                </div>
            </div>
        </div>
    )
}

export default Signup

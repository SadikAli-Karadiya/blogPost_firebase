import React,{useState, useEffect} from 'react'
import Modal from 'react-modal'
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {auth, db} from './Firebase'
import './Profile.css'
import {ToastContainer, toast} from 'react-toastify'
import {motion} from 'framer-motion'

function Profile() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState({name:'', email:''})
    const [myBlogs, setMyBlogs] = useState([])
    const [currentUser, setCurrentUser] = useState(auth.currentUser)

    useEffect(()=>{
        db.collection('blogs').where('postedBy', '==', currentUser && currentUser.uid).get()
        .then((querySnap)=>{
            const blogs  = querySnap.docs.map(docSnap=>{
                   return{
                       ...docSnap.data(),
                       id: docSnap.id
                   }
            })
            setMyBlogs(blogs)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])

    const customStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          transform             : 'translate(-50%, -50%)',
          width                 : '400px'
        }
      }

    const toggleModal = () =>{
        setIsOpen(!isOpen)
        if(!isOpen){
            setInput({name: currentUser && currentUser.displayName, email: currentUser && currentUser.email})
        }
    }

    const fetchUserInput = (event) =>{
        const {name, value} = event.target
        setInput((prevData)=>{
            return{...prevData, [name]:value}
        })
    }

    const updateUserDetail = () =>{
        //updating details in 'users' collection. This collection is created when u required more fields beyond name and email
        db.collection('users').doc(currentUser.uid).update({
            name:input.name,
            email: input.email
        })
        .then(()=>{

            // updating details in 'authentication'
            auth.currentUser.updateProfile({
                displayName: input.name,
            })
            .then(()=>{

                setCurrentUser(auth.currentUser)
                setIsOpen(!isOpen)
                toast.success('Profile updated successfully',{position:'top-center'})
                
            })
            .catch(error=>{
                console.log(error)
            })
            auth.currentUser.updateEmail(input.email)
        })
        .catch((error)=>{
            console.log(error)
            toast.error('Failed to update profile',{position:'top-center'})
        })
    }

    const deleteBlog = (blogId) =>{
        db.collection('blogs').doc(blogId).delete()
        .then(()=>{
            setMyBlogs(myBlogs.filter(blog=> {return blog.id != blogId}))
            toast.success('Blog deleted successfully', {position:'top-center'})
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const container = {
        hide:{
            opacity: 0,
        },
        show:{
            opacity: 1,

            transition:{
                staggerChildren: 0.2
            }
        }
    }
    const child = {
        hide:{
            opacity: 0,
            y:-50
        },
        show:{
            opacity: 1,
            y:0,

            transition:{
                duration:0.8,
                type:'spring',
                damping:7,
            }
        }
    }

    return (
        <>
            <div className='main_div'>
                <div className="userDetail_main_div">
                    <div style={{marginRight:'70px'}}>
                        <AccountCircleIcon style={{fontSize:'170px', color:'rgb(196, 195, 194)'}}/>
                    </div>
                    <div className='d-flex flex-column'>
                        <span style={{fontSize:'35px', fontWeight:'500'}}>{currentUser && currentUser.displayName}</span>
                        <span style={{fontSize:'18px', fontWeight:'normal'}}>{currentUser && currentUser.email}</span>
                        <div>
                            <button className='btn btn-primary mt-4' onClick={toggleModal}>Edit Details</button>
                        </div>
                    </div>
                    
                </div>
                <motion.div variants={container} initial='hide' animate='show' className="blog_main_div">
                    {
                        myBlogs.length
                        ?
                            myBlogs.map((blog)=>{
                                return(
                                    <motion.div variants={child} key={blog.id} className='blog_img_div ml-3'>
                                        <img src={blog.imageUrl} alt=""  width='200px' height='200px' />
                                        <div className='blog_deleteBtn_div'>
                                            <Button onClick={()=>deleteBlog(blog.id)}>
                                                <DeleteIcon/>
                                            </Button>
                                        </div>
                                    </motion.div>
                                )
                            })
                        :
                            <h4 style={{color:'gray'}}>No blogs posted yet</h4>
                    }
                </motion.div>
            </div>

            {/* Modal of edit detail */}
            <div>
                <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel='My modal' ariaHideApp={false} style={customStyles}>
                <div className="modal_cancelBtn_div">
                    <Button onClick={toggleModal}>
                        <CancelIcon /> 
                    </Button>
                </div>
                    <div>
                        <label>Name: </label>
                        <input type="text" placeholder='Name' value={input.name} onChange={fetchUserInput} name='name' className='form-control'/>
                        <label className='mt-3'>Email: </label>
                        <input type="text" placeholder='email' disabled value={input.email} onChange={fetchUserInput} name='email' className='form-control'/>
                    </div>
                    <div style={{width:'99.1%'}}>
                        <button className='btn btn-primary w-100 mt-4 mr-4' onClick={updateUserDetail}>update</button>
                    </div>                    
                </Modal>
            </div>
            <ToastContainer/>
        </>
    )
}

export default Profile

import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {FaCloudUploadAlt} from 'react-icons/all'
import { Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import './CreateBlog.css';
import { v4 as uuidv4 } from 'uuid';
import {storage, auth, db, serverTimestamp} from './Firebase'
import {ToastContainer, toast} from 'react-toastify'

function CreateBlog() {
    const currentUser = auth.currentUser;
    const history = useHistory()

    const [input, setInput] = useState({title:'', body:''})
    const [blogImage, setBlogImage] = useState(null);
    const [textFieldError, setTextFieldError] = useState(null);
    const [imageError, setImageError] = useState(null)
    const [firebaseImageURL, setFirebaseImageURL] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        if(firebaseImageURL){
            try {
                db.collection('blogs').add({
                    title: input.title,
                    body: input.body,
                    imageUrl : firebaseImageURL,
                    postedBy : currentUser.uid,
                    createdAt : serverTimestamp()
                })
                history.push('/')
                toast.success('Blog created successfully', {position:'top-center'})
            } catch (error) {
                console.log(error)
                toast.error('Something strange happened..', {position:'top-center'})
            }
        }
        
    }, [firebaseImageURL]);
    
    const getUserInput = (e) =>{
        const {name, value} = e.target;
        
        setInput((prevData)=>{
            return{ ...prevData, [name]:value}
        })
    }
    const getBlogImage = (e) =>{
        const selectedImg = e.target.files[0];
        setSelectedImage(selectedImg)
        const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg']

        if( selectedImg && allowedImageTypes.includes(selectedImg.type) ){
            const reader = new FileReader;
            reader.onloadend = () =>{
                setBlogImage(reader.result)
            }
            reader.readAsDataURL(selectedImg)
            setImageError(null)
        }
        else{
            setImageError('*File not supported')
        }

    }
    const submit = () =>{
        if(input.title == '' || input.body == ''){
            return setTextFieldError('*Field required')
        }
        else{
            setTextFieldError(null)
        }
        if(blogImage == null){
            return setImageError('*please select image')
        }
        else{
            setImageError(null)
        }

        const uploadTask = storage.ref(`images/${uuidv4()}`).put(selectedImage); // selectedImage contains e.target.files[0]
        uploadTask.on(
            'state_changed',
            snapshot =>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                if(progress == '100'){
                    
                }
            },
            error =>{
                setImageError("can't upload image");
                console.log(error)
            },
            () =>{
                uploadTask.snapshot.ref.getDownloadURL().then(downloadURL =>{
                    setFirebaseImageURL(downloadURL)
                })
            }
        )
    }
    return (
        
        <div className='createBlog_main'>
            <div className="createBlog_center">  
                <div className="createBlog_title_body_container">
                    <div className='heading'>
                        <h3>Create your blog</h3>
                    </div>
                    <div className="title">
                        <input type="text" onChange={getUserInput} name='title' vlaue={input.title} className='form-control input_field' placeholder='Enter title' />
                    </div>
                    <div className="body">
                        <input type="text" onChange={getUserInput} name='body' value={input.body} className='form-control input_field' placeholder='Enter body' />
                    </div>
                    
                    <div className="submit_btn_container">
                        <button className='btn submit_btn' onClick={submit}>Create Blog</button>
                    </div>
                    <span className='text-danger mt-2'>{textFieldError}</span>
                </div>              
                <div className="createBlog_image_preview_container">
                    <Button className='Button'>
                        <DeleteIcon/>
                    </Button>
                    {
                        blogImage
                        ?
                            <div className='image_preview position-relative' >
                                <img src={blogImage} alt="" />
                            </div>
                        :   
                            <div className='image_preview'> 
                                <span className='upload_icon'><FaCloudUploadAlt/></span>
                                <p>No file choosen yet</p>
                            </div>
                    }
                    
                    {   
                        blogImage
                        ?
                            <label className={'remove_file_btn'} onClick={()=>setBlogImage(null)}>Remove file</label>   
                        :
                            <>
                                <input type="file" id='input_file' onChange={getBlogImage} hidden/>
                                <label className='choose_file_btn' htmlFor='input_file'>Choose Photo</label>
                            </>
                    }
                    
                    <p className='text-danger mt-3 display-0'>{imageError}</p>  
                    <ToastContainer/>
                </div>
            </div>
        </div>
    )
}

export default CreateBlog

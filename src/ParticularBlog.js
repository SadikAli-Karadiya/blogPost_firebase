import React,{useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import {db,auth,serverTimestamp} from './Firebase'
import {BeatLoader} from 'react-spinners'
import {css} from '@emotion/core'
import {motion} from 'framer-motion'
import './ParticularBlog.css'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import {ToastContainer, toast} from 'react-toastify'

const loaderStyle = css `
    margin-top: 300px;
`
function ParticularBlog() {

    const {blogId} = useParams()
    const [blog, setBlog] = useState()
    const [comment, setComment] = useState('')
    const [allComments, setAllComments] = useState([])

    const currentUserId = auth.currentUser && auth.currentUser.uid
    const currentUserName = auth.currentUser && auth.currentUser.displayName

    useEffect(()=>{
        // Fetching blog
        db.collection('blogs').doc(blogId).get()
            .then((docSnap)=>{
                setBlog(docSnap.data())
            })
            .catch((error)=>{
                console.log(error)
            })

        // Fetching comments
        db.collection('blogs').doc(blogId).collection("comments").orderBy('createdAt','asc')
        .onSnapshot((snapshot)=>{
            const comments = snapshot.docs.map(docSnap =>{
                return{
                    ...docSnap.data(),
                    id:docSnap.id
                }
            })

            setAllComments(comments)
        })

    },[])


    db.collection('users').doc(blog && blog.postedBy).get()
        .then((docSnap)=>{
            const userWhoPosted = docSnap.data()
            setBlog((prevData)=>{
                return{
                    ...prevData,
                    userWhoPosted
                }
            })
        })
        .catch((error)=>{
            console.log(error)
        })

    const submit = ()=>{
        db.collection('blogs').doc(blogId).collection("comments").add({
            blogId,
            comment,
            commentedById: currentUserId,
            commentedByName: currentUserName,
            createdAt: serverTimestamp()
        }).then((result)=>{
            if(result.exist){}
            setComment('')
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const deleteComment = (blogId, commentId) =>{
        db.collection('blogs').doc(blogId).collection('comments').doc(commentId).delete()
        .then((result)=>{
            toast.success('Your comment has been deleted',{position:'top-center'})
            setAllComments(allComments.filter(comm=> {return comm.id !== commentId})) // No need of this, but to call useEffect it is required. SetAllComments is again set in useEffect
        })
        .catch(error=>{
            console.log(error)
        })
    }
    const container = {
        hide:{
            opacity:0,
            y:-40
        },
        show:{
            opacity:1,
            y:0,
            transition:{
                duration: 0.8,
                when:'beforeChildren' //animation finishes before children animation starts
            }
        }
    }

    const child ={
        hide:{
            opacity:0,
            x:50
        },
        show:{
            opacity:1,
            x:0,
            transition:{
                duration:0.8,
                type:'spring',
                damping:6
            }
        }
    }

    return (
        <div className='d-flex flex-wrap justify-content-center align-items-center h-100 w-100'>
                { 
                    blog
                    ?  
                        <motion.div variants={container} initial='hide' animate='show' className="card mt-5 ml-4" style={{width: '400px', boxShadow:'3px 3px 20px'}} key={blog.id}>
                            <motion.div variants={child} className='card-header'>
                                <h5>{blog.userWhoPosted && blog.userWhoPosted.name}</h5>
                            </motion.div>
                            <img className="card-img-top" src={blog.imageUrl} alt="Card image cap" style={{width:'400px', height:'400px'}} />
                            <motion.div variants={child} className="card-body">
                                <h4 className="card-title">{blog.title}</h4>
                                <p className="card-text " >{blog.body}</p>
                            </motion.div>
                            <motion.div variants={child} className='card-body'>
                                <div className='mb-3' style={{borderBottom:'1px solid lightgray'}}>
                                    <h6>Comments <span className='font-weight-normal'>({allComments.length})</span> :</h6>
                                </div>
                                {
                                    allComments.map(singleComment=>{
                                        return(
                                            <div className='d-flex justify-content-between align-items-center' key={singleComment.id}>
                                                <div style={{width:'280px'}}>
                                                    <span className='font-weight-bold'>{singleComment.commentedByName} : </span>{singleComment.comment}
                                                </div>
                                                
                                                {
                                                    currentUserId == singleComment.commentedById 
                                                    &&
                                                        <div className='d-flex justify-content-center align-items-center' style={{marginBottom:'auto', marginTop:'-5px'}}>
                                                            <Button onClick={()=>{deleteComment(singleComment.blogId, singleComment.id)}}>
                                                                <DeleteIcon style={{color:'red'}}/>
                                                            </Button>
                                                        </div>
                                                }                                                
                                            </div>
                                        )
                                    })
                                }
                            </motion.div>

                            <ToastContainer/> 

                            <motion.div variants={child} className='card-body w-100'>
                                <form action="" onSubmit={(e)=>e.preventDefault()}>
                                    <input type="text" className='comment_field' placeholder='Type your comment here.....' style={{border:'none', outline:'none', borderBottom:'2px solid orange'}} required onChange={(e)=>setComment(e.target.value)} value={comment}/>
                                    <button className='btn btn-warning ml-5' onClick={submit}>submit</button>
                                </form>
                                
                            </motion.div>
                        </motion.div>
                        
                    :
                        <div className="d-flex justify-content-center align-items-center" >
                            <BeatLoader color='orange' css={loaderStyle} />
                        </div>
                       
                }
        </div>
    )
}

export default ParticularBlog

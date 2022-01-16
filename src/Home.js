import React,{useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {db} from './Firebase'
import './Home.css'
import {motion} from 'framer-motion'

function Home() {
    const [allBlogs, setAllBlogs] = useState([])
    const [end, setEnd] = useState(false)
    const history = useHistory()

    useEffect(()=>{
        db.collection('blogs').orderBy('createdAt', 'desc').limit(3).get()
            .then(querySnap=>{
                const blogs= querySnap.docs.map( docSnap =>{
                    return{
                        ...docSnap.data(),
                        id:docSnap.id,
                    }
                })

                if(blogs.length < 3){
                    setEnd(true)
                }
                setAllBlogs(blogs)
            })
            .catch(error=>{
                console.log(error)
            })
    },[])

    const loadmore = async () =>{
        const querySnap = await db.collection('blogs').orderBy('createdAt', 'desc').limit(3).startAfter(allBlogs[allBlogs.length-1].createdAt).get()
        const newBlogs = querySnap.docs.map(docSnap =>{
            return{
                ...docSnap.data(),
                id:docSnap.id
            }
        })
        newBlogs.map(blog=>{
            setAllBlogs(prevData=>[...prevData,blog])
        })
        if(newBlogs.length < 3){setEnd(true)}
        
    }

    const container = {
        hide:{
            opacity: 0,
        },
        visible:{
            opacity: 1,

            transition:{
                staggerChildren:1
            }
        }
    }
    const child = {
        hide:{
            opacity: 0,
            x:50
        },
        visible:{
            opacity: 1,
            x:0,

            transition:{
                duration:0.8,
                type:'spring',
                damping:7,
            }
        }
    }
    return (
        <>
            <motion.div
                variants={container} 
                initial='hide'
                animate='visible'
                className='d-flex flex-wrap justify-content-center align-items-center h-100 w-100'>
                {
                    allBlogs
                    ?   
                        allBlogs.map((blog)=>{
                            return(
                                <motion.div variants={child} className="card mt-5 ml-4" style={{width: '300px', cursor:'pointer'}} key={blog.id} onClick={()=>history.push(`/particularblog/${blog.id}`)}>
                                    <img className="card-img-top" src={blog.imageUrl} alt="Card image cap" style={{width:'300px', height:'300px'}} />
                                    <div className="card-body">
                                        <h5 className="card-title">{blog.title}</h5>
                                        <p className="card-text " >{blog.body}</p>
                                    </div>
                                </motion.div>
                            )
                        })
                        
                    :
                        <h3>No blogs yet</h3>
                }
            </motion.div>
            {
                end == false
                ? 
                    <div className='loadmore_btn_div'>
                        <button className='btn btn-warning' onClick={loadmore}>Load More</button>
                    </div>
                : 
                    <div className='mt-4'>
                        <h3 className='text-center' style={{fontSize:'17px', color:'gray'}}>* You have reached the end *</h3>
                    </div>
            }
            
        </>
    )
}

export default Home

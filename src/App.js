import {useState, useEffect} from 'react'
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Navbar'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {Switch, Route} from 'react-router-dom'
import Signin from './Signin'
import Signup from './Signup'
import Home from './Home'
import CreateBlog from './CreateBlog'
import ParticularBlog from './ParticularBlog'
import Profile from './Profile'
import ProtectedRoutes from './ProtectedRoutes'
import ForgotPassword from './ForgotPassword'

function App() {

  return (
    <>
        <Navbar/>

        <Switch>
                <Route exact path='/' >
                    <ProtectedRoutes component={Home} />
                </Route>
                <Route exact path='/signin' >
                    <ProtectedRoutes component={Signin} />
                </Route>
                <Route exact path='/signup'>
                    <ProtectedRoutes component={Signup} />
                </Route>
                <Route exact path='/createblog'>
                    <ProtectedRoutes component={CreateBlog} />
                </Route>
                <Route exact path='/particularblog/:blogId'>
                    <ProtectedRoutes component={ParticularBlog} />
                </Route>
                <Route exact path='/profile' >
                    <ProtectedRoutes component={Profile} />
                </Route>
                <Route exact path='/forgotpassword' component={ForgotPassword}></Route>
            </Switch>

      <ToastContainer/>
    </>
  );
}

export default App;

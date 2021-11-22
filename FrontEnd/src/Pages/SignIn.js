import React, { useEffect } from 'react'
import './Signup.css'
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();
export default function SignIn() {
    const history = useNavigate();
	const loginWithGoogle = () => {
        document.getElementsByClassName('loaderbap')[0].style.display='flex';
		const authw = getAuth();
		signInWithPopup(authw, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const tokens = credential.accessToken;
				const user = result.user;
				localStorage.setItem('token',tokens)
				localStorage.setItem('uid',user.uid)
                let docx=document.getElementsByClassName('navitem');
                docx[2].style.display='none'
                docx[3].style.display='none'
                docx[4].style.display='block'
                docx[5].style.display='block'
				window.localStorage.setItem('auth', 'true');
                history('/')
                document.getElementsByClassName('loaderbap')[0].style.display='none';
			}).catch((error) => {
                document.getElementsByClassName('loaderbap')[0].style.display='none';
			});
	};
    useEffect(() => {
        
        document.getElementsByClassName('loaderbap')[0].style.display='none';
    }, [])
    function shield() {
        return <>
            <div className='blackbar'>
            </div>
            <img src="./Images/shield.png" />
            <div className='blackbar'>
            </div>
        </>
    }
    return (<div className='Signup SignIn'>
        <div className='leftshield'>
            <div className='logocircle'>DC</div>
            <div className='outshield'>{shield()}</div>
            <div className='signupform'>
                <div className="dcinput">
                    <div className='dcmsgbox'>
                        Hello! Dont waste your time in filling a form
                    </div>
                    <div className='dcmsgbox'>
                        Here.. Take Help of Google
                    </div>
                    <div className='usermsgbox'>
                        <button onClick={()=>loginWithGoogle()}>SignUp With Google</button>
                        {/* <img src='./Images/msg.png'/> */}
                    </div>
                </div>
            </div>
        </div>
        <i class="fas fa-user-shield"></i>
    </div>)
}

import React, { useState } from 'react'
import './Signup.css'
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();
export default function Signup() {
    const history = useNavigate();
    let [click1, setclick1] = useState(undefined);
    let [click2, setclick2] = useState(undefined);
    let [hover2, sethover2] = useState(false);
    let [hover1, sethover1] = useState(false);
    function move() {
    }
	const loginWithGoogle = () => {
		const authw = getAuth();
		signInWithPopup(authw, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const tokens = credential.accessToken;
				const user = result.user;
                let docx=document.getElementsByClassName('navitem');
                docx[2].style.display='none'
                docx[3].style.display='none'
                docx[4].style.display='block'
                docx[5].style.display='block'
				localStorage.setItem('token',tokens)
				localStorage.setItem('uid',user.uid)
				window.localStorage.setItem('auth', 'true');
                history('/')
			}).catch((error) => {
			});
	};
    function Chars() {
        return <div className='twochars'>
            <div style={{ display: click2 === true ? 'none' : 'block' }} id="img1">
                <img onClick={() => { setclick1(true); sethover1(true); move() }} onMouseLeave={() => { if(click1 === undefined)sethover1(false) }} onMouseOver={() => { sethover1(true) }}
                    src={hover1 ? './Images/onlyfemale.png' : './Images/femaleout.png'} />
            </div>
            <div style={{ display: click1 === true ? 'none' : 'block' }} id="img2">
                <img onClick={() => { setclick2(true); sethover2(true); move() }} onMouseLeave={() => { if(click2 === undefined) sethover2(false) }} onMouseOver={() => { sethover2(true) }}
                    src={hover2 ? './Images/onlymale.png' : './Images/maleout.png'} />
            </div>
        </div>
    }
    function shield() {
        return <>
            <div className='blackbar'>
            </div>
            <img src="./Images/shield.png" />
            <div className='blackbar'>
            </div>
        </>
    }
    return (<div className='Signup'>
        <div style={{ visibility: (click1 || click2) ? 'visible' : 'hidden' ,width: (click1 || click2) ? '100%' : '0%' }}  className='leftshield'>
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
            <div className='outshield'>{shield()}</div>
        </div>
            <Chars />
    </div>)
}

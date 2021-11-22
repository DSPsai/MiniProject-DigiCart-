import React, { useEffect, useState } from 'react'
import { Component } from 'react'
import './Navbar.css'
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import axios from 'axios';
import { db, storage } from '../Resources/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
var bod = { lattitude: '', longitude: '' };
navigator.geolocation.getCurrentPosition(function (position) {
    bod.lattitude = position.coords.latitude;
    bod.longitude = position.coords.longitude;
})
export default function Navbar() {
    var [upload, setUpload] = useState(`url('./Images/Upload.webp')`);
    var [image, setImage] = useState();
    var loggedout = false;
    var check = false;
    var uploadimg = false;
    const history = useNavigate();
    let postdat = {
        "link": " "
    }
    let str = window.location.href;
    let res = str.split("/");
    postdat.link = res[3];
    const authw = getAuth();
    function opa(i) {
        document.getElementsByClassName('loaderbap')[0].style.display='none';
        if (!auth)
            history('/signup')
        if (!loggedout)
            onAuthStateChanged(authw, (user) => {
                if (user) {
                    localStorage.setItem('token', user.accessToken)
                    localStorage.setItem('uid', user.uid)
                } else {
                    localStorage.removeItem('token')
                    localStorage.removeItem('uid')
                    history('/signup')
                }
            });
        let docs = document.getElementsByClassName('navitem');
        setauth(localStorage.getItem('token') != undefined)
        for (let j = 0; j < docs.length; j++)
            docs[j].style.opacity = 0.5
        document.getElementsByClassName('navitem')[i].style.opacity = 1
    }
    var [auth, setauth] = useState(localStorage.getItem('token') != undefined)
    useEffect(() => {
        // if (localStorage.getItem('token') != undefined) setauth(false); else setauth(true);
        if (postdat.link == '')
            opa(0)
        else if (postdat.link == 'Shops')
            opa(1)
        else if (postdat.link == 'login')
            opa(2)
        else if (postdat.link == 'signup')
            opa(3)
        localStorage.setItem('lat', bod.lattitude)
        localStorage.setItem('long', bod.longitude)
    }, [])
    function checkloc() {
        navigator.geolocation.getCurrentPosition(function (position) {
            check = true;
            let str = position.coords.latitude.toString() + ',' + position.coords.longitude.toString()
            bod.lattitude = position.coords.latitude;
            bod.longitude = position.coords.longitude;
            console.log(str)
            document.getElementById('enterloc').innerText = str
        })
    }
    async function checkmerc() {
        document.getElementsByClassName('loaderbap')[0].style.display='flex';
        const snapsho = await db.collection('MerchantList').doc(localStorage.getItem('uid')).get()
        if (!snapsho.exists) {
            document.getElementsByClassName('loaderbap')[0].style.display='none';
            document.getElementsByClassName('addmerc')[0].style.display = 'block'
        } else {
            document.getElementsByClassName('loaderbap')[0].style.display='none';
            opa(4)
            history('/merchant')
        }
    }
    function mercadder() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        let name = document.getElementById('mernameadd').value;
        let ShopName = document.getElementById('mercshopnam').value;
        let ShopCat = document.getElementById('merccat').value;
        if (name.length < 2 || ShopName.length < 2 || ShopCat.length < 2 || check) {
        document.getElementsByClassName('loaderbap')[0].style.display='flex';
            const storageRef = ref(storage, '/ShopImages/' + localStorage.getItem('uid') + new Date());
            const uploadTask = uploadBytes(storageRef, image).then((snapshot) => {
                console.log(snapshot);
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    axios.post(`${process.env.REACT_APP_API_URL1}/api/merchant/MercAdd`,
                        {
                            Location: [bod.lattitude, bod.longitude],
                            MerchantName: name,
                            uid: localStorage.getItem('uid'),
                            ShopType: ShopCat,
                            ShopName: ShopName,
                            ShopImage: downloadURL,
                        }, {
                        headers: headers
                    }
                    ).then(response => {
                        document.getElementsByClassName('loaderbap')[0].style.display='flex';
                        document.getElementsByClassName('Addstickymerc')[0].style.display = 'none'
                    })
                        .catch(error => {
        document.getElementsByClassName('loaderbap')[0].style.display='none';
                            alert('Error')
                        });
                });
            });
        }
        else { alert('Enter All the Fields') }
    }
    function searcher() {
        console.log('clicked')
        let valuer = document.getElementById('itemsearch').value;
        window.location.href = `/Shops/Search/${valuer}`;
    }
    return <div className='Navbarbap'>
        {/* <div id="loader" style={{display:loading?'block':'none'}} >
            <img src='/Images/loader.gif' alt="" />
    </div> */}
        <div className="loaderbap">
            <div class="loader"></div>
        </div>
        <div className='navbarin1'>
            <div className='navlist navwrap'>
                <div className='logo'>
                    <div className='logotext'>DC</div>
                </div>
                <div className='navcol'>
                    <div className='logoname'>DigiCart</div>
                    <div className='slogan'>Buy from Your Trusted Ones</div>
                </div>
            </div>
            <div className='navlistitem'>
                <div className='navlist'>
                    <div onClick={() => {
                        if (!auth)
                            history('/signup'); else { opa(0); history('/') }
                    }} className='navitem'>Home</div>
                    <div onClick={() => { opa(1); history('/Shops') }} className='navitem'>Shops</div>
                    <div style={{ display: auth ? 'none' : 'block' }} onClick={() => { opa(2); history('/login') }} className='navitem'>Sign In</div>
                    <div style={{ display: auth ? 'none' : 'block' }} onClick={() => { opa(3); history('/signup') }} className='navitem'>Sign Up</div>
                    <div style={{ display: auth ? 'block' : 'none' }} onClick={() => { opa(4); checkmerc() }} className='navitem'>Merchant</div>
                    <div style={{ display: auth ? 'block' : 'none' }} onClick={async () => {
                        await signOut(authw).then(() => {
                            localStorage.removeItem('token');
                            setauth(false);
                            loggedout = true;
                            console.log(auth)
                            console.log(localStorage.getItem('token') != undefined)
                            history('/login')
                            // Sign-out successful.
                        }).catch((error) => {
                            // An error happened.
                        });
                    }} className='navitem'> Logout </div>
                </div>
            </div>
        </div>
        <div>
            <div className='search'>
                <input placeholder='Search' id='itemsearch' /><i onClick={() => searcher()} class="fas fa-search"></i><br />
            </div>
        </div>
        <div className='addmerc'>
            <div onClick={() => { document.getElementsByClassName('addmerc')[0].style.display = 'none' }} className="timesadd"><i class="far fa-times-circle"></i></div>
            <input accept="image/png, image/jpeg" className='uploading'
                onChange={(event) => { uploadimg = true; setImage(event.target.files[0]); setUpload("url(" + URL.createObjectURL(event.target.files[0]) + ")") }}
                style={{ backgroundImage: upload, backgroundColor: 'none' }} type="file" required />
            <table>
                <tr>
                    <td>Merchant Name : <input id='mernameadd' placeholder='Enter Your Name'></input></td>
                    <td>Shop Name : <input id='mercshopnam' placeholder='Enter Your Shop Name'></input></td>
                </tr>
                <tr>
                    <td>Shop Category : <input id='merccat' placeholder='Enter Your Shop Category'></input></td>
                    <td></td>
                </tr>
                <tr>
                    <td><button onClick={() => { checkloc() }}>Check Location</button></td>
                    <td>Your Location : <div id='enterloc'>{bod.lattitude},{bod.longitude}</div></td>
                </tr>
            </table>
            <button onClick={() => { mercadder() }}>Proceed</button>
        </div>
    </div>
}
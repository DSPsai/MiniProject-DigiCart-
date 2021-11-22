import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import ItemCard from '../Components/ItemCard';
import '../Components/Merc.css'
import axios from 'axios'
import { db, storage } from '../Resources/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();
export default function MercHome() {
    const history = useNavigate();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [uid, setuid] = useState(localStorage.getItem('uid'));
    const [items, setItems] = useState([])
    const [shopname, setshopname] = useState('ShopName');
    const [mercname, setmercname] = useState('MerchantName');
    const [mercimg, setmercimg] = useState('');
    var [upload, setUpload] = useState(`url('./Images/Upload.webp')`);
    var [image, setImage] = useState();
    const [myOrders,setorders]=useState([]);
    useEffect(() => {
        if (token !== undefined) {
            db.collection("ShopList").doc(uid).collection('Shop').onSnapshot((snapshot) => {
                setItems(snapshot.docs.map((snap) => {
                    let temp = snap.data()
                    temp.docid = snap.id;
                    console.log(temp)
                    return temp
                }))
            });
            db.collection("MerchantList").doc(uid).onSnapshot((snapshot) => {
                setmercname(snapshot.data().MerchantName)
                setshopname(snapshot.data().ShopName)
                setmercimg(snapshot.data().ShopImage)
            })
            const authw = getAuth();
            onAuthStateChanged(authw, (user) => {
                if (user) {
                    setToken(user.accessToken);
                    setuid(user.uid);
                    localStorage.setItem('token', user.accessToken)
                    localStorage.setItem('uid', user.uid)
                } else {
                    history('/login');
                    localStorage.removeItem('uid');
                    localStorage.removeItem('token');
                    localStorage.removeItem('auth');
                }
            });
            db.collection("MerchantList").doc(localStorage.getItem('uid')).collection('Buffer').onSnapshot((snapshot) => {
                // setorders(snapshot.data());
                setorders(snapshot.docs.map((snap) => {
                    let temp = snap.data()
                    temp.docid = snap.id;
                    console.log(temp)
                    return temp
                }))
            })
        } else {
            history('/login');
            localStorage.removeItem('uid');
            localStorage.removeItem('token');
            localStorage.removeItem('auth');
        }
    }, []);
    function uploader() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        let itemName = document.getElementById('itemName').value;
        let itemWeight = document.getElementById('itemWeight').value;
        let itemUnits = document.getElementById('itemUnits').value;
        let itemCat = document.getElementById('itemCat').value;
        let itemBrand = document.getElementById('itemBrand').value;
        let itemPrice = document.getElementById('itemPrice').value;
        if (uploadimg || itemName.length > 2 || itemWeight.length > 0 || itemUnits.length > 0 || itemCat.length > 2 || itemBrand.length > 2 || itemPrice.length > 0) {
        document.getElementsByClassName('loaderbap')[0].style.display='flex';
        const storageRef = ref(storage, '/ShopImages/' + uid + new Date());
            const uploadTask = uploadBytes(storageRef, image).then((snapshot) => {
                console.log(snapshot);
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    axios.post(`${process.env.REACT_APP_API_URL1}/api/merchant/Product`,
                        {
                            itemName: itemName,
                            itemWeight: itemWeight,
                            itemCount: itemUnits,
                            itemBrand: itemBrand,
                            itemCat: itemCat,
                            itemPhotoUrl: downloadURL,
                            itemPrice: itemPrice
                        }, {
                        headers: headers
                    }
                    ).then(response => {
                        document.getElementsByClassName('loaderbap')[0].style.display='none';
                        document.getElementsByClassName('Addstickymerc')[0].style.display = 'none'
                    })
                        .catch(error => {
                            document.getElementsByClassName('loaderbap')[0].style.display='none';
                        });
                });
            });
        }
        else {
            alert('Please Enter All the Feilds and Make sure to Select a Photo')
        }
    }
    var uploadimg = false;
    function Add() {
        return <div className='Addstickymerc'>
            <div onClick={() => { document.getElementsByClassName('Addstickymerc')[0].style.display = 'none' }} className="timesadd"><i class="far fa-times-circle"></i></div>
            <input accept="image/png, image/jpeg" className='uploading'
                onChange={(event) => { uploadimg = true; setImage(event.target.files[0]); setUpload("url(" + URL.createObjectURL(event.target.files[0]) + ")") }}
                style={{ backgroundImage: upload, backgroundColor: 'none' }} type="file" required />
            <table>
                <tr>
                    <td>Item Name : <input id='itemName' placeholder='ItemName'></input></td>
                    <td>Item Price : <input id='itemPrice' placeholder='ItemPrice'></input></td>
                </tr>
                <tr>
                    <td>Item Brand : <input id='itemBrand' placeholder='ItemBrand'></input></td>
                    <td>Single Item weight : <input id='itemWeight' placeholder='ItemWeight'></input></td>
                </tr>
                <tr>
                    <td>Item Category : <input id='itemCat' placeholder='ItemCategory'></input></td>
                    <td>Item Total Units : <input id='itemUnits' placeholder='ItemUnits'></input></td>
                </tr>
            </table>
            <button onClick={() => uploader()}>Add</button>
        </div>
    }
    function deleter() {
        return <div className="deletedialog">
            <div onClick={() => { document.getElementsByClassName('deletedialog')[0].style.display = 'none' }} className="timesadd"><i class="far fa-times-circle"></i></div>
            Are You Sure ? You Want to Delete <b><span id='deletedialogName'></span></b> ?
            <br /><div id='ider' style={{ display: 'none' }}></div>
            <div className='buttonsaddmerc'>
                <button onClick={() => { document.getElementsByClassName('deletedialog')[0].style.display = 'none' }} >Calcel</button>
                <button onClick={() => pakkadelete()}>Delete</button>
            </div>
        </div>
    }
    async function pakkadelete() {
        document.getElementsByClassName('loaderbap')[0].style.display='flex';
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        let ider = document.getElementById('ider').innerHTML;
        axios.delete(`${process.env.REACT_APP_API_URL1}/api/merchant/Product`,{
            headers: headers,
            data: {
                docid: ider
            }
          }
        ).then(response => {
            document.getElementsByClassName('loaderbap')[0].style.display='none';
            document.getElementsByClassName('deletedialog')[0].style.display = 'none'
        })
            .catch(error => {
                document.getElementsByClassName('loaderbap')[0].style.display='none';
                document.getElementsByClassName('deletedialog')[0].style.display = 'none'
            });
    }
    function delor(id){
        document.getElementsByClassName('loaderbap')[0].style.display='flex';
        console.log(id)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        axios.post(`${process.env.REACT_APP_API_URL1}/api/merchant/MercBufDel`,
            {
                docid:id
            }, {
            headers: headers
        }
        ).then(response => {
            document.getElementsByClassName('loaderbap')[0].style.display='none';
        })
            .catch(error => {
                document.getElementsByClassName('loaderbap')[0].style.display='none';
            });
    }
    return (
        <div>
            <div className='singleshopPage'>
                {Add()}{deleter()}
                {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
                <div className="shoplabel">
                    <img src={mercimg} alt="ShopImage" />
                    <div className="row">
                        <div className="shopname">{shopname}</div>
                        <div className="shopowner">By {mercname}</div>
                    </div>
                </div>
            <div className="notification">
                {myOrders.length>0?<table>
                    <tr>
                        <th>Name  </th>
                        <th>Total Amount   </th>
                        <th>Items  </th>
                        <th>Items Quantity  </th>
                        <th>Address  </th>
                    </tr>
                {myOrders.map(order=>{
                   return <tr className='singleorder'> 
                        <td>{order.name}</td>
                        <td>{order.totalprice}</td>
                        <td><div>{order.items.join(' , ')}</div></td>
                        <td>{order.no}</td>
                        <td>{order.address}</td>
                        <td onClick={()=>delor(order.docid)} className='addmercitem'><button>Delivered</button></td>
                    </tr>
                })}
                </table>:<></>}
            </div>
                <div className='addmercitem'><button onClick={() => { document.getElementsByClassName('Addstickymerc')[0].style.display = 'block' }} >Add</button></div>
                <div className='shopitemslabel'>Shop Items : </div>
                <div className="items">
                    {items.map(item => {
                        return <ItemCard
                            key={item.id}
                            ider={item.docid}
                            itemPhotoUrl={item.itemPhotoUrl}
                            itemBrand={item.itemBrand}
                            itemName={item.itemName}
                            itemWeight={item.itemWeight}
                            itemCount={item.itemCount}
                            itemPrice={item.itemPrice}
                            itemCat={item.itemCat}
                            merchant={true}
                        />
                    })}
                </div>
                <div className="stickyprice"></div>
            </div>
        </div>
    )
}

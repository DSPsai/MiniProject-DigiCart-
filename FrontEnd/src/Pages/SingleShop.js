import React, { useEffect, useState } from 'react'
import ItemCard from '../Components/ItemCard';
import { db, storage } from '../Resources/firebase';
import './Singleshop.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function SingleShop() {
    const history = useNavigate();
    let postdat = {
        "uid": " "
    }
    let str = window.location.href;
    let res = str.split("/");
    postdat.uid = res[(res.length) - 1];
    const [items, setItems] = useState([])
    const [shopname, setshopname] = useState('ShopName');
    const [mercname, setmercname] = useState('MerchantName');
    const [mercuid, setmercuid] = useState('');
    const [useradd, setuseradd] = useState('')
    const [shopimg, setshopimg] = useState('');
    useEffect(() => {
        localStorage.setItem('items','[]')
        db.collection("ShopList").doc(postdat.uid).collection('Shop').onSnapshot((snapshot) => {
            setItems(snapshot.docs.map((snap) => {
                let temp = snap.data()
                temp.docid = snap.id;
                console.log(temp)
                return temp
            }))
        })
        db.collection("MerchantList").doc(postdat.uid).onSnapshot((snapshot) => {
            setmercname(snapshot.data().MerchantName)
            setshopname(snapshot.data().ShopName)
            setmercuid(snapshot.data().uid)
            setshopimg(snapshot.data().ShopImage)
        })
        db.collection("Users").doc(localStorage.getItem('uid')).onSnapshot((snapshot) => {
            try{setuseradd(snapshot.data().address)}catch(e){setuseradd('')}
            // console.log(snapshot.data().address)
        })
    }, [])
    const Address = () => {
        return <div style={{ textAlign: 'initial' }} className="addcheck deletedialog">
            <div onClick={() => { document.getElementsByClassName('deletedialog')[0].style.display = 'none' }} className="timesadd"><i class="far fa-times-circle"></i></div>
            <b>Your Address :</b> <br />
            <textarea className='addresstext' 
            name='Address'
            // onChange={()=>console.log(document.getElementsByClassName('addresstext')[0].value)}
            rows={20} cols={30}>{useradd}</textarea>
            <br />
            <div className="butadd"><button onClick={()=>checkoutadd()} className='latestbut'>Proceed</button></div>
        </div>
    }
    async function checkoutadd() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        let jitem=await JSON.parse(`${localStorage.getItem('items')}`)
        console.log(jitem)
        axios.post(`http://localhost:5000/api/User/AddCart`,
            {
                ShopRef:mercuid,
                ShopName:mercname,
                Items:jitem,
                address:document.getElementsByClassName('addresstext')[0].value
            }, {
            headers: headers
        }
        ).then(response => {
            localStorage.setItem('items','[]')
            localStorage.setItem('razorpay_id',response.data.id)
            localStorage.setItem('merchant_uid',mercuid)
            localStorage.setItem('mercShop_name',shopname)
            history('/Checkout')
        })
            .catch(error => {
                alert('Error')
            });
    }
    return (
        <div className='singleshopPage'>
            {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
            <div className="shoplabel">
                <img src={shopimg} alt="ShopImage" />
                <div className="row">
                    <div className="shopname">{shopname}</div>
                    <div className="shopowner">By {mercname}</div>
                </div>
            </div>
            {/* <div className='catlabels'>
                <div className='catlabel catlabelactive'>Diary</div>
                <div className='catlabel'>Grocery</div>
                <div className='catlabel'>Flour</div>
                <div className='catlabel'>Cool Drinks</div>
            </div> */}
            <div className="items">
                {items.map(item => {
                    return <ItemCard
                    key={item.id}
                        itemPhotoUrl={item.itemPhotoUrl}
                        itemBrand={item.itemBrand}
                        itemName={item.itemName}
                        itemWeight={item.itemWeight}
                        itemCount={item.itemCount}
                        itemPrice={item.itemPrice}
                        itemCat={item.itemCat}
                        ider={item.docid}
                    />
                })}
            </div>
            <Address />
            <div className="stickyprice">
                <div className='stickytotprice'>Total : <div id="totprice">{0}</div><button onClick={() => { document.getElementsByClassName('deletedialog')[0].style.display = 'block' }} id="checkout">Checkout</button></div>
            </div>
        </div>
    )
}

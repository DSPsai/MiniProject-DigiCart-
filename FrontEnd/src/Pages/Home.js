import React, { useState, useEffect } from 'react'
import './Home.css'
import { db, storage } from '../Resources/firebase';
import { useNavigate } from "react-router-dom";
export default function Home() {
    const history = useNavigate();
    const [shoplists, setShopList] = useState([])
    const [NewOpen, setNewOpen] = useState([])
    const [Recent, setRecent] = useState([])
    const dummy = [
        { name: 'name1', type: 'generalstore', img: "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name2', type: 'superstore', img: "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHNob3B8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name3', type: 'medicalstore', img: "https://image.shutterstock.com/image-photo/shopping-kids-during-virus-outbreak-260nw-1677576121.jpg" },
        { name: 'name1', type: 'generalstore', img: "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name2', type: 'superstore', img: "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHNob3B8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name3', type: 'medicalstore', img: "https://image.shutterstock.com/image-photo/shopping-kids-during-virus-outbreak-260nw-1677576121.jpg" },
        { name: 'name1', type: 'generalstore', img: "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name2', type: 'superstore', img: "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHNob3B8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name3', type: 'medicalstore', img: "https://image.shutterstock.com/image-photo/shopping-kids-during-virus-outbreak-260nw-1677576121.jpg" },
        { name: 'name1', type: 'generalstore', img: "https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name2', type: 'superstore', img: "https://images.unsplash.com/photo-1515706886582-54c73c5eaf41?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHNob3B8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80" },
        { name: 'name3', type: 'medicalstore', img: "https://image.shutterstock.com/image-photo/shopping-kids-during-virus-outbreak-260nw-1677576121.jpg" }
    ]
    useEffect(async () => {
        if (localStorage.getItem('token') != undefined) {
        document.getElementsByClassName('loaderbap')[0].style.display = 'flex';
            await db.collection("MerchantList").onSnapshot((snapshot) => {
                setShopList(snapshot.docs.map((doc) => ({
                    name: doc.data().ShopName,
                    ShopUID: doc.data().uid,
                    type: doc.data().ShopType,
                    img: doc.data().ShopImage
                })
                ))
                setNewOpen(snapshot.docs.map((doc) => ({
                    name: doc.data().ShopName,
                    ShopUID: doc.data().uid,
                    type: doc.data().ShopType,
                    img: doc.data().ShopImage
                })
                ))
            })
            await db.collection("Users").doc(localStorage.getItem('uid')).collection("Recent").onSnapshot(async (snapshot) => {
                let temp = []
                async function geter() {
                    for (let doc of snapshot.docs) {
                        const snapsho = await db.collection('MerchantList').doc(doc.data().ShopID).get()
                        console.log(snapsho.data())
                        temp.push({
                            img: snapsho.data().ShopImage,
                            name: snapsho.data().ShopName,
                            ShopUID: snapsho.data().uid,
                            type: snapsho.data().ShopType
                        })
                    }
                    document.getElementsByClassName('loaderbap')[0].style.display = 'none';
                    return temp;
                }
                setRecent(await geter())
            })
        }
    }, [])
    function shoplist(shops) {
        return shops.map((shop) => {
            return <div onClick={() => { history(`/Shop/${shop.ShopUID}`) }} className='shopcard'>
                <img src={shop.img}></img>
                <div className="shopname">{shop.name}</div>
                <div className="shoptype">{shop.type}</div>
            </div>
        })
    }
    return (
        <>
            <div className="homepage">
                <div className="text">Shop List<div className='addmercitem'><button onClick={() => { history('/Shops') }} > More </button></div></div>
                <div className="shoplists">
                    <div className='shoplist'>
                        {shoplist(shoplists)}
                    </div>
                </div><br />
                <div className="text">Newly Opened Near Your Location</div>
                <div className="shoplists">
                    <div className='shoplist'>
                        {shoplist(NewOpen)}
                    </div>
                </div><br />
                <div className="text">Recently Purchased From</div>
                <div className="shoplists">
                    <div className='shoplist'>
                        {shoplist(Recent)}
                    </div>
                </div><br />
                <div className="text">Dummy Shops For Demo</div>
                <div className="shoplists">
                    <div className='shoplist'>
                        {shoplist(dummy)}
                    </div>
                </div><br />
            </div>
        </>
    )
}

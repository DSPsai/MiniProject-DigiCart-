import React, { useState, useEffect } from 'react'
import ItemCard from '../Components/ItemCard'
import { db } from '../Resources/firebase'
export default function Search() {
    // const [shops, setShops] = useState([])
    // useEffect(async() => {
    //     const citiesRef = db.collection('MerchantList');
    //     const snapshot = await citiesRef.where('MerchantName', 'array-contains', 'Sai Prudhvi').get();
    //     if (snapshot.empty) {
    //         console.log('No matching documents.');
    //         return;
    //     }

    //     snapshot.forEach(doc => {
    //         console.log(doc.id, '=>', doc.data());
    //     });
    // }, [])
    var [data, setData] = useState([]);
    let postdat = {
        "link": " "
    }
    let str = window.location.href;
    let res = str.split("/");
    postdat.link = decodeURI(res[res.length - 1]);
    async function fetchData() {
        document.getElementsByClassName('loaderbap')[0].style.display='flex';
        console.log(postdat.link)
        async function getMarker() {
            const snapshot = await db.collection('Users').get()
            let uids = []
            snapshot.docs.map((doc) => uids.push(doc.id))
            const ref = db.collection('ShopList');
            let shop = '';
            let temp = []
            const getData = async () => await uids.map(async (id) => {
                shop = await ref.doc(id).collection('Shop').get()
                await shop.docs.map(async (shopa) => {
                    let found = (await Object.values(shopa.data()).join(' ').toLowerCase()).match(postdat.link.toLowerCase());
                    if (found != null) {
                        let temper = shopa.data()
                        temper.docid = id;
                        temp = temp.concat(temper)
                    }
                })
                // await setData(temp)
                // const result = await temp.find( item  => item.itemCount === '1000');
                // console.log(temp.find( item  => item.itemCount === '1000'))
                setData(temp)
                document.getElementsByClassName('loaderbap')[0].style.display='none';
            });
            await getData().then(() => { });
        }
        await getMarker()
    }
    useEffect(async () => {
        await fetchData()
    }, []);
    return (
        <div className='Search_Page'>
            <h2>Results for '{postdat.link}'</h2>
            <div className='items'>
                {data.map(item => {
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
                        bol={true}
                        docid={item.docid}
                    />
                })}</div>
        </div>
    )
}

import React,{useState,useEffect} from 'react'
import { db, storage } from '../Resources/firebase';
export default function Orders() {
    useEffect(() => {
        db.collection("Users").doc(localStorage.getItem('uid')).collection('Orders').onSnapshot((snapshot) => {
            // setorders(snapshot.data());

            setorders(snapshot.docs.map((snap) => snap.data()))
        })
    }, [])
    const [myOrders,setorders]=useState([
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan','item1+quan','item2+quan','item3+quan','item1+quan','item2+quan','item3+quan','item1+quan','item2+quan','item3+quan','item1+quan','item2+quan','item3+quan','item1+quan','item2+quan','item3+quan','item1+quan','item2+quan','item3+quan',],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
        {name:'name1',no:'10',totalprice:'999',items:['item1+quan','item2+quan','item3+quan'],address:'24-156/9/18/1,vimaladevi nagar, malkajgiri'},
    ]);
    return (
        <div className='notification'>
        <table>
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
            </tr>
        })}
        </table>
        </div>
    )
}

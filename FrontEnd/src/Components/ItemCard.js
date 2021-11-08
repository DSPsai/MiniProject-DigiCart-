import { deleteUser } from '@firebase/auth';
import React, { useState, useEffect } from 'react'
var totcount = 0;
export function gettot() {
    return totcount;
}
export default function ItemCard(item) {
    let [count, setCount] = useState(0);
    function minus() {
        let items=localStorage.getItem('items');
        if(items === undefined)localStorage.setItem('items','[]')
        if (count == 0) {
            alert('Count Invalid')
        } else {
            let jitem=JSON.parse(`${items}`)
            for(let i of jitem){
                if(i.DocId == item.ider){
                    i.itemCount=i.itemCount-1;
                    if(i.itemCount==0)jitem.pop(i)
                    break
                }
            }
            localStorage.setItem('items',JSON.stringify(jitem))
            console.log(jitem,localStorage.getItem('items'))
            setCount(count - 1)
            document.getElementById('totprice').innerHTML = parseInt(document.getElementById('totprice').innerHTML) - parseInt(item.itemPrice)
            if(parseInt(document.getElementById('totprice').innerHTML)==0)document.getElementById('checkout').style.display = 'none'
        }
    }
    useEffect(() => {
    }, [])
    function plus() {
        let items=localStorage.getItem('items');
        if(items === undefined)localStorage.setItem('items','[{"DocId": "","itemCount": "0"}]')
        let jitem=JSON.parse(`${items}`)
        let found=false;
        for(let i of jitem){
            if(i.DocId == item.ider){
                i.itemCount=i.itemCount+1;
                found=true;
                break
            }
        }
        if(!found){jitem.push({DocId:item.ider,itemCount:1})}
        localStorage.setItem('items',JSON.stringify(jitem))
        console.log(jitem,localStorage.getItem('items'))
        document.getElementById('checkout').style.display = 'block'
        setCount(count + 1)
        document.getElementById('totprice').innerHTML = parseInt(document.getElementById('totprice').innerHTML) + parseInt(item.itemPrice)
    }
    function deleter() {
        console.log(totcount)
        document.getElementsByClassName('deletedialog')[0].style.display = 'block'
        document.getElementById('ider').innerHTML = item.ider;
        document.getElementById('deletedialogName').innerHTML = item.itemName
    }
    return (
        <div className='itemCard'>
            <div className="shopimg"><img src={item.itemPhotoUrl} /></div>
            <div className="itemBrand">{item.itemBrand}</div>
            <div className="itemName">{item.itemName}</div>
            <div className="itemWeight">{item.itemWeight}</div>
            <div className="itemCount">Available Units: {item.itemCount}</div>
            <div className="itemCat">
                {item.itemCat}
                <div className="itemprice">{item.itemPrice}/-</div>
            </div>{()=>{console.log(item.ider)}}
            {item.merchant ? <div className='itemdelete'>
                <i onClick={() => deleter()} class="fas fa-trash-alt"></i>
            </div> : <div className="itemtot">
                <div className="itemtotcount">
                    <i onClick={() => { minus() }} class="far fa-minus-square"></i>
                    <div className="itemcountin">{count}</div>
                    <i onClick={() => { plus() }} class="far fa-plus-square"></i>
                </div>
                <div className="totalitemcost">
                    <div className="totlab"> Total : &ensp;</div>{count * item.itemPrice}/- </div>
            </div>
            }
        </div>
    )
}

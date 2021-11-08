import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
export default function Custmar(props) {
    const history = useNavigate();
    let [hover,sethover]=useState(false);
    return (
        <button className="crime-marker" style={{zIndex:hover?'999':'1',position:hover?'relative':'initial'}}>
            <div onClick={()=>history(`/Shop/${props.uid}`)}  className='shopmapsingle' onMouseLeave={()=>sethover(false)} onMouseOver={()=>sethover(true)}>
                <div className='mapshopName'><img src={props.image} alt="crime doesn't pay" />{props.name}</div>
                <div className='mapshopCat'>{props.category}</div>
            </div>
        </button>
    )
}


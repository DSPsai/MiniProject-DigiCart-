import React, { useState } from 'react'

export default function Custmar(props) {
    let [hover,sethover]=useState(false);
    return (
        <button className="crime-marker" style={{zIndex:hover?'999':'1',position:hover?'relative':'initial'}}>
            <div className='shopmapsingle' onMouseLeave={()=>sethover(false)} onMouseOver={()=>sethover(true)}>
                <div className='mapshopName'><img src="https://i.pinimg.com/originals/21/17/7c/21177c2546b4849f53234ac64a3e4232.png" alt="crime doesn't pay" />{props.name}</div>
                <div className='mapshopCat'>{props.category}</div>
            </div>
        </button>
    )
}


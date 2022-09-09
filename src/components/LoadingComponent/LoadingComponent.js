import React from 'react';
import './Loading.css'



export const LoadingComponent = () => {
  return (
    <>
    <div className='divPadre'>
      <div className='divHijo'>
        <img src='./logo144.png'></img>
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
          <h1 className='letter'>LOADING...</h1>
      </div>
    </div>
    </>
  )
}

export default LoadingComponent;

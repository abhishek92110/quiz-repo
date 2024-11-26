import React from 'react'
import loadingImg from '../image/quiz-loading.gif'

const Loading = () => {
  return (
    <div className='loading-section'>
        <img src={loadingImg}/>
    </div>
  )
}

export default Loading
import React from 'react'
import { Tilt } from 'react-tilt'
import './tilt-style.scss'

const defaultOptions = {
    reverse: false,
    max: 90,
    perspective: 1000,
    scale: 1.1,
    speed: 500,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
}

export default function Carousel3D() {
    return (
        <div className='carousel-wrapper'>
            <Tilt options={defaultOptions} style={{ height: 500, width: 500 }} className='carousel-content'>
                <div >👽</div>
            </Tilt>
        </div>
    )
}

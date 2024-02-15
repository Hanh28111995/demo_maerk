import React from 'react'

export default function FirstSection() {
    const handleJumpToContent = () => {
        document.querySelector('.button--hero')?.addEventListener('click', () => {
            const element = document.querySelector('.second')
            window.scrollTo({ top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth' })
        })
    }
    return (
        <section className="section first">
            <div className="section--one--container">
                <h1>Perfect Drill</h1>
                <p>Variable speed for ultimate fingertip control for all drilling applications. Reverse brush system for full torque and power in forward and reverse, lock-on button for continuous use.</p>
                <button className="button--hero" onClick={() => handleJumpToContent()}>KNOW MORE</button>
            </div>
        </section>
    )
}

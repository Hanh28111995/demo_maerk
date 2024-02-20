import React from 'react'

export default function ThirdSection(props) {
    const handleGoTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            <section className="section third">
                <div className="section--third--container">
                    <h2>Wood and metal</h2>
                    <p>Supports wood and metal drilling. Metal drill bits are not part of the included components with the product. Metal drill bits can be procured by the customer and can be used for drilling into metal surfaces</p>
                    <button className="button--customize" onClick={() => props.triggerPreview()}>CUSTOMIZE</button>
                </div>
            </section>
            <footer >
                <button className="button--footer" onClick={() => handleGoTop()}>BACK TO TOP</button>
            </footer>
        </>
    )
}

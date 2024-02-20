import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

export const scrollAnimation = (position_obj1, target_obj1, position_obj2, target_obj2, position_obj3, target_obj3, isMobile, onUpdate, onUpdateSlideCam) => {


    var lastScrollTop = 0;
    let ticking = false;

    function update() {
        ticking = false;
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
            onUpdate(true, lastScrollTop, st)
        } else if (st < lastScrollTop) {
            onUpdate(true, lastScrollTop, st)
        } // else was horizontal scroll
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update)
        }
        ticking = true;
    }

    function onScroll() {
        requestTick();
    }

    window.addEventListener('scroll', onScroll, false)



    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();

    // tl.to('.section--one--container', {
    //     xPercent: '-150', opacity: 0,
    //     scrollTrigger: {
    //         trigger: '.second',
    //         start: 'top bottom',
    //         end: 'top 80%',
    //         scrub: 1,
    //         immediateRender: false
    //     },
    // })
    // tl.from('.section--two--container', {
    //     xPercent: '100', opacity: 0,
    //     scrollTrigger: {
    //         trigger: '.second',
    //         start: 'top bottom',
    //         end: '150% bottom',
    //         scrub: 1,
    //         immediateRender: false
    //     },
    // })
    // tl.from('.section--third--container', {
    //     xPercent: '-100', opacity: 0,
    //     scrollTrigger: {
    //         trigger: '.third',
    //         start: 'top bottom',
    //         end: '150% bottom',
    //         scrub: 1,
    //         immediateRender: false
    //     },
    // })
    tl.to(position_obj2, {
        x: 0,
        y: 0,
        z: 0,
        scrollTrigger: {
            trigger: '.first',
            start: 'top bottom',
            end: 'bottom',
            scrub: true,
            immediateRender: true
        },
    })
        .to(target_obj2, {
            x: 0,
            y: 0,
            z: 0,
            scrollTrigger: {
                trigger: '.first',
                start: 'top bottom',
                end: 'bottom',
                scrub: true,
                immediateRender: false
            },
        })

    tl.to(target_obj3, {
        x: 0,
        y: 5,
        z: 0,
        scrollTrigger: {
            trigger: '.first',
            start: 'top bottom',
            end: 'bottom ',
            scrub: true,
            immediateRender: false,
        },

    })
    //     .to(position_obj3, {
    //         x: 0,
    //         y: 25,
    //         z: 0,
    //         duration: 0.1,
    //         scrollTrigger: {
    //             trigger: '.App',
    //             start: 'top bottom',
    //             end: 'bottom',
    //             scrub: true,
    //             immediateRender: false
    //         },
    //         // onUpdateSlideCam
    //     })

    //     .to(position, {
    //         x: -3.4,
    //         y: 9.6,
    //         z: 1.71,
    //         scrollTrigger: {
    //             trigger: '.third',
    //             start: 'top bottom',
    //             end: '150% bottom',
    //             scrub: true,
    //             immediateRender: false
    //         },
    //         onUpdate,
    //     })
    //     .to(target, {
    //         x: -1.5,
    //         y: 2.13,
    //         z: -0.4,
    //         scrollTrigger: {
    //             trigger: '.third',
    //             start: 'top bottom',
    //             end: '150% bottom',
    //             scrub: true,
    //             immediateRender: false
    //         },
    //     })
}
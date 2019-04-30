const projectCountP = fetch('https://solidata-api.co-demos.com/api/dsi/infos/get_one/5c7f0438328ed72e431f338e')
  .then(r => r.json())
  .then(r => r.data.data_raw.f_data_count);


projectCountP.then(projectCount => {
    const start = performance.now();
    const DELAY = 5000;
    const counter = document.querySelector('.counter')
    (function step(){
        requestAnimationFrame(now => {
            const elapsed = now - start;
            let fraction = elapsed/DELAY;
            if(fraction >=1)
                fraction = 1;
            // ease out expo to stabilize the significative numbers quickly
            const toDisplay = projectCount * (1- (fraction === 1 ? 0 : Math.pow(2, -10*fraction)));

            counter.textContent = Math.round(Math.max(0, toDisplay));

            if(fraction <1){
                step();
            }
        })
    })();
})

// témoignages
/*
    let shift = 0;
    const SHIFT_UNIT = 17; // em
    const TESTIMONY_COUNT = document.querySelectorAll('#témoignages ul.caroussel-content li').length;
    const TESIMONY_SHOWN = 3;

    const carousselContainer = document.querySelector('#témoignages .caroussel-content')
    const nextButton = document.querySelector('#témoignages .caroussel .next')
    const previousButton = document.querySelector('#témoignages .caroussel .previous')

    previousButton.addEventListener('click', e => {
        if(shift >= 1)
            shift -= 1;
        carousselContainer.style.transform = `translateX(-${shift*SHIFT_UNIT}em)`
    })

    nextButton.addEventListener('click', e => {
        if(shift < TESTIMONY_COUNT-TESIMONY_SHOWN)
            shift += 1;
        carousselContainer.style.transform = `translateX(-${shift*SHIFT_UNIT}em)`
    })
    */

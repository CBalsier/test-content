console.log("hello world from script"); 

const projectCountP = fetch('https://solidata-api.co-demos.com/api/dsi/infos/get_one/5c7f0438328ed72e431f338e')
  .then(r => r.json())
  .then(r => r.data.data_raw.f_data_count);

document.addEventListener('DOMContentLoaded', e => {

  projectCountP.then(projectCount => console.log(projectCount));
  const DELAY = 1000;
  const counter = document.querySelector('.counter')
  projectCountP.then(projectCount => {
    const start = performance.now();
    
    (function step(){
      requestAnimationFrame(now => {
        const elapsed = now - start;
        let fraction = elapsed/DELAY;
        if(fraction >=1)
          fraction = 1;
        const toDisplay = projectCount * (1- (fraction === 1 ? 0 : Math.pow(2, -10*fraction)));
        
        counter.textContent = Math.round(Math.max(0, toDisplay));
        
        if(fraction <1){
          console.log(counter.textContent, " is counter");
          step();
        }
      })
    })();
    console.log(projectCount);
  })

})
console.log("the end");

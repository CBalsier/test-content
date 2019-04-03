console.log("hello world from script"); 

const projectCountP = fetch('https://solidata-api.co-demos.com/api/dsi/infos/get_one/5c7f0438328ed72e431f338e')
  .then(r => r.json())
  .then(r => r.data.data_raw.f_data_count)

console.log(projectCountP)

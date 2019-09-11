(function(){
    const main=document.getElementById('numDevices')
    setInterval(()=>{
        main.innerText=''
        fetch('/api/deviceCount')
            .then((resp)=>{return resp.json()})
            .then((json)=>{main.innerText=JSON.stringify(json)})
        }, 2500);
})()
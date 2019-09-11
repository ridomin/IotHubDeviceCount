(()=>{
    const main=document.getElementById('numDevices')
    const time=document.getElementById("currentTime")
    setInterval(()=>{
        //main.innerText=''
        currentTime.innerText=new Date().toLocaleTimeString()
        fetch('/api/deviceCount')
            .then((resp)=>{return resp.json()})
            .then((json)=>{main.innerText=JSON.stringify(json)})
        }, 1000);
})()
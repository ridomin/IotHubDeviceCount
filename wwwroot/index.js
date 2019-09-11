(()=>{
    const numDevices=document.getElementById('numDevices')
    const time=document.getElementById("currentTime")
    setInterval(()=>{
        //numDevices.innerText=''
        currentTime.innerText=new Date().toLocaleTimeString()
        fetch('/api/deviceCount')
            .then((resp)=>{return resp.json()})
            .then((json)=>{numDevices.innerText=JSON.stringify(json)})
        }, 1000);
})()
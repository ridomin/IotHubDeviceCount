(()=>{
fetch('/api/connection-string')
    .then((resp)=>{return resp.json()})
    .then((json)=>{
        connectionstring.value=json
        setInterval(()=>{
            currentTime.innerText=new Date().toLocaleTimeString()
            fetch('/api/deviceCount')
                .then((resp)=>{return resp.json()})
                .then((json)=>{
                    numDevices.innerText=json
                })
            }, 1000);
        })
})()
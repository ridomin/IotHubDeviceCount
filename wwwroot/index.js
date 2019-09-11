(()=>{
    const numDevices=document.getElementById('numDevices')
    const inputCS=document.getElementById('connectionstring')

    let connectionString = ''

    fetch('/api/connection-string')
        .then((resp)=>{return resp.json()})
        .then((json)=>{
            connectionString=JSON.stringify(json)
            let isConfigured=connectionString.length>0
            console.log(connectionString)
            inputCS.value=connectionString
            setInterval(()=>{
                currentTime.innerText=new Date().toLocaleTimeString()
                fetch('/api/deviceCount')
                    .then((resp)=>{return resp.json()})
                    .then((json)=>{numDevices.innerText=json})
                }, 1000);
            })
})()
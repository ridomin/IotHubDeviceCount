(()=>{
    const numDevices=document.getElementById('numDevices')
    const time=document.getElementById("currentTime")
    const form = document.getElementById('form')
    const inputCS=document.getElementById('connectionstring')

    let isConfigured = false
    let connectionString = ''

    fetch('/api/connection-string')
        .then((resp)=>{return resp.json()})
        .then((json)=>{
            connectionString=JSON.stringify(json)
            isConfigured=connectionString.length>0
            console.log(connectionString)
            inputCS.value=connectionString
            setInterval(()=>{
                //numDevices.innerText=''
                currentTime.innerText=new Date().toLocaleTimeString()
                fetch('/api/deviceCount')
                    .then((resp)=>{return resp.json()})
                    .then((json)=>{numDevices.innerText=JSON.stringify(json)})
                }, 1000);
            })
})()
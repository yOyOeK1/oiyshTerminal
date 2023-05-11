import axios from 'axios'

async function OTJ ( sapiPath , callBack ){
  console.log("OTJ");
  OTGet( sapiPath, (d)=>{
    let tr = OTJRes(d)
    console.log("OTJ / tr", tr)
    callBack( tr )
  } );
}
function OTJRes( data ){
  console.log("OTJRes",data);
  if( data == -1 )
    return -1
  else
    return data.data
}

async function otFetchJ( sapiPath ) {
  console.log("otFetchJ stast ...", sapiPath)
  const res = await fetch(
    `http://192.168.43.220:1990/${sapiPath}`
  )
  console.log("js is alien in transit !")
  return res.json()
}


async function OTGet( sapiPath, callBack ){
  console.log('OTGet ',sapiPath);
  try {
    const response = await axios.get(`http://192.168.43.220:1990/`+sapiPath);
    console.log("OTGet / try response",response);
    callBack( response );
  } catch (error) {
    console.error("OTGet / error",error);
    callBack( -1 );
  }

}

export default OTGet
export { OTGet, OTJ, otFetchJ }

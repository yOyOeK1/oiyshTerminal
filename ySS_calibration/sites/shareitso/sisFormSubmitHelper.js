function sisFormSubmitArm( hostPort ){


  document.getElementsByName('token')[0].value=localStorage.token || ''

  document.getElementsByTagName('form')[0].addEventListener('submit', async e => {
    e.preventDefault()

    if(e.target.token.value) {
      document.getElementById('deprecation-notice').textContent = 'NOTICE: Token will be deprecated in a future release, please configure the server to use the new HTTP basic auth options instead'
    }

    localStorage.token = e.target.token.value

    const tokenValidationFormData = new FormData()
    tokenValidationFormData.append('token', e.target.token.value)

    let tokenValidationResponse;
    try {
      tokenValidationResponse = await fetch(hostPort+'/upload/validateToken', { method: 'POST', body: tokenValidationFormData})
    } catch (e) {
      tokenValidationResponse = {
        ok: false,
        status: "Token validation unsuccessful",
        statusText: e.message,
      }
    }

    if (!tokenValidationResponse.ok) {
      let message = `${tokenValidationResponse.status}: ${tokenValidationResponse.statusText}`
      document.getElementById('status').textContent = message
      console.log(tokenValidationResponse)
      return
    }
    message = `Success: ${tokenValidationResponse.statusText}`
    const uploadFormData = new FormData(e.target)
    const filenames = uploadFormData.getAll('files').map(v => v.name).join(', ')
    const uploadRequest = new XMLHttpRequest()
    uploadRequest.open(e.target.method, e.target.action)
    uploadRequest.timeout = 3600000

    uploadRequest.onreadystatechange = () => {
      if (uploadRequest.readyState === XMLHttpRequest.DONE) {
        let message = `${uploadRequest.status}: ${uploadRequest.statusText}`
        if (uploadRequest.status === 204) message = `Success: ${uploadRequest.statusText}`
        if (uploadRequest.status === 0) message = 'Connection failed'
        document.getElementById('status').textContent = message
      }
    }

    uploadRequest.upload.onprogress = e => {
      let message = e.loaded === e.total ? 'Saving…' : `${Math.floor(100*e.loaded/e.total)}% [${e.loaded >> 10} / ${e.total >> 10}KiB]`
      document.getElementById("status").textContent = message
    }

    uploadRequest.send(uploadFormData)

    document.getElementById('task').textContent = `Uploading ${filenames}:`
    document.getElementById('status').textContent = '0%'
  })

}

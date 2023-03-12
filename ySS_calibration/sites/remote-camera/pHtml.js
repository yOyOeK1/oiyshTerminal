var yssRemCamHtml = `


<style type="text/css">

button {
    width: 120px;
    padding: 10px;
    display: block;
    margin: 20px auto;
    border: 2px solid #111111;
    cursor: pointer;
    background-color: white;
}

#start-camera {
    margin-top: 50px;
}

#video {
    display: none;
    margin: 50px auto 0 auto;
}

#click-photo {
    display: none;
}

#dataurl-container {
    display: none;
}

#canvas {
    display: block;
    margin: 0 auto 20px auto;
}

#dataurl-header {
    text-align: center;
    font-size: 15px;
}

#dataurl {
    display: block;
    height: 100px;
    width: 320px;
    margin: 10px auto;
    resize: none;
    outline: none;
    border: 1px solid #111111;
    padding: 5px;
    font-size: 13px;
    box-sizing: border-box;
}

</style>
</head>

<body>

<a href="https://192.168.43.220:4443" targe="_blank">become camera ...</a>

<button id="start-camera">Start Camera</button>
<video id="video" width="320" height="240" autoplay></video>
<button id="click-photo">Click Photo</button>
<div id="dataurl-container">
    <canvas id="canvas" width="320" height="240"></canvas>
    <div id="dataurl-header">Image Data URL</div>
    <textarea id="dataurl" readonly></textarea>
</div>


<input type="file" capture="camera" accept="image/*" id="cameraInput" name="cameraInput">

`;

function yssRemCamMakeJs(){

  let camera_button = document.querySelector("#start-camera");
  let video = document.querySelector("#video");
  let click_button = document.querySelector("#click-photo");
  let canvas = document.querySelector("#canvas");
  let dataurl = document.querySelector("#dataurl");
  let dataurl_container = document.querySelector("#dataurl-container");

  camera_button.addEventListener('click', async function() {
     	let stream = null;

      try {
      	stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      catch(error) {
      	alert("Oiysh error - "+error.message);
      	return;
      }

      video.srcObject = stream;

      video.style.display = 'block';
      camera_button.style.display = 'none';
      click_button.style.display = 'block';
  });

  click_button.addEventListener('click', function() {
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
     	let image_data_url = canvas.toDataURL('image/jpeg');

      dataurl.value = image_data_url;
      dataurl_container.style.display = 'block';
  });

}

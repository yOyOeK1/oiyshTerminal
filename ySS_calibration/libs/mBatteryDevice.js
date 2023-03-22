
function navBatteryPercentSignUp( pager ){
	try{
		navigator.getBattery().then(battery => {
		battery.onlevelchange = () => {
			pager.wsCallbackExternal({
				'topic': 'thisDevice/bat/perc',
				'payload': Math.round( battery.level*100 ).toString()
				});

      thisDevice.pushUpdateSens('bat/perc', Math.round( battery.level*100 ).toString() );

		};


    battery.ondischargingtimechange = () => {
      thisDevice.pushUpdateSens('bat/dischargeIn', battery.dischargingTime );
    };


		});
		cl("navBatteryPercentSignUp ! as [thisDevice/bat/perc]");
	}catch(e){
		return false;
	}
}


function navBatteryPercent( pager ){
	console.log("try to get battery status...");
	try{
		navigator.getBattery()
		.then(function(battery) {

				setTimeout( function (){

					console.log(" callback bat:"+battery.level);
					pager.wsCallbackExternal({
						'topic': 'thisDevice/bat/perc',
						'payload': Math.round( battery.level*100 ).toString()
						});

          thisDevice.pushUpdateSens('bat/perc', Math.round( battery.level*100 ).toString() );

        },1000);
	  });
	}catch(e){
		return false;
	}
}

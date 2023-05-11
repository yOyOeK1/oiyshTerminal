<script>

import OtcFastDo from '../components/OtcFastDo.vue'

export default {
  components: {
    OtcFastDo
  }

}

</script>

<template>
  <h1>OT - fast do's</h1>
  oiysh Terminal / fast dos
  <hr>

  <OtcFastDo titleit="Ping ott" sapi="ping/.json" host="192.168.43.220" port="1990" useprot="http" />
  <OtcFastDo titleit="Versions serviceIt" sapi="ver/.json" host="192.168.43.220" port="1990" useprot="http" />
  <OtcFastDo titleit="Help" sapi="help/.json" host="192.168.43.220" port="1990" useprot="http" />
  <OtcFastDo titleit="Config" sapi="getConfig/.json" host="192.168.43.220" port="1990" useprot="http" />

</template>

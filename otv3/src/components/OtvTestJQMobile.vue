<script>

import HelloWorld from '../components/HelloWorld.vue'

export default {
  components:{
    HelloWorld
  }
}

</script>

<template>
  <h1>OT - test JQMobile</h1>

  oiysh Terminal / test JQMobile theming and some faka injections
  <hr>
  <br>

  <div class="">

    <div class="ui-panel-wrapper"><div date-role="header" class="ui-bar-a ui-header" id="pHeader" style="display: block;"><h1 data-role="heading" class="ui-title">otdm</h1><div id="mSelGoTo" class="ui-btn-right ui-btn-inline ui-mini ui-icon-forward">
    <div class="ui-select ui-mini"><div id="select-otdmPages-button" class="ui-btn ui-icon-bars ui-btn-icon-right ui-corner-all ui-shadow"><span>cmd</span><select name="select-otdmPages" id="select-otdmPages" data-mini="true">
      <option value="installed">Installed</option>
      <option value="dpkg">dpkg repository</option>
      <option value="cmd" selected="">cmd</option>
      <option value="config">config</option>
      <option value="versions">versions</option>

    </select></div></div>

    </div></div><div data-role="footer" data-theme="a" style="display:none;" role="contentinfo" class="ui-footer ui-bar-b">in foot</div></div>


    <button type="button"
      class="ui-btn"
      >
      JQMobile theming? nice!
    </button>
    <p>This a test.</p>

  </div>


  <img alt="oiyshTerminal logo" class="logo" src="../assets/ySS_calibration/images/otWorld1_640_320.png" width="256" />
  <HelloWorld msg="" />

  <button class="ui-btn ui-icon-check ui-btn-icon-left ui-shadow ui-corner-all">
    HaHA!
  </button>

</template>


class s_mDynoFormPage{

  constructor(){
    cl("s_mDynoFormPage init ...");

    this.app = new mApp();
    this.f = new mDynoForm("testForm",{
      "selectorsOptions":{
        "oneToSelect":{"type":"one", "options":["one","two","ten"]},
      },
      "Strings":{
          "Name": "",
          "Surname":""
      },
      "withNumbers":{
        "age":Number(),
        "count": 1,
      },

    });

  }

  get getName(){
    return "test mDynoForm";
  }

  get getDefaultBackgroundColor(){
    return "#cccccc";
  }

  getHtml(){
    let cp = pager.getCurrentPage();

    let btns = `<a href="#" onclick="pager.getCurrentPage().f.tree['withNumbers'].ageSet(Math.random())">mod .age </a> `+
      `<a href="#" onclick="cl(pager.getCurrentPage().f.tree)">now data</a>`;

    if( cp.fFormTestSet != true ){
      cp.fFormTestSet = true;
      setTimeout(()=>{
        $("#fFormTest").dform({
  		    "action" : "index.html",
  		    "method" : "get",
          "id": "alaMaKota",
  		    "html" :
  		    [
  		        {
  		            "type" : "h1",
  		            "html" : "Test form from .dform"
  		        },
              {
                "type": "li",
                //"class": "ui-controlgroup-controls",
                "html": {
    		            "name" : "username",
    		            "id" : "txt-username",
    		            "caption" : "Username",
    		            "type" : "text",
    		            "placeholder" : "E.g. user@example.com"
    		        }
              },
  		        {
  		            "name" : "password",
  		            "caption" : "Password",
  		            "type" : "password"
  		        },
              {
                 "name" : "selOne",
  		            "caption" : "Select one",
  		            "type" : "select",
                  "options": {
                    1:"one",
                    2:"two",
                    3:"three"
                  },
              },
              {
                "type": "div",
                "class": "ui-controlgroup-controls",
                "html": {
  		            "name" : "selSome",
  		            "caption" : "Select some",
  		            "type" : "checkboxes",
                  //"css": {"display":"inline"},
                  //"class": 'ui-btn ui-corner-all ui-btn-inherit ui-checkbox-off',
                  "options": {
                    1:"one",
                    2:"two",
                    3:"three"
                  },

  		            }
              },
  		        {
  		            "type" : "submit",
  		            "value" : "Login"
  		        }
  		    ]
        });
      },500);
    }


    return cp.app.appFrame({
      "title":cp.getName,
      "content": `<div id="fFormTest"></div>`+btns+cp.f.getHtml()
    });
  }

  getHtmlAfterLoad(){
    cl(
      pager.getCurrentPage().getName+
      " - getHtmlAfterLoad()"
    );
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){}

  onMessageCallBack( r ){
    cl(
      pager.getCurrentPage().getName+
      " - got msg "
    );
  }

}

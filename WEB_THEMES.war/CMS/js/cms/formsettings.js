var validationList = [{
	"name":"String",
	"value":"text"
},{
	"name":"Number",
	"value":"integer"
},{
	"name":"Date",
	"value":"date"
},{
	"name":"Email",
	"value":"email"
},{
	"name":"Phone",
	"value":"number"
},{
	"name":"Radio",
	"value":"radio"
},{
	"name":"Checkbox",
	"value":"checkbox"
},{
	"name":"Select",
	"value":"select"
}];
var dateFormatlist = [{
	"name":"mm/dd/yy",
	"value":"mm/dd/yy"
},{
	"name":"mm-dd-yy",
	"value":"mm-dd-yy"
}];
var editSetting = {"input":{
    "title": "Text Input",
    "fields": {
      "id": {
        "label": "ID / Name",
        "type": "input",
        "value": "textinput"
      },
      "label": {
        "label": "Label Text",
        "type": "input",
        "value": "Text Input"
      },
      "placeholder": {
        "label": "Placeholder",
        "type": "input",
        "value": "placeholder"
      },
      "required": {
        "label": "Required",
        "type": "checkbox",
        "value": false
      },
      "errortext": {
          "label": "Error Message",
          "type": "input",
          "value": "error"
        },
      "helptext": {
        "label": "Invalid Error Message",
        "type": "input",
        "value": "help"
      }
    }
},"date":{
    "title": "Date Input",
    "fields": {
      "id": {
        "label": "ID / Name",
        "type": "input",
        "value": "textinput"
      },
      "label": {
        "label": "Label Text",
        "type": "input",
        "value": "Text Input"
      },
      "placeholder": {
        "label": "Placeholder",
        "type": "input",
        "value": "placeholder"
      },
      "required": {
        "label": "Required",
        "type": "checkbox",
        "value": false
      },
      "errortext": {
          "label": "Error Message",
          "type": "input",
          "value": "error"
        },
      "helptext": {
        "label": "Invalid Error Message",
        "type": "input",
        "value": "help"
      }
    }
  },
"textarea":{
    "title": "Text Area",
    "fields": {
      "id": {
        "label": "ID / Name",
        "type": "input",
        "value": "textinput"
      },
      "label": {
        "label": "Label Text",
        "type": "input",
        "value": "Text Input"
      },
      "required": {
        "label": "Required",
        "type": "checkbox",
        "value": false
      },
      "errortext": {
          "label": "Error Message",
          "type": "input",
          "value": "error"
        },
      "helptext": {
          "label": "Invalid Error Message",
          "type": "input",
          "value": "help"
        }
    }
  },
  "radio":{
    "title": "Radios",
    "fields": {
      "id": {
        "label": "Group Name",
        "type": "input",
        "value": "textinput"
      },
      "label": {
        "label": "Label Text",
        "type": "input",
        "value": "Text Input"
      },
	  "radios": {
        "label": "Radio Names",
        "type": "textarea",
        "value": [1,2]
      },
	  "radiovalues": {
        "label": "Radio Values",
        "type": "textarea",
        "value": [1,2]
      },
      "required": {
        "label": "Required",
        "type": "checkbox",
        "value": false
      },
      "errortext": {
          "label": "Error Message",
          "type": "input",
          "value": "error"
        },
      "helptext": {
          "label": "Invalid Error Message",
          "type": "input",
          "value": "help"
       }
    }
  },
   "checkbox":{
    "title": "Checkbox",
    "fields": {
      "id": {
        "label": "Group Name",
        "type": "input",
        "value": "textinput"
      },
      "label": {
        "label": "Label Text",
        "type": "input",
        "value": "Text Input"
      },
	  "radios": {
        "label": "Checkbox Name",
        "type": "textarea",
        "value": [1,2]
      },
	  "radiovalues": {
        "label": "Checkbox Values",
        "type": "textarea",
        "value": [1,2]
      },
      "required": {
        "label": "Required",
        "type": "checkbox",
        "value": false
      },
      "errortext": {
          "label": "Error Message",
          "type": "input",
          "value": "error"
        },
      "helptext": {
          "label": "Invalid Error Message",
          "type": "input",
          "value": "help"
        }
    }
  },
   "select":{
    "title": "Checkbox",
    "fields": {
      "id": {
        "label": "ID / Name",
        "type": "input",
        "value": "textinput"
      },
      "label": {
        "label": "Label Text",
        "type": "input",
        "value": "Text Input"
      },
	  "radios": {
        "label": "Option Names",
        "type": "textarea",
        "value": [1,2]
      },
	  "radiovalues": {
        "label": "Option Values",
        "type": "textarea",
        "value": [1,2]
      },
      "required": {
        "label": "Required",
        "type": "checkbox",
        "value": false
      },
      "errortext": {
          "label": "Error Message",
          "type": "input",
          "value": "error"
        },
      "helptext": {
          "label": "Invalid Error Message",
          "type": "input",
          "value": "help"
        }
    }
  },
  "text":{
	    "title": "Text",
	    "fields": {
	      "textarea": {
	        "label": "HTML CODE",
	        "type": "textarea",
	        "value": ""
	      }
	  }
  }
};
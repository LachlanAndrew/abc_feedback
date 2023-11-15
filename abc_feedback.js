console.log ("abc_feedback loaded");

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

// // Find input fields with the specified "???" fields.
// find_inputs_by_name (fieldNames, tag, attempts) {
//   fieldPointers = {};
//   for (var i = 0; i < attempts; i++) {
//     for (var n in document.getElementsByTagName(tag)) {
//       if (tag.innerhtml.contains(fieldNames)) {
// 	fieldPointers[tag.name] = n;
//       }
//     }
//     if (fieldPointers.length == fieldNames.length)
//       return fieldPointers;
//     else if (i < attempts-1)
//       sleep (1);
//   }
//   return fieldPointers;
// }
// 
// prefill () {
//   fp1 = find_inputs_by_name({"I have feedback"}, "li", 1)
//   synthetic_click(fp1["query_type"], fp1["feedback"]);
// 
//   fields = {"location", "loc_opt", "source", "source_op", "conditions"}
//   fp2 = find_inputs_by_name(fields, 3);
//   synthetic_ckick(fp2["loc_opt"]);
//   synthetic_ckick(fp2["source_opt"]);
//   synthetic_ckick(fp2["conditions"]);
// }
// 
// s = copy_selection();
// save(s); 	// cookie?

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

/* function setNativeValue() from [https://stackoverflow.com/questions/40894637/how-to-programmatically-fill-input-elements-built-with-react/70848568] */

/**
 * See [Modify React Component's State using jQuery/Plain Javascript from Chrome Extension](https://stackoverflow.com/q/41166005)
 * See https://github.com/facebook/react/issues/11488#issuecomment-347775628
 * See [How to programmatically fill input elements built with React?](https://stackoverflow.com/q/40894637)
 * See https://github.com/facebook/react/issues/10135#issuecomment-401496776
 *
 * @param {HTMLInputElement | HTMLSelectElement} el
 * @param {string} value
 */
function setNativeValue(el, value) {
  const previousValue = el.value;

  if (el.type === 'checkbox' || el.type === 'radio') {
    if ((!!value && !el.checked) || (!!!value && el.checked)) {
      el.click();
    }
  } else el.value = value;

  const tracker = el._valueTracker;
  if (tracker) {
    tracker.setValue(previousValue);
  }

  // 'change' instead of 'input', see https://github.com/facebook/react/issues/11488#issuecomment-381590324
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function next_input_after (fields) {
  console.log ("in next_input_after");
  const el = document.getElementsByTagName("*");
  curr = "";
  retval = [];
  for (n in el) {
    if (el[n].innerHTML in fields) {
      curr = el[n].innerHTML;
      console.log("Found", curr);
      console.log(el[n]);
      //el[n].innerHTML = fields[curr];	// HACK.  Replace prompt by contents
    } else if (el[n].tagName in {"INPUT":0, "TEXTAREA":0}) {
      if (curr != "") {
	retval.push (el[n]);
	//el[n].value = fields[curr];
	console.log ("old", el[n]);
	setNativeValue(el[n], fields[curr]);
	console.log ("new", el[n].value);
	console.log ("new", el[n]);
	fields[curr] = el[n];
	curr = "";
      } else if (el[n].type == "checkbox") {
	simulate (el[n], "click");
      }
    }
  }
  return retval;
}

async function close_when_found (str) {
    for (;;) {
        await delay (10000);
	const el = document.getElementsByTagName("p");
	for (n in el) {
	  if (el[n].innerHTML == str) {
	    window.close ()
	  }
	}
    }
}

async function fill_form () {
  console.log("feedback here");

  to_click = {"I have feedback":0,
              "ABC News website":0,
              "On the ABC News website":0,
              "Outer suburbs of a capital city":0,
	      "No":0};

  dd = 500;
  for (;;) {
    await delay (dd);

    //for (n in document.getElementsByTagName("*")) { % }
    const el = document.getElementsByTagName("span");
    for (n in el) {
      //console.log(el[n].innerHTML);
      match = (el[n].innerHTML in to_click);
      if (!match) {
        for (a in to_click) {
	  b = el[n].innerHTML;
	  if (b && b.startsWith(a)) {
	    to_click[a] = 1;
	    match = true;
	    break;
	  }
	}
      }
      if (match) {
	//console.log ("Yes");
	//console.log (el[n]);
	to_click[el[n].innerHTML] = 1;
	console.log ("trying", el[n]);
	simulate (el[n], "click");
      }
    }
    anyNotSet = false;
    for (e in to_click)
      if (to_click[e] == 0)
        anyNotSet = true;
    if (!anyNotSet)
      break;
    console.log ("ABC in loop");

    dd += 500;
  }

  fields = {"Email": "lachlanbis@gmail.com",
	    "First name": "Lachlan",
	    "Location": "Glen Iris, VIC 3146",
//	    "What do you want to tell us about, or what questions do you have?": await navigator.clipboard.readText ()
	    "What do you want to tell us about, or what questions do you have?": ""
	   };
  console.log(fields);
  inputs = next_input_after (fields);
  console.log(inputs);

  for (e in fields) {
    console.log ("e is", e);
    if (e.startsWith ("What do you want"))
      fields[e].focus ();
  }

  await delay (500);
  fields = {"Please provide a link to the content": document.referrer};
  inputs = next_input_after (fields);

  console.log("feedback done");

  close_when_found ("Thanks.");
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

async function launch_feedback () {
  // Copy current selection to clipboard
  console.log ("launch_feedback");
  try {
    await navigator.clipboard.writeText ("The article says \"" + getSelectionText () + "\"\n\n");
  } catch (err) {
    console.log("Failed to copy: ", err);
  }

  // Open feedback in new window
  // (Requires pop-up blockers disabled for https://www.abc.net.au)
  window.open("https://www.abc.net.au/news/contact");
}

my_url = window.location.href;
if (my_url.endsWith("abc.net.au/news/contact"))
  fill_form ();
else {
  console.log("ABC: not feedback");

  // Make Alt+C copy the current selection, and open abc.net.au/news/contact
  // (use of BODY still allows Alt-C to toggle case sensitive in search window.)
  document.getElementsByTagName("BODY")[0]
          .addEventListener ("keydown", (ev) => {
			      console.log("body keydown"); console.log(ev);
			      if (ev.altKey && ev.key=="c") launch_feedback();
			   });

  // Old attempt using manifest.json command.

  //browser.commands.onCommand.addListener((command) => { %}
  //if (command === "send-feedback") {
  //  launch_feedback ();
  //}

}

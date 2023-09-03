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

async function fill_form () {
  console.log("feedback here");

  await delay (4000);

  console.log(document);

  to_click = {"I have feedback":0,
              "ABC News website":0,
              "Outer suburbs of a capital city":0};

  //for (n in document.getElementsByTagName("*")) {
  const el = document.getElementsByTagName("span");
  for (n in el) {
    if (el[n].innerHTML in to_click) {
      //console.log ("Yes");
      //console.log (el[n]);
      to_click[el[n].innerHTML] = 1;
      simulate (el[n], "click");
    }
    //else {
    //  console.log ("No");
    //  console.log (el[n].innerHTML);
    //}
    //console.log (el[n]);
    //console.log (el[n].innerHTML);
    //console.log (el[n].parentElement);
  }

  console.log("feedback done");
}

fill_form ();

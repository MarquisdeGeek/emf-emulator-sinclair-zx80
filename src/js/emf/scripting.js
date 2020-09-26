emf.scripting = {};


emf.scripting.createEventList = function() {
  let eventList = [];

  function addEvent(timeat, evt) {
  	eventList.push({condition: { at: timeat }, action: evt })
  }

  function clearList() {
  	eventList = [];
  }

  function runList(machine, controller) {
    return new Promise(function(resolve, reject) {
      // TODO
    	resolve();
    });
  }

  function stopList() {
    return new Promise(function(resolve, reject) {
    	resolve();
    });
  }

  return {
  	addEvent,
  	clearList,
  	runList,
  	stopList,
  };
};

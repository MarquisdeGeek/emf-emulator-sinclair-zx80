let gStateVars = {
  machine: undefined,
  controller: undefined,
};

$(window).load(function() {
  SGXPrepare_OS();
});

function menuAbout() {
  $('#menuAboutModal').modal('show');
}

function SGXPrepare_OS() {
  let options = {};

  gStateVars.machine = new emfzx80(options)
  gStateVars.controller = new emf.controller(gStateVars.machine);

  // INCLUDE:EMBEDDED
}

// EMF uses the SGX graphics engine for rendering, but not updates,
// so these methods need only be stubs
function SGXinit() {}

function SGXstart() {
  gStateVars.machine.start();
  gStateVars.controller.startRunning();
}

function SGXdraw() {}

function SGXupdate(telaps) {
  Main.pause();
}
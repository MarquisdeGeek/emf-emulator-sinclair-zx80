let gStateVars = {
  machine: undefined,
  framework: undefined,
};

$(window).load(function() {
  SGXPrepare_OS();
});

function menuAbout() {
  $('#menuAboutModal').modal('show');
}

function SGXPrepare_OS() {
  let options = {};

  sgx.system.disableBackspace(false);

  gStateVars.machine = new emfzx80(options)

  gStateVars.framework = new emf.framework(gStateVars.machine);

  gStateVars.machine.options.framework = {
    memoryView: {}
  };
  gStateVars.machine.options.framework.memoryView.width = 16;
  gStateVars.machine.options.framework.memoryView.showASCII = true;
}

function SGXinit() {
  // NOP
}

function SGXstart() {
  uiConfigure(gStateVars.machine);
}

function SGXdraw() {
  // NOP
}

function SGXupdate(telaps) {
  Main.pause();
}

function uiConfigure(m) {
  let lastAssembledState;

  if (gStateVars.machine.description) {
    $('#emf_title').html(gStateVars.machine.description);
  }

  $('#emf_asm_process').click(function(ev) {
    let text = $('#emf_asm_intext').val().split('\n');
    let asm = new emf.assembler(gStateVars.machine.bus.cpu);
    let result = asm.assemble(text);


    let exporter = new emf.exporter(gStateVars.machine);
    lastAssembledState = exporter.emfMemory(result.memory);

    gStateVars.framework.memory('#emf_asm_memory_content', result.memory);
    asm.showErrorList('#emf_errorlist_content', result.errorList);
    asm.showFullMap('#emf_fullmap_content', result.fullMap);
    asm.showEquTable('#emf_equates_content', result.equmap);
  });


  $('#emf_asm_export').click(function(ev) {
    if (lastAssembledState) {
      let saveas = new emf.saveAs();
      saveas.saveAs(`emf_${gStateVars.machine.bus.cpu.name}_state.json`, lastAssembledState);
    } else {
      alert("Please build your code, first!");
    }
  });



  $(window).keydown(function(event) {
    if ((event.which == 13) && ($(event.target)[0] != $("textarea")[0])) {
      event.preventDefault();
      return false;
    }
  });

}
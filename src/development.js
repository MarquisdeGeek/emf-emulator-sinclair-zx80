let gStateVars = {
  // Settings
  autoUpdate: true,

  // Emulation
  machine: undefined,
  controller: undefined,
  framework: undefined,
  importer: undefined,
  debugemf: undefined,

  // State
  previousCPUState: undefined,
  indexHistory: 0
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
  gStateVars.controller = emf.controller(gStateVars.machine, {
    onStart: function() {
      $('#emu_state').html("Running");
    },
    onStop: function() {
      $('#emu_state').html("Stopped");
      uiRefresh(gStateVars.machine);
    },
    onUpdate: function() {
      if (gStateVars.autoUpdate && gStateVars.controller.isRunning()) {
        uiRefresh(gStateVars.machine);
      }
    },
  });
  gStateVars.framework = new emf.framework(gStateVars.machine);
  gStateVars.framework.createMemoryDisplay({
    divTab: '#myTab',
    divContentsTab: '#myTabContent'
  });
  gStateVars.framework.populateMemoryDisplay(true);

  gStateVars.debugemf = new emf.debugemf(gStateVars.machine, gStateVars.controller, gStateVars.framework);
  $('#emf_dbug_outtext').val(gStateVars.debugemf.executeCommand('help').join('\n'));

  // INCLUDE:PREPARE
}

function SGXinit() {
  // NOP
}

function SGXstart() {
  gStateVars.machine.start();

  uiConfigure(gStateVars.machine);

  uiRefresh(gStateVars.machine);

  let params = (new URL(document.location)).searchParams;
  if (params.get('autostart')) {
    startRunning();
  }
}

function SGXdraw() {
  // NOP
}

function SGXupdate(telaps) {
  Main.pause();
}


function startRunning() {
  gStateVars.controller.startRunning();
  uiRefresh(gStateVars.machine);
}

function stopRunning() {
  gStateVars.controller.stopRunning();
  uiRefresh(gStateVars.machine);
}

// INCLUDE:HELPERS

function importMachineData(machine, filename, data) {
  // Contents of 'importMachineData' function

  if (filename.toLowerCase().indexOf('.o') !== -1 || filename.toLowerCase().indexOf('.p') !== -1) {
    let zximporter = new zx80.importer(gStateVars.machine);
    zximporter.o(name, data);
  } else {
    gStateVars.controller.coldLoadData(name, data, {
      startAddress: 16384
    });
  }
}

function uiProcessCommand() {
  let cmd = $('#emf_dbug_intext').val();
  let result = gStateVars.debugemf.executeCommand(cmd);

  let outtext = $('#emf_dbug_outtext');
  outtext.val(outtext.val() + '\n> ' + cmd + '\n' + result.join('\n'));
  if (outtext.length) {
    outtext.scrollTop(outtext[0].scrollHeight - outtext.height());
  }

  $('#emf_dbug_intext').val('');
  $('#emf_dbug_intext').focus();

  gStateVars.indexHistory = 0;

  uiRefresh(gStateVars.machine);
}

function uiConfigure(m) {
  sgx.system.disableBackspace(false);

  if (gStateVars.machine.description) {
    $('#emf_title').html(gStateVars.machine.description);
  }

  $('#emf_dbug_intext').keyup(function(e) {
    if (e.keyCode == 13) {
      uiProcessCommand();

    } else if (e.keyCode == 38) { // up arrow
      let history = gStateVars.debugemf.getHistory(++gStateVars.indexHistory);
      $('#emf_dbug_intext').val(history);
      $('#emf_dbug_intext').focus();

    } else if (e.keyCode == 40) { // down arrow
      let history = gStateVars.debugemf.getHistory(--gStateVars.indexHistory);
      $('#emf_dbug_intext').val(history);
      $('#emf_dbug_intext').focus();
    }
    //
    e.preventDefault();
  });

  $('#emf_dbug_enter').click(uiProcessCommand);


  $('#emf_step').click(function(ev) {
    gStateVars.controller.step();
    uiRefresh(m);
  });

  $('#emf_stop').click(function(ev) {
    stopRunning();
  });

  $('#emf_run').click(function(ev) {
    startRunning();
  });

  $('#emf_reset').click(function(ev) {
    m.reset();
    if (typeof uiReflect2Emulator !== typeof undefined) {
      uiReflect2Emulator();
    }
    uiRefresh(m);
  });

  $('#emf_export').click(function(ev) {
    let exporter = new emf.exporter();
    let state = exporter.emfMachine(gStateVars.machine);
    let saveas = new emf.saveAs();
    saveas.saveAs(`emf_${gStateVars.machine.name}_state.json`, state);
  });

  $('#opt_auto_update').click(function(ev) {
    gStateVars.autoUpdate = $("#opt_auto_update").is(":checked");
  });

  function loadResource(filename, div, pc) {
    let importer = new emf.importer();

    importer.byURL(`emf/sw/${filename}`)
      .then(function(data) {
        importMachineData(gStateVars.machine, filename, data);
      })
  }

  new emf.dragDrop('SGXCanvas', m, function(filename, data) {
    importMachineData(gStateVars.machine, filename, data);
    uiRefresh(m);
  });

  $('#emu_state').html("Loaded...");
}

function uiRefresh(m) {
  let memoryRanges = m.bus.memory.getAddressRanges();
  let pc = m.bus.cpu.emulate.getRegisterValuePC();
  let addrFrom = pc;
  let lines = $('#SGXCanvas').height() / 14; // rule of thumb/guestimate

  gStateVars.framework.disassembleRows('#emf_disassembly_solo', m.bus.cpu, addrFrom, lines, pc);
  gStateVars.framework.registers('#emf_registers', m.bus.cpu, gStateVars.previousCPUState);
  gStateVars.framework.populateMemoryDisplay();
  //
  gStateVars.previousCPUState = m.bus.cpu.emulate.getState();
}
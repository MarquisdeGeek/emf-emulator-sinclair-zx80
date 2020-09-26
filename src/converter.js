let gStateVars = {
  framework: undefined,
  memory: undefined,
  conversionCallback: convertToJavaScript
};


$(window).load(function() {
  SGXPrepare_OS();
});

function menuAbout() {
  $('#menuAboutModal').modal('show');
}

function SGXPrepare_OS() {
  let fakeMachine = {
    options: {
      framework: {
        memoryView: {
          width: 8,
          showASCII: true
        }
      }
    }
  };

  gStateVars.framework = new emf.framework(fakeMachine);

  uiConfigure();
}

function SGXinit() {
  // NOP
}

function SGXstart() {
  // NOP
}

function SGXdraw() {
  // NOP
}

function SGXupdate(telaps) {
  Main.pause();
}

function uiConfigure(m) {

  $('#emf_convert_to_ecma6').click(function(ev) {
    doConversion(convertToJavaScript);
  });

  $('#emf_convert_to_c99').click(function(ev) {
    doConversion(convertToC);
  });

  $('#emf_convert_to_hex').click(function(ev) {
    doConversion(convertToHEX);
  });

  $('#emf_convert_to_hexjson').click(function(ev) {
    doConversion(convertToHEXJSON);
  });

  $('#emf_convert_to_hexstring').click(function(ev) {
    doConversion(convertToHEXString);
  });

  new emf.dragDrop('dragdrop', m, function(filename, data) {

    let memoryHandler = new emf.memory();
    gStateVars.memory = memoryHandler.createFromArray(0, data);

    // TODO: Correctly re-size the memory block, because the data loaded
    // might be larger than the bytes it converts into. i.e. 0xa3 in ASCII
    // is 1 binary byte here
    let importer = new emf.importer();
    importer.byFilename(filename, gStateVars.memory, 0, data);

    gStateVars.framework.memory('#emf_memory_source', gStateVars.memory, 0, data.length);
    doConversion();
  });
}

//
// Conversion methods
//
function doConversion(cbfn) {
  gStateVars.conversionCallback = cbfn || gStateVars.conversionCallback;
  gStateVars.conversionCallback('#emf_memory_dest', gStateVars.memory);
}

function convertToJavaScript(div, data) {
  return convertToArray(div, data, {
    prefix: 'let data = [',
    postfix: '];'
  });
}

function convertToC(div, data) {
  return convertToArray(div, data, {
    prefix: 'unsigned char data[] = {',
    postfix: '};'
  });
}

function convertToHEX(div, data) {
  let exporter = new emf.exporter();
  let result = exporter.intelHEX(data);
  $(div).html(result.rows.join('<br>'));
}

function convertToHEXJSON(div, data) {
  let exporter = new emf.exporter();
  let result = exporter.emfMemory(data);
  $(div).html(JSON.stringify(result, null, 2));
}

function convertToHEXString(div, data) {
  let html = '"';
  for (let a = 0; data.isValidAddress(a); ++a) {
    html += emf.utils.hex8(data.read8(a));
  }
  html += '"';
  $(div).html(html);
}

function convertToArray(div, data, options) {
  let html = options.prefix;
  let line = '';
  for (let a = 0; data.isValidAddress(a); ++a) {
    if ((a % 8) === 0) {
      html += `${line}<br>`;
      line = '';
      line += `/* ${emf.utils.hex16(a)} */ `;
    }
    line += `0x${emf.utils.hex8(data.read8(a))}, `;
    //
  }
  html += `${line}<br>`;
  html += `${options.postfix}<br>`;
  //
  $(div).html(html);
};
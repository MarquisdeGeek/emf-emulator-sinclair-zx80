let zx80_display = (function(bus, options) {
  let lastScreen = [];
  let optimised = true;
  let textureCache = [];
  let nativeOffset = 256;
  let surface;
  let scale = 1.5;

  (function ctor() {
    sgxSurface = sgxskeleton.init(320 * scale, 240 * scale);
    clearCaches();

    bus.attachPin('vsync', {
      onFalling: function() {
        render();
      }
    });
    /*
        // Authenticate ugliness switch!
        const canvas = document.getElementById('SGXCanvas');
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    */
  })();

  function clearCaches() {
    lastScreen = [];
    textureCache = [];
  }

  function start() {
    new zx.zx81(sgxSurface, scale);
    zx.system.setSolidDraw(true);

    for (let i = 0; i < 256; ++i) {
      textureCache[i] = zx.system.getCharacterTexture(i | nativeOffset);
    }

    zx.system.setSolidDraw(true);
  }

  function getDFile(bus) {
    return bus.memory.read16(16396);
  }

  function getVars(bus) {
    return bus.memory.read16(16400);
  }

  function at(x, y) {
    // +1 to ignore 118 (HALT)
    // *33 for 32 characters plus 118 EOL/HALT
    return lastScreen ? lastScreen[x + y * 32] : undefined;
  }

  function renderDFile(screenData, addr, vars) {

    if (!zx.system || !zx.system.screen) { //not initialised yet
      return;
    }

    addr += 1; // dfile begins with 118

    let yline = 0;
    let xline = 0;
    let screenIndex = 0;
    //zx.system.cls();
    while (addr < vars) {
      let byte = screenData.read8(addr);

      if (byte === 118) {
        // Fill line with blanks spaces
        while (xline < 32) {
          zx.system.screen.printAt(yline, xline, zx.chr$(0));
          lastScreen[screenIndex] = 0;
          ++xline;
          ++screenIndex;
        }
        ++yline;
        xline = 0;
      } else {

        if (optimised && lastScreen && byte === (itWas = at(xline, yline))) {
          //nop
        } else {
          textureCache[byte] = textureCache[byte] || zx.system.getCharacterTexture(byte | nativeOffset);
          zx.system.drawWith(textureCache[byte], {}, xline * 8, yline * 8);

          // The |256 hack ensures ZX Javascript interprets the rest
          // of the byte literally
          // zx.system.drawCharacter(byte|256, {}, xline*8, yline*8);

          // This change makes the rendered faster than:
          //          zx.system.screen.printAt(yline, xline, zx.chr$(byte));
          lastScreen[screenIndex] = byte;
        }

        ++xline;
        ++screenIndex;
      }
      //
      ++addr;
    }

  }

  function render() {
    let addr = getDFile(bus);
    let vars = getVars(bus);

    renderDFile(bus.memory, addr, vars);
  }

  return {
    start,
    render,
  }
});
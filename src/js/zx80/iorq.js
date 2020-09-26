let zx80_iorq = (function(bus, options) {

  function start() {
    bus.attachPin('iorq', {
      onFalling: function() {
        let port = bus.readBlock('address');

        // Read from IO?
        let rd = bus.readBlock('rd');
        if (!rd) {
          let data = readPort(port);
          bus.writeBlock('data', data);
          return;
        }

        // Write to IO? We need to check both RD and RW, since it might be memory
        let wr = bus.readBlock('wr');
        if (!wr) {
          let data = bus.readBlock('data');
          writePort(address, data);
          return;
        }
      },
    });
  }

  function readPort(addr) {
    addr = addr.getUnsigned ? addr.getUnsigned() : addr;

    var a, h, i, mask, retval = 0xff;

    a = addr & 0xff;
    if (a == 0xfb) {
      return 0xff;
    } else if (a == 0xfe) {
      h = addr >> 8;
      switch (h) {
        case 0xfe:
          retval = zx80_keyboard.getState(0);
          break;
        case 0xfd:
          retval = zx80_keyboard.getState(1);
          break;
        case 0xfb:
          retval = zx80_keyboard.getState(2);
          break;
        case 0xf7:
          retval = zx80_keyboard.getState(3);
          break;
        case 0xef:
          retval = zx80_keyboard.getState(4);
          break;
        case 0xdf:
          retval = zx80_keyboard.getState(5);
          break;
        case 0xbf:
          retval = zx80_keyboard.getState(6);
          break;
        case 0x7f:
          retval = zx80_keyboard.getState(7);
          break;

        default:
          for (i = 0, mask = 1; i < 8; i++, mask <<= 1)
            if (!(h & mask))
              retval &= zx80_keyboard.getState(i);
      }
    }
    return retval;
  }

  function writePort(addr, val) {
    addr = addr.getUnsigned ? addr.getUnsigned() : addr;
    val = val.getUnsigned ? val.getUnsigned() : val;

    var a, f, fe, rgb;

    a = addr & 0xff;
    if (a == 0xfd) {
      //bus.cpu.emulate.pinNMI.setHigh();
      //nmigen = false;
      //hsygen = true;
    } else if (a == 0xfe) {
      //if (zx80) hsygen=true; else nmigen=true;
      //bus.cpu.emulate.pinNMI.setLow();
    } else if (a == 0xff || a == 0x07) {
      //hsygen = true;
    }
  }

  return {
    start,
    readPort,
    writePort,
  }
});
// Since the ZX80 didn't have a ULA chip, this is my 'Westwood-simulation'
let zx80_ula = (function(bus, options) {

  (function ctor() {})();

  function start() {
    bus.attachPin('int', {
      onFalling: function() {
        bus.display.render();
      }
    });

    bus.attachPin('mreq', {
      onFalling: function() {
        let address = bus.readBlock('address');

        // Read from memory?
        let rd = bus.readPinState('rd');
        if (!rd) {
          // If reading an opcode, we have this magical change
          let m1 = bus.readPinState('m1');
          if (!m1) {
            let opcode = bus.memory.read8(address & 0x7fff);

            if (address & 0x8000) {
              if (opcode & 0x40) {
                // nop : doing other lines of display
              } else {
                opcode = 0;
              }
            }
            bus.writeBlock('data', opcode);
            return;
          }

          // Else, just pull standard memory
          let data = bus.memory.read8(address);
          bus.writeBlock('data', data);
          return;
        }

        // Write to memory? We need to check both RD and RW, since it might be IO
        let wr = bus.readPinState('wr');
        if (!wr) {
          let data = bus.readBlock('data');
          bus.memory.write8(address, data);
        }
      },
    });
  }

  return {
    start,
  }
});
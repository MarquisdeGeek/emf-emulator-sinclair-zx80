var zx80 = zx80 || {};

zx80.importer = (function(machine) {

  // Uses the structure and magic numbers from 'load_prog' in https://nocanvas.zame-dev.org/0004/
  function o(name, data) {
    let memory = machine.bus.memory;
    let cpu = machine.bus.cpu.emulate;
    // Since the emulator might never have run, we can't determine the RAMTOP from
    // existing system variables.
    let RAMblock = memory.getAddressRanges().filter((a) => a.write && !a.shadow);
    // BUGWARN: We assume the first block of RAM is the right one
    let RAMtop = RAMblock[0].start + RAMblock[0].size;

    // Do a cold start every time - we can support multi-part loads later
    machine.reset();
    //
    let prgptr = 0x4000;
    for(let i=0;i<data.length;++i, ++prgptr) {
      memory.write8(prgptr, data[i], true);
    }

    // Clear the rest
    for(let i=data.length;i<0x8000;++i, ++prgptr) {
      memory.write8(prgptr, 0, true);
    }

    let newState = {
      registers: {
        a: 0x00,
        b: 0x00,
        c: 0x00,
        d: 0x04,
        e: 0x47,
        h: 0x40,
        l: 0x2A,
        ix: 0xFFFF,
        iy: 0x4000,
        //
        prime_a: 0xFF,
        prime_f: 0xFF,
        prime_b: 0x00,
        prime_c: 0x21,
        prime_d: 0xD8,
        prime_e: 0xF0,
        prime_h: 0xD8,
        prime_l: 0xF0,
        //
        sp: RAMtop - 2,
        pc: 0x0283,
        //
        intv: 0x0e,
        memrefresh: 0xe8,
      },
      flags: {
        c: 0,
        n: 0,
        p: 1,
        // b3 - ignored
        h: 0,
        // b5 - ignored
        z: 1,
        s: 0,
      },
      //
      state: {
        inHalt: false,
        int_iff0: 0,
        int_iff1: 0,
        interruptMode: 1,        
      }
    };
    cpu.setState(newState); // done first, so we can overwrite SP etc, later

    memory.write16(newState.registers.sp, 0x3FAE, true);
  }

  return {
    o,
  }
});

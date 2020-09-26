// zx80_z80_emulator
let zx80_z80_emulator = (function(bus, options) {
  let tmp8 = new emf.Number(8);
  let tmp16 = new emf.Number(16);

  // TODO: f = flags, and cc_ are separate but should be unified?!?!
  let f = new emf.Number(8);

  let cc_bit_0 = 0;
  let cc_bit_1 = 0;
  let cc_bit_2 = 0;
  let cc_bit_3 = 0;
  let cc_bit_4 = 0;
  let cc_bit_5 = 0;
  let cc_bit_6 = 0;
  let cc_bit_7 = 0;


  // TODO: XML to contain internal functions (e.g. memory refresh, interupt handlers)
  // TODO: XML to differentiate between CPU conventions (imm0) and implementation details (inHalt)
  // Options: directMemory = false
  // Options: directIORQ = true
  // Options: directFetch = false
  let read1 = function(a) {
    return read8(a) & 0x01;
  }
  let read2 = function(a) {
    return read8(a) & 0x03;
  }
  let read3 = function(a) {
    return read8(a) & 0x07;
  }
  let read4 = function(a) {
    return read8(a) & 0x0f;
  }
  let read5 = function(a) {
    return read8(a) & 0x1f;
  }
  let read6 = function(a) {
    return read8(a) & 0x3f;
  }
  let read7 = function(a) {
    return read8(a) & 0x7f;
  }
  let read8;
  let read9 = function(a) {
    return read16(a) & 0x1ff;
  }
  let read10 = function(a) {
    return read16(a) & 0x3ff;
  }
  let read11 = function(a) {
    return read16(a) & 0x7ff;
  }
  let read12 = function(a) {
    return read16(a) & 0xfff;
  }
  let read13 = function(a) {
    return read16(a) & 0x1fff;
  }
  let read14 = function(a) {
    return read16(a) & 0x3fff;
  }
  let read15 = function(a) {
    return read16(a) & 0x7fff;
  }
  let read16;

  /*
   **
   ** Declarations
   **
   */
  let a = new emf.Number(8);
  let gsRegisterA = new emf.Number(8);
  let b = new emf.Number(8);
  let gsRegisterB = new emf.Number(8);
  let c = new emf.Number(8);
  let gsRegisterC = new emf.Number(8);
  let d = new emf.Number(8);
  let gsRegisterD = new emf.Number(8);
  let e = new emf.Number(8);
  let gsRegisterE = new emf.Number(8);
  let h = new emf.Number(8);
  let gsRegisterH = new emf.Number(8);
  let l = new emf.Number(8);
  let gsRegisterL = new emf.Number(8);
  let pc = new emf.Number(16);
  let gsRegisterPC = new emf.Number(16);
  let sp = new emf.Number(16);
  let gsRegisterSP = new emf.Number(16);
  let ix = new emf.Number(16);
  let gsRegisterIX = new emf.Number(16);
  let iy = new emf.Number(16);
  let gsRegisterIY = new emf.Number(16);
  let prime_a = new emf.Number(8);
  let gsRegisterPRIME_A = new emf.Number(8);
  let prime_b = new emf.Number(8);
  let gsRegisterPRIME_B = new emf.Number(8);
  let prime_c = new emf.Number(8);
  let gsRegisterPRIME_C = new emf.Number(8);
  let prime_d = new emf.Number(8);
  let gsRegisterPRIME_D = new emf.Number(8);
  let prime_e = new emf.Number(8);
  let gsRegisterPRIME_E = new emf.Number(8);
  let prime_f = new emf.Number(8);
  let gsRegisterPRIME_F = new emf.Number(8);
  let prime_h = new emf.Number(8);
  let gsRegisterPRIME_H = new emf.Number(8);
  let prime_l = new emf.Number(8);
  let gsRegisterPRIME_L = new emf.Number(8);
  let intv = new emf.Number(8);
  let gsRegisterINTV = new emf.Number(8);
  let memrefresh = new emf.Number(8);
  let gsRegisterMEMREFRESH = new emf.Number(8);
  let memr7 = new emf.Number(8);
  let gsRegisterMEMR7 = new emf.Number(8);
  let af = createRegisterPair(a, f);
  let bc = createRegisterPair(b, c);
  let de = createRegisterPair(d, e);
  let hl = createRegisterPair(h, l);
  let prime_bc = createRegisterPair(prime_b, prime_c);
  let prime_de = createRegisterPair(prime_d, prime_e);
  let prime_hl = createRegisterPair(prime_h, prime_l);

  /*
   **
   ** Internal state
   **
   */
  let isBigEndian = (false); // Treat as bool
  let inHalt = (false); // Treat as bool
  let int_iff0 = (0); // Treat as int8
  let int_iff1 = (0); // Treat as int8
  let int_iff2 = (0); // Treat as int8
  let interruptMode = (0); // Treat as int8
  let wasNMIGenerated = (false); // Treat as bool
  let wasIRQGenerated = (false); // Treat as bool

  /*
   **
   ** Bus
   **
   */
  function setupBusHandlersInternal() {
    // Watching the pins
    bus.attachPin('nmi', {
      onFalling: function() {
        wasNMIGenerated = true
      },
    });
    bus.attachPin('nmi', {
      onRising: function() {
        wasNMIGenerated = false
      },
    });
    bus.attachPin('int', {
      onFalling: function() {
        wasIRQGenerated = true
      },
    });
    bus.attachPin('reset', {
      onFalling: function() {
        reset()
      },
    });
  }

  /*
   **
   ** ALU
   **
   */
  function set(r, v) {
    r.assign(v);
  }

  function get(r) {
    return r.getUnsigned();
  }

  function lit(v) {
    return v;
  }
  // NOTE: When using the bus versions, this uses Z80 conventions
  let in8;
  let out8;
  let write8;
  let fetch8;
  let write16;
  //
  function setupBusHandlers() {
    if (options.directIORQ) {
      in8 = bus.iorq.readPort;
      out8 = bus.iorq.writePort;
    } else {
      in8 = function(port) {
        port = port.getUnsigned ? port.getUnsigned() : port;
        bus.writeBlock('address', port);
        bus.setLow('rd');
        bus.setLow('iorq');
        let data = bus.readBlock('data');
        bus.setHigh('iorq');
        bus.setHigh('rd');
        return data;
      };

      out8 = function(port, data) {
        port = port.getUnsigned ? port.getUnsigned() : port;
        data = data.getUnsigned ? data.getUnsigned() : data;
        bus.writeBlock('address', port);
        bus.writeBlock('data', data);
        bus.setLow('wr');
        bus.pulseLow('iorq');
        bus.setHigh('wr');
      };
    }
    //
    if (options.directMemory) {
      // TODO: don't auto generate these
      read8 = bus.memory.read8;
      read16 = bus.memory.read16;
      write8 = bus.memory.write8;
      write16 = bus.memory.write16;
    } else {
      // TODO: CPU needs endian knowledge to do read16
      read8 = function(address) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        bus.writeBlock('address', address);
        bus.setLow('rd');
        bus.setLow('mreq');
        let data = bus.readBlock('data');
        bus.setHigh('mreq');
        bus.setHigh('rd');
        return data;
      };

      write8 = function(address, data) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        data = data.getUnsigned ? data.getUnsigned() : data;
        bus.writeBlock('address', address);
        bus.writeBlock('data', data);
        bus.setLow('wr');
        bus.pulseLow('mreq');
        bus.setHigh('wr');
      };

      read16 = function(address) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        if (isBigEndian) {
          return read8(address) * 256 + read8(address + 1);
        } else {
          return read8(address + 1) * 256 + read8(address);
        }
      };

      write16 = function(address, data) {
        address = address.getUnsigned ? address.getUnsigned() : address;
        data = data.getUnsigned ? data.getUnsigned() : data;

        if (isBigEndian) {
          write8(address + 0, data >> 8);
          write8(address + 1, data & 0xff);
        } else {
          write8(address + 1, data >> 8);
          write8(address + 0, data & 0xff);
        }
      };
    }
    //
    if (options.directFetch) {
      fetch8 = function() {
        let pcValue = pc.getUnsigned();
        return bus.memory.read8(pcValue);
      };
    } else {
      fetch8 = function() {
        let pcValue = pc.getUnsigned();
        bus.writeBlock('address', pcValue);
        bus.setLow('m1');
        bus.setLow('rd');
        bus.setLow('mreq');
        let data = bus.readBlock('data');
        bus.setHigh('mreq');
        bus.setHigh('rd');
        bus.setHigh('m1');

        // TODO: Re-introduce this?
        //pc.inc();
        updateMemoryRefresh();

        return data;
      };

    }
    //
  }
  var alu = alu || {};

  alu.parityLUT8 = [];

  alu.start = function() {
    for (let i = 0; i < 256; ++i) {
      alu.parityLUT8[i] = calculateParity(i);
    }
  }

  alu.reset = function() {

  }

  function calculateParity(v, sz = 8) {
    let bits = 0;

    v = v & 255; /// ensure it's positive, for the table deference

    for (let i = 0; i < sz; ++i) {
      if (v & (1 << i)) {
        ++bits;
      }
    }
    let parity = (bits & 1) == 1 ? 0 : 1; // odd parity returns 0
    return parity;
  }
  let flagHalfCarryAdd = [0, 1, 1, 1, 0, 0, 0, 1];
  let flagHalfCarrySub = [0, 0, 1, 0, 1, 0, 1, 1];

  alu.add_u8u8c = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;

    let result = (v1 + v2 + v3);
    wasCarry = result > 0xff ? 1 : 0;

    // Did the calculation in the lowest 4 bits spill over into the upper 4 bits

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x88) >> 3) | (((v2) & 0x88) >> 2) | ((result & 0x88) >> 1);
    wasHalfCarry = flagHalfCarryAdd[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 3 || lookup == 4) ? 1 : 0;

    result &= 0xff;

    computeFlags8(result);
    aluLastResult = result;

    return result;
  }

  alu.sub_u8u8b = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;
    let result = (v1 - v2) - v3;

    wasCarry = result & 0x100 ? 1 : 0;
    wasNegation = true;

    // Did the calculation in the lowest 4 bits spill under

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x88) >> 3) | (((v2) & 0x88) >> 2) | ((result & 0x88) >> 1);
    wasHalfCarry = flagHalfCarrySub[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 1 || lookup == 6) ? 1 : 0;

    result &= 0xff;

    computeFlags8(result);

    return result;
  }
  alu.abs16 = function(v) {
    return computeFlags16(Math.abs(v));
  }

  alu.add_u16u16c = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;

    let result = (v1 + v2 + v3);
    wasCarry = result > 0xffff ? 1 : 0;

    // 16 bit adds set_'H' on overflow of bit 11 (!?)

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x8800) >> 11) | (((v2) & 0x8800) >> 10) | ((result & 0x8800) >> 9);
    wasHalfCarry = flagHalfCarryAdd[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 3 || lookup == 4) ? 1 : 0; // TODO: not convinced any Z80 instr checks the 'V' flag fter 16 bit adds

    result &= 0xffff;

    computeFlags16(result);
    aluLastResult = result;

    return result;
  }

  alu.add_u16s8 = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;

    let result = (v1 + v2 + v3);
    if (v2 >= 128) { // handle the negative bit of 8 bit numbers in v2
      result -= 256;
    }
    wasCarry = result > 0xffff ? 1 : 0;

    // 16 bit adds set_'H' on overflow of bit 11 (!?)

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x8800) >> 11) | (((v2) & 0x8800) >> 10) | ((result & 0x8800) >> 9);
    wasHalfCarry = flagHalfCarryAdd[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 3 || lookup == 4) ? 1 : 0;

    result &= 0xffff;

    computeFlags16(result);

    return result;
  }

  alu.sub_u16u16b = function(v1, v2, v3 = 0) {
    v1 = v1.get ? v1.getUnsigned() : v1;
    v2 = v2.get ? v2.getUnsigned() : v2;
    let result = (v1 - v2) - v3;

    wasCarry = result & 0x10000 ? 1 : 0;
    wasNegation = true;

    // 16-bit half carry occurs on bit 11

    // The MSB is same on both src params, but changed between result and src param1
    let lookup = ((v1 & 0x8800) >> 11) | (((v2) & 0x8800) >> 10) | ((result & 0x8800) >> 9);
    wasHalfCarry = flagHalfCarrySub[(lookup & 7)];
    lookup >>= 4;
    wasOverflow = (lookup == 1 || lookup == 6) ? 1 : 0;

    result &= 0xffff;

    computeFlags16(result);

    return result;
  }
  alu.daa = function(v, carry, subtraction) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = carry;

    if (subtraction) { // last instr was subtraction	
      if ((v & 0x0f) > 9) {
        v -= 6;
      }
      if ((v & 0xf0) > 0x90) {
        v -= 0x60;
      }
    } else { // post an addition
      if ((v & 0x0f) > 9) {
        v += 6;
      }
      if ((v & 0xf0) > 0x90) {
        v += 0x60;
      }
    }
    v = v & 0xff;
    computeFlags8(v);
    return v;
  }
  // utility methods
  let wasCarry;
  let wasNegation;
  let wasOverflow;
  let wasHalfCarry;
  let wasZero;
  let wasSign;
  let wasParity;
  //
  let aluLastResult;


  function sign() {
    return wasSign;
  }

  function sign16() {
    return wasSign;
  }

  function zero() {
    return wasZero;
  }

  function halfcarry() {
    return wasHalfCarry;
  }

  function overflow() {
    return wasOverflow;
  }

  function parity() {
    return wasParity;
  }

  function carry() {
    return wasCarry;
  }

  function getParity8(v) {
    return alu.parityLUT8[v];
  }

  function getParity16(v) {
    return alu.parityLUT8[v * 255] ^ alu.parityLUT8[v >> 8];
  }

  function computeFlags8(r) {
    wasSign = r & 0x80 ? 1 : 0;
    wasZero = r == 0 ? 1 : 0;
    wasParity = getParity8(r);
    return r;
  }

  function computeFlags16(r) {
    wasSign = r & 0x8000 ? 1 : 0;
    wasZero = r == 0 ? 1 : 0;
    wasParity = getParity16(r);
    return r;
  }
  //
  // Basic manipulation
  //
  alu.complement8 = function(v) {
    v = v.get ? v.getUnsigned() : v;
    v = (~v) & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.setBit8 = function(bit, value) {
    value = value.get ? value.getUnsigned() : value;
    value = value | (1 << bit);
    computeFlags8(value);
    return value;
  }

  alu.clearBit8 = function(bit, value) {
    value = value.get ? value.getUnsigned() : value;
    value = value & ~(1 << bit);
    computeFlags8(value);
    return value;
  }

  alu.testBit8 = function(bit, value) {
    value = value.get ? value.getUnsigned() : value;
    let isBitSet = value & (1 << bit) ? 1 : 0;
    wasSign = value & 0x80 ? 1 : 0;
    wasZero = isBitSet ? 0 : 1;
    wasOverflow = wasZero;
    wasParity = wasZero; // TODO: sure this isn't getParity8(value);?
    return isBitSet;
  }

  alu.and8 = function(v, v2) {
    v = v.get ? v.getUnsigned() : v;
    v2 = v2.get ? v2.getUnsigned() : v2;

    return computeFlags8(v & v2);
  }

  alu.xor8 = function(v, v2) {
    v = v.get ? v.getUnsigned() : v;
    v2 = v2.get ? v2.getUnsigned() : v2;

    return computeFlags8(v ^ v2);
  }

  alu.or8 = function(v, v2) {
    v = v.get ? v.getUnsigned() : v;
    v2 = v2.get ? v2.getUnsigned() : v2;

    return computeFlags8(v | v2);
  }

  //
  // Shift and rotates
  //
  alu.lsr8 = function(v, places) {
    v = v.get ? v.getUnsigned() : v;
    wasCarry = v & 1;
    return v >> places;
  }

  alu.lsl8 = function(v, places) {
    v = v.get ? v.getUnsigned() : v;
    wasCarry = v & 0x80 ? 1 : 0;
    return v << places;
  }

  alu.rra8 = function(v, carry) {
    v = v.get ? v.getUnsigned() : v;

    v |= carry ? 0x100 : 0;
    wasCarry = v & 1;
    v >>= 1;
    v &= 0xff;

    computeFlags8(v);

    return v;
  }

  // SLL is undocumented it seems (at least in Zaks:82)
  // http://www.z80.info/z80undoc.htm
  // suggests it's like SLA, but with 1 in the LSB
  alu.sll8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v |= 1;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.sla8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.sra8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1;
    v >>= 1;
    v |= (v & 0x40) << 1;

    computeFlags8(v);

    return v;
  }

  alu.srl8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1;
    v >>= 1;
    v = v & 0x7f;

    computeFlags8(v);

    return v;
  }

  alu.rlc8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v |= wasCarry;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.rl8 = function(v, carry) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 0x80 ? 1 : 0;
    v <<= 1;
    v |= carry;
    v = v & 0xff;

    computeFlags8(v);

    return v;
  }

  alu.rr8 = function(v, carry) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1 ? 1 : 0;
    v >>= 1;
    v |= carry ? 0x80 : 0;

    computeFlags8(v);

    return v;
  }

  alu.rrc8 = function(v) {
    v = v.get ? v.getUnsigned() : v;

    wasCarry = v & 1 ? 1 : 0;
    v >>= 1;
    v |= wasCarry ? 0x80 : 0;

    computeFlags8(v);

    return v;
  }
  alu.complement16 = function(v) {
    v = v.get ? v.getUnsigned() : v;
    v = (~v) & 0xffff;

    computeFlags16(v);

    return v;
  }

  alu.test16 = function(v) {
    return computeFlags16(v)
  }

  alu.xor16 = function(v1, v2) {
    return computeFlags16(v1 ^ v2);
  }

  alu.or16 = function(v1, v2) {
    return computeFlags16(v1 | v2);
  }

  alu.and16 = function(v1, v2) {
    return computeFlags16(v1 & v2);
  }

  function createRegisterPair(hi, lo) {
    let pair = new emf.Number(16);
    let pairAssign = pair.assign;
    let pairGetUnsigned = pair.getUnsigned;

    getMethods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')
    let method = getMethods(pair);
    method.forEach((m) => {
      let original = pair[m];
      pair[m] = function(args) {
        //// Copy from individual
        let combined = (hi.getUnsigned() << 8) | lo.getUnsigned();
        pairAssign(combined);

        // Do normal math using genuine logic
        let returnValue = original(args);

        // Copy back
        let result = pairGetUnsigned();
        hi.assign(result >> 8);
        lo.assign(result & 255);

        return returnValue; // for those that use it. e.g. equals()
      }
    });

    // TODO: get() 
    pair.get = function() {
      return (hi.getUnsigned() << 8) | lo.getUnsigned();
    }
    pair.getUnsigned = function() {
      return (hi.getUnsigned() << 8) | lo.getUnsigned();
    }

    return pair;
  }

  /*
   **
   ** Utility methods
   **
   */
  function start() {
    alu.start();
    setupBusHandlersInternal();
    setupBusHandlers();
    return reset();
  }

  function reset() {
    alu.reset();
    a.assign(0);
    b.assign(0);
    c.assign(0);
    d.assign(0);
    e.assign(0);
    h.assign(0);
    l.assign(0);
    pc.assign(0);
    sp.assign(0);
    ix.assign(0);
    iy.assign(0);
    prime_a.assign(0);
    prime_b.assign(0);
    prime_c.assign(0);
    prime_d.assign(0);
    prime_e.assign(0);
    prime_f.assign(0);
    prime_h.assign(0);
    prime_l.assign(0);
    intv.assign(0);
    memrefresh.assign(0);
    memr7.assign(0);
    isBigEndian = (false);
    inHalt = (false);
    int_iff0 = (0);
    int_iff1 = (0);
    int_iff2 = (0);
    interruptMode = (0);
    wasNMIGenerated = (false);
    wasIRQGenerated = (false);
  }

  function getRegisterValueA() {
    return a.getUnsigned();
  }

  function setRegisterValueA(v) {
    a.assign(v);
  }

  function getRegisterValueB() {
    return b.getUnsigned();
  }

  function setRegisterValueB(v) {
    b.assign(v);
  }

  function getRegisterValueC() {
    return c.getUnsigned();
  }

  function setRegisterValueC(v) {
    c.assign(v);
  }

  function getRegisterValueD() {
    return d.getUnsigned();
  }

  function setRegisterValueD(v) {
    d.assign(v);
  }

  function getRegisterValueE() {
    return e.getUnsigned();
  }

  function setRegisterValueE(v) {
    e.assign(v);
  }

  function getRegisterValueH() {
    return h.getUnsigned();
  }

  function setRegisterValueH(v) {
    h.assign(v);
  }

  function getRegisterValueL() {
    return l.getUnsigned();
  }

  function setRegisterValueL(v) {
    l.assign(v);
  }

  function getRegisterValuePC() {
    return pc.getUnsigned();
  }

  function setRegisterValuePC(v) {
    pc.assign(v);
  }

  function getRegisterValueSP() {
    return sp.getUnsigned();
  }

  function setRegisterValueSP(v) {
    sp.assign(v);
  }

  function getRegisterValueIX() {
    return ix.getUnsigned();
  }

  function setRegisterValueIX(v) {
    ix.assign(v);
  }

  function getRegisterValueIY() {
    return iy.getUnsigned();
  }

  function setRegisterValueIY(v) {
    iy.assign(v);
  }

  function getRegisterValuePRIME_A() {
    return prime_a.getUnsigned();
  }

  function setRegisterValuePRIME_A(v) {
    prime_a.assign(v);
  }

  function getRegisterValuePRIME_B() {
    return prime_b.getUnsigned();
  }

  function setRegisterValuePRIME_B(v) {
    prime_b.assign(v);
  }

  function getRegisterValuePRIME_C() {
    return prime_c.getUnsigned();
  }

  function setRegisterValuePRIME_C(v) {
    prime_c.assign(v);
  }

  function getRegisterValuePRIME_D() {
    return prime_d.getUnsigned();
  }

  function setRegisterValuePRIME_D(v) {
    prime_d.assign(v);
  }

  function getRegisterValuePRIME_E() {
    return prime_e.getUnsigned();
  }

  function setRegisterValuePRIME_E(v) {
    prime_e.assign(v);
  }

  function getRegisterValuePRIME_F() {
    return prime_f.getUnsigned();
  }

  function setRegisterValuePRIME_F(v) {
    prime_f.assign(v);
  }

  function getRegisterValuePRIME_H() {
    return prime_h.getUnsigned();
  }

  function setRegisterValuePRIME_H(v) {
    prime_h.assign(v);
  }

  function getRegisterValuePRIME_L() {
    return prime_l.getUnsigned();
  }

  function setRegisterValuePRIME_L(v) {
    prime_l.assign(v);
  }

  function getRegisterValueINTV() {
    return intv.getUnsigned();
  }

  function setRegisterValueINTV(v) {
    intv.assign(v);
  }

  function getRegisterValueMEMREFRESH() {
    return memrefresh.getUnsigned();
  }

  function setRegisterValueMEMREFRESH(v) {
    memrefresh.assign(v);
  }

  function getRegisterValueMEMR7() {
    return memr7.getUnsigned();
  }

  function setRegisterValueMEMR7(v) {
    memr7.assign(v);
  }

  function getRegisterValue(name) {
    name = name.toLowerCase();
    if (name == 'a') return getRegisterValueA();
    if (name == 'b') return getRegisterValueB();
    if (name == 'c') return getRegisterValueC();
    if (name == 'd') return getRegisterValueD();
    if (name == 'e') return getRegisterValueE();
    if (name == 'h') return getRegisterValueH();
    if (name == 'l') return getRegisterValueL();
    if (name == 'pc') return getRegisterValuePC();
    if (name == 'sp') return getRegisterValueSP();
    if (name == 'ix') return getRegisterValueIX();
    if (name == 'iy') return getRegisterValueIY();
    if (name == 'prime_a') return getRegisterValuePRIME_A();
    if (name == 'prime_b') return getRegisterValuePRIME_B();
    if (name == 'prime_c') return getRegisterValuePRIME_C();
    if (name == 'prime_d') return getRegisterValuePRIME_D();
    if (name == 'prime_e') return getRegisterValuePRIME_E();
    if (name == 'prime_f') return getRegisterValuePRIME_F();
    if (name == 'prime_h') return getRegisterValuePRIME_H();
    if (name == 'prime_l') return getRegisterValuePRIME_L();
    if (name == 'intv') return getRegisterValueINTV();
    if (name == 'memrefresh') return getRegisterValueMEMREFRESH();
    if (name == 'memr7') return getRegisterValueMEMR7();
  }

  function setRegisterValue(name, v) {
    name = name.toLowerCase();
    if (name === 'a') return setRegisterValueA(v);
    if (name === 'b') return setRegisterValueB(v);
    if (name === 'c') return setRegisterValueC(v);
    if (name === 'd') return setRegisterValueD(v);
    if (name === 'e') return setRegisterValueE(v);
    if (name === 'h') return setRegisterValueH(v);
    if (name === 'l') return setRegisterValueL(v);
    if (name === 'pc') return setRegisterValuePC(v);
    if (name === 'sp') return setRegisterValueSP(v);
    if (name === 'ix') return setRegisterValueIX(v);
    if (name === 'iy') return setRegisterValueIY(v);
    if (name === 'prime_a') return setRegisterValuePRIME_A(v);
    if (name === 'prime_b') return setRegisterValuePRIME_B(v);
    if (name === 'prime_c') return setRegisterValuePRIME_C(v);
    if (name === 'prime_d') return setRegisterValuePRIME_D(v);
    if (name === 'prime_e') return setRegisterValuePRIME_E(v);
    if (name === 'prime_f') return setRegisterValuePRIME_F(v);
    if (name === 'prime_h') return setRegisterValuePRIME_H(v);
    if (name === 'prime_l') return setRegisterValuePRIME_L(v);
    if (name === 'intv') return setRegisterValueINTV(v);
    if (name === 'memrefresh') return setRegisterValueMEMREFRESH(v);
    if (name === 'memr7') return setRegisterValueMEMR7(v);
  }

  function setFlagValue(name, v) {
    name = name.toLowerCase();
    if (name === 'c') return changeFlagC(v);
    if (name === 'n') return changeFlagN(v);
    if (name === 'p') return changeFlagP(v);
    if (name === 'v') return changeFlagV(v);
    if (name === 'b3') return changeFlagB3(v);
    if (name === 'h') return changeFlagH(v);
    if (name === 'b5') return changeFlagB5(v);
    if (name === 'z') return changeFlagZ(v);
    if (name === 's') return changeFlagS(v);
  }

  function getFlagC() {
    return cc_bit_0;
  }

  function clearFlagC() {
    cc_bit_0 = 0;
  }

  function setFlagC() {
    cc_bit_0 = 1;
  }

  function affectFlagC() {
    if (carry()) {
      setFlagC();
    } else {
      clearFlagC();
    }
  }

  function changeFlagC(newState) {
    if (newState) {
      setFlagC();
    } else {
      clearFlagC();
    }
  }

  function getFlagN() {
    return cc_bit_1;
  }

  function clearFlagN() {
    cc_bit_1 = 0;
  }

  function setFlagN() {
    cc_bit_1 = 1;
  }

  function affectFlagN() {
    if (subtract()) {
      setFlagN();
    } else {
      clearFlagN();
    }
  }

  function changeFlagN(newState) {
    if (newState) {
      setFlagN();
    } else {
      clearFlagN();
    }
  }

  function getFlagP() {
    return cc_bit_2;
  }

  function clearFlagP() {
    cc_bit_2 = 0;
  }

  function setFlagP() {
    cc_bit_2 = 1;
  }

  function affectFlagP() {
    if (parity()) {
      setFlagP();
    } else {
      clearFlagP();
    }
  }

  function changeFlagP(newState) {
    if (newState) {
      setFlagP();
    } else {
      clearFlagP();
    }
  }

  function getFlagV() {
    return cc_bit_2;
  }

  function clearFlagV() {
    cc_bit_2 = 0;
  }

  function setFlagV() {
    cc_bit_2 = 1;
  }

  function affectFlagV() {
    if (overflow()) {
      setFlagV();
    } else {
      clearFlagV();
    }
  }

  function changeFlagV(newState) {
    if (newState) {
      setFlagV();
    } else {
      clearFlagV();
    }
  }

  function getFlagB3() {
    return cc_bit_3;
  }

  function clearFlagB3() {
    cc_bit_3 = 0;
  }

  function setFlagB3() {
    cc_bit_3 = 1;
  }

  function affectFlagB3() {
    if (unused3()) {
      setFlagB3();
    } else {
      clearFlagB3();
    }
  }

  function changeFlagB3(newState) {
    if (newState) {
      setFlagB3();
    } else {
      clearFlagB3();
    }
  }

  function getFlagH() {
    return cc_bit_4;
  }

  function clearFlagH() {
    cc_bit_4 = 0;
  }

  function setFlagH() {
    cc_bit_4 = 1;
  }

  function affectFlagH() {
    if (halfcarry()) {
      setFlagH();
    } else {
      clearFlagH();
    }
  }

  function changeFlagH(newState) {
    if (newState) {
      setFlagH();
    } else {
      clearFlagH();
    }
  }

  function getFlagB5() {
    return cc_bit_5;
  }

  function clearFlagB5() {
    cc_bit_5 = 0;
  }

  function setFlagB5() {
    cc_bit_5 = 1;
  }

  function affectFlagB5() {
    if (unused5()) {
      setFlagB5();
    } else {
      clearFlagB5();
    }
  }

  function changeFlagB5(newState) {
    if (newState) {
      setFlagB5();
    } else {
      clearFlagB5();
    }
  }

  function getFlagZ() {
    return cc_bit_6;
  }

  function clearFlagZ() {
    cc_bit_6 = 0;
  }

  function setFlagZ() {
    cc_bit_6 = 1;
  }

  function affectFlagZ() {
    if (zero()) {
      setFlagZ();
    } else {
      clearFlagZ();
    }
  }

  function changeFlagZ(newState) {
    if (newState) {
      setFlagZ();
    } else {
      clearFlagZ();
    }
  }

  function getFlagS() {
    return cc_bit_7;
  }

  function clearFlagS() {
    cc_bit_7 = 0;
  }

  function setFlagS() {
    cc_bit_7 = 1;
  }

  function affectFlagS() {
    if (sign()) {
      setFlagS();
    } else {
      clearFlagS();
    }
  }

  function changeFlagS(newState) {
    if (newState) {
      setFlagS();
    } else {
      clearFlagS();
    }
  }

  function update(how) {
    // emf.control ensures only 1 step is executed
    return step();
  }

  function xferCCBitsToFlagsByte() {
    f.assign(
      (cc_bit_0 ? 1 : 0) |
      (cc_bit_1 ? 2 : 0) |
      (cc_bit_2 ? 4 : 0) |
      (cc_bit_3 ? 8 : 0) |
      (cc_bit_4 ? 16 : 0) |
      (cc_bit_5 ? 32 : 0) |
      (cc_bit_6 ? 64 : 0) |
      (cc_bit_7 ? 128 : 0) |
      0
    );
  }

  function xferFlagsByteToCCBits() {
    let v = f.getUnsigned();
    cc_bit_0 = (v & 1) ? 1 : 0;
    cc_bit_1 = (v & 2) ? 1 : 0;
    cc_bit_2 = (v & 4) ? 1 : 0;
    cc_bit_3 = (v & 8) ? 1 : 0;
    cc_bit_4 = (v & 16) ? 1 : 0;
    cc_bit_5 = (v & 32) ? 1 : 0;
    cc_bit_6 = (v & 64) ? 1 : 0;
    cc_bit_7 = (v & 128) ? 1 : 0;
  }

  //
  // Special instructions
  //
  alu.rrd8 = function() { // only for (HL)
    var v = read8(hl);
    var av = a.getUnsigned();
    var newHL = ((av & 0x0f) << 4) | (v >> 4);
    var new_a = (av & 0xf0) | (v & 0x0f);

    write8(hl, newHL);
    a.assign(new_a);

    computeFlags8(new_a);
    return new_a;
  }

  alu.rld8 = function() { // only applies to (hl)
    var v = read8(hl);
    var av = a.getUnsigned();
    var newHL = (v << 4) | (av & 0x0f);
    var new_a = (av & 0xf0) | ((v & 0xf0) >> 4);

    write8(hl, newHL);
    a.assign(new_a);

    computeFlags8(new_a);
    return new_a;
  }

  //
  // CPU handlers
  function halt() {
    inHalt = true;
    pc.sub(1); // hold still on this instruction, until an NMI hits
  }

  function disableInterrupt() {
    int_iff1 = int_iff2 = 0;
    //interruptEnabled = false;
  }

  function enableInterrupt() {
    int_iff1 = int_iff2 = 1;
    //interruptEnabled = true;
  }

  function im0() {
    interruptMode = 0;
  }

  function im1() {
    interruptMode = 1;
  }

  function im2() {
    interruptMode = 2;
  }

  // INTERUPTS : NMI

  // returns true if we've handled an interupt
  function updateMemoryRefresh() {
    memrefresh.assign((memrefresh.getUnsigned() + 1) & 0x7f);
  }

  function updateInterupts() {
    if (!wasNMIGenerated && inHalt) {
      do_z80_interrupt();
    } else if (wasIRQGenerated) {
      do_z80_interrupt();
      wasIRQGenerated = false;
    } else if (wasNMIGenerated) {
      do_z80_nmi();
      return true;
    }
    return false;
  }

  function do_z80_interrupt() {
    let tstates = 0;

    if (int_iff1) {

      if (inHalt) {
        //z80.pc++; z80.pc &= 0xffff;
        pc.add(1);
        inHalt = false;
      }

      int_iff1 = int_iff2 = 0;

      sp.add(-2);
      write16(sp.getUnsigned(), pc.getUnsigned());

      updateMemoryRefresh();

      switch (interruptMode) {
        case 0:
        case 1:
          pc.assign(0x0038);
          tstates += 13;
          break;
        case 2: {
          var inttemp = (intv.getUnsigned() << 8) | 0xff;
          var pcl = read8(inttemp++);
          inttemp &= 0xffff;
          var pch = read8(inttemp);
          pc.assign((pch << 8) | pcl);
          tstates += 19;
          break;
        }
        default:
          ;
      }
    }
    return tstates;
  }


  function do_z80_nmi() {

    if (inHalt) {
      //z80.pc++; z80.pc &= 0xffff;
      pc.add(1);
      inHalt = false;
    }

    z80.iff2 = z80.iff1;
    z80.iff1 = 0;

    z80.sp = (z80.sp - 1) & 0xffff;
    writebyte_internal(z80.sp, (z80.pc >> 8));
    z80.sp = (z80.sp - 1) & 0xffff;
    writebyte_internal(z80.sp, (z80.pc & 0xff));

    tstates += 11;
    z80.pc = 0x0066;
  }

  function step() {
    if (updateInterupts()) {
      return 12; // arbitrary, non-zero
    }

    return processOpcode();
  }

  function processOpcode() {
    var bit;
    var opcode = fetch8()
    var cycles = 1;

    switch (opcode) {
      case 0x0:
        // nop
        // Reference: zaks:82 page 359

        ;
        pc.add(1);
        return 4;


        break;

      case 0x1:
        // LD @r,@n
        // Reference: zaks:82 page 293

        bc.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x2:
        // LD (BC),A
        // Reference: zaks:82 page 299

        write8(bc, a);
        pc.add(1);
        return 7;


        break;

      case 0x3:
        // INC @r
        // Reference: zaks:82 page 265

        bc.assign(emf.Maths.add_u16u16(bc, 1));
        pc.add(1);
        return 6;


        break;

      case 0x4:
        // INC @r
        // Reference: zaks:82 page 264

        b.assign(alu.add_u8u8c(b, 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x5:
        // DEC @r
        // Reference: zaks:82 page 238

        b.assign(alu.sub_u8u8b(b, 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x6:
        // LD @r,@n
        // Reference: zaks:82 page 295

        b.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x7:
        // RLCA
        // Reference: zaks:82 page 399

        a.assign(alu.rlc8(a));
        clearFlagH();
        clearFlagN();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8:
        // EX AF,AF’
        // Reference: zaks:82 page 248

        tmp8.assign(a);
        a.assign(prime_a);
        prime_a.assign(tmp8);
        xferCCBitsToFlagsByte();
        tmp8.assign(f);
        f.assign(prime_f);
        xferFlagsByteToCCBits();
        prime_f.assign(tmp8);
        pc.add(1);
        return 4;


        break;

      case 0x9:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        hl.assign(alu.add_u16u16c(hl, bc));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 11;


        break;

      case 0xa:
        // LD A,(BC)
        // Reference: zaks:82 page 329

        a.assign(read8(bc));
        pc.add(1);
        return 7;


        break;

      case 0xb:
        // DEC @r
        // Reference: zaks:82 page 240

        bc.assign(emf.Maths.sub_u16u16(bc, 1));
        pc.add(1);
        return 6;


        break;

      case 0xc:
        // INC @r
        // Reference: zaks:82 page 264

        c.assign(alu.add_u8u8c(c, 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0xd:
        // DEC @r
        // Reference: zaks:82 page 238

        c.assign(alu.sub_u8u8b(c, 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0xe:
        // LD @r,@n
        // Reference: zaks:82 page 295

        c.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0xf:
        // RRCA
        // Reference: zaks:82 page 415

        a.assign(alu.rrc8(a));
        clearFlagH();
        clearFlagN();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x10:
        // DJNZ (PC+@n)
        // Reference: zaks:82 page 245

        b.assign(alu.sub_u8u8b(b, 1));
        if (b.notEquals(0)) {
          pc.assign(emf.Maths.add_u16s8(pc, read8(pc.getUnsigned() + (1))));;
          cycles = 5;
        }
        pc.add(2);
        return 8 + cycles;


        break;

      case 0x11:
        // LD @r,@n
        // Reference: zaks:82 page 293

        de.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x12:
        // LD (DE),A
        // Reference: zaks:82 page 300

        write8(de, a);
        pc.add(1);
        return 7;


        break;

      case 0x13:
        // INC @r
        // Reference: zaks:82 page 265

        de.assign(emf.Maths.add_u16u16(de, 1));
        pc.add(1);
        return 6;


        break;

      case 0x14:
        // INC @r
        // Reference: zaks:82 page 264

        d.assign(alu.add_u8u8c(d, 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x15:
        // DEC @r
        // Reference: zaks:82 page 238

        d.assign(alu.sub_u8u8b(d, 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x16:
        // LD @r,@n
        // Reference: zaks:82 page 295

        d.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x17:
        // RLA
        // Reference: zaks:82 page 398

        a.assign(alu.rl8(a, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x18:
        // JR (PC+@n)
        // Reference: zaks:82 page 290

        pc.assign(emf.Maths.add_u16u16(emf.Maths.add_u16s8(pc, read8(pc.getUnsigned() + (1))), 0));
        pc.add(2);
        return 12;


        break;

      case 0x19:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        hl.assign(alu.add_u16u16c(hl, de));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 11;


        break;

      case 0x1a:
        // LD A,(DE)
        // Reference: zaks:82 page 330

        a.assign(read8(de));
        pc.add(1);
        return 7;


        break;

      case 0x1b:
        // DEC @r
        // Reference: zaks:82 page 240

        de.assign(emf.Maths.sub_u16u16(de, 1));
        pc.add(1);
        return 6;


        break;

      case 0x1c:
        // INC @r
        // Reference: zaks:82 page 264

        e.assign(alu.add_u8u8c(e, 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x1d:
        // DEC @r
        // Reference: zaks:82 page 238

        e.assign(alu.sub_u8u8b(e, 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x1e:
        // LD @r,@n
        // Reference: zaks:82 page 295

        e.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x1f:
        // RRA
        // Reference: zaks:82 page 412

        a.assign(alu.rra8(a, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x20:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        if (cc_bit_6 == 0) {
          pc.assign(emf.Maths.add_u16u16(emf.Maths.add_u16s8(pc, read8(pc.getUnsigned() + (1))), 0));
          cycles = 5;
        }
        pc.add(2);
        return 10 + cycles;


        break;

      case 0x21:
        // LD @r,@n
        // Reference: zaks:82 page 293

        hl.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x22:
        // LD (@n),HL
        // Reference: zaks:82 page 323

        write16(read16(pc.getUnsigned() + (1)), hl);
        pc.add(3);
        return 16;


        break;

      case 0x23:
        // INC @r
        // Reference: zaks:82 page 265

        hl.assign(emf.Maths.add_u16u16(hl, 1));
        pc.add(1);
        return 6;


        break;

      case 0x24:
        // INC @r
        // Reference: zaks:82 page 264

        h.assign(alu.add_u8u8c(h, 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x25:
        // DEC @r
        // Reference: zaks:82 page 238

        h.assign(alu.sub_u8u8b(h, 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x26:
        // LD @r,@n
        // Reference: zaks:82 page 295

        h.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x27:
        // DAA
        // Reference: zaks:82 page 236

        a.assign(alu.daa(a, cc_bit_0, cc_bit_1));
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x28:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        if (cc_bit_6 == 1) {
          pc.assign(emf.Maths.add_u16u16(emf.Maths.add_u16s8(pc, read8(pc.getUnsigned() + (1))), 0));
          cycles = 5;
        }
        pc.add(2);
        return 10 + cycles;


        break;

      case 0x29:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        hl.assign(alu.add_u16u16c(hl, hl));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 11;


        break;

      case 0x2a:
        // LD HL,(@n)
        // Reference: zaks:82 page 334

        hl.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 16;


        break;

      case 0x2b:
        // DEC @r
        // Reference: zaks:82 page 240

        hl.assign(emf.Maths.sub_u16u16(hl, 1));
        pc.add(1);
        return 6;


        break;

      case 0x2c:
        // INC @r
        // Reference: zaks:82 page 264

        l.assign(alu.add_u8u8c(l, 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x2d:
        // DEC @r
        // Reference: zaks:82 page 238

        l.assign(alu.sub_u8u8b(l, 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x2e:
        // LD @r,@n
        // Reference: zaks:82 page 295

        l.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x2f:
        // CPL
        // Reference: zaks:82 page 235

        a.assign(alu.complement8(a));
        setFlagH();
        setFlagN();
        pc.add(1);
        return 4;


        break;

      case 0x30:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        if (cc_bit_0 == 0) {
          pc.assign(emf.Maths.add_u16u16(emf.Maths.add_u16s8(pc, read8(pc.getUnsigned() + (1))), 0));
          cycles = 5;
        }
        pc.add(2);
        return 10 + cycles;


        break;

      case 0x31:
        // LD @r,@n
        // Reference: zaks:82 page 293

        sp.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 10;


        break;

      case 0x32:
        // LD (@n),A
        // Reference: zaks:82 page 319

        write8(read16(pc.getUnsigned() + (1)), a);
        pc.add(3);
        return 13;


        break;

      case 0x33:
        // INC @r
        // Reference: zaks:82 page 265

        sp.assign(emf.Maths.add_u16u16(sp, 1));
        pc.add(1);
        return 6;


        break;

      case 0x34:
        // INC @r
        // Reference: zaks:82 page 264
        // INC (HL)
        // Reference: zaks:82 page 267

        write8(hl, alu.add_u8u8c(read8(hl), 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 11;


        break;

      case 0x35:
        // DEC @r
        // Reference: zaks:82 page 238
        // DEC (HL)
        // Reference: zaks:82 page 238

        write8(hl, alu.sub_u8u8b(read8(hl), 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 11;


        break;

      case 0x36:
        // LD @r,@n
        // Reference: zaks:82 page 295
        // LD (HL),@n
        // Reference: zaks:82 page 301

        write8(hl, read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 10;


        break;

      case 0x37:
        // SCF
        // Reference: zaks:82 page 424

        ;
        clearFlagH();
        clearFlagN();
        setFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x38:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        if (cc_bit_0 == 1) {
          pc.assign(emf.Maths.add_u16u16(emf.Maths.add_u16s8(pc, read8(pc.getUnsigned() + (1))), 0));
          cycles = 5;
        }
        pc.add(2);
        return 10 + cycles;


        break;

      case 0x39:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        hl.assign(alu.add_u16u16c(hl, sp));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 11;


        break;

      case 0x3a:
        // LD A,(@n)
        // Reference: zaks:82 page 317

        a.assign(read8(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 13;


        break;

      case 0x3b:
        // DEC @r
        // Reference: zaks:82 page 240

        sp.assign(emf.Maths.sub_u16u16(sp, 1));
        pc.add(1);
        return 6;


        break;

      case 0x3c:
        // INC @r
        // Reference: zaks:82 page 264

        a.assign(alu.add_u8u8c(a, 1));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x3d:
        // DEC @r
        // Reference: zaks:82 page 238

        a.assign(alu.sub_u8u8b(a, 1));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 4;


        break;

      case 0x3e:
        // LD @r,@n
        // Reference: zaks:82 page 295

        a.assign(read8(pc.getUnsigned() + (1)));
        pc.add(2);
        return 7;


        break;

      case 0x3f:
        // CCF
        // Reference: zaks:82 page 224
        // Reference: The H flag should be set to the old carry, according to http://www.z80.info/z80sflag.htm 

        wasHalfCarry = cc_bit_0;
        wasCarry = cc_bit_0 ? 0 : 1;
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x40:
        // LD @r,@s
        // Reference: zaks:82 page 297

        b.assign(b);
        pc.add(1);
        return 4;


        break;

      case 0x41:
        // LD @r,@s
        // Reference: zaks:82 page 297

        b.assign(c);
        pc.add(1);
        return 4;


        break;

      case 0x42:
        // LD @r,@s
        // Reference: zaks:82 page 297

        b.assign(d);
        pc.add(1);
        return 4;


        break;

      case 0x43:
        // LD @r,@s
        // Reference: zaks:82 page 297

        b.assign(e);
        pc.add(1);
        return 4;


        break;

      case 0x44:
        // LD @r,@s
        // Reference: zaks:82 page 297

        b.assign(h);
        pc.add(1);
        return 4;


        break;

      case 0x45:
        // LD @r,@s
        // Reference: zaks:82 page 297

        b.assign(l);
        pc.add(1);
        return 4;


        break;

      case 0x46:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        b.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x47:
        // LD @r,@s
        // Reference: zaks:82 page 297

        b.assign(a);
        pc.add(1);
        return 4;


        break;

      case 0x48:
        // LD @r,@s
        // Reference: zaks:82 page 297

        c.assign(b);
        pc.add(1);
        return 4;


        break;

      case 0x49:
        // LD @r,@s
        // Reference: zaks:82 page 297

        c.assign(c);
        pc.add(1);
        return 4;


        break;

      case 0x4a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        c.assign(d);
        pc.add(1);
        return 4;


        break;

      case 0x4b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        c.assign(e);
        pc.add(1);
        return 4;


        break;

      case 0x4c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        c.assign(h);
        pc.add(1);
        return 4;


        break;

      case 0x4d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        c.assign(l);
        pc.add(1);
        return 4;


        break;

      case 0x4e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        c.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x4f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        c.assign(a);
        pc.add(1);
        return 4;


        break;

      case 0x50:
        // LD @r,@s
        // Reference: zaks:82 page 297

        d.assign(b);
        pc.add(1);
        return 4;


        break;

      case 0x51:
        // LD @r,@s
        // Reference: zaks:82 page 297

        d.assign(c);
        pc.add(1);
        return 4;


        break;

      case 0x52:
        // LD @r,@s
        // Reference: zaks:82 page 297

        d.assign(d);
        pc.add(1);
        return 4;


        break;

      case 0x53:
        // LD @r,@s
        // Reference: zaks:82 page 297

        d.assign(e);
        pc.add(1);
        return 4;


        break;

      case 0x54:
        // LD @r,@s
        // Reference: zaks:82 page 297

        d.assign(h);
        pc.add(1);
        return 4;


        break;

      case 0x55:
        // LD @r,@s
        // Reference: zaks:82 page 297

        d.assign(l);
        pc.add(1);
        return 4;


        break;

      case 0x56:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        d.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x57:
        // LD @r,@s
        // Reference: zaks:82 page 297

        d.assign(a);
        pc.add(1);
        return 4;


        break;

      case 0x58:
        // LD @r,@s
        // Reference: zaks:82 page 297

        e.assign(b);
        pc.add(1);
        return 4;


        break;

      case 0x59:
        // LD @r,@s
        // Reference: zaks:82 page 297

        e.assign(c);
        pc.add(1);
        return 4;


        break;

      case 0x5a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        e.assign(d);
        pc.add(1);
        return 4;


        break;

      case 0x5b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        e.assign(e);
        pc.add(1);
        return 4;


        break;

      case 0x5c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        e.assign(h);
        pc.add(1);
        return 4;


        break;

      case 0x5d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        e.assign(l);
        pc.add(1);
        return 4;


        break;

      case 0x5e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        e.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x5f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        e.assign(a);
        pc.add(1);
        return 4;


        break;

      case 0x60:
        // LD @r,@s
        // Reference: zaks:82 page 297

        h.assign(b);
        pc.add(1);
        return 4;


        break;

      case 0x61:
        // LD @r,@s
        // Reference: zaks:82 page 297

        h.assign(c);
        pc.add(1);
        return 4;


        break;

      case 0x62:
        // LD @r,@s
        // Reference: zaks:82 page 297

        h.assign(d);
        pc.add(1);
        return 4;


        break;

      case 0x63:
        // LD @r,@s
        // Reference: zaks:82 page 297

        h.assign(e);
        pc.add(1);
        return 4;


        break;

      case 0x64:
        // LD @r,@s
        // Reference: zaks:82 page 297

        h.assign(h);
        pc.add(1);
        return 4;


        break;

      case 0x65:
        // LD @r,@s
        // Reference: zaks:82 page 297

        h.assign(l);
        pc.add(1);
        return 4;


        break;

      case 0x66:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        h.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x67:
        // LD @r,@s
        // Reference: zaks:82 page 297

        h.assign(a);
        pc.add(1);
        return 4;


        break;

      case 0x68:
        // LD @r,@s
        // Reference: zaks:82 page 297

        l.assign(b);
        pc.add(1);
        return 4;


        break;

      case 0x69:
        // LD @r,@s
        // Reference: zaks:82 page 297

        l.assign(c);
        pc.add(1);
        return 4;


        break;

      case 0x6a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        l.assign(d);
        pc.add(1);
        return 4;


        break;

      case 0x6b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        l.assign(e);
        pc.add(1);
        return 4;


        break;

      case 0x6c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        l.assign(h);
        pc.add(1);
        return 4;


        break;

      case 0x6d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        l.assign(l);
        pc.add(1);
        return 4;


        break;

      case 0x6e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        l.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x6f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        l.assign(a);
        pc.add(1);
        return 4;


        break;

      case 0x70:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        write8(hl, b);
        pc.add(1);
        return 7;


        break;

      case 0x71:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        write8(hl, c);
        pc.add(1);
        return 7;


        break;

      case 0x72:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        write8(hl, d);
        pc.add(1);
        return 7;


        break;

      case 0x73:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        write8(hl, e);
        pc.add(1);
        return 7;


        break;

      case 0x74:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        write8(hl, h);
        pc.add(1);
        return 7;


        break;

      case 0x75:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        write8(hl, l);
        pc.add(1);
        return 7;


        break;

      case 0x76:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356
        // LD (HL),@r
        // Reference: zaks:82 page 303
        // HALT
        // Reference: zaks:82 page 257

        halt();
        pc.add(1);
        return 7;


        break;

      case 0x77:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        write8(hl, a);
        pc.add(1);
        return 7;


        break;

      case 0x78:
        // LD @r,@s
        // Reference: zaks:82 page 297

        a.assign(b);
        pc.add(1);
        return 4;


        break;

      case 0x79:
        // LD @r,@s
        // Reference: zaks:82 page 297

        a.assign(c);
        pc.add(1);
        return 4;


        break;

      case 0x7a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        a.assign(d);
        pc.add(1);
        return 4;


        break;

      case 0x7b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        a.assign(e);
        pc.add(1);
        return 4;


        break;

      case 0x7c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        a.assign(h);
        pc.add(1);
        return 4;


        break;

      case 0x7d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        a.assign(l);
        pc.add(1);
        return 4;


        break;

      case 0x7e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        a.assign(read8(hl));
        pc.add(1);
        return 7;


        break;

      case 0x7f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        a.assign(a);
        pc.add(1);
        return 4;


        break;

      case 0x80:
        // ADD A,@r
        // Reference: zaks:82 page 201

        a.assign(alu.add_u8u8c(a, b));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x81:
        // ADD A,@r
        // Reference: zaks:82 page 201

        a.assign(alu.add_u8u8c(a, c));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x82:
        // ADD A,@r
        // Reference: zaks:82 page 201

        a.assign(alu.add_u8u8c(a, d));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x83:
        // ADD A,@r
        // Reference: zaks:82 page 201

        a.assign(alu.add_u8u8c(a, e));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x84:
        // ADD A,@r
        // Reference: zaks:82 page 201

        a.assign(alu.add_u8u8c(a, h));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x85:
        // ADD A,@r
        // Reference: zaks:82 page 201

        a.assign(alu.add_u8u8c(a, l));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x86:
        // ADD A,@r
        // Reference: zaks:82 page 201
        // ADD A,(HL)
        // Reference: zaks:82 page 194

        a.assign(alu.add_u8u8c(a, read8(hl)));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x87:
        // ADD A,@r
        // Reference: zaks:82 page 201

        a.assign(alu.add_u8u8c(a, a));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x88:
        // ADC A,@r
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, b, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x89:
        // ADC A,@r
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, c, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8a:
        // ADC A,@r
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, d, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8b:
        // ADC A,@r
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, e, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8c:
        // ADC A,@r
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, h, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8d:
        // ADC A,@r
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, l, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x8e:
        // ADC A,@r
        // Reference: zaks:82 page 190
        // ADC A,(HL)
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, read8(hl), cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x8f:
        // ADC A,@r
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, a, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x90:
        // SUB A,@r
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, b));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x91:
        // SUB A,@r
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, c));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x92:
        // SUB A,@r
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, d));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x93:
        // SUB A,@r
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, e));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x94:
        // SUB A,@r
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, h));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x95:
        // SUB A,@r
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, l));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x96:
        // SUB A,@r
        // Reference: zaks:82 page 434
        // SUB A,(HL)
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, read8(hl)));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x97:
        // SUB A,@r
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, a));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x98:
        // SBC A,@r
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, b, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x99:
        // SBC A,@r
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, c, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9a:
        // SBC A,@r
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, d, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9b:
        // SBC A,@r
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, e, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9c:
        // SBC A,@r
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, h, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9d:
        // SBC A,@r
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, l, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x9e:
        // SBC A,@r
        // Reference: zaks:82 page 420
        // SBC A,(HL)
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, read8(hl), cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0x9f:
        // SBC A,@r
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, a, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xa0:
        // AND A,@r
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, b));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa1:
        // AND A,@r
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, c));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa2:
        // AND A,@r
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, d));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa3:
        // AND A,@r
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, e));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa4:
        // AND A,@r
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, h));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa5:
        // AND A,@r
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, l));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa6:
        // AND A,@r
        // Reference: zaks:82 page 209
        // AND A,(HL)
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, read8(hl)));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 7;


        break;

      case 0xa7:
        // AND A,@r
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, a));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa8:
        // XOR A,@r
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, b));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xa9:
        // XOR A,@r
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, c));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xaa:
        // XOR A,@r
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, d));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xab:
        // XOR A,@r
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, e));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xac:
        // XOR A,@r
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, h));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xad:
        // XOR A,@r
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, l));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xae:
        // XOR A,@r
        // Reference: zaks:82 page 436
        // XOR A,(HL)
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, read8(hl)));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 7;


        break;

      case 0xaf:
        // XOR A,@r
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, a));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb0:
        // OR A,@r
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, b));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb1:
        // OR A,@r
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, c));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb2:
        // OR A,@r
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, d));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb3:
        // OR A,@r
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, e));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb4:
        // OR A,@r
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, h));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb5:
        // OR A,@r
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, l));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb6:
        // OR A,@r
        // Reference: zaks:82 page 360
        // OR A,(HL)
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, read8(hl)));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 7;


        break;

      case 0xb7:
        // OR A,@r
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, a));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 4;


        break;

      case 0xb8:
        // CP A,@r
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, b));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xb9:
        // CP A,@r
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, c));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xba:
        // CP A,@r
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, d));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbb:
        // CP A,@r
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, e));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbc:
        // CP A,@r
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, h));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbd:
        // CP A,@r
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, l));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xbe:
        // CP A,@r
        // Reference: zaks:82 page 225
        // CP A,(HL)
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, read8(hl)));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 7;


        break;

      case 0xbf:
        // CP A,@r
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, a));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0xc0:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_6 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xc1:
        // POP @r
        // Reference: zaks:82 page 373

        bc.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xc2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_6 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xc3:
        // JP (@n)
        // Reference: zaks:82 page 284

        pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        pc.add(3);
        return 10;


        break;

      case 0xc4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_6 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xc5:
        // PUSH @r
        // Reference: zaks:82 page 379

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, bc);
        pc.add(1);
        return 10;


        break;

      case 0xc6:
        // ADD A,@n
        // Reference: zaks:82 page 200

        a.assign(alu.add_u8u8c(a, read8(pc.getUnsigned() + (1))));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xc7:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x00, -1));
        pc.add(1);
        return 11;


        break;

      case 0xc8:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_6 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xc9:
        // RET
        // Reference: zaks:82 page 388

        pc.assign(read16(sp) - 1);
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        pc.add(1);
        return 10;


        break;

      case 0xca:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_6 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xcb:
        // CB
        // Reference:  page 
        // return cb_ext();
        // extended instructions beginning cb called cb

        pc.add(1);
        return cb_ext();
        pc.add(1);
        return 0;


        break;

      case 0xcc:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_6 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xcd:
        // CALL (@n)
        // Reference: zaks:82 page 222

        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, emf.Maths.add_u16u16(pc, 3));
        pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));
        pc.add(3);
        return 17;


        break;

      case 0xce:
        // ADC A,@n
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, read8(pc.getUnsigned() + (1)), cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xcf:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x08, -1));
        pc.add(1);
        return 11;


        break;

      case 0xd0:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_0 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xd1:
        // POP @r
        // Reference: zaks:82 page 373

        de.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xd2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_0 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xd3:
        // OUT (@n),A
        // Reference: zaks:82 page 368

        out8(read8(pc.getUnsigned() + (1)), a);
        pc.add(2);
        return 11;


        break;

      case 0xd4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_0 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xd5:
        // PUSH @r
        // Reference: zaks:82 page 379

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, de);
        pc.add(1);
        return 10;


        break;

      case 0xd6:
        // SUB @n
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, read8(pc.getUnsigned() + (1))));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xd7:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x10, -1));
        pc.add(1);
        return 11;


        break;

      case 0xd8:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_0 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xd9:
        // EXX
        // Reference: zaks:82 page 256

        tmp16.assign(bc);
        bc.assign(prime_bc);
        prime_bc.assign(tmp16);
        tmp16.assign(de);
        de.assign(prime_de);
        prime_de.assign(tmp16);
        tmp16.assign(hl);
        hl.assign(prime_hl);
        prime_hl.assign(tmp16);
        pc.add(1);
        return 4;


        break;

      case 0xda:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_0 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xdb:
        // IN A,(@n)
        // Reference: zaks:82 page 263

        a.assign(in8(read8(pc.getUnsigned() + (1))));
        computeFlags8(a.getUnsigned());
        pc.add(2);
        return 11;


        break;

      case 0xdc:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_0 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xdd:
        // DD
        // Reference:  page 
        // return dd_ext();
        // extended instructions beginning dd called dd

        pc.add(1);
        return dd_ext();
        pc.add(1);
        return 0;


        break;

      case 0xde:
        // SBC A,@n
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, read8(pc.getUnsigned() + (1)), cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 11;


        break;

      case 0xdf:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x18, -1));
        pc.add(1);
        return 11;


        break;

      case 0xe0:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_2 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xe1:
        // POP @r
        // Reference: zaks:82 page 373

        hl.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xe2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_2 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xe3:
        // EX (SP),HL
        // Reference: zaks:82 page 250

        tmp16.assign(hl);
        hl.assign(read16(sp));
        write16(sp, tmp16);
        pc.add(1);
        return 19;


        break;

      case 0xe4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_2 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xe5:
        // PUSH @r
        // Reference: zaks:82 page 379

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, hl);
        pc.add(1);
        return 10;


        break;

      case 0xe6:
        // AND @n
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, read8(pc.getUnsigned() + (1))));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 7;


        break;

      case 0xe7:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x20, -1));
        pc.add(1);
        return 11;


        break;

      case 0xe8:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_2 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xe9:
        // JP (HL)
        // Reference: zaks:82 page 285

        pc.assign(emf.Maths.add_u16u16(hl, -1));
        pc.add(1);
        return 4;


        break;

      case 0xea:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_2 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xeb:
        // EX DE,HL
        // Reference: zaks:82 page 249

        tmp16.assign(hl);
        hl.assign(de);
        de.assign(tmp16);
        pc.add(1);
        return 4;


        break;

      case 0xec:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_2 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xed:
        // ED
        // Reference:  page 
        // return ed_ext();
        // extended instructions beginning ed called ed

        pc.add(1);
        return ed_ext();
        pc.add(1);
        return 0;


        break;

      case 0xee:
        // XOR A,@n
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, read8(pc.getUnsigned() + (1))));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 7;


        break;

      case 0xef:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x28, -1));
        pc.add(1);
        return 11;


        break;

      case 0xf0:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_7 == 0) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xf1:
        // POP @r
        // Reference: zaks:82 page 373

        af.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        if (opcode == 0xf1) xferFlagsByteToCCBits();
        pc.add(1);
        return 10;


        break;

      case 0xf2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_7 == 0) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xf3:
        // DI
        // Reference: zaks:82 page 244

        disableInterrupt();
        pc.add(1);
        return 4;


        break;

      case 0xf4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_7 == 0) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xf5:
        // PUSH @r
        // Reference: zaks:82 page 379

        if (opcode == 0xf5) xferCCBitsToFlagsByte();
        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, af);
        pc.add(1);
        return 10;


        break;

      case 0xf6:
        // OR A,@n
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, read8(pc.getUnsigned() + (1))));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 7;


        break;

      case 0xf7:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x30, -1));
        pc.add(1);
        return 11;


        break;

      case 0xf8:
        // RET @r
        // Reference: zaks:82 page 390

        if (cc_bit_7 == 1) {
          pc.assign(read16(sp) - 1);
          sp.assign(emf.Maths.add_u16u16(sp, 2));;
          cycles = 6;
        }
        pc.add(1);
        return 5 + cycles;


        break;

      case 0xf9:
        // LD SP,HL
        // Reference: zaks:82 page 345

        sp.assign(hl);
        pc.add(1);
        return 6;


        break;

      case 0xfa:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        if (cc_bit_7 == 1) {
          pc.assign(emf.Maths.add_u16u16(read16(pc.getUnsigned() + (1)), -3));
        }
        pc.add(3);
        return 10;


        break;

      case 0xfb:
        // EI
        // Reference: zaks:82 page 247

        enableInterrupt();
        pc.add(1);
        return 4;


        break;

      case 0xfc:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        if (cc_bit_7 == 1) {
          sp.assign(emf.Maths.sub_u16u16(sp, 2));
          write16(sp, emf.Maths.add_u16u16(pc, 3));
          pc.assign(emf.Maths.sub_u16u16(read16(pc.getUnsigned() + (1)), 3));;
          cycles = 7;
        }
        pc.add(3);
        return 10 + cycles;


        break;

      case 0xfd:
        // FD
        // Reference:  page 
        // return fd_ext();
        // extended instructions beginning fd called fd

        pc.add(1);
        return fd_ext();
        pc.add(1);
        return 0;


        break;

      case 0xfe:
        // CP @n
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, read8(pc.getUnsigned() + (1))));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 7;


        break;

      case 0xff:
        // RST @r
        // Reference: zaks:82 page 418

        sp.assign(emf.Maths.add_u16u16(sp, -2));
        write16(sp, emf.Maths.add_u16u16(pc, 1));
        pc.assign(emf.Maths.add_u16u16(0x38, -1));
        pc.add(1);
        return 11;


        break;

    } // hctiws
    return 1;
  }

  function dd_ext() {
    var bit;
    var opcode = fetch8()
    var cycles = 1;

    switch (opcode) {
      case 0x0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        ix.assign(alu.add_u16u16c(ix, bc));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0xa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x10:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x11:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x12:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x13:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x14:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x15:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x16:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x17:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x18:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x19:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        ix.assign(alu.add_u16u16c(ix, de));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x1a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x20:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x21:
        // LD IX,@n
        // Reference: zaks:82 page 336

        ix.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 15;


        break;

      case 0x22:
        // LD (@n),IX
        // Reference: zaks:82 page 325

        write16(read16(pc.getUnsigned() + (1)), ix);
        pc.add(3);
        return 20;


        break;

      case 0x23:
        // INC IX
        // Reference: zaks:82 page 272

        ix.assign(emf.Maths.add_u16u16(ix, 1));
        pc.add(1);
        return 10;


        break;

      case 0x24:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x25:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x26:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x27:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x28:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x29:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        ix.assign(alu.add_u16u16c(ix, ix));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x2a:
        // LD IX,(@n)
        // Reference: zaks:82 page 338

        ix.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 20;


        break;

      case 0x2b:
        // DEC IX
        // Reference: zaks:82 page 242

        ix.assign(emf.Maths.sub_u16u16(ix, 1));
        pc.add(1);
        return 10;


        break;

      case 0x2c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x30:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x31:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x32:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x33:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x34:
        // INC (IX+@n)
        // Reference: zaks:82 page 268

        tmp8.assign(alu.add_u8u8c(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))), 1));
        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(2);
        return 23;


        break;

      case 0x35:
        // DEC (IX+@n)
        // Reference: zaks:82 page 238

        tmp8.assign(alu.sub_u8u8b(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))), 1));
        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(2);
        return 23;


        break;

      case 0x36:
        // LD (IX+@d),@n
        // Reference: zaks:82 page 309

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), read8(pc.getUnsigned() + (2)));
        pc.add(3);
        return 19;


        break;

      case 0x37:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x38:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x39:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        ix.assign(alu.add_u16u16c(ix, sp));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x3a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x40:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x41:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x42:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x43:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x44:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x45:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x46:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        b.assign(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x47:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x48:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x49:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        c.assign(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x4f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x50:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x51:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x52:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x53:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x54:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x55:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x56:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        d.assign(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x57:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x58:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x59:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        e.assign(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x5f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x60:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x61:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x62:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x63:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x64:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x65:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x66:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        h.assign(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x67:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x68:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x69:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        l.assign(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x6f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x70:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), b);
        pc.add(2);
        return 19;


        break;

      case 0x71:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), c);
        pc.add(2);
        return 19;


        break;

      case 0x72:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), d);
        pc.add(2);
        return 19;


        break;

      case 0x73:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), e);
        pc.add(2);
        return 19;


        break;

      case 0x74:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), h);
        pc.add(2);
        return 19;


        break;

      case 0x75:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), l);
        pc.add(2);
        return 19;


        break;

      case 0x76:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x77:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), a);
        pc.add(2);
        return 19;


        break;

      case 0x78:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x79:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        a.assign(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x7f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x80:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x81:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x82:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x83:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x84:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x85:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x86:
        // ADD A,(IX+@n)
        // Reference: zaks:82 page 196

        a.assign(alu.add_u8u8c(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 19;


        break;

      case 0x87:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x88:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x89:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8e:
        // ADC A,(IX+@n)
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))), cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(2);
        return 15;


        break;

      case 0x8f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x90:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x91:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x92:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x93:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x94:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x95:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x96:
        // SUB (IX+@n)
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 15;


        break;

      case 0x97:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x98:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x99:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9e:
        // SBC A,(IX+@n)
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))), cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 19;


        break;

      case 0x9f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa6:
        // AND (IX+@n)
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 19;


        break;

      case 0xa7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xaa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xab:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xac:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xad:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xae:
        // XOR A,(IX+@n)
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 15;


        break;

      case 0xaf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb6:
        // OR (IX+@n)
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 19;


        break;

      case 0xb7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xba:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbe:
        // CP A,(IX+@n)
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 19;


        break;

      case 0xbf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xca:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcb:
        // RLC (IX+@n)
        // Reference: zaks:82 page 404
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
          tmp8.assign(alu.rlc8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 23;

        }
        // RRC (IX+@n)
        // Reference: zaks:82 page 413
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
          tmp8.assign(alu.rrc8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // RL (IX+@n)
        // Reference: zaks:82 page 396
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
          tmp8.assign(alu.rl8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))), cc_bit_0));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // RR (IX+@n)
        // Reference: zaks:82 page 410
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
          tmp8.assign(alu.rr8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1)))), cc_bit_0));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 23;

        }
        // SLA (IX+@n)
        // Reference: zaks:82 page 428
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
          tmp8.assign(alu.sla8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // SRA (IX+@n)
        // Reference: zaks:82 page 430
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
          tmp8.assign(alu.sra8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // SLL (IX+@n)
        // Reference:  page 
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
          tmp8.assign(alu.sll8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // SRL (IX+@n)
        // Reference: zaks:82 page 432
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
          tmp8.assign(alu.srl8(read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 23;

        }
        // BIT @r,(IX+@n)
        // Reference: zaks:82 page 213
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
          let bit = (read8(emf.Maths.add_u16s8(pc, 2)) & 0x38) >> 3;;
          tmp8.assign(alu.testBit8(bit, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          clearFlagN();
          setFlagH();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          pc.add(3);
          return 20;

        }
        // RES @r,(IX+@n)
        // Reference: zaks:82 page 385
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;;
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), alu.clearBit8(bit, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          pc.add(3);
          return 15;

        }
        // SET @r,(IX+@n)
        // Reference: zaks:82 page 425
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;;
          write8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))), alu.setBit8(bit, read8(emf.Maths.add_u16s8(ix, read8(pc.getUnsigned() + (1))))));
          pc.add(3);
          return 23;

        }
        break;

      case 0xcc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xce:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xda:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xde:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe1:
        // POP IX
        // Reference: zaks:82 page 375

        ix.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        pc.add(1);
        return 14;


        break;

      case 0xe2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe3:
        // EX (SP),IX
        // Reference: zaks:82 page 252

        tmp16.assign(ix);
        ix.assign(read16(sp));
        write16(sp, tmp16);
        pc.add(1);
        return 23;


        break;

      case 0xe4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe5:
        // PUSH IX
        // Reference: zaks:82 page 381

        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, ix);
        pc.add(1);
        return 15;


        break;

      case 0xe6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe9:
        // JP (IX)
        // Reference: zaks:82 page 286

        pc.assign(emf.Maths.add_u16u16(ix, -1));
        pc.add(1);
        return 8;


        break;

      case 0xea:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xeb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xec:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xed:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xee:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xef:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf9:
        // LD SP,IX
        // Reference: zaks:82 page 346

        sp.assign(ix);
        pc.add(1);
        return 10;


        break;

      case 0xfa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfe:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xff:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

    } // hctiws
    return 1;
  }

  function cb_ext() {
    var bit;
    var opcode = fetch8()
    var cycles = 1;

    switch (opcode) {
      case 0x0:
        // RLC @r
        // Reference: zaks:82 page 400

        b.assign(alu.rlc8(b));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x1:
        // RLC @r
        // Reference: zaks:82 page 400

        c.assign(alu.rlc8(c));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x2:
        // RLC @r
        // Reference: zaks:82 page 400

        d.assign(alu.rlc8(d));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x3:
        // RLC @r
        // Reference: zaks:82 page 400

        e.assign(alu.rlc8(e));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x4:
        // RLC @r
        // Reference: zaks:82 page 400

        h.assign(alu.rlc8(h));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x5:
        // RLC @r
        // Reference: zaks:82 page 400

        l.assign(alu.rlc8(l));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x6:
        // RLC @r
        // Reference: zaks:82 page 400
        // RLC (HL)
        // Reference: zaks:82 page 402

        tmp8.assign(alu.rlc8(read8(hl)));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x7:
        // RLC @r
        // Reference: zaks:82 page 400

        a.assign(alu.rlc8(a));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x8:
        // RRC @r
        // Reference: zaks:82 page 413

        b.assign(alu.rrc8(b));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x9:
        // RRC @r
        // Reference: zaks:82 page 413

        c.assign(alu.rrc8(c));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0xa:
        // RRC @r
        // Reference: zaks:82 page 413

        d.assign(alu.rrc8(d));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0xb:
        // RRC @r
        // Reference: zaks:82 page 413

        e.assign(alu.rrc8(e));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0xc:
        // RRC @r
        // Reference: zaks:82 page 413

        h.assign(alu.rrc8(h));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0xd:
        // RRC @r
        // Reference: zaks:82 page 413

        l.assign(alu.rrc8(l));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0xe:
        // RRC @r
        // Reference: zaks:82 page 413
        // RRC (HL)
        // Reference: zaks:82 page 413

        tmp8.assign(alu.rrc8(read8(hl)));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0xf:
        // RRC @r
        // Reference: zaks:82 page 413

        a.assign(alu.rrc8(a));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x10:
        // RL @r
        // Reference: zaks:82 page 396

        b.assign(alu.rl8(b, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x11:
        // RL @r
        // Reference: zaks:82 page 396

        c.assign(alu.rl8(c, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x12:
        // RL @r
        // Reference: zaks:82 page 396

        d.assign(alu.rl8(d, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x13:
        // RL @r
        // Reference: zaks:82 page 396

        e.assign(alu.rl8(e, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x14:
        // RL @r
        // Reference: zaks:82 page 396

        h.assign(alu.rl8(h, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x15:
        // RL @r
        // Reference: zaks:82 page 396

        l.assign(alu.rl8(l, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x16:
        // RL @r
        // Reference: zaks:82 page 396
        // RL (HL)
        // Reference: zaks:82 page 396

        tmp8.assign(alu.rl8(read8(hl), cc_bit_0));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x17:
        // RL @r
        // Reference: zaks:82 page 396

        a.assign(alu.rl8(a, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x18:
        // RR @r
        // Reference: zaks:82 page 410

        b.assign(alu.rr8(b, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x19:
        // RR @r
        // Reference: zaks:82 page 410

        c.assign(alu.rr8(c, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x1a:
        // RR @r
        // Reference: zaks:82 page 410

        d.assign(alu.rr8(d, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x1b:
        // RR @r
        // Reference: zaks:82 page 410

        e.assign(alu.rr8(e, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x1c:
        // RR @r
        // Reference: zaks:82 page 410

        h.assign(alu.rr8(h, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x1d:
        // RR @r
        // Reference: zaks:82 page 410

        l.assign(alu.rr8(l, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x1e:
        // RR @r
        // Reference: zaks:82 page 410
        // RR (HL)
        // Reference: zaks:82 page 410

        tmp8.assign(alu.rr8(read8(hl), cc_bit_0));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x1f:
        // RR @r
        // Reference: zaks:82 page 410

        a.assign(alu.rr8(a, cc_bit_0));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x20:
        // SLA @r
        // Reference: zaks:82 page 428

        b.assign(alu.sla8(b));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x21:
        // SLA @r
        // Reference: zaks:82 page 428

        c.assign(alu.sla8(c));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x22:
        // SLA @r
        // Reference: zaks:82 page 428

        d.assign(alu.sla8(d));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x23:
        // SLA @r
        // Reference: zaks:82 page 428

        e.assign(alu.sla8(e));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x24:
        // SLA @r
        // Reference: zaks:82 page 428

        h.assign(alu.sla8(h));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x25:
        // SLA @r
        // Reference: zaks:82 page 428

        l.assign(alu.sla8(l));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x26:
        // SLA @r
        // Reference: zaks:82 page 428
        // SLA (HL)
        // Reference: zaks:82 page 428

        tmp8.assign(alu.sla8(read8(hl)));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x27:
        // SLA @r
        // Reference: zaks:82 page 428

        a.assign(alu.sla8(a));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x28:
        // SRA @r
        // Reference: zaks:82 page 430

        b.assign(alu.sra8(b));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x29:
        // SRA @r
        // Reference: zaks:82 page 430

        c.assign(alu.sra8(c));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x2a:
        // SRA @r
        // Reference: zaks:82 page 430

        d.assign(alu.sra8(d));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x2b:
        // SRA @r
        // Reference: zaks:82 page 430

        e.assign(alu.sra8(e));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x2c:
        // SRA @r
        // Reference: zaks:82 page 430

        h.assign(alu.sra8(h));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x2d:
        // SRA @r
        // Reference: zaks:82 page 430

        l.assign(alu.sra8(l));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x2e:
        // SRA @r
        // Reference: zaks:82 page 430
        // SRA (HL)
        // Reference: zaks:82 page 430

        tmp8.assign(alu.sra8(read8(hl)));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x2f:
        // SRA @r
        // Reference: zaks:82 page 430

        a.assign(alu.sra8(a));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x30:
        // SLL @r
        // Reference:  page 

        b.assign(alu.sll8(b));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x31:
        // SLL @r
        // Reference:  page 

        c.assign(alu.sll8(c));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x32:
        // SLL @r
        // Reference:  page 

        d.assign(alu.sll8(d));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x33:
        // SLL @r
        // Reference:  page 

        e.assign(alu.sll8(e));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x34:
        // SLL @r
        // Reference:  page 

        h.assign(alu.sll8(h));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x35:
        // SLL @r
        // Reference:  page 

        l.assign(alu.sll8(l));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x36:
        // SLL @r
        // Reference:  page 
        // SLL (HL)
        // Reference:  page 

        tmp8.assign(alu.sll8(read8(hl)));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x37:
        // SLL @r
        // Reference:  page 

        a.assign(alu.sll8(a));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x38:
        // SRL @r
        // Reference: zaks:82 page 432

        b.assign(alu.srl8(b));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x39:
        // SRL @r
        // Reference: zaks:82 page 432

        c.assign(alu.srl8(c));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x3a:
        // SRL @r
        // Reference: zaks:82 page 432

        d.assign(alu.srl8(d));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x3b:
        // SRL @r
        // Reference: zaks:82 page 432

        e.assign(alu.srl8(e));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x3c:
        // SRL @r
        // Reference: zaks:82 page 432

        h.assign(alu.srl8(h));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x3d:
        // SRL @r
        // Reference: zaks:82 page 432

        l.assign(alu.srl8(l));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x3e:
        // SRL @r
        // Reference: zaks:82 page 432
        // SRL (HL)
        // Reference: zaks:82 page 432

        tmp8.assign(alu.srl8(read8(hl)));
        write8(hl, tmp8);
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x3f:
        // SRL @r
        // Reference: zaks:82 page 432

        a.assign(alu.srl8(a));
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        affectFlagC();
        pc.add(1);
        return 8;


        break;

      case 0x40:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(0, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x41:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(0, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x42:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(0, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x43:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(0, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x44:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(0, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x45:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(0, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x46:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(0, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x47:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(0, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x48:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(1, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x49:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(1, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x4a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(1, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x4b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(1, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x4c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(1, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x4d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(1, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x4e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(1, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x4f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(1, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x50:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(2, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x51:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(2, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x52:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(2, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x53:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(2, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x54:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(2, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x55:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(2, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x56:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(2, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x57:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(2, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x58:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(3, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x59:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(3, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x5a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(3, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x5b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(3, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x5c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(3, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x5d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(3, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x5e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(3, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x5f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(3, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x60:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(4, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x61:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(4, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x62:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(4, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x63:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(4, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x64:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(4, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x65:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(4, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x66:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(4, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x67:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(4, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x68:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(5, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x69:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(5, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x6a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(5, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x6b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(5, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x6c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(5, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x6d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(5, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x6e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(5, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x6f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(5, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x70:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(6, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x71:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(6, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x72:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(6, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x73:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(6, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x74:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(6, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x75:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(6, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x76:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(6, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x77:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(6, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x78:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(7, b));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x79:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(7, c));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x7a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(7, d));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x7b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(7, e));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x7c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(7, h));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x7d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(7, l));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x7e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        tmp8.assign(alu.testBit8(7, read8(hl)));
        clearFlagN();
        setFlagH();
        affectFlagZ();
        affectFlagS();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x7f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        tmp8.assign(alu.testBit8(7, a));
        clearFlagN();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 8;


        break;

      case 0x80:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(0, b));
        pc.add(1);
        return 8;


        break;

      case 0x81:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(0, c));
        pc.add(1);
        return 8;


        break;

      case 0x82:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(0, d));
        pc.add(1);
        return 8;


        break;

      case 0x83:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(0, e));
        pc.add(1);
        return 8;


        break;

      case 0x84:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(0, h));
        pc.add(1);
        return 8;


        break;

      case 0x85:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(0, l));
        pc.add(1);
        return 8;


        break;

      case 0x86:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(0, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0x87:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(0, a));
        pc.add(1);
        return 8;


        break;

      case 0x88:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(1, b));
        pc.add(1);
        return 8;


        break;

      case 0x89:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(1, c));
        pc.add(1);
        return 8;


        break;

      case 0x8a:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(1, d));
        pc.add(1);
        return 8;


        break;

      case 0x8b:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(1, e));
        pc.add(1);
        return 8;


        break;

      case 0x8c:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(1, h));
        pc.add(1);
        return 8;


        break;

      case 0x8d:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(1, l));
        pc.add(1);
        return 8;


        break;

      case 0x8e:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(1, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0x8f:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(1, a));
        pc.add(1);
        return 8;


        break;

      case 0x90:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(2, b));
        pc.add(1);
        return 8;


        break;

      case 0x91:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(2, c));
        pc.add(1);
        return 8;


        break;

      case 0x92:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(2, d));
        pc.add(1);
        return 8;


        break;

      case 0x93:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(2, e));
        pc.add(1);
        return 8;


        break;

      case 0x94:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(2, h));
        pc.add(1);
        return 8;


        break;

      case 0x95:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(2, l));
        pc.add(1);
        return 8;


        break;

      case 0x96:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(2, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0x97:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(2, a));
        pc.add(1);
        return 8;


        break;

      case 0x98:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(3, b));
        pc.add(1);
        return 8;


        break;

      case 0x99:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(3, c));
        pc.add(1);
        return 8;


        break;

      case 0x9a:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(3, d));
        pc.add(1);
        return 8;


        break;

      case 0x9b:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(3, e));
        pc.add(1);
        return 8;


        break;

      case 0x9c:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(3, h));
        pc.add(1);
        return 8;


        break;

      case 0x9d:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(3, l));
        pc.add(1);
        return 8;


        break;

      case 0x9e:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(3, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0x9f:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(3, a));
        pc.add(1);
        return 8;


        break;

      case 0xa0:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(4, b));
        pc.add(1);
        return 8;


        break;

      case 0xa1:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(4, c));
        pc.add(1);
        return 8;


        break;

      case 0xa2:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(4, d));
        pc.add(1);
        return 8;


        break;

      case 0xa3:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(4, e));
        pc.add(1);
        return 8;


        break;

      case 0xa4:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(4, h));
        pc.add(1);
        return 8;


        break;

      case 0xa5:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(4, l));
        pc.add(1);
        return 8;


        break;

      case 0xa6:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(4, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xa7:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(4, a));
        pc.add(1);
        return 8;


        break;

      case 0xa8:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(5, b));
        pc.add(1);
        return 8;


        break;

      case 0xa9:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(5, c));
        pc.add(1);
        return 8;


        break;

      case 0xaa:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(5, d));
        pc.add(1);
        return 8;


        break;

      case 0xab:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(5, e));
        pc.add(1);
        return 8;


        break;

      case 0xac:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(5, h));
        pc.add(1);
        return 8;


        break;

      case 0xad:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(5, l));
        pc.add(1);
        return 8;


        break;

      case 0xae:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(5, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xaf:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(5, a));
        pc.add(1);
        return 8;


        break;

      case 0xb0:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(6, b));
        pc.add(1);
        return 8;


        break;

      case 0xb1:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(6, c));
        pc.add(1);
        return 8;


        break;

      case 0xb2:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(6, d));
        pc.add(1);
        return 8;


        break;

      case 0xb3:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(6, e));
        pc.add(1);
        return 8;


        break;

      case 0xb4:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(6, h));
        pc.add(1);
        return 8;


        break;

      case 0xb5:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(6, l));
        pc.add(1);
        return 8;


        break;

      case 0xb6:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(6, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xb7:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(6, a));
        pc.add(1);
        return 8;


        break;

      case 0xb8:
        // RES @r,@s
        // Reference: zaks:82 page 385

        b.assign(alu.clearBit8(7, b));
        pc.add(1);
        return 8;


        break;

      case 0xb9:
        // RES @r,@s
        // Reference: zaks:82 page 385

        c.assign(alu.clearBit8(7, c));
        pc.add(1);
        return 8;


        break;

      case 0xba:
        // RES @r,@s
        // Reference: zaks:82 page 385

        d.assign(alu.clearBit8(7, d));
        pc.add(1);
        return 8;


        break;

      case 0xbb:
        // RES @r,@s
        // Reference: zaks:82 page 385

        e.assign(alu.clearBit8(7, e));
        pc.add(1);
        return 8;


        break;

      case 0xbc:
        // RES @r,@s
        // Reference: zaks:82 page 385

        h.assign(alu.clearBit8(7, h));
        pc.add(1);
        return 8;


        break;

      case 0xbd:
        // RES @r,@s
        // Reference: zaks:82 page 385

        l.assign(alu.clearBit8(7, l));
        pc.add(1);
        return 8;


        break;

      case 0xbe:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        write8(hl, alu.clearBit8(7, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xbf:
        // RES @r,@s
        // Reference: zaks:82 page 385

        a.assign(alu.clearBit8(7, a));
        pc.add(1);
        return 8;


        break;

      case 0xc0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(0, b));
        pc.add(1);
        return 8;


        break;

      case 0xc1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(0, c));
        pc.add(1);
        return 8;


        break;

      case 0xc2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(0, d));
        pc.add(1);
        return 8;


        break;

      case 0xc3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(0, e));
        pc.add(1);
        return 8;


        break;

      case 0xc4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(0, h));
        pc.add(1);
        return 8;


        break;

      case 0xc5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(0, l));
        pc.add(1);
        return 8;


        break;

      case 0xc6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(0, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xc7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(0, a));
        pc.add(1);
        return 8;


        break;

      case 0xc8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(1, b));
        pc.add(1);
        return 8;


        break;

      case 0xc9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(1, c));
        pc.add(1);
        return 8;


        break;

      case 0xca:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(1, d));
        pc.add(1);
        return 8;


        break;

      case 0xcb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(1, e));
        pc.add(1);
        return 8;


        break;

      case 0xcc:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(1, h));
        pc.add(1);
        return 8;


        break;

      case 0xcd:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(1, l));
        pc.add(1);
        return 8;


        break;

      case 0xce:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(1, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xcf:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(1, a));
        pc.add(1);
        return 8;


        break;

      case 0xd0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(2, b));
        pc.add(1);
        return 8;


        break;

      case 0xd1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(2, c));
        pc.add(1);
        return 8;


        break;

      case 0xd2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(2, d));
        pc.add(1);
        return 8;


        break;

      case 0xd3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(2, e));
        pc.add(1);
        return 8;


        break;

      case 0xd4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(2, h));
        pc.add(1);
        return 8;


        break;

      case 0xd5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(2, l));
        pc.add(1);
        return 8;


        break;

      case 0xd6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(2, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xd7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(2, a));
        pc.add(1);
        return 8;


        break;

      case 0xd8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(3, b));
        pc.add(1);
        return 8;


        break;

      case 0xd9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(3, c));
        pc.add(1);
        return 8;


        break;

      case 0xda:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(3, d));
        pc.add(1);
        return 8;


        break;

      case 0xdb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(3, e));
        pc.add(1);
        return 8;


        break;

      case 0xdc:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(3, h));
        pc.add(1);
        return 8;


        break;

      case 0xdd:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(3, l));
        pc.add(1);
        return 8;


        break;

      case 0xde:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(3, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xdf:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(3, a));
        pc.add(1);
        return 8;


        break;

      case 0xe0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(4, b));
        pc.add(1);
        return 8;


        break;

      case 0xe1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(4, c));
        pc.add(1);
        return 8;


        break;

      case 0xe2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(4, d));
        pc.add(1);
        return 8;


        break;

      case 0xe3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(4, e));
        pc.add(1);
        return 8;


        break;

      case 0xe4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(4, h));
        pc.add(1);
        return 8;


        break;

      case 0xe5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(4, l));
        pc.add(1);
        return 8;


        break;

      case 0xe6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(4, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xe7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(4, a));
        pc.add(1);
        return 8;


        break;

      case 0xe8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(5, b));
        pc.add(1);
        return 8;


        break;

      case 0xe9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(5, c));
        pc.add(1);
        return 8;


        break;

      case 0xea:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(5, d));
        pc.add(1);
        return 8;


        break;

      case 0xeb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(5, e));
        pc.add(1);
        return 8;


        break;

      case 0xec:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(5, h));
        pc.add(1);
        return 8;


        break;

      case 0xed:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(5, l));
        pc.add(1);
        return 8;


        break;

      case 0xee:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(5, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xef:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(5, a));
        pc.add(1);
        return 8;


        break;

      case 0xf0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(6, b));
        pc.add(1);
        return 8;


        break;

      case 0xf1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(6, c));
        pc.add(1);
        return 8;


        break;

      case 0xf2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(6, d));
        pc.add(1);
        return 8;


        break;

      case 0xf3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(6, e));
        pc.add(1);
        return 8;


        break;

      case 0xf4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(6, h));
        pc.add(1);
        return 8;


        break;

      case 0xf5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(6, l));
        pc.add(1);
        return 8;


        break;

      case 0xf6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(6, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xf7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(6, a));
        pc.add(1);
        return 8;


        break;

      case 0xf8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        b.assign(alu.setBit8(7, b));
        pc.add(1);
        return 8;


        break;

      case 0xf9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        c.assign(alu.setBit8(7, c));
        pc.add(1);
        return 8;


        break;

      case 0xfa:
        // SET @r,@s
        // Reference: zaks:82 page 425

        d.assign(alu.setBit8(7, d));
        pc.add(1);
        return 8;


        break;

      case 0xfb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        e.assign(alu.setBit8(7, e));
        pc.add(1);
        return 8;


        break;

      case 0xfc:
        // SET @r,@s
        // Reference: zaks:82 page 425

        h.assign(alu.setBit8(7, h));
        pc.add(1);
        return 8;


        break;

      case 0xfd:
        // SET @r,@s
        // Reference: zaks:82 page 425

        l.assign(alu.setBit8(7, l));
        pc.add(1);
        return 8;


        break;

      case 0xfe:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        write8(hl, alu.setBit8(7, read8(hl)));
        pc.add(1);
        return 15;


        break;

      case 0xff:
        // SET @r,@s
        // Reference: zaks:82 page 425

        a.assign(alu.setBit8(7, a));
        pc.add(1);
        return 8;


        break;

    } // hctiws
    return 1;
  }

  function ed_ext() {
    var bit;
    var opcode = fetch8()
    var cycles = 1;

    switch (opcode) {
      case 0x0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x10:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x11:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x12:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x13:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x14:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x15:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x16:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x17:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x18:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x19:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x20:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x21:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x22:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x23:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x24:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x25:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x26:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x27:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x28:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x29:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x30:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x31:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x32:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x33:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x34:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x35:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x36:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x37:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x38:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x39:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x40:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        b.assign(in8(bc));
        computeFlags8(b.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x41:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        out8(bc, b);
        pc.add(1);
        return 12;


        break;

      case 0x42:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        hl.assign(alu.sub_u16u16b(hl, bc, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x43:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        write16(read16(pc.getUnsigned() + (1)), bc);
        pc.add(3);
        return 15;


        break;

      case 0x44:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x45:
        // RETN
        // Reference: zaks:82 page 394

        pc.assign(read16(sp) - 1);
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        int_iff1 = int_iff2;
        pc.add(1);
        return 14;


        break;

      case 0x46:
        // IM 0
        // Reference: zaks:82 page 258

        im0();
        pc.add(1);
        return 8;


        break;

      case 0x47:
        // LD I,A
        // Reference: zaks:82 page 332

        intv.assign(a);
        pc.add(1);
        return 9;


        break;

      case 0x48:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        c.assign(in8(bc));
        computeFlags8(c.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x49:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        out8(bc, c);
        pc.add(1);
        return 12;


        break;

      case 0x4a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        hl.assign(alu.add_u16u16c(hl, bc, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x4b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        bc.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 20;


        break;

      case 0x4c:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x4d:
        // RETI
        // Reference: zaks:82 page 392

        pc.assign(read16(sp) - 1);
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        pc.add(1);
        return 14;


        break;

      case 0x4e:
        // IM 1

        im1();
        pc.add(1);
        return 8;


        break;

      case 0x4f:
        // LD R,A
        // Reference: zaks:82 page 344

        memrefresh.assign(a);
        memr7.assign(a);
        pc.add(1);
        return 9;


        break;

      case 0x50:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        d.assign(in8(bc));
        computeFlags8(d.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x51:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        out8(bc, d);
        pc.add(1);
        return 12;


        break;

      case 0x52:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        hl.assign(alu.sub_u16u16b(hl, de, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x53:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        write16(read16(pc.getUnsigned() + (1)), de);
        pc.add(3);
        return 15;


        break;

      case 0x54:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x55:
        // RETN

        pc.assign(read16(sp) - 1);
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        int_iff1 = int_iff2;
        pc.add(1);
        return 14;


        break;

      case 0x56:
        // IM 1
        // Reference: zaks:82 page 259

        im1();
        pc.add(1);
        return 8;


        break;

      case 0x57:
        // LD A,I
        // Reference: zaks:82 page 331

        a.assign(intv);
        wasParity = int_iff2 ? 1 : 0;
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 9;


        break;

      case 0x58:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        e.assign(in8(bc));
        computeFlags8(e.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x59:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        out8(bc, e);
        pc.add(1);
        return 12;


        break;

      case 0x5a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        hl.assign(alu.add_u16u16c(hl, de, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x5b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        de.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 20;


        break;

      case 0x5c:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x5d:
        // RETN

        pc.assign(read16(sp) - 1);
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        int_iff1 = int_iff2;
        pc.add(1);
        return 14;


        break;

      case 0x5e:
        // IM 2
        // Reference: zaks:82 page 260

        im2();
        pc.add(1);
        return 8;


        break;

      case 0x5f:
        // LD A,R
        // Reference: zaks:82 page 333

        a.assign(memrefresh.getUnsigned() | (memr7.getUnsigned() & 0x80));
        wasParity = int_iff2 ? 1 : 0;
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 9;


        break;

      case 0x60:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        h.assign(in8(bc));
        computeFlags8(h.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x61:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        out8(bc, h);
        pc.add(1);
        return 12;


        break;

      case 0x62:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        hl.assign(alu.sub_u16u16b(hl, hl, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x63:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        write16(read16(pc.getUnsigned() + (1)), hl);
        pc.add(3);
        return 15;


        break;

      case 0x64:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x65:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x66:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x67:
        // RRD
        // Reference: zaks:82 page 416

        tmp8.assign(alu.rrd8());
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 18;


        break;

      case 0x68:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        l.assign(in8(bc));
        computeFlags8(l.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x69:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        out8(bc, l);
        pc.add(1);
        return 12;


        break;

      case 0x6a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        hl.assign(alu.add_u16u16c(hl, hl, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x6b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        hl.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 20;


        break;

      case 0x6c:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x6d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6f:
        // RLD
        // Reference: zaks:82 page 408

        tmp8.assign(alu.rld8());
        clearFlagH();
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 18;


        break;

      case 0x70:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag
        // IN (C)

        tmp8.assign(in8(bc));
        computeFlags8(tmp8.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x71:
        // OUT (C),@r
        // Reference: zaks:82 page 366
        // OUT (C),0

        out8(bc, 0);
        pc.add(1);
        return 12;


        break;

      case 0x72:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        hl.assign(alu.sub_u16u16b(hl, sp, cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x73:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        write16(read16(pc.getUnsigned() + (1)), sp);
        pc.add(3);
        return 15;


        break;

      case 0x74:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x75:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x76:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x77:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x78:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        a.assign(in8(bc));
        computeFlags8(a.getUnsigned());
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 12;


        break;

      case 0x79:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        out8(bc, a);
        pc.add(1);
        return 12;


        break;

      case 0x7a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        hl.assign(alu.add_u16u16c(hl, sp, cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x7b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        sp.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 20;


        break;

      case 0x7c:
        // NEG
        // Reference: zaks:82 page 358

        tmp8.assign(a);
        a.assign(alu.sub_u8u8b(0, a));
        //if (tmp8.equals(0)) wasCarry=1;/*Zaks error*/;
        //if (tmp8.getUnsigned() & (0x80)) wasParity=1;;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(1);
        return 4;


        break;

      case 0x7d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x80:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x81:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x82:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x83:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x84:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x85:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x86:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x87:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x88:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x89:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x90:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x91:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x92:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x93:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x94:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x95:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x96:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x97:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x98:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x99:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa0:
        // LDI
        // Reference: zaks:82 page 352

        write8(de, read8(hl));
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        de.assign(emf.Maths.add_u16u16(de, 1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.equals(0)) wasParity = 0;
        else wasParity = 1;
        clearFlagH();
        clearFlagN();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xa1:
        // CPI
        // Reference: zaks:82 page 231

        tmp8.assign(alu.sub_u8u8b(a, read8(hl)));
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.equals(0)) wasParity = 0;
        else wasParity = 1;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xa2:
        // INI
        // Reference: zaks:82 page 278

        tmp8.assign(in8(bc));
        write8(hl, tmp8);
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        b.assign(emf.Maths.add_u8u8(b, -1));
        if (bc.equals(0)) wasZero = 1;
        else wasZero = 0;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xa3:
        // OUTI
        // Reference: zaks:82 page 371
        // Reference: confusion whether should N be set or not?

        out8(bc, read8(hl));
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        b.assign(emf.Maths.add_u8u8(b, -1));
        if (bc.equals(0)) wasZero = 1;
        else wasZero = 0;
        setFlagN();
        affectFlagZ();
        pc.add(1);
        return 16;


        break;

      case 0xa4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa8:
        // LDD
        // Reference: zaks:82 page 348

        write8(de, read8(hl));
        de.assign(emf.Maths.add_u16u16(de, -1));
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.equals(0)) wasParity = 0;
        else wasParity = 1;
        clearFlagH();
        clearFlagN();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xa9:
        // CPD
        // Reference: zaks:82 page 227

        tmp8.assign(alu.sub_u8u8b(a, read8(hl)));
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.equals(0)) wasParity = 0;
        else wasParity = 1;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xaa:
        // IND
        // Reference: zaks:82 page 274

        tmp8.assign(in8(bc));
        write8(hl, tmp8);
        b.assign(emf.Maths.add_u8u8(b, -1));
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        if (b.equals(0)) wasZero = 1;
        else wasZero = 0;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xab:
        // OUTD
        // Reference: zaks:82 page 369

        out8(bc, read8(hl));
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        b.assign(emf.Maths.add_u8u8(b, -1));
        if (bc.equals(0)) wasZero = 1;
        else wasZero = 0;
        setFlagN();
        affectFlagZ();
        pc.add(1);
        return 16;


        break;

      case 0xac:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xad:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xae:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xaf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb0:
        // LDIR
        // Reference: zaks:82 page 354
        // Reference: The book indicates to clear the PV flag, but http://www.z80.info/z80sflag.htm suggests otherwise

        write8(de, read8(hl));
        de.assign(emf.Maths.add_u16u16(de, 1));
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.notEquals(0)) {
          pc.sub(2);
        };
        if (bc.equals(0)) wasOverflow = 0;
        else wasOverflow = 1;
        clearFlagH();
        clearFlagN();
        affectFlagV();
        pc.add(1);
        return 16;


        break;

      case 0xb1:
        // CPIR
        // Reference: zaks:82 page 233

        tmp8.assign(alu.sub_u8u8b(a, read8(hl)));
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.notEquals(0) && tmp8.notEquals(0)) {
          pc.sub(2)
        };
        if (bc.equals(0)) wasOverflow = 0;
        else wasOverflow = 1;
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(1);
        return 16;


        break;

      case 0xb2:
        // INIR
        // Reference: zaks:82 page 280

        tmp8.assign(in8(bc));
        write8(hl, tmp8);
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        b.assign(emf.Maths.add_u8u8(b, -1));
        if (b.notEquals(0)) {
          pc.sub(2);
        };
        setFlagN();
        setFlagZ();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xb3:
        // OTIR
        // Reference: zaks:82 page 364

        out8(bc, read8(hl));
        hl.assign(emf.Maths.add_u16u16(hl, 1));
        b.assign(emf.Maths.add_u8u8(b, -1));
        if (b.notEquals(0)) {
          pc.sub(2);
        };
        setFlagN();
        setFlagZ();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xb4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb8:
        // LDDR
        // Reference: zaks:82 page 350

        write8(de, read8(hl));
        de.assign(emf.Maths.add_u16u16(de, -1));
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.equals(0)) wasParity = 0;
        else wasParity = 1;
        if (bc.notEquals(0)) {
          pc.sub(2);
        };
        clearFlagH();
        clearFlagN();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xb9:
        // CPDR
        // Reference: zaks:82 page 229

        tmp8.assign(alu.sub_u8u8b(a, read8(hl)));
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        bc.assign(emf.Maths.add_u16u16(bc, -1));
        if (bc.equals(0)) wasParity = 0;
        else wasParity = 1;
        if (bc.notEquals(0) && tmp8.notEquals(0)) {
          pc.sub(2);
        };
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xba:
        // INDR
        // Reference: zaks:82 page 276

        tmp8.assign(in8(bc));
        write8(hl, tmp8);
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        b.assign(emf.Maths.add_u8u8(b, -1));
        if (b.notEquals(0)) {
          pc.sub(2);
        };
        setFlagN();
        affectFlagP();
        pc.add(1);
        return 16;


        break;

      case 0xbb:
        // OTDR
        // Reference: zaks:82 page 362

        out8(bc, read8(hl));
        hl.assign(emf.Maths.add_u16u16(hl, -1));
        b.assign(emf.Maths.add_u8u8(b, -1));
        if (b.notEquals(0)) {
          pc.sub(2);
        };
        setFlagZ();
        setFlagN();
        pc.add(1);
        return 16;


        break;

      case 0xbc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbe:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xca:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xce:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xda:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xde:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xea:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xeb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xec:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xed:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xee:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xef:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfe:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xff:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

    } // hctiws
    return 1;
  }

  function fd_ext() {
    var bit;
    var opcode = fetch8()
    var cycles = 1;

    switch (opcode) {
      case 0x0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        iy.assign(alu.add_u16u16c(iy, bc));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0xa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x10:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x11:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x12:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x13:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x14:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x15:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x16:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x17:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x18:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x19:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        iy.assign(alu.add_u16u16c(iy, de));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x1a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x1f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x20:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x21:
        // LD IY,@n
        // Reference: zaks:82 page 340

        iy.assign(read16(pc.getUnsigned() + (1)));
        pc.add(3);
        return 15;


        break;

      case 0x22:
        // LD (@n),IY
        // Reference: zaks:82 page 327

        write16(read16(pc.getUnsigned() + (1)), iy);
        pc.add(3);
        return 20;


        break;

      case 0x23:
        // INC IY
        // Reference: zaks:82 page 273

        iy.assign(alu.add_u16u16c(iy, 1));
        pc.add(1);
        return 10;


        break;

      case 0x24:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x25:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x26:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x27:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x28:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x29:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        iy.assign(alu.add_u16u16c(iy, iy));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x2a:
        // LD IY,(@n)
        // Reference: zaks:82 page 342

        iy.assign(read16(read16(pc.getUnsigned() + (1))));
        pc.add(3);
        return 20;


        break;

      case 0x2b:
        // DEC IY
        // Reference: zaks:82 page 243

        iy.assign(emf.Maths.sub_u16u16(iy, 1));
        pc.add(1);
        return 10;


        break;

      case 0x2c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x2f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x30:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x31:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x32:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x33:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x34:
        // INC (IY+@n)
        // Reference: zaks:82 page 270

        tmp8.assign(alu.add_u8u8c(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))), 1));
        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(2);
        return 23;


        break;

      case 0x35:
        // DEC (IY+@n)
        // Reference: zaks:82 page 238

        tmp8.assign(alu.sub_u8u8b(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))), 1));
        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(2);
        return 15;


        break;

      case 0x36:
        // LD (IY+@d),@n
        // Reference: zaks:82 page 311

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), read8(pc.getUnsigned() + (2)));
        pc.add(3);
        return 19;


        break;

      case 0x37:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x38:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x39:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        iy.assign(alu.add_u16u16c(iy, sp));
        clearFlagN();
        affectFlagH();
        affectFlagC();
        pc.add(1);
        return 15;


        break;

      case 0x3a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3e:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x3f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x40:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x41:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x42:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x43:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x44:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x45:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x46:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        b.assign(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x47:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x48:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x49:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x4e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        c.assign(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x4f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x50:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x51:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x52:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x53:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x54:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x55:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x56:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        d.assign(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x57:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x58:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x59:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x5e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        e.assign(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x5f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x60:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x61:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x62:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x63:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x64:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x65:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x66:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        h.assign(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x67:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x68:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x69:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x6e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        l.assign(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x6f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x70:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), b);
        pc.add(2);
        return 19;


        break;

      case 0x71:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), c);
        pc.add(2);
        return 19;


        break;

      case 0x72:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), d);
        pc.add(2);
        return 19;


        break;

      case 0x73:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), e);
        pc.add(2);
        return 19;


        break;

      case 0x74:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), h);
        pc.add(2);
        return 19;


        break;

      case 0x75:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), l);
        pc.add(2);
        return 19;


        break;

      case 0x76:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x77:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), a);
        pc.add(2);
        return 19;


        break;

      case 0x78:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x79:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x7e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        a.assign(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))));
        pc.add(2);
        return 19;


        break;

      case 0x7f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x80:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x81:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x82:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x83:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x84:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x85:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x86:
        // ADD A,(IY+@n)
        // Reference: zaks:82 page 198

        a.assign(alu.add_u8u8c(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 19;


        break;

      case 0x87:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x88:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x89:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x8e:
        // ADC A,(IY+@n)
        // Reference: zaks:82 page 190

        a.assign(alu.add_u8u8c(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))), cc_bit_0));
        clearFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        pc.add(2);
        return 15;


        break;

      case 0x8f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x90:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x91:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x92:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x93:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x94:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x95:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x96:
        // SUB (IY+@n)
        // Reference: zaks:82 page 434

        a.assign(alu.sub_u8u8b(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 15;


        break;

      case 0x97:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x98:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x99:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9a:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9b:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9c:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9d:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0x9e:
        // SBC A,(IY+@n)
        // Reference: zaks:82 page 420

        a.assign(alu.sub_u8u8b(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))), cc_bit_0));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 19;


        break;

      case 0x9f:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa6:
        // AND (IY+@n)
        // Reference: zaks:82 page 209

        a.assign(alu.and8(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
        clearFlagN();
        clearFlagC();
        setFlagH();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 19;


        break;

      case 0xa7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xa9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xaa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xab:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xac:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xad:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xae:
        // XOR A,(IY+@n)
        // Reference: zaks:82 page 436

        a.assign(alu.xor8(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
        clearFlagH();
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 15;


        break;

      case 0xaf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb6:
        // OR (IY+@n)
        // Reference: zaks:82 page 360

        a.assign(alu.or8(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
        clearFlagN();
        clearFlagC();
        affectFlagS();
        affectFlagZ();
        affectFlagP();
        pc.add(2);
        return 19;


        break;

      case 0xb7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xb9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xba:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xbe:
        // CP A,(IY+@n)
        // Reference: zaks:82 page 225

        tmp8.assign(alu.sub_u8u8b(a, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
        setFlagN();
        affectFlagS();
        affectFlagZ();
        affectFlagH();
        affectFlagV();
        affectFlagC();
        pc.add(2);
        return 19;


        break;

      case 0xbf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xc9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xca:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcb:
        // RLC (IY+@n)
        // Reference: zaks:82 page 406
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
          tmp8.assign(alu.rlc8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 23;

        }
        // RRC (IY+@n)
        // Reference: zaks:82 page 413
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
          tmp8.assign(alu.rrc8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // RL (IY+@n)
        // Reference: zaks:82 page 396
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
          tmp8.assign(alu.rl8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))), cc_bit_0));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // RR (IY+@n)
        // Reference: zaks:82 page 410
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
          tmp8.assign(alu.rr8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1)))), cc_bit_0));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // SLA (IY+@n)
        // Reference: zaks:82 page 428
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
          tmp8.assign(alu.sla8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // SRA (IY+@n)
        // Reference: zaks:82 page 430
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
          tmp8.assign(alu.sra8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // SLL (IY+@n)
        // Reference:  page 
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
          tmp8.assign(alu.sll8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 15;

        }
        // SRL (IY+@n)
        // Reference: zaks:82 page 432
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
          tmp8.assign(alu.srl8(read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), tmp8);
          clearFlagH();
          clearFlagN();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          affectFlagC();
          pc.add(3);
          return 23;

        }
        // BIT @r,(IY+@n)
        // Reference: zaks:82 page 213
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;;
          tmp8.assign(alu.testBit8(bit, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          clearFlagN();
          setFlagH();
          affectFlagS();
          affectFlagZ();
          affectFlagP();
          pc.add(3);
          return 20;

        }
        // RES @r,(IY+@n)
        // Reference: zaks:82 page 385
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;;
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), alu.clearBit8(bit, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          pc.add(3);
          return 15;

        }
        // SET @r,(IY+@n)
        // Reference: zaks:82 page 425
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;;
          write8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))), alu.setBit8(bit, read8(emf.Maths.add_u16s8(iy, read8(pc.getUnsigned() + (1))))));
          pc.add(3);
          return 23;

        }
        break;

      case 0xcc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xce:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xcf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xd9:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xda:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xde:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xdf:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe1:
        // POP IY
        // Reference: zaks:82 page 377

        iy.assign(read16(sp));
        sp.assign(emf.Maths.add_u16u16(sp, 2));
        pc.add(1);
        return 14;


        break;

      case 0xe2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe3:
        // EX (SP),IY
        // Reference: zaks:82 page 254

        tmp16.assign(iy);
        iy.assign(read16(sp));
        write16(sp, tmp16);
        pc.add(1);
        return 23;


        break;

      case 0xe4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe5:
        // PUSH IY
        // Reference: zaks:82 page 383

        sp.assign(emf.Maths.sub_u16u16(sp, 2));
        write16(sp, iy);
        pc.add(1);
        return 15;


        break;

      case 0xe6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xe9:
        // JP (IY)
        // Reference: zaks:82 page 286

        pc.assign(emf.Maths.add_u16u16(iy, -1));
        pc.add(1);
        return 8;


        break;

      case 0xea:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xeb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xec:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xed:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xee:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xef:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf0:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf1:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf2:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf3:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf4:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf5:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf6:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf7:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf8:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xf9:
        // LD SP,IY
        // Reference: zaks:82 page 347

        sp.assign(iy);
        pc.add(1);
        return 10;


        break;

      case 0xfa:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfb:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfc:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfd:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xfe:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

      case 0xff:
        // Unknown operation
        pc.add(1);
        return 1;
        break;

    } // hctiws
    return 1;
  }
  // importEmulatorALU
  // let assign(al ;
  // let assign(al ;
  // let assign(re ;
  // let write16 ;
  // let assign(al ;
  // let assign(al ;
  // let assign(re ;
  // let assign(em ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let write8 ;
  // let assign(al ;
  // let assign(r ;
  // let assign(r ;
  // let assign(r ;
  // let assign(r ;
  // let assign(r ;
  // let assign(r ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let write8 ;
  // let assign(r ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(a ;
  // let assign(alu. ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let assign(alu. ;
  // let write8 ;
  // let read8(emf.Maths. ;
  // let assign(alu. ;
  // let read8(emf.Maths. ;
  // let write8 ;
  // let read8(emf.Maths. ;
  // let write8 ;
  // let assign(re ;
  // let assign(em ;
  // let assign(iy) ;
  // let assign(re ;
  // let write16 ;
  // let assign(em ;
  // let write16 ;
  // let assign(em ;
  // let assign(iy ;

  /*
   **
   ** State
   **
   */
  function getState() {
    gsRegisterA.assign(getRegisterValueA());
    gsRegisterB.assign(getRegisterValueB());
    gsRegisterC.assign(getRegisterValueC());
    gsRegisterD.assign(getRegisterValueD());
    gsRegisterE.assign(getRegisterValueE());
    gsRegisterH.assign(getRegisterValueH());
    gsRegisterL.assign(getRegisterValueL());
    gsRegisterPC.assign(getRegisterValuePC());
    gsRegisterSP.assign(getRegisterValueSP());
    gsRegisterIX.assign(getRegisterValueIX());
    gsRegisterIY.assign(getRegisterValueIY());
    gsRegisterPRIME_A.assign(getRegisterValuePRIME_A());
    gsRegisterPRIME_B.assign(getRegisterValuePRIME_B());
    gsRegisterPRIME_C.assign(getRegisterValuePRIME_C());
    gsRegisterPRIME_D.assign(getRegisterValuePRIME_D());
    gsRegisterPRIME_E.assign(getRegisterValuePRIME_E());
    gsRegisterPRIME_F.assign(getRegisterValuePRIME_F());
    gsRegisterPRIME_H.assign(getRegisterValuePRIME_H());
    gsRegisterPRIME_L.assign(getRegisterValuePRIME_L());
    gsRegisterINTV.assign(getRegisterValueINTV());
    gsRegisterMEMREFRESH.assign(getRegisterValueMEMREFRESH());
    gsRegisterMEMR7.assign(getRegisterValueMEMR7());
    return {
      flags: {
        c: getFlagC(),
        n: getFlagN(),
        p: getFlagP(),
        v: getFlagV(),
        b3: getFlagB3(),
        h: getFlagH(),
        b5: getFlagB5(),
        z: getFlagZ(),
        s: getFlagS(),
      },

      registers: {
        a: gsRegisterA,
        b: gsRegisterB,
        c: gsRegisterC,
        d: gsRegisterD,
        e: gsRegisterE,
        h: gsRegisterH,
        l: gsRegisterL,
        pc: gsRegisterPC,
        sp: gsRegisterSP,
        ix: gsRegisterIX,
        iy: gsRegisterIY,
        prime_a: gsRegisterPRIME_A,
        prime_b: gsRegisterPRIME_B,
        prime_c: gsRegisterPRIME_C,
        prime_d: gsRegisterPRIME_D,
        prime_e: gsRegisterPRIME_E,
        prime_f: gsRegisterPRIME_F,
        prime_h: gsRegisterPRIME_H,
        prime_l: gsRegisterPRIME_L,
        intv: gsRegisterINTV,
        memrefresh: gsRegisterMEMREFRESH,
        memr7: gsRegisterMEMR7,
      },

      state: {
        isBigEndian: isBigEndian,
        inHalt: inHalt,
        int_iff0: int_iff0,
        int_iff1: int_iff1,
        int_iff2: int_iff2,
        interruptMode: interruptMode,
        wasNMIGenerated: wasNMIGenerated,
        wasIRQGenerated: wasIRQGenerated,
      },
    };
  }

  function setState(newState) {
    // registers:
    if (typeof newState.registers.a !== typeof undefined) {
      setRegisterValueA(newState.registers.a);
    }
    if (typeof newState.registers.b !== typeof undefined) {
      setRegisterValueB(newState.registers.b);
    }
    if (typeof newState.registers.c !== typeof undefined) {
      setRegisterValueC(newState.registers.c);
    }
    if (typeof newState.registers.d !== typeof undefined) {
      setRegisterValueD(newState.registers.d);
    }
    if (typeof newState.registers.e !== typeof undefined) {
      setRegisterValueE(newState.registers.e);
    }
    if (typeof newState.registers.h !== typeof undefined) {
      setRegisterValueH(newState.registers.h);
    }
    if (typeof newState.registers.l !== typeof undefined) {
      setRegisterValueL(newState.registers.l);
    }
    if (typeof newState.registers.pc !== typeof undefined) {
      setRegisterValuePC(newState.registers.pc);
    }
    if (typeof newState.registers.sp !== typeof undefined) {
      setRegisterValueSP(newState.registers.sp);
    }
    if (typeof newState.registers.ix !== typeof undefined) {
      setRegisterValueIX(newState.registers.ix);
    }
    if (typeof newState.registers.iy !== typeof undefined) {
      setRegisterValueIY(newState.registers.iy);
    }
    if (typeof newState.registers.prime_a !== typeof undefined) {
      setRegisterValuePRIME_A(newState.registers.prime_a);
    }
    if (typeof newState.registers.prime_b !== typeof undefined) {
      setRegisterValuePRIME_B(newState.registers.prime_b);
    }
    if (typeof newState.registers.prime_c !== typeof undefined) {
      setRegisterValuePRIME_C(newState.registers.prime_c);
    }
    if (typeof newState.registers.prime_d !== typeof undefined) {
      setRegisterValuePRIME_D(newState.registers.prime_d);
    }
    if (typeof newState.registers.prime_e !== typeof undefined) {
      setRegisterValuePRIME_E(newState.registers.prime_e);
    }
    if (typeof newState.registers.prime_f !== typeof undefined) {
      setRegisterValuePRIME_F(newState.registers.prime_f);
    }
    if (typeof newState.registers.prime_h !== typeof undefined) {
      setRegisterValuePRIME_H(newState.registers.prime_h);
    }
    if (typeof newState.registers.prime_l !== typeof undefined) {
      setRegisterValuePRIME_L(newState.registers.prime_l);
    }
    if (typeof newState.registers.intv !== typeof undefined) {
      setRegisterValueINTV(newState.registers.intv);
    }
    if (typeof newState.registers.memrefresh !== typeof undefined) {
      setRegisterValueMEMREFRESH(newState.registers.memrefresh);
    }
    if (typeof newState.registers.memr7 !== typeof undefined) {
      setRegisterValueMEMR7(newState.registers.memr7);
    }

    // Flags:
    if (typeof newState.flags.c !== typeof undefined) {
      changeFlagC(newState.flags.c);
    }
    if (typeof newState.flags.n !== typeof undefined) {
      changeFlagN(newState.flags.n);
    }
    if (typeof newState.flags.p !== typeof undefined) {
      changeFlagP(newState.flags.p);
    }
    if (typeof newState.flags.v !== typeof undefined) {
      changeFlagV(newState.flags.v);
    }
    if (typeof newState.flags.b3 !== typeof undefined) {
      changeFlagB3(newState.flags.b3);
    }
    if (typeof newState.flags.h !== typeof undefined) {
      changeFlagH(newState.flags.h);
    }
    if (typeof newState.flags.b5 !== typeof undefined) {
      changeFlagB5(newState.flags.b5);
    }
    if (typeof newState.flags.z !== typeof undefined) {
      changeFlagZ(newState.flags.z);
    }
    if (typeof newState.flags.s !== typeof undefined) {
      changeFlagS(newState.flags.s);
    }

    // state
    if (typeof newState.state.isBigEndian !== typeof undefined) {
      isBigEndian = newState.state.isBigEndian;
    }
    if (typeof newState.state.inHalt !== typeof undefined) {
      inHalt = newState.state.inHalt;
    }
    if (typeof newState.state.int_iff0 !== typeof undefined) {
      int_iff0 = newState.state.int_iff0;
    }
    if (typeof newState.state.int_iff1 !== typeof undefined) {
      int_iff1 = newState.state.int_iff1;
    }
    if (typeof newState.state.int_iff2 !== typeof undefined) {
      int_iff2 = newState.state.int_iff2;
    }
    if (typeof newState.state.interruptMode !== typeof undefined) {
      interruptMode = newState.state.interruptMode;
    }
    if (typeof newState.state.wasNMIGenerated !== typeof undefined) {
      wasNMIGenerated = newState.state.wasNMIGenerated;
    }
    if (typeof newState.state.wasIRQGenerated !== typeof undefined) {
      wasIRQGenerated = newState.state.wasIRQGenerated;
    }
  }


  /*
   **
   ** Expose this API
   **
   */
  return {
    start,
    reset,
    update,
    getState,
    setState,
    getRegisterValueA,
    setRegisterValueA,
    getRegisterValueB,
    setRegisterValueB,
    getRegisterValueC,
    setRegisterValueC,
    getRegisterValueD,
    setRegisterValueD,
    getRegisterValueE,
    setRegisterValueE,
    getRegisterValueH,
    setRegisterValueH,
    getRegisterValueL,
    setRegisterValueL,
    getRegisterValuePC,
    setRegisterValuePC,
    getRegisterValueSP,
    setRegisterValueSP,
    getRegisterValueIX,
    setRegisterValueIX,
    getRegisterValueIY,
    setRegisterValueIY,
    getRegisterValuePRIME_A,
    setRegisterValuePRIME_A,
    getRegisterValuePRIME_B,
    setRegisterValuePRIME_B,
    getRegisterValuePRIME_C,
    setRegisterValuePRIME_C,
    getRegisterValuePRIME_D,
    setRegisterValuePRIME_D,
    getRegisterValuePRIME_E,
    setRegisterValuePRIME_E,
    getRegisterValuePRIME_F,
    setRegisterValuePRIME_F,
    getRegisterValuePRIME_H,
    setRegisterValuePRIME_H,
    getRegisterValuePRIME_L,
    setRegisterValuePRIME_L,
    getRegisterValueINTV,
    setRegisterValueINTV,
    getRegisterValueMEMREFRESH,
    setRegisterValueMEMREFRESH,
    getRegisterValueMEMR7,
    setRegisterValueMEMR7,
    getRegisterValue,
    setRegisterValue,
    setFlagValue,
  }
});
// zx80_z80_assemble
let zx80_z80_assemble = (function(bus, options) {
  let equateMap = {};
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
   ** Equates table
   **
   */
  function clearEquateMap() {
    equateMap = {};
  }

  function setEquateValue(name, value) {
    name = name.toLowerCase();
    equateMap[name] = value;
  }

  function getEquateValue(name) {
    name = name.toLowerCase();
    return equateMap[name];
  }

  function getEquateMap(n) {
    return equateMap;
  }


  /*
   **
   ** The real work...
   **
   */
  function start() {
    read8 = bus.memory.read8;
    read16 = bus.memory.read16;
  }

  function assemble(str) {
    let pattern = null;
    let matched;
    let pc = new emf.Number(16); // TODO: Remove the need for this
    // nop
    // Reference: zaks:82 page 359

    if ((matched = str.match(/nop/i)) != null) {
      let rt = {
        pattern: "00000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 293

    if ((matched = str.match(/LD\s+bc\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00000001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // LD (BC),A
    // Reference: zaks:82 page 299

    if ((matched = str.match(/LD\s+\s*\(\s*BC\s*\)\s*\s*,\s*A/i)) != null) {
      let rt = {
        pattern: "00000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 265

    if ((matched = str.match(/INC\s+bc/i)) != null) {
      let rt = {
        pattern: "00000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264

    if ((matched = str.match(/INC\s+b/i)) != null) {
      let rt = {
        pattern: "00000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+b/i)) != null) {
      let rt = {
        pattern: "00000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295

    if ((matched = str.match(/LD\s+b\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RLCA
    // Reference: zaks:82 page 399

    if ((matched = str.match(/RLCA/i)) != null) {
      let rt = {
        pattern: "00000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // EX AF,AF’
    // Reference: zaks:82 page 248

    if ((matched = str.match(/EX\s\s*\\s*\\s*\\s*\\s*\\s*\\s*\+\s*\s*\s*\s*\s*\s*\s*AF\s*\s*\s*\s*\s*\s*\s*\s*,\s*\s*\s*\s*\s*\s*\s*\s*AF’/i)) != null) {
      let rt = {
        pattern: "00001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD HL,@r
    // Reference: zaks:82 page 203

    if ((matched = str.match(/ADD\s+HL\s*,\s*bc/i)) != null) {
      let rt = {
        pattern: "00001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD A,(BC)
    // Reference: zaks:82 page 329

    if ((matched = str.match(/LD\s+A\s*,\s*\s*\(\s*BC\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 240

    if ((matched = str.match(/DEC\s+bc/i)) != null) {
      let rt = {
        pattern: "00001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264

    if ((matched = str.match(/INC\s+c/i)) != null) {
      let rt = {
        pattern: "00001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+c/i)) != null) {
      let rt = {
        pattern: "00001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295

    if ((matched = str.match(/LD\s+c\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RRCA
    // Reference: zaks:82 page 415

    if ((matched = str.match(/RRCA/i)) != null) {
      let rt = {
        pattern: "00001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DJNZ (PC+@n)
    // Reference: zaks:82 page 245

    if ((matched = str.match(/DJNZ\s\s*\+\s*\s*\\s*\(\s*\s*PC\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00010000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 293

    if ((matched = str.match(/LD\s+de\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00010001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // LD (DE),A
    // Reference: zaks:82 page 300

    if ((matched = str.match(/LD\s+\s*\(\s*DE\s*\)\s*\s*,\s*A/i)) != null) {
      let rt = {
        pattern: "00010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 265

    if ((matched = str.match(/INC\s+de/i)) != null) {
      let rt = {
        pattern: "00010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264

    if ((matched = str.match(/INC\s+d/i)) != null) {
      let rt = {
        pattern: "00010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+d/i)) != null) {
      let rt = {
        pattern: "00010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295

    if ((matched = str.match(/LD\s+d\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RLA
    // Reference: zaks:82 page 398

    if ((matched = str.match(/RLA/i)) != null) {
      let rt = {
        pattern: "00010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JR (PC+@n)
    // Reference: zaks:82 page 290

    if ((matched = str.match(/JR\s+\s*\(\s*PC\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00011000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // ADD HL,@r
    // Reference: zaks:82 page 203

    if ((matched = str.match(/ADD\s+HL\s*,\s*de/i)) != null) {
      let rt = {
        pattern: "00011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD A,(DE)
    // Reference: zaks:82 page 330

    if ((matched = str.match(/LD\s+A\s*,\s*\s*\(\s*DE\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 240

    if ((matched = str.match(/DEC\s+de/i)) != null) {
      let rt = {
        pattern: "00011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264

    if ((matched = str.match(/INC\s+e/i)) != null) {
      let rt = {
        pattern: "00011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+e/i)) != null) {
      let rt = {
        pattern: "00011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295

    if ((matched = str.match(/LD\s+e\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RRA
    // Reference: zaks:82 page 412

    if ((matched = str.match(/RRA/i)) != null) {
      let rt = {
        pattern: "00011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JR @r,(PC+@n)
    // Reference: zaks:82 page 288

    if ((matched = str.match(/JR\s+nz\s*,\s*\s*\(\s*PC\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "001000000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 293

    if ((matched = str.match(/LD\s+hl\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00100001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // LD (@n),HL
    // Reference: zaks:82 page 323

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*HL/i)) != null) {
      let rt = {
        pattern: "00100010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 265

    if ((matched = str.match(/INC\s+hl/i)) != null) {
      let rt = {
        pattern: "00100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264

    if ((matched = str.match(/INC\s+h/i)) != null) {
      let rt = {
        pattern: "00100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+h/i)) != null) {
      let rt = {
        pattern: "00100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295

    if ((matched = str.match(/LD\s+h\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // DAA
    // Reference: zaks:82 page 236

    if ((matched = str.match(/DAA/i)) != null) {
      let rt = {
        pattern: "00100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JR @r,(PC+@n)
    // Reference: zaks:82 page 288

    if ((matched = str.match(/JR\s+z\s*,\s*\s*\(\s*PC\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "001001000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // ADD HL,@r
    // Reference: zaks:82 page 203

    if ((matched = str.match(/ADD\s+HL\s*,\s*hl/i)) != null) {
      let rt = {
        pattern: "00101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD HL,(@n)
    // Reference: zaks:82 page 334

    if ((matched = str.match(/LD\s+HL\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00101010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 240

    if ((matched = str.match(/DEC\s+hl/i)) != null) {
      let rt = {
        pattern: "00101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264

    if ((matched = str.match(/INC\s+l/i)) != null) {
      let rt = {
        pattern: "00101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+l/i)) != null) {
      let rt = {
        pattern: "00101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295

    if ((matched = str.match(/LD\s+l\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CPL
    // Reference: zaks:82 page 235

    if ((matched = str.match(/CPL/i)) != null) {
      let rt = {
        pattern: "00101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JR @r,(PC+@n)
    // Reference: zaks:82 page 288

    if ((matched = str.match(/JR\s+nc\s*,\s*\s*\(\s*PC\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "001010000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 293

    if ((matched = str.match(/LD\s+sp\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00110001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // LD (@n),A
    // Reference: zaks:82 page 319

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*A/i)) != null) {
      let rt = {
        pattern: "00110010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 265

    if ((matched = str.match(/INC\s+sp/i)) != null) {
      let rt = {
        pattern: "00110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264
    // INC (HL)
    // Reference: zaks:82 page 267

    if ((matched = str.match(/INC\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238
    // DEC (HL)
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295
    // LD (HL),@n
    // Reference: zaks:82 page 301

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00110110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // SCF
    // Reference: zaks:82 page 424

    if ((matched = str.match(/SCF/i)) != null) {
      let rt = {
        pattern: "00110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JR @r,(PC+@n)
    // Reference: zaks:82 page 288

    if ((matched = str.match(/JR\s+c\s*,\s*\s*\(\s*PC\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "001011000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // ADD HL,@r
    // Reference: zaks:82 page 203

    if ((matched = str.match(/ADD\s+HL\s*,\s*sp/i)) != null) {
      let rt = {
        pattern: "00111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD A,(@n)
    // Reference: zaks:82 page 317

    if ((matched = str.match(/LD\s+A\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00111010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 240

    if ((matched = str.match(/DEC\s+sp/i)) != null) {
      let rt = {
        pattern: "00111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC @r
    // Reference: zaks:82 page 264

    if ((matched = str.match(/INC\s+a/i)) != null) {
      let rt = {
        pattern: "00111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // DEC @r
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s+a/i)) != null) {
      let rt = {
        pattern: "00111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@n
    // Reference: zaks:82 page 295

    if ((matched = str.match(/LD\s+a\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CCF
    // Reference: zaks:82 page 224
    // Reference: The H flag should be set to the old carry, according to http://www.z80.info/z80sflag.htm 

    if ((matched = str.match(/CCF/i)) != null) {
      let rt = {
        pattern: "00111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+b\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+b\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+b\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+b\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+b\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+b\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356

    if ((matched = str.match(/LD\s+b\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+b\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+c\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+c\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+c\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+c\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+c\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+c\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356

    if ((matched = str.match(/LD\s+c\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+c\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+d\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+d\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+d\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+d\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+d\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+d\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356

    if ((matched = str.match(/LD\s+d\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+d\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+e\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+e\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+e\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+e\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+e\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+e\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356

    if ((matched = str.match(/LD\s+e\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+e\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+h\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+h\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+h\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+h\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+h\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+h\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356

    if ((matched = str.match(/LD\s+h\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+h\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+l\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+l\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+l\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+l\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+l\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+l\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356

    if ((matched = str.match(/LD\s+l\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+l\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD (HL),@r
    // Reference: zaks:82 page 303

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD (HL),@r
    // Reference: zaks:82 page 303

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD (HL),@r
    // Reference: zaks:82 page 303

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD (HL),@r
    // Reference: zaks:82 page 303

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD (HL),@r
    // Reference: zaks:82 page 303

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD (HL),@r
    // Reference: zaks:82 page 303

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356
    // LD (HL),@r
    // Reference: zaks:82 page 303
    // HALT
    // Reference: zaks:82 page 257

    if ((matched = str.match(/HALT/i)) != null) {
      let rt = {
        pattern: "01110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD (HL),@r
    // Reference: zaks:82 page 303

    if ((matched = str.match(/LD\s+\s*\(\s*HL\s*\)\s*\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+a\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+a\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+a\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+a\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+a\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+a\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297
    // LD @r,(HL)
    // Reference: zaks:82 page 356

    if ((matched = str.match(/LD\s+a\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,@s
    // Reference: zaks:82 page 297

    if ((matched = str.match(/LD\s+a\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201

    if ((matched = str.match(/ADD\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201

    if ((matched = str.match(/ADD\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201

    if ((matched = str.match(/ADD\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201

    if ((matched = str.match(/ADD\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201

    if ((matched = str.match(/ADD\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201

    if ((matched = str.match(/ADD\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201
    // ADD A,(HL)
    // Reference: zaks:82 page 194

    if ((matched = str.match(/ADD\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@r
    // Reference: zaks:82 page 201

    if ((matched = str.match(/ADD\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190
    // ADC A,(HL)
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC A,@r
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434
    // SUB A,(HL)
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB A,@r
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420
    // SBC A,(HL)
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@r
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209
    // AND A,(HL)
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND A,@r
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436
    // XOR A,(HL)
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@r
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360
    // OR A,(HL)
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@r
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225
    // CP A,(HL)
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP A,@r
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+nz/i)) != null) {
      let rt = {
        pattern: "11000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r
    // Reference: zaks:82 page 373

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*bc/i)) != null) {
      let rt = {
        pattern: "11000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+nz\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11000010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // JP (@n)
    // Reference: zaks:82 page 284

    if ((matched = str.match(/JP\s+\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11000011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+nz\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11000100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r
    // Reference: zaks:82 page 379

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*bc/i)) != null) {
      let rt = {
        pattern: "11000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD A,@n
    // Reference: zaks:82 page 200

    if ((matched = str.match(/ADD\s+A\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x00/i)) != null) {
      let rt = {
        pattern: "11000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+z/i)) != null) {
      let rt = {
        pattern: "11001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET
    // Reference: zaks:82 page 388

    if ((matched = str.match(/RET/i)) != null) {
      let rt = {
        pattern: "11001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+z\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11001010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // CB
    // Reference:  page 

    if ((matched = str.match(/CB/i)) != null) {
      let rt = {
        pattern: "11001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+z\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11001100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // CALL (@n)
    // Reference: zaks:82 page 222

    if ((matched = str.match(/CALL\s\s*\\s*\+\s*\s*\s*\\s*\\s*\(\s*\s*\s*\s*\\s*\(\s*\s*\w\s*\\s*\+\s*\s*\s*\\s*\)\s*\s*\s*\\s*\\s*\)\s*\s*\s*/i)) != null) {
      let rt = {
        pattern: "11001101nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // ADC A,@n
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x08/i)) != null) {
      let rt = {
        pattern: "11001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+nc/i)) != null) {
      let rt = {
        pattern: "11010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r
    // Reference: zaks:82 page 373

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*de/i)) != null) {
      let rt = {
        pattern: "11010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+nc\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11010010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // OUT (@n),A
    // Reference: zaks:82 page 368

    if ((matched = str.match(/OUT\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*A/i)) != null) {
      let rt = {
        pattern: "11010011nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+nc\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11010100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r
    // Reference: zaks:82 page 379

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*de/i)) != null) {
      let rt = {
        pattern: "11010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SUB @n
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x10/i)) != null) {
      let rt = {
        pattern: "11010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+c/i)) != null) {
      let rt = {
        pattern: "11011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // EXX
    // Reference: zaks:82 page 256

    if ((matched = str.match(/EXX/i)) != null) {
      let rt = {
        pattern: "11011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+c\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11011010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // IN A,(@n)
    // Reference: zaks:82 page 263

    if ((matched = str.match(/IN\s\s*\+\s*A\s*\s*,\s*\s*\s*\\s*\(\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "11011011nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+c\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11011100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DD
    // Reference:  page 

    if ((matched = str.match(/DD/i)) != null) {
      let rt = {
        pattern: "11011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC A,@n
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x18/i)) != null) {
      let rt = {
        pattern: "11011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+po/i)) != null) {
      let rt = {
        pattern: "11100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r
    // Reference: zaks:82 page 373

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*hl/i)) != null) {
      let rt = {
        pattern: "11100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+po\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11100010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // EX (SP),HL
    // Reference: zaks:82 page 250

    if ((matched = str.match(/EX\s\s*\\s*\+\s*\s*\s*\\s*\\s*\(\s*\s*\s*SP\s*\\s*\\s*\)\s*\s*\s*\s*\s*\s*,\s*\s*\s*HL/i)) != null) {
      let rt = {
        pattern: "11100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+po\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11100100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r
    // Reference: zaks:82 page 379

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*hl/i)) != null) {
      let rt = {
        pattern: "11100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // AND @n
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x20/i)) != null) {
      let rt = {
        pattern: "11100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+pe/i)) != null) {
      let rt = {
        pattern: "11101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP (HL)
    // Reference: zaks:82 page 285

    if ((matched = str.match(/JP\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+pe\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11101010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // EX DE,HL
    // Reference: zaks:82 page 249

    if ((matched = str.match(/EX\s\s*\\s*\+\s*\s*DE\s*\s*\s*,\s*\s*\s*HL/i)) != null) {
      let rt = {
        pattern: "11101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+pe\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11101100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // ED
    // Reference:  page 

    if ((matched = str.match(/ED/i)) != null) {
      let rt = {
        pattern: "11101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // XOR A,@n
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x28/i)) != null) {
      let rt = {
        pattern: "11101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+p/i)) != null) {
      let rt = {
        pattern: "11110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // POP @r
    // Reference: zaks:82 page 373

    if ((matched = str.match(/POP\s\s*\\s*\+\s*\s*af/i)) != null) {
      let rt = {
        pattern: "11110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+p\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11110010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DI
    // Reference: zaks:82 page 244

    if ((matched = str.match(/DI/i)) != null) {
      let rt = {
        pattern: "11110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+p\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11110100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // PUSH @r
    // Reference: zaks:82 page 379

    if ((matched = str.match(/PUSH\s\s*\\s*\+\s*\s*af/i)) != null) {
      let rt = {
        pattern: "11110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OR A,@n
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+A\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11110110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x30/i)) != null) {
      let rt = {
        pattern: "11110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RET @r
    // Reference: zaks:82 page 390

    if ((matched = str.match(/RET\s+m/i)) != null) {
      let rt = {
        pattern: "11111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD SP,HL
    // Reference: zaks:82 page 345

    if ((matched = str.match(/LD\s+SP\s*,\s*HL/i)) != null) {
      let rt = {
        pattern: "11111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP @r,(@n)
    // Reference: zaks:82 page 282

    if ((matched = str.match(/JP\s+m\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11111010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // EI
    // Reference: zaks:82 page 247

    if ((matched = str.match(/EI/i)) != null) {
      let rt = {
        pattern: "11111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CALL @r,@n
    // Reference: zaks:82 page 219
    // Reference: This edition describes the P CC as 100, instead of 110

    if ((matched = str.match(/CALL\s+m\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "11111100nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // FD
    // Reference:  page 

    if ((matched = str.match(/FD/i)) != null) {
      let rt = {
        pattern: "11111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CP @n
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+(\w+)/i)) != null) {
      let rt = {
        pattern: "11111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RST @r
    // Reference: zaks:82 page 418

    if ((matched = str.match(/RST\s\s*\\s*\+\s*\s*0x38/i)) != null) {
      let rt = {
        pattern: "11111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD IX,@r
    // Reference: zaks:82 page 205

    if ((matched = str.match(/ADD\s+IX\s*,\s*bc/i)) != null) {
      let rt = {
        pattern: "00001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD IX,@r
    // Reference: zaks:82 page 205

    if ((matched = str.match(/ADD\s+IX\s*,\s*de/i)) != null) {
      let rt = {
        pattern: "00011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD IX,@n
    // Reference: zaks:82 page 336

    if ((matched = str.match(/LD\s+IX\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00100001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // LD (@n),IX
    // Reference: zaks:82 page 325

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*IX/i)) != null) {
      let rt = {
        pattern: "00100010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // INC IX
    // Reference: zaks:82 page 272

    if ((matched = str.match(/INC\s+IX/i)) != null) {
      let rt = {
        pattern: "00100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD IX,@r
    // Reference: zaks:82 page 205

    if ((matched = str.match(/ADD\s+IX\s*,\s*ix/i)) != null) {
      let rt = {
        pattern: "00101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD IX,(@n)
    // Reference: zaks:82 page 338

    if ((matched = str.match(/LD\s+IX\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00101010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DEC IX
    // Reference: zaks:82 page 242

    if ((matched = str.match(/DEC\s+IX/i)) != null) {
      let rt = {
        pattern: "00101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC (IX+@n)
    // Reference: zaks:82 page 268

    if ((matched = str.match(/INC\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00110100nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // DEC (IX+@n)
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00110101nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IX+@d),@n
    // Reference: zaks:82 page 309

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00110110ddddddddnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/d+/, emf.utils.bin8(value0));
      let value1 = emf.utils.convertToDecimal(matched[2]);
      if (value1 == undefined) {
        value1 = getEquateValue(matched[2]);
        if (value1 == undefined) {
          rt.retry = true;
          value1 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value1));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // ADD IX,@r
    // Reference: zaks:82 page 205

    if ((matched = str.match(/ADD\s+IX\s*,\s*sp/i)) != null) {
      let rt = {
        pattern: "00111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305

    if ((matched = str.match(/LD\s+b\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305

    if ((matched = str.match(/LD\s+c\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305

    if ((matched = str.match(/LD\s+d\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305

    if ((matched = str.match(/LD\s+e\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305

    if ((matched = str.match(/LD\s+h\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305

    if ((matched = str.match(/LD\s+l\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IX+@n),@r
    // Reference: zaks:82 page 313

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01110000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IX+@n),@r
    // Reference: zaks:82 page 313

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01110001nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IX+@n),@r
    // Reference: zaks:82 page 313

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01110010nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IX+@n),@r
    // Reference: zaks:82 page 313

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01110011nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IX+@n),@r
    // Reference: zaks:82 page 313

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01110100nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IX+@n),@r
    // Reference: zaks:82 page 313

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01110101nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305
    // LD (IX+@n),@r
    // Reference: zaks:82 page 313
    // LD (IX+@n),@r
    // Reference: zaks:82 page 313

    if ((matched = str.match(/LD\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01110111nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IX+@n)
    // Reference: zaks:82 page 305

    if ((matched = str.match(/LD\s+a\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // ADD A,(IX+@n)
    // Reference: zaks:82 page 196

    if ((matched = str.match(/ADD\s+A\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // ADC A,(IX+@n)
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // SUB (IX+@n)
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // SBC A,(IX+@n)
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // AND (IX+@n)
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // XOR A,(IX+@n)
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // OR (IX+@n)
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10110110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CP A,(IX+@n)
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*\s*\(\s*IX\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RLC (IX+@n)
    // Reference: zaks:82 page 404
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
      if ((matched = str.match(/RLC\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RRC (IX+@n)
    // Reference: zaks:82 page 413
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
      if ((matched = str.match(/RRC\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00001110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RL (IX+@n)
    // Reference: zaks:82 page 396
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
      if ((matched = str.match(/RL\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00010110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RR (IX+@n)
    // Reference: zaks:82 page 410
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
      if ((matched = str.match(/RR\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00011110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SLA (IX+@n)
    // Reference: zaks:82 page 428
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
      if ((matched = str.match(/SLA\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00100110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SRA (IX+@n)
    // Reference: zaks:82 page 430
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
      if ((matched = str.match(/SRA\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00101110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SLL (IX+@n)
    // Reference:  page 
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
      if ((matched = str.match(/SLL\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00110110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SRL (IX+@n)
    // Reference: zaks:82 page 432
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
      if ((matched = str.match(/SRL\s\s*\+\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00111110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // BIT @r,(IX+@n)
    // Reference: zaks:82 page 213
    if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
      if ((matched = str.match(/BIT\s\s*\+\s*0\s*\s*,\s*\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn01000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RES @r,(IX+@n)
    // Reference: zaks:82 page 385
    if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
      if ((matched = str.match(/RES\s\s*\+\s*0\s*\s*,\s*\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn10000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SET @r,(IX+@n)
    // Reference: zaks:82 page 425
    if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
      if ((matched = str.match(/SET\s\s*\+\s*0\s*\s*,\s*\s*\s*\\s*\(\s*\s*IX\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn11000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // POP IX
    // Reference: zaks:82 page 375

    if ((matched = str.match(/POP\s\s*\+\s*IX/i)) != null) {
      let rt = {
        pattern: "11100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // EX (SP),IX
    // Reference: zaks:82 page 252

    if ((matched = str.match(/EX\s\s*\\s*\+\s*\s*\s*\\s*\\s*\(\s*\s*\s*SP\s*\\s*\\s*\)\s*\s*\s*\s*\s*\s*,\s*\s*\s*IX/i)) != null) {
      let rt = {
        pattern: "11100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // PUSH IX
    // Reference: zaks:82 page 381

    if ((matched = str.match(/PUSH\s\s*\+\s*IX/i)) != null) {
      let rt = {
        pattern: "11100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP (IX)
    // Reference: zaks:82 page 286

    if ((matched = str.match(/JP\s+\s*\(\s*IX\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD SP,IX
    // Reference: zaks:82 page 346

    if ((matched = str.match(/LD\s+SP\s*,\s*IX/i)) != null) {
      let rt = {
        pattern: "11111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400

    if ((matched = str.match(/RLC\s+b/i)) != null) {
      let rt = {
        pattern: "00000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400

    if ((matched = str.match(/RLC\s+c/i)) != null) {
      let rt = {
        pattern: "00000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400

    if ((matched = str.match(/RLC\s+d/i)) != null) {
      let rt = {
        pattern: "00000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400

    if ((matched = str.match(/RLC\s+e/i)) != null) {
      let rt = {
        pattern: "00000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400

    if ((matched = str.match(/RLC\s+h/i)) != null) {
      let rt = {
        pattern: "00000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400

    if ((matched = str.match(/RLC\s+l/i)) != null) {
      let rt = {
        pattern: "00000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400
    // RLC (HL)
    // Reference: zaks:82 page 402

    if ((matched = str.match(/RLC\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLC @r
    // Reference: zaks:82 page 400

    if ((matched = str.match(/RLC\s+a/i)) != null) {
      let rt = {
        pattern: "00000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s+b/i)) != null) {
      let rt = {
        pattern: "00001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s+c/i)) != null) {
      let rt = {
        pattern: "00001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s+d/i)) != null) {
      let rt = {
        pattern: "00001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s+e/i)) != null) {
      let rt = {
        pattern: "00001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s+h/i)) != null) {
      let rt = {
        pattern: "00001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s+l/i)) != null) {
      let rt = {
        pattern: "00001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413
    // RRC (HL)
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRC @r
    // Reference: zaks:82 page 413

    if ((matched = str.match(/RRC\s+a/i)) != null) {
      let rt = {
        pattern: "00001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s+b/i)) != null) {
      let rt = {
        pattern: "00010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s+c/i)) != null) {
      let rt = {
        pattern: "00010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s+d/i)) != null) {
      let rt = {
        pattern: "00010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s+e/i)) != null) {
      let rt = {
        pattern: "00010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s+h/i)) != null) {
      let rt = {
        pattern: "00010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s+l/i)) != null) {
      let rt = {
        pattern: "00010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396
    // RL (HL)
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RL @r
    // Reference: zaks:82 page 396

    if ((matched = str.match(/RL\s+a/i)) != null) {
      let rt = {
        pattern: "00010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s+b/i)) != null) {
      let rt = {
        pattern: "00011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s+c/i)) != null) {
      let rt = {
        pattern: "00011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s+d/i)) != null) {
      let rt = {
        pattern: "00011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s+e/i)) != null) {
      let rt = {
        pattern: "00011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s+h/i)) != null) {
      let rt = {
        pattern: "00011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s+l/i)) != null) {
      let rt = {
        pattern: "00011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410
    // RR (HL)
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RR @r
    // Reference: zaks:82 page 410

    if ((matched = str.match(/RR\s+a/i)) != null) {
      let rt = {
        pattern: "00011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s+b/i)) != null) {
      let rt = {
        pattern: "00100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s+c/i)) != null) {
      let rt = {
        pattern: "00100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s+d/i)) != null) {
      let rt = {
        pattern: "00100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s+e/i)) != null) {
      let rt = {
        pattern: "00100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s+h/i)) != null) {
      let rt = {
        pattern: "00100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s+l/i)) != null) {
      let rt = {
        pattern: "00100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428
    // SLA (HL)
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLA @r
    // Reference: zaks:82 page 428

    if ((matched = str.match(/SLA\s+a/i)) != null) {
      let rt = {
        pattern: "00100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s+b/i)) != null) {
      let rt = {
        pattern: "00101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s+c/i)) != null) {
      let rt = {
        pattern: "00101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s+d/i)) != null) {
      let rt = {
        pattern: "00101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s+e/i)) != null) {
      let rt = {
        pattern: "00101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s+h/i)) != null) {
      let rt = {
        pattern: "00101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s+l/i)) != null) {
      let rt = {
        pattern: "00101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430
    // SRA (HL)
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRA @r
    // Reference: zaks:82 page 430

    if ((matched = str.match(/SRA\s+a/i)) != null) {
      let rt = {
        pattern: "00101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 

    if ((matched = str.match(/SLL\s+b/i)) != null) {
      let rt = {
        pattern: "00110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 

    if ((matched = str.match(/SLL\s+c/i)) != null) {
      let rt = {
        pattern: "00110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 

    if ((matched = str.match(/SLL\s+d/i)) != null) {
      let rt = {
        pattern: "00110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 

    if ((matched = str.match(/SLL\s+e/i)) != null) {
      let rt = {
        pattern: "00110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 

    if ((matched = str.match(/SLL\s+h/i)) != null) {
      let rt = {
        pattern: "00110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 

    if ((matched = str.match(/SLL\s+l/i)) != null) {
      let rt = {
        pattern: "00110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 
    // SLL (HL)
    // Reference:  page 

    if ((matched = str.match(/SLL\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SLL @r
    // Reference:  page 

    if ((matched = str.match(/SLL\s+a/i)) != null) {
      let rt = {
        pattern: "00110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s+b/i)) != null) {
      let rt = {
        pattern: "00111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s+c/i)) != null) {
      let rt = {
        pattern: "00111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s+d/i)) != null) {
      let rt = {
        pattern: "00111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s+e/i)) != null) {
      let rt = {
        pattern: "00111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s+h/i)) != null) {
      let rt = {
        pattern: "00111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s+l/i)) != null) {
      let rt = {
        pattern: "00111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432
    // SRL (HL)
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s\s*\+\s*\s*\\s*\(\s*\s*HL\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SRL @r
    // Reference: zaks:82 page 432

    if ((matched = str.match(/SRL\s+a/i)) != null) {
      let rt = {
        pattern: "00111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+0\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+0\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+0\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+0\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+0\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+0\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+0\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+0\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+1\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+1\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+1\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+1\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+1\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+1\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+1\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+1\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+2\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+2\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+2\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+2\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+2\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+2\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+2\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+2\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+3\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+3\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+3\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+3\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+3\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+3\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+3\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+3\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+4\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+4\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+4\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+4\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+4\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+4\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+4\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+4\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+5\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+5\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+5\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+5\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+5\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+5\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+5\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+5\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+6\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+6\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+6\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+6\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+6\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+6\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+6\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+6\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+7\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+7\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+7\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+7\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+7\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+7\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217
    // BIT @r, (HL)
    // Reference: zaks:82 page 211

    if ((matched = str.match(/BIT\s+7\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // BIT @r,@s
    // Reference: zaks:82 page 217

    if ((matched = str.match(/BIT\s+7\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+0\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+1\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+2\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+3\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+4\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+5\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+6\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "10111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "10111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "10111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "10111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "10111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "10111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385
    // RES @r, (HL)
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RES @r,@s
    // Reference: zaks:82 page 385

    if ((matched = str.match(/RES\s+7\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "10111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11000011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11000100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+0\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11001011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11001100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+1\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11010011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11010100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+2\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11011011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11011100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+3\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11100100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11100110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+4\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11101100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11101101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11101110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+5\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11110100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11110101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11110110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+6\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11110111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "11111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "11111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "11111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "11111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "11111100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "11111101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425
    // SET @r, (HL)
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*\s+\s*\(\s*HL\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11111110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SET @r,@s
    // Reference: zaks:82 page 425

    if ((matched = str.match(/SET\s+7\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "11111111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag

    if ((matched = str.match(/IN\s\s*\+\s*b\s*\s*,\s*\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01000000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01000001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC HL,@r
    // Reference: zaks:82 page 422

    if ((matched = str.match(/SBC\s+HL\s*,\s*bc/i)) != null) {
      let rt = {
        pattern: "01000010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD (@n),@r
    // Reference: zaks:82 page 321

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*bc/i)) != null) {
      let rt = {
        pattern: "01000011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RETN
    // Reference: zaks:82 page 394

    if ((matched = str.match(/RETN/i)) != null) {
      let rt = {
        pattern: "01000101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IM 0
    // Reference: zaks:82 page 258

    if ((matched = str.match(/IM\s+0/i)) != null) {
      let rt = {
        pattern: "01000110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD I,A
    // Reference: zaks:82 page 332

    if ((matched = str.match(/LD\s+I\s*,\s*A/i)) != null) {
      let rt = {
        pattern: "01000111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag

    if ((matched = str.match(/IN\s\s*\+\s*c\s*\s*,\s*\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01001000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC HL,@r
    // Reference: zaks:82 page 192

    if ((matched = str.match(/ADC\s+HL\s*,\s*bc/i)) != null) {
      let rt = {
        pattern: "01001010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,(@n)
    // Reference: zaks:82 page 292

    if ((matched = str.match(/LD\s+bc\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01001011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RETI
    // Reference: zaks:82 page 392

    if ((matched = str.match(/RETI/i)) != null) {
      let rt = {
        pattern: "01001101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IM 1

    if ((matched = str.match(/IM\s+1/i)) != null) {
      let rt = {
        pattern: "01001110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD R,A
    // Reference: zaks:82 page 344

    if ((matched = str.match(/LD\s\s*\+\s*R\s*\s*,\s*\s*A/i)) != null) {
      let rt = {
        pattern: "01001111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag

    if ((matched = str.match(/IN\s\s*\+\s*d\s*\s*,\s*\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01010000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01010001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC HL,@r
    // Reference: zaks:82 page 422

    if ((matched = str.match(/SBC\s+HL\s*,\s*de/i)) != null) {
      let rt = {
        pattern: "01010010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD (@n),@r
    // Reference: zaks:82 page 321

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*de/i)) != null) {
      let rt = {
        pattern: "01010011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RETN

    if ((matched = str.match(/RETN/i)) != null) {
      let rt = {
        pattern: "01010101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IM 1
    // Reference: zaks:82 page 259

    if ((matched = str.match(/IM\s+1/i)) != null) {
      let rt = {
        pattern: "01010110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD A,I
    // Reference: zaks:82 page 331

    if ((matched = str.match(/LD\s\s*\+\s*A\s*\s*,\s*\s*I/i)) != null) {
      let rt = {
        pattern: "01010111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag

    if ((matched = str.match(/IN\s\s*\+\s*e\s*\s*,\s*\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01011000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC HL,@r
    // Reference: zaks:82 page 192

    if ((matched = str.match(/ADC\s+HL\s*,\s*de/i)) != null) {
      let rt = {
        pattern: "01011010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,(@n)
    // Reference: zaks:82 page 292

    if ((matched = str.match(/LD\s+de\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01011011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RETN

    if ((matched = str.match(/RETN/i)) != null) {
      let rt = {
        pattern: "01011101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IM 2
    // Reference: zaks:82 page 260

    if ((matched = str.match(/IM\s+2/i)) != null) {
      let rt = {
        pattern: "01011110",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD A,R
    // Reference: zaks:82 page 333

    if ((matched = str.match(/LD\s\s*\+\s*A\s*\s*,\s*\s*R/i)) != null) {
      let rt = {
        pattern: "01011111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag

    if ((matched = str.match(/IN\s\s*\+\s*h\s*\s*,\s*\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC HL,@r
    // Reference: zaks:82 page 422

    if ((matched = str.match(/SBC\s+HL\s*,\s*hl/i)) != null) {
      let rt = {
        pattern: "01100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD (@n),@r
    // Reference: zaks:82 page 321

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*hl/i)) != null) {
      let rt = {
        pattern: "01100011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RRD
    // Reference: zaks:82 page 416

    if ((matched = str.match(/RRD/i)) != null) {
      let rt = {
        pattern: "01100111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag

    if ((matched = str.match(/IN\s\s*\+\s*l\s*\s*,\s*\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC HL,@r
    // Reference: zaks:82 page 192

    if ((matched = str.match(/ADC\s+HL\s*,\s*hl/i)) != null) {
      let rt = {
        pattern: "01101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,(@n)
    // Reference: zaks:82 page 292

    if ((matched = str.match(/LD\s+hl\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01101011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // RLD
    // Reference: zaks:82 page 408

    if ((matched = str.match(/RLD/i)) != null) {
      let rt = {
        pattern: "01101111",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag
    // IN (C)

    if ((matched = str.match(/IN\s\s*\+\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366
    // OUT (C),0

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*0/i)) != null) {
      let rt = {
        pattern: "01110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // SBC HL,@r
    // Reference: zaks:82 page 422

    if ((matched = str.match(/SBC\s+HL\s*,\s*sp/i)) != null) {
      let rt = {
        pattern: "01110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD (@n),@r
    // Reference: zaks:82 page 321

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*sp/i)) != null) {
      let rt = {
        pattern: "01110011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IN @r,(C)
    // Reference: zaks:82 page 261
    // Reference: We don't set the H flag

    if ((matched = str.match(/IN\s\s*\+\s*a\s*\s*,\s*\s*\s*\\s*\(\s*\s*C\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "01111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUT (C),@r
    // Reference: zaks:82 page 366

    if ((matched = str.match(/OUT\s+\s*\(\s*C\s*\)\s*\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADC HL,@r
    // Reference: zaks:82 page 192

    if ((matched = str.match(/ADC\s+HL\s*,\s*sp/i)) != null) {
      let rt = {
        pattern: "01111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,(@n)
    // Reference: zaks:82 page 292

    if ((matched = str.match(/LD\s+sp\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01111011nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // NEG
    // Reference: zaks:82 page 358

    if ((matched = str.match(/NEG/i)) != null) {
      let rt = {
        pattern: "01rrr100",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LDI
    // Reference: zaks:82 page 352

    if ((matched = str.match(/LDI/i)) != null) {
      let rt = {
        pattern: "10100000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CPI
    // Reference: zaks:82 page 231

    if ((matched = str.match(/CPI/i)) != null) {
      let rt = {
        pattern: "10100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INI
    // Reference: zaks:82 page 278

    if ((matched = str.match(/INI/i)) != null) {
      let rt = {
        pattern: "10100010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUTI
    // Reference: zaks:82 page 371
    // Reference: confusion whether should N be set or not?

    if ((matched = str.match(/OUTI/i)) != null) {
      let rt = {
        pattern: "10100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LDD
    // Reference: zaks:82 page 348

    if ((matched = str.match(/LDD/i)) != null) {
      let rt = {
        pattern: "10101000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CPD
    // Reference: zaks:82 page 227

    if ((matched = str.match(/CPD/i)) != null) {
      let rt = {
        pattern: "10101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // IND
    // Reference: zaks:82 page 274

    if ((matched = str.match(/IND/i)) != null) {
      let rt = {
        pattern: "10101010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OUTD
    // Reference: zaks:82 page 369

    if ((matched = str.match(/OUTD/i)) != null) {
      let rt = {
        pattern: "10101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LDIR
    // Reference: zaks:82 page 354
    // Reference: The book indicates to clear the PV flag, but http://www.z80.info/z80sflag.htm suggests otherwise

    if ((matched = str.match(/LDIR/i)) != null) {
      let rt = {
        pattern: "10110000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CPIR
    // Reference: zaks:82 page 233

    if ((matched = str.match(/CPIR/i)) != null) {
      let rt = {
        pattern: "10110001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INIR
    // Reference: zaks:82 page 280

    if ((matched = str.match(/INIR/i)) != null) {
      let rt = {
        pattern: "10110010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OTIR
    // Reference: zaks:82 page 364

    if ((matched = str.match(/OTIR/i)) != null) {
      let rt = {
        pattern: "10110011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LDDR
    // Reference: zaks:82 page 350

    if ((matched = str.match(/LDDR/i)) != null) {
      let rt = {
        pattern: "10111000",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // CPDR
    // Reference: zaks:82 page 229

    if ((matched = str.match(/CPDR/i)) != null) {
      let rt = {
        pattern: "10111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INDR
    // Reference: zaks:82 page 276

    if ((matched = str.match(/INDR/i)) != null) {
      let rt = {
        pattern: "10111010",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // OTDR
    // Reference: zaks:82 page 362

    if ((matched = str.match(/OTDR/i)) != null) {
      let rt = {
        pattern: "10111011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD IY,@r
    // Reference: zaks:82 page 207

    if ((matched = str.match(/ADD\s+IY\s*,\s*bc/i)) != null) {
      let rt = {
        pattern: "00001001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD IY,@r
    // Reference: zaks:82 page 207

    if ((matched = str.match(/ADD\s+IY\s*,\s*de/i)) != null) {
      let rt = {
        pattern: "00011001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD IY,@n
    // Reference: zaks:82 page 340

    if ((matched = str.match(/LD\s+IY\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00100001nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // LD (@n),IY
    // Reference: zaks:82 page 327

    if ((matched = str.match(/LD\s+\s*\(\s*(\w+)\s*\)\s*\s*,\s*IY/i)) != null) {
      let rt = {
        pattern: "00100010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // INC IY
    // Reference: zaks:82 page 273

    if ((matched = str.match(/INC\s+IY/i)) != null) {
      let rt = {
        pattern: "00100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // ADD IY,@r
    // Reference: zaks:82 page 207

    if ((matched = str.match(/ADD\s+IY\s*,\s*iy/i)) != null) {
      let rt = {
        pattern: "00101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD IY,(@n)
    // Reference: zaks:82 page 342

    if ((matched = str.match(/LD\s+IY\s*,\s*\s*\(\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "00101010nnnnnnnnnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin16(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // DEC IY
    // Reference: zaks:82 page 243

    if ((matched = str.match(/DEC\s+IY/i)) != null) {
      let rt = {
        pattern: "00101011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // INC (IY+@n)
    // Reference: zaks:82 page 270

    if ((matched = str.match(/INC\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00110100nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // DEC (IY+@n)
    // Reference: zaks:82 page 238

    if ((matched = str.match(/DEC\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
      let rt = {
        pattern: "00110101nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IY+@d),@n
    // Reference: zaks:82 page 311

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*(\w+)/i)) != null) {
      let rt = {
        pattern: "00110110ddddddddnnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/d+/, emf.utils.bin8(value0));
      let value1 = emf.utils.convertToDecimal(matched[2]);
      if (value1 == undefined) {
        value1 = getEquateValue(matched[2]);
        if (value1 == undefined) {
          rt.retry = true;
          value1 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value1));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
        parseInt(rt.pattern.substr(16, 8), 2),
      ]
      return rt;
    }

    // ADD IY,@r
    // Reference: zaks:82 page 207

    if ((matched = str.match(/ADD\s+IY\s*,\s*sp/i)) != null) {
      let rt = {
        pattern: "00111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307

    if ((matched = str.match(/LD\s+b\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307

    if ((matched = str.match(/LD\s+c\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307

    if ((matched = str.match(/LD\s+d\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307

    if ((matched = str.match(/LD\s+e\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307

    if ((matched = str.match(/LD\s+h\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307

    if ((matched = str.match(/LD\s+l\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IY+@n),@r
    // Reference: zaks:82 page 315

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*b/i)) != null) {
      let rt = {
        pattern: "01110000nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IY+@n),@r
    // Reference: zaks:82 page 315

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*c/i)) != null) {
      let rt = {
        pattern: "01110001nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IY+@n),@r
    // Reference: zaks:82 page 315

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*d/i)) != null) {
      let rt = {
        pattern: "01110010nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IY+@n),@r
    // Reference: zaks:82 page 315

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*e/i)) != null) {
      let rt = {
        pattern: "01110011nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IY+@n),@r
    // Reference: zaks:82 page 315

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*h/i)) != null) {
      let rt = {
        pattern: "01110100nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD (IY+@n),@r
    // Reference: zaks:82 page 315

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*l/i)) != null) {
      let rt = {
        pattern: "01110101nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307
    // LD (IY+@n),@r
    // Reference: zaks:82 page 315
    // LD (IY+@n),@r
    // Reference: zaks:82 page 315

    if ((matched = str.match(/LD\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*\s*,\s*a/i)) != null) {
      let rt = {
        pattern: "01110111nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // LD @r,(IY+@n)
    // Reference: zaks:82 page 307

    if ((matched = str.match(/LD\s+a\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "01111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // ADD A,(IY+@n)
    // Reference: zaks:82 page 198

    if ((matched = str.match(/ADD\s+A\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10000110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // ADC A,(IY+@n)
    // Reference: zaks:82 page 190

    if ((matched = str.match(/ADC\s+A\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10001110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // SUB (IY+@n)
    // Reference: zaks:82 page 434

    if ((matched = str.match(/SUB\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10010110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // SBC A,(IY+@n)
    // Reference: zaks:82 page 420

    if ((matched = str.match(/SBC\s+A\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10011110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // AND (IY+@n)
    // Reference: zaks:82 page 209

    if ((matched = str.match(/AND\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10100110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // XOR A,(IY+@n)
    // Reference: zaks:82 page 436

    if ((matched = str.match(/XOR\s+A\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10101110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // OR (IY+@n)
    // Reference: zaks:82 page 360

    if ((matched = str.match(/OR\s+\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10110110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // CP A,(IY+@n)
    // Reference: zaks:82 page 225

    if ((matched = str.match(/CP\s+A\s*,\s*\s*\(\s*IY\s*\+\s*(\w+)\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "10111110nnnnnnnn",
        retry: false
      };
      let value0 = emf.utils.convertToDecimal(matched[1]);
      if (value0 == undefined) {
        value0 = getEquateValue(matched[1]);
        if (value0 == undefined) {
          rt.retry = true;
          value0 = 0xeeee;
        }
      }
      rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
        parseInt(rt.pattern.substr(8, 8), 2),
      ]
      return rt;
    }

    // RLC (IY+@n)
    // Reference: zaks:82 page 406
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
      if ((matched = str.match(/RLC\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RRC (IY+@n)
    // Reference: zaks:82 page 413
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
      if ((matched = str.match(/RRC\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00001110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RL (IY+@n)
    // Reference: zaks:82 page 396
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
      if ((matched = str.match(/RL\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00010110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RR (IY+@n)
    // Reference: zaks:82 page 410
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
      if ((matched = str.match(/RR\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00011110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SLA (IY+@n)
    // Reference: zaks:82 page 428
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
      if ((matched = str.match(/SLA\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00100110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SRA (IY+@n)
    // Reference: zaks:82 page 430
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
      if ((matched = str.match(/SRA\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00101110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SLL (IY+@n)
    // Reference:  page 
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
      if ((matched = str.match(/SLL\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00110110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SRL (IY+@n)
    // Reference: zaks:82 page 432
    if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
      if ((matched = str.match(/SRL\s\s*\+\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn00111110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // BIT @r,(IY+@n)
    // Reference: zaks:82 page 213
    if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
      if ((matched = str.match(/BIT\s\s*\+\s*0\s*\s*,\s*\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn01000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // RES @r,(IY+@n)
    // Reference: zaks:82 page 385
    if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
      if ((matched = str.match(/RES\s\s*\+\s*0\s*\s*,\s*\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn10000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // SET @r,(IY+@n)
    // Reference: zaks:82 page 425
    if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
      if ((matched = str.match(/SET\s\s*\+\s*0\s*\s*,\s*\s*\s*\\s*\(\s*\s*IY\s*\\s*\+\s*\s*\s*\(\s*\w\s*\+\s*\s*\)\s*\s*\\s*\)\s*\s*/i)) != null) {
        let rt = {
          pattern: "11001011nnnnnnnn11000110",
          retry: false
        };
        let value0 = emf.utils.convertToDecimal(matched[1]);
        if (value0 == undefined) {
          value0 = getEquateValue(matched[1]);
          if (value0 == undefined) {
            rt.retry = true;
            value0 = 0xeeee;
          }
        }
        rt.pattern = rt.pattern.replace(/n+/, emf.utils.bin8(value0));
        rt.data = [
          parseInt(rt.pattern.substr(0, 8), 2),
          parseInt(rt.pattern.substr(8, 8), 2),
          parseInt(rt.pattern.substr(16, 8), 2),
        ]
        return rt;
      }
    }
    // POP IY
    // Reference: zaks:82 page 377

    if ((matched = str.match(/POP\s\s*\+\s*IY/i)) != null) {
      let rt = {
        pattern: "11100001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // EX (SP),IY
    // Reference: zaks:82 page 254

    if ((matched = str.match(/EX\s\s*\\s*\+\s*\s*\s*\\s*\\s*\(\s*\s*\s*SP\s*\\s*\\s*\)\s*\s*\s*\s*\s*\s*,\s*\s*\s*IY/i)) != null) {
      let rt = {
        pattern: "11100011",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // PUSH IY
    // Reference: zaks:82 page 383

    if ((matched = str.match(/PUSH\s\s*\+\s*IY/i)) != null) {
      let rt = {
        pattern: "11100101",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // JP (IY)
    // Reference: zaks:82 page 286

    if ((matched = str.match(/JP\s+\s*\(\s*IY\s*\)\s*/i)) != null) {
      let rt = {
        pattern: "11101001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    // LD SP,IY
    // Reference: zaks:82 page 347

    if ((matched = str.match(/LD\s+SP\s*,\s*IY/i)) != null) {
      let rt = {
        pattern: "11111001",
        retry: false
      };
      rt.data = [
        parseInt(rt.pattern.substr(0, 8), 2),
      ]
      return rt;
    }

    return pattern;
  }
  return {
    clearEquateMap,
    setEquateValue,
    getEquateMap,
    getEquateValue,

    start,
    assemble
  }
});
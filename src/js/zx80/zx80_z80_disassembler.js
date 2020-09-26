// zx80_z80_disassemble
let zx80_z80_disassemble = (function(bus, options) {
  function disassemble(address) {
    return step(bus, address);
  }

  function getAddressText16(address) {
    let label = bus.memory.getLabel(address);
    if (label) {
      return label;
    }
    return emf.utils.hex16(address) + "H"
  }
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

  function start() {
    read8 = bus.memory.read8;
    read16 = bus.memory.read16;
  }

  function step(bus, addr) {
    var dis = new Object();
    dis.instruction = "Unknown opcode";
    dis.byte_length = 1;
    var instr; /* of type uint */
    let pc = new emf.Number(16, 2, addr);
    let opcode = read8(addr);

    switch (opcode) {
      case 0x0:
        // nop
        // Reference: zaks:82 page 359

        dis.byte_length = 1;
        dis.instruction = "nop";
        return dis;

        break;

      case 0x1:
        // LD @r,@n
        // Reference: zaks:82 page 293

        dis.byte_length = 3;
        dis.instruction = "LD bc," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x2:
        // LD (BC),A
        // Reference: zaks:82 page 299

        dis.byte_length = 1;
        dis.instruction = "LD (BC),A";
        return dis;

        break;

      case 0x3:
        // INC @r
        // Reference: zaks:82 page 265

        dis.byte_length = 1;
        dis.instruction = "INC bc";
        return dis;

        break;

      case 0x4:
        // INC @r
        // Reference: zaks:82 page 264

        dis.byte_length = 1;
        dis.instruction = "INC b";
        return dis;

        break;

      case 0x5:
        // DEC @r
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC b";
        return dis;

        break;

      case 0x6:
        // LD @r,@n
        // Reference: zaks:82 page 295

        dis.byte_length = 2;
        dis.instruction = "LD b," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x7:
        // RLCA
        // Reference: zaks:82 page 399

        dis.byte_length = 1;
        dis.instruction = "RLCA";
        return dis;

        break;

      case 0x8:
        // EX AF,AF’
        // Reference: zaks:82 page 248

        dis.byte_length = 1;
        dis.instruction = "EX AF,AF’";
        return dis;

        break;

      case 0x9:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        dis.byte_length = 1;
        dis.instruction = "ADD HL,bc";
        return dis;

        break;

      case 0xa:
        // LD A,(BC)
        // Reference: zaks:82 page 329

        dis.byte_length = 1;
        dis.instruction = "LD A,(BC)";
        return dis;

        break;

      case 0xb:
        // DEC @r
        // Reference: zaks:82 page 240

        dis.byte_length = 1;
        dis.instruction = "DEC bc";
        return dis;

        break;

      case 0xc:
        // INC @r
        // Reference: zaks:82 page 264

        dis.byte_length = 1;
        dis.instruction = "INC c";
        return dis;

        break;

      case 0xd:
        // DEC @r
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC c";
        return dis;

        break;

      case 0xe:
        // LD @r,@n
        // Reference: zaks:82 page 295

        dis.byte_length = 2;
        dis.instruction = "LD c," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xf:
        // RRCA
        // Reference: zaks:82 page 415

        dis.byte_length = 1;
        dis.instruction = "RRCA";
        return dis;

        break;

      case 0x10:
        // DJNZ (PC+@n)
        // Reference: zaks:82 page 245

        dis.byte_length = 2;
        dis.instruction = "DJNZ (PC+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x11:
        // LD @r,@n
        // Reference: zaks:82 page 293

        dis.byte_length = 3;
        dis.instruction = "LD de," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x12:
        // LD (DE),A
        // Reference: zaks:82 page 300

        dis.byte_length = 1;
        dis.instruction = "LD (DE),A";
        return dis;

        break;

      case 0x13:
        // INC @r
        // Reference: zaks:82 page 265

        dis.byte_length = 1;
        dis.instruction = "INC de";
        return dis;

        break;

      case 0x14:
        // INC @r
        // Reference: zaks:82 page 264

        dis.byte_length = 1;
        dis.instruction = "INC d";
        return dis;

        break;

      case 0x15:
        // DEC @r
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC d";
        return dis;

        break;

      case 0x16:
        // LD @r,@n
        // Reference: zaks:82 page 295

        dis.byte_length = 2;
        dis.instruction = "LD d," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x17:
        // RLA
        // Reference: zaks:82 page 398

        dis.byte_length = 1;
        dis.instruction = "RLA";
        return dis;

        break;

      case 0x18:
        // JR (PC+@n)
        // Reference: zaks:82 page 290

        dis.byte_length = 2;
        dis.instruction = "JR (PC+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x19:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        dis.byte_length = 1;
        dis.instruction = "ADD HL,de";
        return dis;

        break;

      case 0x1a:
        // LD A,(DE)
        // Reference: zaks:82 page 330

        dis.byte_length = 1;
        dis.instruction = "LD A,(DE)";
        return dis;

        break;

      case 0x1b:
        // DEC @r
        // Reference: zaks:82 page 240

        dis.byte_length = 1;
        dis.instruction = "DEC de";
        return dis;

        break;

      case 0x1c:
        // INC @r
        // Reference: zaks:82 page 264

        dis.byte_length = 1;
        dis.instruction = "INC e";
        return dis;

        break;

      case 0x1d:
        // DEC @r
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC e";
        return dis;

        break;

      case 0x1e:
        // LD @r,@n
        // Reference: zaks:82 page 295

        dis.byte_length = 2;
        dis.instruction = "LD e," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x1f:
        // RRA
        // Reference: zaks:82 page 412

        dis.byte_length = 1;
        dis.instruction = "RRA";
        return dis;

        break;

      case 0x20:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        dis.byte_length = 2;
        dis.instruction = "JR nz,(PC+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x21:
        // LD @r,@n
        // Reference: zaks:82 page 293

        dis.byte_length = 3;
        dis.instruction = "LD hl," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x22:
        // LD (@n),HL
        // Reference: zaks:82 page 323

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),HL";
        return dis;

        break;

      case 0x23:
        // INC @r
        // Reference: zaks:82 page 265

        dis.byte_length = 1;
        dis.instruction = "INC hl";
        return dis;

        break;

      case 0x24:
        // INC @r
        // Reference: zaks:82 page 264

        dis.byte_length = 1;
        dis.instruction = "INC h";
        return dis;

        break;

      case 0x25:
        // DEC @r
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC h";
        return dis;

        break;

      case 0x26:
        // LD @r,@n
        // Reference: zaks:82 page 295

        dis.byte_length = 2;
        dis.instruction = "LD h," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x27:
        // DAA
        // Reference: zaks:82 page 236

        dis.byte_length = 1;
        dis.instruction = "DAA";
        return dis;

        break;

      case 0x28:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        dis.byte_length = 2;
        dis.instruction = "JR z,(PC+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x29:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        dis.byte_length = 1;
        dis.instruction = "ADD HL,hl";
        return dis;

        break;

      case 0x2a:
        // LD HL,(@n)
        // Reference: zaks:82 page 334

        dis.byte_length = 3;
        dis.instruction = "LD HL,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x2b:
        // DEC @r
        // Reference: zaks:82 page 240

        dis.byte_length = 1;
        dis.instruction = "DEC hl";
        return dis;

        break;

      case 0x2c:
        // INC @r
        // Reference: zaks:82 page 264

        dis.byte_length = 1;
        dis.instruction = "INC l";
        return dis;

        break;

      case 0x2d:
        // DEC @r
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC l";
        return dis;

        break;

      case 0x2e:
        // LD @r,@n
        // Reference: zaks:82 page 295

        dis.byte_length = 2;
        dis.instruction = "LD l," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x2f:
        // CPL
        // Reference: zaks:82 page 235

        dis.byte_length = 1;
        dis.instruction = "CPL";
        return dis;

        break;

      case 0x30:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        dis.byte_length = 2;
        dis.instruction = "JR nc,(PC+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x31:
        // LD @r,@n
        // Reference: zaks:82 page 293

        dis.byte_length = 3;
        dis.instruction = "LD sp," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x32:
        // LD (@n),A
        // Reference: zaks:82 page 319

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),A";
        return dis;

        break;

      case 0x33:
        // INC @r
        // Reference: zaks:82 page 265

        dis.byte_length = 1;
        dis.instruction = "INC sp";
        return dis;

        break;

      case 0x34:
        // INC @r
        // Reference: zaks:82 page 264
        // INC (HL)
        // Reference: zaks:82 page 267

        dis.byte_length = 1;
        dis.instruction = "INC (HL)";
        return dis;

        break;

      case 0x35:
        // DEC @r
        // Reference: zaks:82 page 238
        // DEC (HL)
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC (HL)";
        return dis;

        break;

      case 0x36:
        // LD @r,@n
        // Reference: zaks:82 page 295
        // LD (HL),@n
        // Reference: zaks:82 page 301

        dis.byte_length = 2;
        dis.instruction = "LD (HL)," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x37:
        // SCF
        // Reference: zaks:82 page 424

        dis.byte_length = 1;
        dis.instruction = "SCF";
        return dis;

        break;

      case 0x38:
        // JR @r,(PC+@n)
        // Reference: zaks:82 page 288

        dis.byte_length = 2;
        dis.instruction = "JR c,(PC+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x39:
        // ADD HL,@r
        // Reference: zaks:82 page 203

        dis.byte_length = 1;
        dis.instruction = "ADD HL,sp";
        return dis;

        break;

      case 0x3a:
        // LD A,(@n)
        // Reference: zaks:82 page 317

        dis.byte_length = 3;
        dis.instruction = "LD A,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x3b:
        // DEC @r
        // Reference: zaks:82 page 240

        dis.byte_length = 1;
        dis.instruction = "DEC sp";
        return dis;

        break;

      case 0x3c:
        // INC @r
        // Reference: zaks:82 page 264

        dis.byte_length = 1;
        dis.instruction = "INC a";
        return dis;

        break;

      case 0x3d:
        // DEC @r
        // Reference: zaks:82 page 238

        dis.byte_length = 1;
        dis.instruction = "DEC a";
        return dis;

        break;

      case 0x3e:
        // LD @r,@n
        // Reference: zaks:82 page 295

        dis.byte_length = 2;
        dis.instruction = "LD a," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x3f:
        // CCF
        // Reference: zaks:82 page 224
        // Reference: The H flag should be set to the old carry, according to http://www.z80.info/z80sflag.htm 

        dis.byte_length = 1;
        dis.instruction = "CCF";
        return dis;

        break;

      case 0x40:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD b,b";
        return dis;

        break;

      case 0x41:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD b,c";
        return dis;

        break;

      case 0x42:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD b,d";
        return dis;

        break;

      case 0x43:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD b,e";
        return dis;

        break;

      case 0x44:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD b,h";
        return dis;

        break;

      case 0x45:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD b,l";
        return dis;

        break;

      case 0x46:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        dis.byte_length = 1;
        dis.instruction = "LD b,(HL)";
        return dis;

        break;

      case 0x47:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD b,a";
        return dis;

        break;

      case 0x48:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD c,b";
        return dis;

        break;

      case 0x49:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD c,c";
        return dis;

        break;

      case 0x4a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD c,d";
        return dis;

        break;

      case 0x4b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD c,e";
        return dis;

        break;

      case 0x4c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD c,h";
        return dis;

        break;

      case 0x4d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD c,l";
        return dis;

        break;

      case 0x4e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        dis.byte_length = 1;
        dis.instruction = "LD c,(HL)";
        return dis;

        break;

      case 0x4f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD c,a";
        return dis;

        break;

      case 0x50:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD d,b";
        return dis;

        break;

      case 0x51:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD d,c";
        return dis;

        break;

      case 0x52:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD d,d";
        return dis;

        break;

      case 0x53:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD d,e";
        return dis;

        break;

      case 0x54:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD d,h";
        return dis;

        break;

      case 0x55:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD d,l";
        return dis;

        break;

      case 0x56:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        dis.byte_length = 1;
        dis.instruction = "LD d,(HL)";
        return dis;

        break;

      case 0x57:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD d,a";
        return dis;

        break;

      case 0x58:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD e,b";
        return dis;

        break;

      case 0x59:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD e,c";
        return dis;

        break;

      case 0x5a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD e,d";
        return dis;

        break;

      case 0x5b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD e,e";
        return dis;

        break;

      case 0x5c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD e,h";
        return dis;

        break;

      case 0x5d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD e,l";
        return dis;

        break;

      case 0x5e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        dis.byte_length = 1;
        dis.instruction = "LD e,(HL)";
        return dis;

        break;

      case 0x5f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD e,a";
        return dis;

        break;

      case 0x60:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD h,b";
        return dis;

        break;

      case 0x61:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD h,c";
        return dis;

        break;

      case 0x62:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD h,d";
        return dis;

        break;

      case 0x63:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD h,e";
        return dis;

        break;

      case 0x64:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD h,h";
        return dis;

        break;

      case 0x65:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD h,l";
        return dis;

        break;

      case 0x66:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        dis.byte_length = 1;
        dis.instruction = "LD h,(HL)";
        return dis;

        break;

      case 0x67:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD h,a";
        return dis;

        break;

      case 0x68:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD l,b";
        return dis;

        break;

      case 0x69:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD l,c";
        return dis;

        break;

      case 0x6a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD l,d";
        return dis;

        break;

      case 0x6b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD l,e";
        return dis;

        break;

      case 0x6c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD l,h";
        return dis;

        break;

      case 0x6d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD l,l";
        return dis;

        break;

      case 0x6e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        dis.byte_length = 1;
        dis.instruction = "LD l,(HL)";
        return dis;

        break;

      case 0x6f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD l,a";
        return dis;

        break;

      case 0x70:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        dis.byte_length = 1;
        dis.instruction = "LD (HL),b";
        return dis;

        break;

      case 0x71:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        dis.byte_length = 1;
        dis.instruction = "LD (HL),c";
        return dis;

        break;

      case 0x72:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        dis.byte_length = 1;
        dis.instruction = "LD (HL),d";
        return dis;

        break;

      case 0x73:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        dis.byte_length = 1;
        dis.instruction = "LD (HL),e";
        return dis;

        break;

      case 0x74:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        dis.byte_length = 1;
        dis.instruction = "LD (HL),h";
        return dis;

        break;

      case 0x75:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        dis.byte_length = 1;
        dis.instruction = "LD (HL),l";
        return dis;

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

        dis.byte_length = 1;
        dis.instruction = "HALT";
        return dis;

        break;

      case 0x77:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD (HL),@r
        // Reference: zaks:82 page 303

        dis.byte_length = 1;
        dis.instruction = "LD (HL),a";
        return dis;

        break;

      case 0x78:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD a,b";
        return dis;

        break;

      case 0x79:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD a,c";
        return dis;

        break;

      case 0x7a:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD a,d";
        return dis;

        break;

      case 0x7b:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD a,e";
        return dis;

        break;

      case 0x7c:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD a,h";
        return dis;

        break;

      case 0x7d:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD a,l";
        return dis;

        break;

      case 0x7e:
        // LD @r,@s
        // Reference: zaks:82 page 297
        // LD @r,(HL)
        // Reference: zaks:82 page 356

        dis.byte_length = 1;
        dis.instruction = "LD a,(HL)";
        return dis;

        break;

      case 0x7f:
        // LD @r,@s
        // Reference: zaks:82 page 297

        dis.byte_length = 1;
        dis.instruction = "LD a,a";
        return dis;

        break;

      case 0x80:
        // ADD A,@r
        // Reference: zaks:82 page 201

        dis.byte_length = 1;
        dis.instruction = "ADD A,b";
        return dis;

        break;

      case 0x81:
        // ADD A,@r
        // Reference: zaks:82 page 201

        dis.byte_length = 1;
        dis.instruction = "ADD A,c";
        return dis;

        break;

      case 0x82:
        // ADD A,@r
        // Reference: zaks:82 page 201

        dis.byte_length = 1;
        dis.instruction = "ADD A,d";
        return dis;

        break;

      case 0x83:
        // ADD A,@r
        // Reference: zaks:82 page 201

        dis.byte_length = 1;
        dis.instruction = "ADD A,e";
        return dis;

        break;

      case 0x84:
        // ADD A,@r
        // Reference: zaks:82 page 201

        dis.byte_length = 1;
        dis.instruction = "ADD A,h";
        return dis;

        break;

      case 0x85:
        // ADD A,@r
        // Reference: zaks:82 page 201

        dis.byte_length = 1;
        dis.instruction = "ADD A,l";
        return dis;

        break;

      case 0x86:
        // ADD A,@r
        // Reference: zaks:82 page 201
        // ADD A,(HL)
        // Reference: zaks:82 page 194

        dis.byte_length = 1;
        dis.instruction = "ADD A,(HL)";
        return dis;

        break;

      case 0x87:
        // ADD A,@r
        // Reference: zaks:82 page 201

        dis.byte_length = 1;
        dis.instruction = "ADD A,a";
        return dis;

        break;

      case 0x88:
        // ADC A,@r
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,b";
        return dis;

        break;

      case 0x89:
        // ADC A,@r
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,c";
        return dis;

        break;

      case 0x8a:
        // ADC A,@r
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,d";
        return dis;

        break;

      case 0x8b:
        // ADC A,@r
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,e";
        return dis;

        break;

      case 0x8c:
        // ADC A,@r
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,h";
        return dis;

        break;

      case 0x8d:
        // ADC A,@r
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,l";
        return dis;

        break;

      case 0x8e:
        // ADC A,@r
        // Reference: zaks:82 page 190
        // ADC A,(HL)
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,(HL)";
        return dis;

        break;

      case 0x8f:
        // ADC A,@r
        // Reference: zaks:82 page 190

        dis.byte_length = 1;
        dis.instruction = "ADC A,a";
        return dis;

        break;

      case 0x90:
        // SUB A,@r
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,b";
        return dis;

        break;

      case 0x91:
        // SUB A,@r
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,c";
        return dis;

        break;

      case 0x92:
        // SUB A,@r
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,d";
        return dis;

        break;

      case 0x93:
        // SUB A,@r
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,e";
        return dis;

        break;

      case 0x94:
        // SUB A,@r
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,h";
        return dis;

        break;

      case 0x95:
        // SUB A,@r
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,l";
        return dis;

        break;

      case 0x96:
        // SUB A,@r
        // Reference: zaks:82 page 434
        // SUB A,(HL)
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,(HL)";
        return dis;

        break;

      case 0x97:
        // SUB A,@r
        // Reference: zaks:82 page 434

        dis.byte_length = 1;
        dis.instruction = "SUB A,a";
        return dis;

        break;

      case 0x98:
        // SBC A,@r
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,b";
        return dis;

        break;

      case 0x99:
        // SBC A,@r
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,c";
        return dis;

        break;

      case 0x9a:
        // SBC A,@r
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,d";
        return dis;

        break;

      case 0x9b:
        // SBC A,@r
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,e";
        return dis;

        break;

      case 0x9c:
        // SBC A,@r
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,h";
        return dis;

        break;

      case 0x9d:
        // SBC A,@r
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,l";
        return dis;

        break;

      case 0x9e:
        // SBC A,@r
        // Reference: zaks:82 page 420
        // SBC A,(HL)
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,(HL)";
        return dis;

        break;

      case 0x9f:
        // SBC A,@r
        // Reference: zaks:82 page 420

        dis.byte_length = 1;
        dis.instruction = "SBC A,a";
        return dis;

        break;

      case 0xa0:
        // AND A,@r
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,b";
        return dis;

        break;

      case 0xa1:
        // AND A,@r
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,c";
        return dis;

        break;

      case 0xa2:
        // AND A,@r
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,d";
        return dis;

        break;

      case 0xa3:
        // AND A,@r
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,e";
        return dis;

        break;

      case 0xa4:
        // AND A,@r
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,h";
        return dis;

        break;

      case 0xa5:
        // AND A,@r
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,l";
        return dis;

        break;

      case 0xa6:
        // AND A,@r
        // Reference: zaks:82 page 209
        // AND A,(HL)
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,(HL)";
        return dis;

        break;

      case 0xa7:
        // AND A,@r
        // Reference: zaks:82 page 209

        dis.byte_length = 1;
        dis.instruction = "AND A,a";
        return dis;

        break;

      case 0xa8:
        // XOR A,@r
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,b";
        return dis;

        break;

      case 0xa9:
        // XOR A,@r
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,c";
        return dis;

        break;

      case 0xaa:
        // XOR A,@r
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,d";
        return dis;

        break;

      case 0xab:
        // XOR A,@r
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,e";
        return dis;

        break;

      case 0xac:
        // XOR A,@r
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,h";
        return dis;

        break;

      case 0xad:
        // XOR A,@r
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,l";
        return dis;

        break;

      case 0xae:
        // XOR A,@r
        // Reference: zaks:82 page 436
        // XOR A,(HL)
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,(HL)";
        return dis;

        break;

      case 0xaf:
        // XOR A,@r
        // Reference: zaks:82 page 436

        dis.byte_length = 1;
        dis.instruction = "XOR A,a";
        return dis;

        break;

      case 0xb0:
        // OR A,@r
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,b";
        return dis;

        break;

      case 0xb1:
        // OR A,@r
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,c";
        return dis;

        break;

      case 0xb2:
        // OR A,@r
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,d";
        return dis;

        break;

      case 0xb3:
        // OR A,@r
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,e";
        return dis;

        break;

      case 0xb4:
        // OR A,@r
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,h";
        return dis;

        break;

      case 0xb5:
        // OR A,@r
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,l";
        return dis;

        break;

      case 0xb6:
        // OR A,@r
        // Reference: zaks:82 page 360
        // OR A,(HL)
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,(HL)";
        return dis;

        break;

      case 0xb7:
        // OR A,@r
        // Reference: zaks:82 page 360

        dis.byte_length = 1;
        dis.instruction = "OR A,a";
        return dis;

        break;

      case 0xb8:
        // CP A,@r
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,b";
        return dis;

        break;

      case 0xb9:
        // CP A,@r
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,c";
        return dis;

        break;

      case 0xba:
        // CP A,@r
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,d";
        return dis;

        break;

      case 0xbb:
        // CP A,@r
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,e";
        return dis;

        break;

      case 0xbc:
        // CP A,@r
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,h";
        return dis;

        break;

      case 0xbd:
        // CP A,@r
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,l";
        return dis;

        break;

      case 0xbe:
        // CP A,@r
        // Reference: zaks:82 page 225
        // CP A,(HL)
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,(HL)";
        return dis;

        break;

      case 0xbf:
        // CP A,@r
        // Reference: zaks:82 page 225

        dis.byte_length = 1;
        dis.instruction = "CP A,a";
        return dis;

        break;

      case 0xc0:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET nz";
        return dis;

        break;

      case 0xc1:
        // POP @r
        // Reference: zaks:82 page 373

        dis.byte_length = 1;
        dis.instruction = "POP bc";
        return dis;

        break;

      case 0xc2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP nz,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xc3:
        // JP (@n)
        // Reference: zaks:82 page 284

        dis.byte_length = 3;
        dis.instruction = "JP (" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xc4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL nz," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xc5:
        // PUSH @r
        // Reference: zaks:82 page 379

        dis.byte_length = 1;
        dis.instruction = "PUSH bc";
        return dis;

        break;

      case 0xc6:
        // ADD A,@n
        // Reference: zaks:82 page 200

        dis.byte_length = 2;
        dis.instruction = "ADD A," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xc7:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x00";
        return dis;

        break;

      case 0xc8:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET z";
        return dis;

        break;

      case 0xc9:
        // RET
        // Reference: zaks:82 page 388

        dis.byte_length = 1;
        dis.instruction = "RET";
        return dis;

        break;

      case 0xca:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP z,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xcb:
        // CB
        // Reference:  page 
        dis = cb_ext(bus, addr + 1);
        dis.byte_length += 1;
        return dis;
        break;

      case 0xcc:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL z," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xcd:
        // CALL (@n)
        // Reference: zaks:82 page 222

        dis.byte_length = 3;
        dis.instruction = "CALL (" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xce:
        // ADC A,@n
        // Reference: zaks:82 page 190

        dis.byte_length = 2;
        dis.instruction = "ADC A," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xcf:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x08";
        return dis;

        break;

      case 0xd0:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET nc";
        return dis;

        break;

      case 0xd1:
        // POP @r
        // Reference: zaks:82 page 373

        dis.byte_length = 1;
        dis.instruction = "POP de";
        return dis;

        break;

      case 0xd2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP nc,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xd3:
        // OUT (@n),A
        // Reference: zaks:82 page 368

        dis.byte_length = 2;
        dis.instruction = "OUT (" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),A";
        return dis;

        break;

      case 0xd4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL nc," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xd5:
        // PUSH @r
        // Reference: zaks:82 page 379

        dis.byte_length = 1;
        dis.instruction = "PUSH de";
        return dis;

        break;

      case 0xd6:
        // SUB @n
        // Reference: zaks:82 page 434

        dis.byte_length = 2;
        dis.instruction = "SUB " + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xd7:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x10";
        return dis;

        break;

      case 0xd8:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET c";
        return dis;

        break;

      case 0xd9:
        // EXX
        // Reference: zaks:82 page 256

        dis.byte_length = 1;
        dis.instruction = "EXX";
        return dis;

        break;

      case 0xda:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP c,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xdb:
        // IN A,(@n)
        // Reference: zaks:82 page 263

        dis.byte_length = 2;
        dis.instruction = "IN A,(" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xdc:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL c," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xdd:
        // DD
        // Reference:  page 
        dis = dd_ext(bus, addr + 1);
        dis.byte_length += 1;
        return dis;
        break;

      case 0xde:
        // SBC A,@n
        // Reference: zaks:82 page 420

        dis.byte_length = 2;
        dis.instruction = "SBC A," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xdf:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x18";
        return dis;

        break;

      case 0xe0:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET po";
        return dis;

        break;

      case 0xe1:
        // POP @r
        // Reference: zaks:82 page 373

        dis.byte_length = 1;
        dis.instruction = "POP hl";
        return dis;

        break;

      case 0xe2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP po,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xe3:
        // EX (SP),HL
        // Reference: zaks:82 page 250

        dis.byte_length = 1;
        dis.instruction = "EX (SP),HL";
        return dis;

        break;

      case 0xe4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL po," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xe5:
        // PUSH @r
        // Reference: zaks:82 page 379

        dis.byte_length = 1;
        dis.instruction = "PUSH hl";
        return dis;

        break;

      case 0xe6:
        // AND @n
        // Reference: zaks:82 page 209

        dis.byte_length = 2;
        dis.instruction = "AND " + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xe7:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x20";
        return dis;

        break;

      case 0xe8:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET pe";
        return dis;

        break;

      case 0xe9:
        // JP (HL)
        // Reference: zaks:82 page 285

        dis.byte_length = 1;
        dis.instruction = "JP (HL)";
        return dis;

        break;

      case 0xea:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP pe,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xeb:
        // EX DE,HL
        // Reference: zaks:82 page 249

        dis.byte_length = 1;
        dis.instruction = "EX DE,HL";
        return dis;

        break;

      case 0xec:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL pe," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xed:
        // ED
        // Reference:  page 
        dis = ed_ext(bus, addr + 1);
        dis.byte_length += 1;
        return dis;
        break;

      case 0xee:
        // XOR A,@n
        // Reference: zaks:82 page 436

        dis.byte_length = 2;
        dis.instruction = "XOR A," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xef:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x28";
        return dis;

        break;

      case 0xf0:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET p";
        return dis;

        break;

      case 0xf1:
        // POP @r
        // Reference: zaks:82 page 373

        dis.byte_length = 1;
        dis.instruction = "POP af";
        return dis;

        break;

      case 0xf2:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP p,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xf3:
        // DI
        // Reference: zaks:82 page 244

        dis.byte_length = 1;
        dis.instruction = "DI";
        return dis;

        break;

      case 0xf4:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL p," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xf5:
        // PUSH @r
        // Reference: zaks:82 page 379

        dis.byte_length = 1;
        dis.instruction = "PUSH af";
        return dis;

        break;

      case 0xf6:
        // OR A,@n
        // Reference: zaks:82 page 360

        dis.byte_length = 2;
        dis.instruction = "OR A," + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xf7:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x30";
        return dis;

        break;

      case 0xf8:
        // RET @r
        // Reference: zaks:82 page 390

        dis.byte_length = 1;
        dis.instruction = "RET m";
        return dis;

        break;

      case 0xf9:
        // LD SP,HL
        // Reference: zaks:82 page 345

        dis.byte_length = 1;
        dis.instruction = "LD SP,HL";
        return dis;

        break;

      case 0xfa:
        // JP @r,(@n)
        // Reference: zaks:82 page 282

        dis.byte_length = 3;
        dis.instruction = "JP m,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0xfb:
        // EI
        // Reference: zaks:82 page 247

        dis.byte_length = 1;
        dis.instruction = "EI";
        return dis;

        break;

      case 0xfc:
        // CALL @r,@n
        // Reference: zaks:82 page 219
        // Reference: This edition describes the P CC as 100, instead of 110

        dis.byte_length = 3;
        dis.instruction = "CALL m," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0xfd:
        // FD
        // Reference:  page 
        dis = fd_ext(bus, addr + 1);
        dis.byte_length += 1;
        return dis;
        break;

      case 0xfe:
        // CP @n
        // Reference: zaks:82 page 225

        dis.byte_length = 2;
        dis.instruction = "CP " + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0xff:
        // RST @r
        // Reference: zaks:82 page 418

        dis.byte_length = 1;
        dis.instruction = "RST 0x38";
        return dis;

        break;

    } // hctiws
    return dis;
  }

  function dd_ext(bus, addr) {
    var dis = new Object();
    dis.instruction = "Unknown opcode";
    dis.byte_length = 1;
    var instr; /* of type uint */
    let pc = new emf.Number(16, 2, addr);
    let opcode = read8(addr);

    switch (opcode) {
      case 0x0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x00";
        return dis;
        break;

      case 0x1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x01";
        return dis;
        break;

      case 0x2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x02";
        return dis;
        break;

      case 0x3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x03";
        return dis;
        break;

      case 0x4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x04";
        return dis;
        break;

      case 0x5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x05";
        return dis;
        break;

      case 0x6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x06";
        return dis;
        break;

      case 0x7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x07";
        return dis;
        break;

      case 0x8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x08";
        return dis;
        break;

      case 0x9:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        dis.byte_length = 1;
        dis.instruction = "ADD IX,bc";
        return dis;

        break;

      case 0xa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0a";
        return dis;
        break;

      case 0xb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0b";
        return dis;
        break;

      case 0xc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0c";
        return dis;
        break;

      case 0xd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0d";
        return dis;
        break;

      case 0xe:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0e";
        return dis;
        break;

      case 0xf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0f";
        return dis;
        break;

      case 0x10:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x10";
        return dis;
        break;

      case 0x11:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x11";
        return dis;
        break;

      case 0x12:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x12";
        return dis;
        break;

      case 0x13:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x13";
        return dis;
        break;

      case 0x14:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x14";
        return dis;
        break;

      case 0x15:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x15";
        return dis;
        break;

      case 0x16:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x16";
        return dis;
        break;

      case 0x17:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x17";
        return dis;
        break;

      case 0x18:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x18";
        return dis;
        break;

      case 0x19:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        dis.byte_length = 1;
        dis.instruction = "ADD IX,de";
        return dis;

        break;

      case 0x1a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1a";
        return dis;
        break;

      case 0x1b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1b";
        return dis;
        break;

      case 0x1c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1c";
        return dis;
        break;

      case 0x1d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1d";
        return dis;
        break;

      case 0x1e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1e";
        return dis;
        break;

      case 0x1f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1f";
        return dis;
        break;

      case 0x20:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x20";
        return dis;
        break;

      case 0x21:
        // LD IX,@n
        // Reference: zaks:82 page 336

        dis.byte_length = 3;
        dis.instruction = "LD IX," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x22:
        // LD (@n),IX
        // Reference: zaks:82 page 325

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),IX";
        return dis;

        break;

      case 0x23:
        // INC IX
        // Reference: zaks:82 page 272

        dis.byte_length = 1;
        dis.instruction = "INC IX";
        return dis;

        break;

      case 0x24:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x24";
        return dis;
        break;

      case 0x25:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x25";
        return dis;
        break;

      case 0x26:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x26";
        return dis;
        break;

      case 0x27:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x27";
        return dis;
        break;

      case 0x28:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x28";
        return dis;
        break;

      case 0x29:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        dis.byte_length = 1;
        dis.instruction = "ADD IX,ix";
        return dis;

        break;

      case 0x2a:
        // LD IX,(@n)
        // Reference: zaks:82 page 338

        dis.byte_length = 3;
        dis.instruction = "LD IX,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x2b:
        // DEC IX
        // Reference: zaks:82 page 242

        dis.byte_length = 1;
        dis.instruction = "DEC IX";
        return dis;

        break;

      case 0x2c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2c";
        return dis;
        break;

      case 0x2d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2d";
        return dis;
        break;

      case 0x2e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2e";
        return dis;
        break;

      case 0x2f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2f";
        return dis;
        break;

      case 0x30:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x30";
        return dis;
        break;

      case 0x31:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x31";
        return dis;
        break;

      case 0x32:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x32";
        return dis;
        break;

      case 0x33:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x33";
        return dis;
        break;

      case 0x34:
        // INC (IX+@n)
        // Reference: zaks:82 page 268

        dis.byte_length = 2;
        dis.instruction = "INC (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x35:
        // DEC (IX+@n)
        // Reference: zaks:82 page 238

        dis.byte_length = 2;
        dis.instruction = "DEC (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x36:
        // LD (IX+@d),@n
        // Reference: zaks:82 page 309

        dis.byte_length = 3;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)," + (("0000" + read8(addr + 2).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x37:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x37";
        return dis;
        break;

      case 0x38:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x38";
        return dis;
        break;

      case 0x39:
        // ADD IX,@r
        // Reference: zaks:82 page 205

        dis.byte_length = 1;
        dis.instruction = "ADD IX,sp";
        return dis;

        break;

      case 0x3a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3a";
        return dis;
        break;

      case 0x3b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3b";
        return dis;
        break;

      case 0x3c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3c";
        return dis;
        break;

      case 0x3d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3d";
        return dis;
        break;

      case 0x3e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3e";
        return dis;
        break;

      case 0x3f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3f";
        return dis;
        break;

      case 0x40:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x40";
        return dis;
        break;

      case 0x41:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x41";
        return dis;
        break;

      case 0x42:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x42";
        return dis;
        break;

      case 0x43:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x43";
        return dis;
        break;

      case 0x44:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x44";
        return dis;
        break;

      case 0x45:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x45";
        return dis;
        break;

      case 0x46:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        dis.byte_length = 2;
        dis.instruction = "LD b,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x47:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x47";
        return dis;
        break;

      case 0x48:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x48";
        return dis;
        break;

      case 0x49:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x49";
        return dis;
        break;

      case 0x4a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4a";
        return dis;
        break;

      case 0x4b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4b";
        return dis;
        break;

      case 0x4c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4c";
        return dis;
        break;

      case 0x4d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4d";
        return dis;
        break;

      case 0x4e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        dis.byte_length = 2;
        dis.instruction = "LD c,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x4f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4f";
        return dis;
        break;

      case 0x50:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x50";
        return dis;
        break;

      case 0x51:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x51";
        return dis;
        break;

      case 0x52:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x52";
        return dis;
        break;

      case 0x53:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x53";
        return dis;
        break;

      case 0x54:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x54";
        return dis;
        break;

      case 0x55:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x55";
        return dis;
        break;

      case 0x56:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        dis.byte_length = 2;
        dis.instruction = "LD d,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x57:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x57";
        return dis;
        break;

      case 0x58:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x58";
        return dis;
        break;

      case 0x59:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x59";
        return dis;
        break;

      case 0x5a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5a";
        return dis;
        break;

      case 0x5b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5b";
        return dis;
        break;

      case 0x5c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5c";
        return dis;
        break;

      case 0x5d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5d";
        return dis;
        break;

      case 0x5e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        dis.byte_length = 2;
        dis.instruction = "LD e,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x5f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5f";
        return dis;
        break;

      case 0x60:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x60";
        return dis;
        break;

      case 0x61:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x61";
        return dis;
        break;

      case 0x62:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x62";
        return dis;
        break;

      case 0x63:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x63";
        return dis;
        break;

      case 0x64:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x64";
        return dis;
        break;

      case 0x65:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x65";
        return dis;
        break;

      case 0x66:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        dis.byte_length = 2;
        dis.instruction = "LD h,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x67:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x67";
        return dis;
        break;

      case 0x68:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x68";
        return dis;
        break;

      case 0x69:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x69";
        return dis;
        break;

      case 0x6a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6a";
        return dis;
        break;

      case 0x6b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6b";
        return dis;
        break;

      case 0x6c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6c";
        return dis;
        break;

      case 0x6d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6d";
        return dis;
        break;

      case 0x6e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        dis.byte_length = 2;
        dis.instruction = "LD l,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x6f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6f";
        return dis;
        break;

      case 0x70:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        dis.byte_length = 2;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),b";
        return dis;

        break;

      case 0x71:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        dis.byte_length = 2;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),c";
        return dis;

        break;

      case 0x72:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        dis.byte_length = 2;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),d";
        return dis;

        break;

      case 0x73:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        dis.byte_length = 2;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),e";
        return dis;

        break;

      case 0x74:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        dis.byte_length = 2;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),h";
        return dis;

        break;

      case 0x75:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        dis.byte_length = 2;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),l";
        return dis;

        break;

      case 0x76:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x76";
        return dis;
        break;

      case 0x77:
        // LD (IX+@n),@r
        // Reference: zaks:82 page 313

        dis.byte_length = 2;
        dis.instruction = "LD (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),a";
        return dis;

        break;

      case 0x78:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x78";
        return dis;
        break;

      case 0x79:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x79";
        return dis;
        break;

      case 0x7a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7a";
        return dis;
        break;

      case 0x7b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7b";
        return dis;
        break;

      case 0x7c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7c";
        return dis;
        break;

      case 0x7d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7d";
        return dis;
        break;

      case 0x7e:
        // LD @r,(IX+@n)
        // Reference: zaks:82 page 305

        dis.byte_length = 2;
        dis.instruction = "LD a,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x7f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7f";
        return dis;
        break;

      case 0x80:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x80";
        return dis;
        break;

      case 0x81:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x81";
        return dis;
        break;

      case 0x82:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x82";
        return dis;
        break;

      case 0x83:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x83";
        return dis;
        break;

      case 0x84:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x84";
        return dis;
        break;

      case 0x85:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x85";
        return dis;
        break;

      case 0x86:
        // ADD A,(IX+@n)
        // Reference: zaks:82 page 196

        dis.byte_length = 2;
        dis.instruction = "ADD A,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x87:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x87";
        return dis;
        break;

      case 0x88:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x88";
        return dis;
        break;

      case 0x89:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x89";
        return dis;
        break;

      case 0x8a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8a";
        return dis;
        break;

      case 0x8b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8b";
        return dis;
        break;

      case 0x8c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8c";
        return dis;
        break;

      case 0x8d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8d";
        return dis;
        break;

      case 0x8e:
        // ADC A,(IX+@n)
        // Reference: zaks:82 page 190

        dis.byte_length = 2;
        dis.instruction = "ADC A,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x8f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8f";
        return dis;
        break;

      case 0x90:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x90";
        return dis;
        break;

      case 0x91:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x91";
        return dis;
        break;

      case 0x92:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x92";
        return dis;
        break;

      case 0x93:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x93";
        return dis;
        break;

      case 0x94:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x94";
        return dis;
        break;

      case 0x95:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x95";
        return dis;
        break;

      case 0x96:
        // SUB (IX+@n)
        // Reference: zaks:82 page 434

        dis.byte_length = 2;
        dis.instruction = "SUB (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x97:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x97";
        return dis;
        break;

      case 0x98:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x98";
        return dis;
        break;

      case 0x99:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x99";
        return dis;
        break;

      case 0x9a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9a";
        return dis;
        break;

      case 0x9b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9b";
        return dis;
        break;

      case 0x9c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9c";
        return dis;
        break;

      case 0x9d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9d";
        return dis;
        break;

      case 0x9e:
        // SBC A,(IX+@n)
        // Reference: zaks:82 page 420

        dis.byte_length = 2;
        dis.instruction = "SBC A,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x9f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9f";
        return dis;
        break;

      case 0xa0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa0";
        return dis;
        break;

      case 0xa1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa1";
        return dis;
        break;

      case 0xa2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa2";
        return dis;
        break;

      case 0xa3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa3";
        return dis;
        break;

      case 0xa4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa4";
        return dis;
        break;

      case 0xa5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa5";
        return dis;
        break;

      case 0xa6:
        // AND (IX+@n)
        // Reference: zaks:82 page 209

        dis.byte_length = 2;
        dis.instruction = "AND (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xa7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa7";
        return dis;
        break;

      case 0xa8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa8";
        return dis;
        break;

      case 0xa9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa9";
        return dis;
        break;

      case 0xaa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xaa";
        return dis;
        break;

      case 0xab:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xab";
        return dis;
        break;

      case 0xac:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xac";
        return dis;
        break;

      case 0xad:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xad";
        return dis;
        break;

      case 0xae:
        // XOR A,(IX+@n)
        // Reference: zaks:82 page 436

        dis.byte_length = 2;
        dis.instruction = "XOR A,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xaf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xaf";
        return dis;
        break;

      case 0xb0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb0";
        return dis;
        break;

      case 0xb1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb1";
        return dis;
        break;

      case 0xb2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb2";
        return dis;
        break;

      case 0xb3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb3";
        return dis;
        break;

      case 0xb4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb4";
        return dis;
        break;

      case 0xb5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb5";
        return dis;
        break;

      case 0xb6:
        // OR (IX+@n)
        // Reference: zaks:82 page 360

        dis.byte_length = 2;
        dis.instruction = "OR (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xb7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb7";
        return dis;
        break;

      case 0xb8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb8";
        return dis;
        break;

      case 0xb9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb9";
        return dis;
        break;

      case 0xba:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xba";
        return dis;
        break;

      case 0xbb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbb";
        return dis;
        break;

      case 0xbc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbc";
        return dis;
        break;

      case 0xbd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbd";
        return dis;
        break;

      case 0xbe:
        // CP A,(IX+@n)
        // Reference: zaks:82 page 225

        dis.byte_length = 2;
        dis.instruction = "CP A,(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xbf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbf";
        return dis;
        break;

      case 0xc0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc0";
        return dis;
        break;

      case 0xc1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc1";
        return dis;
        break;

      case 0xc2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc2";
        return dis;
        break;

      case 0xc3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc3";
        return dis;
        break;

      case 0xc4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc4";
        return dis;
        break;

      case 0xc5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc5";
        return dis;
        break;

      case 0xc6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc6";
        return dis;
        break;

      case 0xc7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc7";
        return dis;
        break;

      case 0xc8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc8";
        return dis;
        break;

      case 0xc9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc9";
        return dis;
        break;

      case 0xca:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xca";
        return dis;
        break;

      case 0xcb:
        // RLC (IX+@n)
        // Reference: zaks:82 page 404
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
          dis.byte_length = 3;
          dis.instruction = "RLC (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RRC (IX+@n)
        // Reference: zaks:82 page 413
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
          dis.byte_length = 3;
          dis.instruction = "RRC (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RL (IX+@n)
        // Reference: zaks:82 page 396
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
          dis.byte_length = 3;
          dis.instruction = "RL (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RR (IX+@n)
        // Reference: zaks:82 page 410
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
          dis.byte_length = 3;
          dis.instruction = "RR (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SLA (IX+@n)
        // Reference: zaks:82 page 428
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
          dis.byte_length = 3;
          dis.instruction = "SLA (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SRA (IX+@n)
        // Reference: zaks:82 page 430
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
          dis.byte_length = 3;
          dis.instruction = "SRA (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SLL (IX+@n)
        // Reference:  page 
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
          dis.byte_length = 3;
          dis.instruction = "SLL (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SRL (IX+@n)
        // Reference: zaks:82 page 432
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
          dis.byte_length = 3;
          dis.instruction = "SRL (IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // BIT @r,(IX+@n)
        // Reference: zaks:82 page 213
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
          let bit = (read8(emf.Maths.add_u16s8(pc, 2)) & 0x38) >> 3;
          dis.byte_length = 3;
          dis.instruction = "BIT " + bit + ",(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RES @r,(IX+@n)
        // Reference: zaks:82 page 385
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;
          dis.byte_length = 3;
          dis.instruction = "RES " + bit + ",(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SET @r,(IX+@n)
        // Reference: zaks:82 page 425
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;
          dis.byte_length = 3;
          dis.instruction = "SET " + bit + ",(IX+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        break;

      case 0xcc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcc";
        return dis;
        break;

      case 0xcd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcd";
        return dis;
        break;

      case 0xce:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xce";
        return dis;
        break;

      case 0xcf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcf";
        return dis;
        break;

      case 0xd0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd0";
        return dis;
        break;

      case 0xd1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd1";
        return dis;
        break;

      case 0xd2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd2";
        return dis;
        break;

      case 0xd3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd3";
        return dis;
        break;

      case 0xd4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd4";
        return dis;
        break;

      case 0xd5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd5";
        return dis;
        break;

      case 0xd6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd6";
        return dis;
        break;

      case 0xd7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd7";
        return dis;
        break;

      case 0xd8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd8";
        return dis;
        break;

      case 0xd9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd9";
        return dis;
        break;

      case 0xda:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xda";
        return dis;
        break;

      case 0xdb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdb";
        return dis;
        break;

      case 0xdc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdc";
        return dis;
        break;

      case 0xdd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdd";
        return dis;
        break;

      case 0xde:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xde";
        return dis;
        break;

      case 0xdf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdf";
        return dis;
        break;

      case 0xe0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe0";
        return dis;
        break;

      case 0xe1:
        // POP IX
        // Reference: zaks:82 page 375

        dis.byte_length = 1;
        dis.instruction = "POP IX";
        return dis;

        break;

      case 0xe2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe2";
        return dis;
        break;

      case 0xe3:
        // EX (SP),IX
        // Reference: zaks:82 page 252

        dis.byte_length = 1;
        dis.instruction = "EX (SP),IX";
        return dis;

        break;

      case 0xe4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe4";
        return dis;
        break;

      case 0xe5:
        // PUSH IX
        // Reference: zaks:82 page 381

        dis.byte_length = 1;
        dis.instruction = "PUSH IX";
        return dis;

        break;

      case 0xe6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe6";
        return dis;
        break;

      case 0xe7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe7";
        return dis;
        break;

      case 0xe8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe8";
        return dis;
        break;

      case 0xe9:
        // JP (IX)
        // Reference: zaks:82 page 286

        dis.byte_length = 1;
        dis.instruction = "JP (IX)";
        return dis;

        break;

      case 0xea:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xea";
        return dis;
        break;

      case 0xeb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xeb";
        return dis;
        break;

      case 0xec:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xec";
        return dis;
        break;

      case 0xed:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xed";
        return dis;
        break;

      case 0xee:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xee";
        return dis;
        break;

      case 0xef:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xef";
        return dis;
        break;

      case 0xf0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf0";
        return dis;
        break;

      case 0xf1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf1";
        return dis;
        break;

      case 0xf2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf2";
        return dis;
        break;

      case 0xf3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf3";
        return dis;
        break;

      case 0xf4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf4";
        return dis;
        break;

      case 0xf5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf5";
        return dis;
        break;

      case 0xf6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf6";
        return dis;
        break;

      case 0xf7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf7";
        return dis;
        break;

      case 0xf8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf8";
        return dis;
        break;

      case 0xf9:
        // LD SP,IX
        // Reference: zaks:82 page 346

        dis.byte_length = 1;
        dis.instruction = "LD SP,IX";
        return dis;

        break;

      case 0xfa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfa";
        return dis;
        break;

      case 0xfb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfb";
        return dis;
        break;

      case 0xfc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfc";
        return dis;
        break;

      case 0xfd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfd";
        return dis;
        break;

      case 0xfe:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfe";
        return dis;
        break;

      case 0xff:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xff";
        return dis;
        break;

    } // hctiws
    return dis;
  }

  function cb_ext(bus, addr) {
    var dis = new Object();
    dis.instruction = "Unknown opcode";
    dis.byte_length = 1;
    var instr; /* of type uint */
    let pc = new emf.Number(16, 2, addr);
    let opcode = read8(addr);

    switch (opcode) {
      case 0x0:
        // RLC @r
        // Reference: zaks:82 page 400

        dis.byte_length = 1;
        dis.instruction = "RLC b";
        return dis;

        break;

      case 0x1:
        // RLC @r
        // Reference: zaks:82 page 400

        dis.byte_length = 1;
        dis.instruction = "RLC c";
        return dis;

        break;

      case 0x2:
        // RLC @r
        // Reference: zaks:82 page 400

        dis.byte_length = 1;
        dis.instruction = "RLC d";
        return dis;

        break;

      case 0x3:
        // RLC @r
        // Reference: zaks:82 page 400

        dis.byte_length = 1;
        dis.instruction = "RLC e";
        return dis;

        break;

      case 0x4:
        // RLC @r
        // Reference: zaks:82 page 400

        dis.byte_length = 1;
        dis.instruction = "RLC h";
        return dis;

        break;

      case 0x5:
        // RLC @r
        // Reference: zaks:82 page 400

        dis.byte_length = 1;
        dis.instruction = "RLC l";
        return dis;

        break;

      case 0x6:
        // RLC @r
        // Reference: zaks:82 page 400
        // RLC (HL)
        // Reference: zaks:82 page 402

        dis.byte_length = 1;
        dis.instruction = "RLC (HL)";
        return dis;

        break;

      case 0x7:
        // RLC @r
        // Reference: zaks:82 page 400

        dis.byte_length = 1;
        dis.instruction = "RLC a";
        return dis;

        break;

      case 0x8:
        // RRC @r
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC b";
        return dis;

        break;

      case 0x9:
        // RRC @r
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC c";
        return dis;

        break;

      case 0xa:
        // RRC @r
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC d";
        return dis;

        break;

      case 0xb:
        // RRC @r
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC e";
        return dis;

        break;

      case 0xc:
        // RRC @r
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC h";
        return dis;

        break;

      case 0xd:
        // RRC @r
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC l";
        return dis;

        break;

      case 0xe:
        // RRC @r
        // Reference: zaks:82 page 413
        // RRC (HL)
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC (HL)";
        return dis;

        break;

      case 0xf:
        // RRC @r
        // Reference: zaks:82 page 413

        dis.byte_length = 1;
        dis.instruction = "RRC a";
        return dis;

        break;

      case 0x10:
        // RL @r
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL b";
        return dis;

        break;

      case 0x11:
        // RL @r
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL c";
        return dis;

        break;

      case 0x12:
        // RL @r
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL d";
        return dis;

        break;

      case 0x13:
        // RL @r
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL e";
        return dis;

        break;

      case 0x14:
        // RL @r
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL h";
        return dis;

        break;

      case 0x15:
        // RL @r
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL l";
        return dis;

        break;

      case 0x16:
        // RL @r
        // Reference: zaks:82 page 396
        // RL (HL)
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL (HL)";
        return dis;

        break;

      case 0x17:
        // RL @r
        // Reference: zaks:82 page 396

        dis.byte_length = 1;
        dis.instruction = "RL a";
        return dis;

        break;

      case 0x18:
        // RR @r
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR b";
        return dis;

        break;

      case 0x19:
        // RR @r
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR c";
        return dis;

        break;

      case 0x1a:
        // RR @r
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR d";
        return dis;

        break;

      case 0x1b:
        // RR @r
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR e";
        return dis;

        break;

      case 0x1c:
        // RR @r
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR h";
        return dis;

        break;

      case 0x1d:
        // RR @r
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR l";
        return dis;

        break;

      case 0x1e:
        // RR @r
        // Reference: zaks:82 page 410
        // RR (HL)
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR (HL)";
        return dis;

        break;

      case 0x1f:
        // RR @r
        // Reference: zaks:82 page 410

        dis.byte_length = 1;
        dis.instruction = "RR a";
        return dis;

        break;

      case 0x20:
        // SLA @r
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA b";
        return dis;

        break;

      case 0x21:
        // SLA @r
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA c";
        return dis;

        break;

      case 0x22:
        // SLA @r
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA d";
        return dis;

        break;

      case 0x23:
        // SLA @r
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA e";
        return dis;

        break;

      case 0x24:
        // SLA @r
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA h";
        return dis;

        break;

      case 0x25:
        // SLA @r
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA l";
        return dis;

        break;

      case 0x26:
        // SLA @r
        // Reference: zaks:82 page 428
        // SLA (HL)
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA (HL)";
        return dis;

        break;

      case 0x27:
        // SLA @r
        // Reference: zaks:82 page 428

        dis.byte_length = 1;
        dis.instruction = "SLA a";
        return dis;

        break;

      case 0x28:
        // SRA @r
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA b";
        return dis;

        break;

      case 0x29:
        // SRA @r
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA c";
        return dis;

        break;

      case 0x2a:
        // SRA @r
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA d";
        return dis;

        break;

      case 0x2b:
        // SRA @r
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA e";
        return dis;

        break;

      case 0x2c:
        // SRA @r
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA h";
        return dis;

        break;

      case 0x2d:
        // SRA @r
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA l";
        return dis;

        break;

      case 0x2e:
        // SRA @r
        // Reference: zaks:82 page 430
        // SRA (HL)
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA (HL)";
        return dis;

        break;

      case 0x2f:
        // SRA @r
        // Reference: zaks:82 page 430

        dis.byte_length = 1;
        dis.instruction = "SRA a";
        return dis;

        break;

      case 0x30:
        // SLL @r
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL b";
        return dis;

        break;

      case 0x31:
        // SLL @r
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL c";
        return dis;

        break;

      case 0x32:
        // SLL @r
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL d";
        return dis;

        break;

      case 0x33:
        // SLL @r
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL e";
        return dis;

        break;

      case 0x34:
        // SLL @r
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL h";
        return dis;

        break;

      case 0x35:
        // SLL @r
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL l";
        return dis;

        break;

      case 0x36:
        // SLL @r
        // Reference:  page 
        // SLL (HL)
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL (HL)";
        return dis;

        break;

      case 0x37:
        // SLL @r
        // Reference:  page 

        dis.byte_length = 1;
        dis.instruction = "SLL a";
        return dis;

        break;

      case 0x38:
        // SRL @r
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL b";
        return dis;

        break;

      case 0x39:
        // SRL @r
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL c";
        return dis;

        break;

      case 0x3a:
        // SRL @r
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL d";
        return dis;

        break;

      case 0x3b:
        // SRL @r
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL e";
        return dis;

        break;

      case 0x3c:
        // SRL @r
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL h";
        return dis;

        break;

      case 0x3d:
        // SRL @r
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL l";
        return dis;

        break;

      case 0x3e:
        // SRL @r
        // Reference: zaks:82 page 432
        // SRL (HL)
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL (HL)";
        return dis;

        break;

      case 0x3f:
        // SRL @r
        // Reference: zaks:82 page 432

        dis.byte_length = 1;
        dis.instruction = "SRL a";
        return dis;

        break;

      case 0x40:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 0,b";
        return dis;

        break;

      case 0x41:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 0,c";
        return dis;

        break;

      case 0x42:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 0,d";
        return dis;

        break;

      case 0x43:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 0,e";
        return dis;

        break;

      case 0x44:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 0,h";
        return dis;

        break;

      case 0x45:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 0,l";
        return dis;

        break;

      case 0x46:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 0, (HL)";
        return dis;

        break;

      case 0x47:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 0,a";
        return dis;

        break;

      case 0x48:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 1,b";
        return dis;

        break;

      case 0x49:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 1,c";
        return dis;

        break;

      case 0x4a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 1,d";
        return dis;

        break;

      case 0x4b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 1,e";
        return dis;

        break;

      case 0x4c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 1,h";
        return dis;

        break;

      case 0x4d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 1,l";
        return dis;

        break;

      case 0x4e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 1, (HL)";
        return dis;

        break;

      case 0x4f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 1,a";
        return dis;

        break;

      case 0x50:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 2,b";
        return dis;

        break;

      case 0x51:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 2,c";
        return dis;

        break;

      case 0x52:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 2,d";
        return dis;

        break;

      case 0x53:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 2,e";
        return dis;

        break;

      case 0x54:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 2,h";
        return dis;

        break;

      case 0x55:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 2,l";
        return dis;

        break;

      case 0x56:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 2, (HL)";
        return dis;

        break;

      case 0x57:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 2,a";
        return dis;

        break;

      case 0x58:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 3,b";
        return dis;

        break;

      case 0x59:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 3,c";
        return dis;

        break;

      case 0x5a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 3,d";
        return dis;

        break;

      case 0x5b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 3,e";
        return dis;

        break;

      case 0x5c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 3,h";
        return dis;

        break;

      case 0x5d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 3,l";
        return dis;

        break;

      case 0x5e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 3, (HL)";
        return dis;

        break;

      case 0x5f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 3,a";
        return dis;

        break;

      case 0x60:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 4,b";
        return dis;

        break;

      case 0x61:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 4,c";
        return dis;

        break;

      case 0x62:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 4,d";
        return dis;

        break;

      case 0x63:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 4,e";
        return dis;

        break;

      case 0x64:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 4,h";
        return dis;

        break;

      case 0x65:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 4,l";
        return dis;

        break;

      case 0x66:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 4, (HL)";
        return dis;

        break;

      case 0x67:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 4,a";
        return dis;

        break;

      case 0x68:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 5,b";
        return dis;

        break;

      case 0x69:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 5,c";
        return dis;

        break;

      case 0x6a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 5,d";
        return dis;

        break;

      case 0x6b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 5,e";
        return dis;

        break;

      case 0x6c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 5,h";
        return dis;

        break;

      case 0x6d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 5,l";
        return dis;

        break;

      case 0x6e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 5, (HL)";
        return dis;

        break;

      case 0x6f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 5,a";
        return dis;

        break;

      case 0x70:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 6,b";
        return dis;

        break;

      case 0x71:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 6,c";
        return dis;

        break;

      case 0x72:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 6,d";
        return dis;

        break;

      case 0x73:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 6,e";
        return dis;

        break;

      case 0x74:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 6,h";
        return dis;

        break;

      case 0x75:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 6,l";
        return dis;

        break;

      case 0x76:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 6, (HL)";
        return dis;

        break;

      case 0x77:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 6,a";
        return dis;

        break;

      case 0x78:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 7,b";
        return dis;

        break;

      case 0x79:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 7,c";
        return dis;

        break;

      case 0x7a:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 7,d";
        return dis;

        break;

      case 0x7b:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 7,e";
        return dis;

        break;

      case 0x7c:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 7,h";
        return dis;

        break;

      case 0x7d:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 7,l";
        return dis;

        break;

      case 0x7e:
        // BIT @r,@s
        // Reference: zaks:82 page 217
        // BIT @r, (HL)
        // Reference: zaks:82 page 211

        dis.byte_length = 1;
        dis.instruction = "BIT 7, (HL)";
        return dis;

        break;

      case 0x7f:
        // BIT @r,@s
        // Reference: zaks:82 page 217

        dis.byte_length = 1;
        dis.instruction = "BIT 7,a";
        return dis;

        break;

      case 0x80:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0,b";
        return dis;

        break;

      case 0x81:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0,c";
        return dis;

        break;

      case 0x82:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0,d";
        return dis;

        break;

      case 0x83:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0,e";
        return dis;

        break;

      case 0x84:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0,h";
        return dis;

        break;

      case 0x85:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0,l";
        return dis;

        break;

      case 0x86:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0, (HL)";
        return dis;

        break;

      case 0x87:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 0,a";
        return dis;

        break;

      case 0x88:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1,b";
        return dis;

        break;

      case 0x89:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1,c";
        return dis;

        break;

      case 0x8a:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1,d";
        return dis;

        break;

      case 0x8b:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1,e";
        return dis;

        break;

      case 0x8c:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1,h";
        return dis;

        break;

      case 0x8d:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1,l";
        return dis;

        break;

      case 0x8e:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1, (HL)";
        return dis;

        break;

      case 0x8f:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 1,a";
        return dis;

        break;

      case 0x90:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2,b";
        return dis;

        break;

      case 0x91:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2,c";
        return dis;

        break;

      case 0x92:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2,d";
        return dis;

        break;

      case 0x93:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2,e";
        return dis;

        break;

      case 0x94:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2,h";
        return dis;

        break;

      case 0x95:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2,l";
        return dis;

        break;

      case 0x96:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2, (HL)";
        return dis;

        break;

      case 0x97:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 2,a";
        return dis;

        break;

      case 0x98:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3,b";
        return dis;

        break;

      case 0x99:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3,c";
        return dis;

        break;

      case 0x9a:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3,d";
        return dis;

        break;

      case 0x9b:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3,e";
        return dis;

        break;

      case 0x9c:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3,h";
        return dis;

        break;

      case 0x9d:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3,l";
        return dis;

        break;

      case 0x9e:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3, (HL)";
        return dis;

        break;

      case 0x9f:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 3,a";
        return dis;

        break;

      case 0xa0:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4,b";
        return dis;

        break;

      case 0xa1:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4,c";
        return dis;

        break;

      case 0xa2:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4,d";
        return dis;

        break;

      case 0xa3:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4,e";
        return dis;

        break;

      case 0xa4:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4,h";
        return dis;

        break;

      case 0xa5:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4,l";
        return dis;

        break;

      case 0xa6:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4, (HL)";
        return dis;

        break;

      case 0xa7:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 4,a";
        return dis;

        break;

      case 0xa8:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5,b";
        return dis;

        break;

      case 0xa9:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5,c";
        return dis;

        break;

      case 0xaa:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5,d";
        return dis;

        break;

      case 0xab:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5,e";
        return dis;

        break;

      case 0xac:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5,h";
        return dis;

        break;

      case 0xad:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5,l";
        return dis;

        break;

      case 0xae:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5, (HL)";
        return dis;

        break;

      case 0xaf:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 5,a";
        return dis;

        break;

      case 0xb0:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6,b";
        return dis;

        break;

      case 0xb1:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6,c";
        return dis;

        break;

      case 0xb2:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6,d";
        return dis;

        break;

      case 0xb3:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6,e";
        return dis;

        break;

      case 0xb4:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6,h";
        return dis;

        break;

      case 0xb5:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6,l";
        return dis;

        break;

      case 0xb6:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6, (HL)";
        return dis;

        break;

      case 0xb7:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 6,a";
        return dis;

        break;

      case 0xb8:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7,b";
        return dis;

        break;

      case 0xb9:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7,c";
        return dis;

        break;

      case 0xba:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7,d";
        return dis;

        break;

      case 0xbb:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7,e";
        return dis;

        break;

      case 0xbc:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7,h";
        return dis;

        break;

      case 0xbd:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7,l";
        return dis;

        break;

      case 0xbe:
        // RES @r,@s
        // Reference: zaks:82 page 385
        // RES @r, (HL)
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7, (HL)";
        return dis;

        break;

      case 0xbf:
        // RES @r,@s
        // Reference: zaks:82 page 385

        dis.byte_length = 1;
        dis.instruction = "RES 7,a";
        return dis;

        break;

      case 0xc0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0,b";
        return dis;

        break;

      case 0xc1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0,c";
        return dis;

        break;

      case 0xc2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0,d";
        return dis;

        break;

      case 0xc3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0,e";
        return dis;

        break;

      case 0xc4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0,h";
        return dis;

        break;

      case 0xc5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0,l";
        return dis;

        break;

      case 0xc6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0, (HL)";
        return dis;

        break;

      case 0xc7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 0,a";
        return dis;

        break;

      case 0xc8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1,b";
        return dis;

        break;

      case 0xc9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1,c";
        return dis;

        break;

      case 0xca:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1,d";
        return dis;

        break;

      case 0xcb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1,e";
        return dis;

        break;

      case 0xcc:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1,h";
        return dis;

        break;

      case 0xcd:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1,l";
        return dis;

        break;

      case 0xce:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1, (HL)";
        return dis;

        break;

      case 0xcf:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 1,a";
        return dis;

        break;

      case 0xd0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2,b";
        return dis;

        break;

      case 0xd1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2,c";
        return dis;

        break;

      case 0xd2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2,d";
        return dis;

        break;

      case 0xd3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2,e";
        return dis;

        break;

      case 0xd4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2,h";
        return dis;

        break;

      case 0xd5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2,l";
        return dis;

        break;

      case 0xd6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2, (HL)";
        return dis;

        break;

      case 0xd7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 2,a";
        return dis;

        break;

      case 0xd8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3,b";
        return dis;

        break;

      case 0xd9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3,c";
        return dis;

        break;

      case 0xda:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3,d";
        return dis;

        break;

      case 0xdb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3,e";
        return dis;

        break;

      case 0xdc:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3,h";
        return dis;

        break;

      case 0xdd:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3,l";
        return dis;

        break;

      case 0xde:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3, (HL)";
        return dis;

        break;

      case 0xdf:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 3,a";
        return dis;

        break;

      case 0xe0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4,b";
        return dis;

        break;

      case 0xe1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4,c";
        return dis;

        break;

      case 0xe2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4,d";
        return dis;

        break;

      case 0xe3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4,e";
        return dis;

        break;

      case 0xe4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4,h";
        return dis;

        break;

      case 0xe5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4,l";
        return dis;

        break;

      case 0xe6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4, (HL)";
        return dis;

        break;

      case 0xe7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 4,a";
        return dis;

        break;

      case 0xe8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5,b";
        return dis;

        break;

      case 0xe9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5,c";
        return dis;

        break;

      case 0xea:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5,d";
        return dis;

        break;

      case 0xeb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5,e";
        return dis;

        break;

      case 0xec:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5,h";
        return dis;

        break;

      case 0xed:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5,l";
        return dis;

        break;

      case 0xee:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5, (HL)";
        return dis;

        break;

      case 0xef:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 5,a";
        return dis;

        break;

      case 0xf0:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6,b";
        return dis;

        break;

      case 0xf1:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6,c";
        return dis;

        break;

      case 0xf2:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6,d";
        return dis;

        break;

      case 0xf3:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6,e";
        return dis;

        break;

      case 0xf4:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6,h";
        return dis;

        break;

      case 0xf5:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6,l";
        return dis;

        break;

      case 0xf6:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6, (HL)";
        return dis;

        break;

      case 0xf7:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 6,a";
        return dis;

        break;

      case 0xf8:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7,b";
        return dis;

        break;

      case 0xf9:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7,c";
        return dis;

        break;

      case 0xfa:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7,d";
        return dis;

        break;

      case 0xfb:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7,e";
        return dis;

        break;

      case 0xfc:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7,h";
        return dis;

        break;

      case 0xfd:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7,l";
        return dis;

        break;

      case 0xfe:
        // SET @r,@s
        // Reference: zaks:82 page 425
        // SET @r, (HL)
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7, (HL)";
        return dis;

        break;

      case 0xff:
        // SET @r,@s
        // Reference: zaks:82 page 425

        dis.byte_length = 1;
        dis.instruction = "SET 7,a";
        return dis;

        break;

    } // hctiws
    return dis;
  }

  function ed_ext(bus, addr) {
    var dis = new Object();
    dis.instruction = "Unknown opcode";
    dis.byte_length = 1;
    var instr; /* of type uint */
    let pc = new emf.Number(16, 2, addr);
    let opcode = read8(addr);

    switch (opcode) {
      case 0x0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x00";
        return dis;
        break;

      case 0x1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x01";
        return dis;
        break;

      case 0x2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x02";
        return dis;
        break;

      case 0x3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x03";
        return dis;
        break;

      case 0x4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x04";
        return dis;
        break;

      case 0x5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x05";
        return dis;
        break;

      case 0x6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x06";
        return dis;
        break;

      case 0x7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x07";
        return dis;
        break;

      case 0x8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x08";
        return dis;
        break;

      case 0x9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x09";
        return dis;
        break;

      case 0xa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0a";
        return dis;
        break;

      case 0xb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0b";
        return dis;
        break;

      case 0xc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0c";
        return dis;
        break;

      case 0xd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0d";
        return dis;
        break;

      case 0xe:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0e";
        return dis;
        break;

      case 0xf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0f";
        return dis;
        break;

      case 0x10:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x10";
        return dis;
        break;

      case 0x11:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x11";
        return dis;
        break;

      case 0x12:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x12";
        return dis;
        break;

      case 0x13:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x13";
        return dis;
        break;

      case 0x14:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x14";
        return dis;
        break;

      case 0x15:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x15";
        return dis;
        break;

      case 0x16:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x16";
        return dis;
        break;

      case 0x17:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x17";
        return dis;
        break;

      case 0x18:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x18";
        return dis;
        break;

      case 0x19:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x19";
        return dis;
        break;

      case 0x1a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1a";
        return dis;
        break;

      case 0x1b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1b";
        return dis;
        break;

      case 0x1c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1c";
        return dis;
        break;

      case 0x1d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1d";
        return dis;
        break;

      case 0x1e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1e";
        return dis;
        break;

      case 0x1f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1f";
        return dis;
        break;

      case 0x20:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x20";
        return dis;
        break;

      case 0x21:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x21";
        return dis;
        break;

      case 0x22:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x22";
        return dis;
        break;

      case 0x23:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x23";
        return dis;
        break;

      case 0x24:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x24";
        return dis;
        break;

      case 0x25:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x25";
        return dis;
        break;

      case 0x26:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x26";
        return dis;
        break;

      case 0x27:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x27";
        return dis;
        break;

      case 0x28:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x28";
        return dis;
        break;

      case 0x29:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x29";
        return dis;
        break;

      case 0x2a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2a";
        return dis;
        break;

      case 0x2b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2b";
        return dis;
        break;

      case 0x2c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2c";
        return dis;
        break;

      case 0x2d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2d";
        return dis;
        break;

      case 0x2e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2e";
        return dis;
        break;

      case 0x2f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2f";
        return dis;
        break;

      case 0x30:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x30";
        return dis;
        break;

      case 0x31:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x31";
        return dis;
        break;

      case 0x32:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x32";
        return dis;
        break;

      case 0x33:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x33";
        return dis;
        break;

      case 0x34:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x34";
        return dis;
        break;

      case 0x35:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x35";
        return dis;
        break;

      case 0x36:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x36";
        return dis;
        break;

      case 0x37:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x37";
        return dis;
        break;

      case 0x38:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x38";
        return dis;
        break;

      case 0x39:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x39";
        return dis;
        break;

      case 0x3a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3a";
        return dis;
        break;

      case 0x3b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3b";
        return dis;
        break;

      case 0x3c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3c";
        return dis;
        break;

      case 0x3d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3d";
        return dis;
        break;

      case 0x3e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3e";
        return dis;
        break;

      case 0x3f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3f";
        return dis;
        break;

      case 0x40:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        dis.byte_length = 1;
        dis.instruction = "IN b,(C)";
        return dis;

        break;

      case 0x41:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        dis.byte_length = 1;
        dis.instruction = "OUT (C),b";
        return dis;

        break;

      case 0x42:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        dis.byte_length = 1;
        dis.instruction = "SBC HL,bc";
        return dis;

        break;

      case 0x43:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),bc";
        return dis;

        break;

      case 0x44:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x45:
        // RETN
        // Reference: zaks:82 page 394

        dis.byte_length = 1;
        dis.instruction = "RETN";
        return dis;

        break;

      case 0x46:
        // IM 0
        // Reference: zaks:82 page 258

        dis.byte_length = 1;
        dis.instruction = "IM 0";
        return dis;

        break;

      case 0x47:
        // LD I,A
        // Reference: zaks:82 page 332

        dis.byte_length = 1;
        dis.instruction = "LD I,A";
        return dis;

        break;

      case 0x48:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        dis.byte_length = 1;
        dis.instruction = "IN c,(C)";
        return dis;

        break;

      case 0x49:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        dis.byte_length = 1;
        dis.instruction = "OUT (C),c";
        return dis;

        break;

      case 0x4a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        dis.byte_length = 1;
        dis.instruction = "ADC HL,bc";
        return dis;

        break;

      case 0x4b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        dis.byte_length = 3;
        dis.instruction = "LD bc,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x4c:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x4d:
        // RETI
        // Reference: zaks:82 page 392

        dis.byte_length = 1;
        dis.instruction = "RETI";
        return dis;

        break;

      case 0x4e:
        // IM 1

        dis.byte_length = 1;
        dis.instruction = "IM 1";
        return dis;

        break;

      case 0x4f:
        // LD R,A
        // Reference: zaks:82 page 344

        dis.byte_length = 1;
        dis.instruction = "LD R,A";
        return dis;

        break;

      case 0x50:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        dis.byte_length = 1;
        dis.instruction = "IN d,(C)";
        return dis;

        break;

      case 0x51:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        dis.byte_length = 1;
        dis.instruction = "OUT (C),d";
        return dis;

        break;

      case 0x52:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        dis.byte_length = 1;
        dis.instruction = "SBC HL,de";
        return dis;

        break;

      case 0x53:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),de";
        return dis;

        break;

      case 0x54:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x55:
        // RETN

        dis.byte_length = 1;
        dis.instruction = "RETN";
        return dis;

        break;

      case 0x56:
        // IM 1
        // Reference: zaks:82 page 259

        dis.byte_length = 1;
        dis.instruction = "IM 1";
        return dis;

        break;

      case 0x57:
        // LD A,I
        // Reference: zaks:82 page 331

        dis.byte_length = 1;
        dis.instruction = "LD A,I";
        return dis;

        break;

      case 0x58:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        dis.byte_length = 1;
        dis.instruction = "IN e,(C)";
        return dis;

        break;

      case 0x59:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        dis.byte_length = 1;
        dis.instruction = "OUT (C),e";
        return dis;

        break;

      case 0x5a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        dis.byte_length = 1;
        dis.instruction = "ADC HL,de";
        return dis;

        break;

      case 0x5b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        dis.byte_length = 3;
        dis.instruction = "LD de,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x5c:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x5d:
        // RETN

        dis.byte_length = 1;
        dis.instruction = "RETN";
        return dis;

        break;

      case 0x5e:
        // IM 2
        // Reference: zaks:82 page 260

        dis.byte_length = 1;
        dis.instruction = "IM 2";
        return dis;

        break;

      case 0x5f:
        // LD A,R
        // Reference: zaks:82 page 333

        dis.byte_length = 1;
        dis.instruction = "LD A,R";
        return dis;

        break;

      case 0x60:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        dis.byte_length = 1;
        dis.instruction = "IN h,(C)";
        return dis;

        break;

      case 0x61:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        dis.byte_length = 1;
        dis.instruction = "OUT (C),h";
        return dis;

        break;

      case 0x62:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        dis.byte_length = 1;
        dis.instruction = "SBC HL,hl";
        return dis;

        break;

      case 0x63:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),hl";
        return dis;

        break;

      case 0x64:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x65:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x65";
        return dis;
        break;

      case 0x66:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x66";
        return dis;
        break;

      case 0x67:
        // RRD
        // Reference: zaks:82 page 416

        dis.byte_length = 1;
        dis.instruction = "RRD";
        return dis;

        break;

      case 0x68:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        dis.byte_length = 1;
        dis.instruction = "IN l,(C)";
        return dis;

        break;

      case 0x69:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        dis.byte_length = 1;
        dis.instruction = "OUT (C),l";
        return dis;

        break;

      case 0x6a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        dis.byte_length = 1;
        dis.instruction = "ADC HL,hl";
        return dis;

        break;

      case 0x6b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        dis.byte_length = 3;
        dis.instruction = "LD hl,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x6c:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x6d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6d";
        return dis;
        break;

      case 0x6e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6e";
        return dis;
        break;

      case 0x6f:
        // RLD
        // Reference: zaks:82 page 408

        dis.byte_length = 1;
        dis.instruction = "RLD";
        return dis;

        break;

      case 0x70:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag
        // IN (C)

        dis.byte_length = 1;
        dis.instruction = "IN (C)";
        return dis;

        break;

      case 0x71:
        // OUT (C),@r
        // Reference: zaks:82 page 366
        // OUT (C),0

        dis.byte_length = 1;
        dis.instruction = "OUT (C),0";
        return dis;

        break;

      case 0x72:
        // SBC HL,@r
        // Reference: zaks:82 page 422

        dis.byte_length = 1;
        dis.instruction = "SBC HL,sp";
        return dis;

        break;

      case 0x73:
        // LD (@n),@r
        // Reference: zaks:82 page 321

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),sp";
        return dis;

        break;

      case 0x74:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x75:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x75";
        return dis;
        break;

      case 0x76:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x76";
        return dis;
        break;

      case 0x77:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x77";
        return dis;
        break;

      case 0x78:
        // IN @r,(C)
        // Reference: zaks:82 page 261
        // Reference: We don't set the H flag

        dis.byte_length = 1;
        dis.instruction = "IN a,(C)";
        return dis;

        break;

      case 0x79:
        // OUT (C),@r
        // Reference: zaks:82 page 366

        dis.byte_length = 1;
        dis.instruction = "OUT (C),a";
        return dis;

        break;

      case 0x7a:
        // ADC HL,@r
        // Reference: zaks:82 page 192

        dis.byte_length = 1;
        dis.instruction = "ADC HL,sp";
        return dis;

        break;

      case 0x7b:
        // LD @r,(@n)
        // Reference: zaks:82 page 292

        dis.byte_length = 3;
        dis.instruction = "LD sp,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x7c:
        // NEG
        // Reference: zaks:82 page 358

        dis.byte_length = 1;
        dis.instruction = "NEG";
        return dis;

        break;

      case 0x7d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7d";
        return dis;
        break;

      case 0x7e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7e";
        return dis;
        break;

      case 0x7f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7f";
        return dis;
        break;

      case 0x80:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x80";
        return dis;
        break;

      case 0x81:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x81";
        return dis;
        break;

      case 0x82:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x82";
        return dis;
        break;

      case 0x83:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x83";
        return dis;
        break;

      case 0x84:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x84";
        return dis;
        break;

      case 0x85:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x85";
        return dis;
        break;

      case 0x86:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x86";
        return dis;
        break;

      case 0x87:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x87";
        return dis;
        break;

      case 0x88:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x88";
        return dis;
        break;

      case 0x89:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x89";
        return dis;
        break;

      case 0x8a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8a";
        return dis;
        break;

      case 0x8b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8b";
        return dis;
        break;

      case 0x8c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8c";
        return dis;
        break;

      case 0x8d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8d";
        return dis;
        break;

      case 0x8e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8e";
        return dis;
        break;

      case 0x8f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8f";
        return dis;
        break;

      case 0x90:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x90";
        return dis;
        break;

      case 0x91:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x91";
        return dis;
        break;

      case 0x92:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x92";
        return dis;
        break;

      case 0x93:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x93";
        return dis;
        break;

      case 0x94:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x94";
        return dis;
        break;

      case 0x95:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x95";
        return dis;
        break;

      case 0x96:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x96";
        return dis;
        break;

      case 0x97:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x97";
        return dis;
        break;

      case 0x98:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x98";
        return dis;
        break;

      case 0x99:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x99";
        return dis;
        break;

      case 0x9a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9a";
        return dis;
        break;

      case 0x9b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9b";
        return dis;
        break;

      case 0x9c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9c";
        return dis;
        break;

      case 0x9d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9d";
        return dis;
        break;

      case 0x9e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9e";
        return dis;
        break;

      case 0x9f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9f";
        return dis;
        break;

      case 0xa0:
        // LDI
        // Reference: zaks:82 page 352

        dis.byte_length = 1;
        dis.instruction = "LDI";
        return dis;

        break;

      case 0xa1:
        // CPI
        // Reference: zaks:82 page 231

        dis.byte_length = 1;
        dis.instruction = "CPI";
        return dis;

        break;

      case 0xa2:
        // INI
        // Reference: zaks:82 page 278

        dis.byte_length = 1;
        dis.instruction = "INI";
        return dis;

        break;

      case 0xa3:
        // OUTI
        // Reference: zaks:82 page 371
        // Reference: confusion whether should N be set or not?

        dis.byte_length = 1;
        dis.instruction = "OUTI";
        return dis;

        break;

      case 0xa4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa4";
        return dis;
        break;

      case 0xa5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa5";
        return dis;
        break;

      case 0xa6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa6";
        return dis;
        break;

      case 0xa7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa7";
        return dis;
        break;

      case 0xa8:
        // LDD
        // Reference: zaks:82 page 348

        dis.byte_length = 1;
        dis.instruction = "LDD";
        return dis;

        break;

      case 0xa9:
        // CPD
        // Reference: zaks:82 page 227

        dis.byte_length = 1;
        dis.instruction = "CPD";
        return dis;

        break;

      case 0xaa:
        // IND
        // Reference: zaks:82 page 274

        dis.byte_length = 1;
        dis.instruction = "IND";
        return dis;

        break;

      case 0xab:
        // OUTD
        // Reference: zaks:82 page 369

        dis.byte_length = 1;
        dis.instruction = "OUTD";
        return dis;

        break;

      case 0xac:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xac";
        return dis;
        break;

      case 0xad:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xad";
        return dis;
        break;

      case 0xae:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xae";
        return dis;
        break;

      case 0xaf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xaf";
        return dis;
        break;

      case 0xb0:
        // LDIR
        // Reference: zaks:82 page 354
        // Reference: The book indicates to clear the PV flag, but http://www.z80.info/z80sflag.htm suggests otherwise

        dis.byte_length = 1;
        dis.instruction = "LDIR";
        return dis;

        break;

      case 0xb1:
        // CPIR
        // Reference: zaks:82 page 233

        dis.byte_length = 1;
        dis.instruction = "CPIR";
        return dis;

        break;

      case 0xb2:
        // INIR
        // Reference: zaks:82 page 280

        dis.byte_length = 1;
        dis.instruction = "INIR";
        return dis;

        break;

      case 0xb3:
        // OTIR
        // Reference: zaks:82 page 364

        dis.byte_length = 1;
        dis.instruction = "OTIR";
        return dis;

        break;

      case 0xb4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb4";
        return dis;
        break;

      case 0xb5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb5";
        return dis;
        break;

      case 0xb6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb6";
        return dis;
        break;

      case 0xb7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb7";
        return dis;
        break;

      case 0xb8:
        // LDDR
        // Reference: zaks:82 page 350

        dis.byte_length = 1;
        dis.instruction = "LDDR";
        return dis;

        break;

      case 0xb9:
        // CPDR
        // Reference: zaks:82 page 229

        dis.byte_length = 1;
        dis.instruction = "CPDR";
        return dis;

        break;

      case 0xba:
        // INDR
        // Reference: zaks:82 page 276

        dis.byte_length = 1;
        dis.instruction = "INDR";
        return dis;

        break;

      case 0xbb:
        // OTDR
        // Reference: zaks:82 page 362

        dis.byte_length = 1;
        dis.instruction = "OTDR";
        return dis;

        break;

      case 0xbc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbc";
        return dis;
        break;

      case 0xbd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbd";
        return dis;
        break;

      case 0xbe:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbe";
        return dis;
        break;

      case 0xbf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbf";
        return dis;
        break;

      case 0xc0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc0";
        return dis;
        break;

      case 0xc1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc1";
        return dis;
        break;

      case 0xc2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc2";
        return dis;
        break;

      case 0xc3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc3";
        return dis;
        break;

      case 0xc4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc4";
        return dis;
        break;

      case 0xc5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc5";
        return dis;
        break;

      case 0xc6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc6";
        return dis;
        break;

      case 0xc7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc7";
        return dis;
        break;

      case 0xc8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc8";
        return dis;
        break;

      case 0xc9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc9";
        return dis;
        break;

      case 0xca:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xca";
        return dis;
        break;

      case 0xcb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcb";
        return dis;
        break;

      case 0xcc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcc";
        return dis;
        break;

      case 0xcd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcd";
        return dis;
        break;

      case 0xce:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xce";
        return dis;
        break;

      case 0xcf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcf";
        return dis;
        break;

      case 0xd0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd0";
        return dis;
        break;

      case 0xd1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd1";
        return dis;
        break;

      case 0xd2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd2";
        return dis;
        break;

      case 0xd3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd3";
        return dis;
        break;

      case 0xd4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd4";
        return dis;
        break;

      case 0xd5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd5";
        return dis;
        break;

      case 0xd6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd6";
        return dis;
        break;

      case 0xd7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd7";
        return dis;
        break;

      case 0xd8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd8";
        return dis;
        break;

      case 0xd9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd9";
        return dis;
        break;

      case 0xda:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xda";
        return dis;
        break;

      case 0xdb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdb";
        return dis;
        break;

      case 0xdc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdc";
        return dis;
        break;

      case 0xdd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdd";
        return dis;
        break;

      case 0xde:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xde";
        return dis;
        break;

      case 0xdf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdf";
        return dis;
        break;

      case 0xe0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe0";
        return dis;
        break;

      case 0xe1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe1";
        return dis;
        break;

      case 0xe2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe2";
        return dis;
        break;

      case 0xe3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe3";
        return dis;
        break;

      case 0xe4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe4";
        return dis;
        break;

      case 0xe5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe5";
        return dis;
        break;

      case 0xe6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe6";
        return dis;
        break;

      case 0xe7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe7";
        return dis;
        break;

      case 0xe8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe8";
        return dis;
        break;

      case 0xe9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe9";
        return dis;
        break;

      case 0xea:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xea";
        return dis;
        break;

      case 0xeb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xeb";
        return dis;
        break;

      case 0xec:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xec";
        return dis;
        break;

      case 0xed:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xed";
        return dis;
        break;

      case 0xee:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xee";
        return dis;
        break;

      case 0xef:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xef";
        return dis;
        break;

      case 0xf0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf0";
        return dis;
        break;

      case 0xf1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf1";
        return dis;
        break;

      case 0xf2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf2";
        return dis;
        break;

      case 0xf3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf3";
        return dis;
        break;

      case 0xf4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf4";
        return dis;
        break;

      case 0xf5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf5";
        return dis;
        break;

      case 0xf6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf6";
        return dis;
        break;

      case 0xf7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf7";
        return dis;
        break;

      case 0xf8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf8";
        return dis;
        break;

      case 0xf9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf9";
        return dis;
        break;

      case 0xfa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfa";
        return dis;
        break;

      case 0xfb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfb";
        return dis;
        break;

      case 0xfc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfc";
        return dis;
        break;

      case 0xfd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfd";
        return dis;
        break;

      case 0xfe:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfe";
        return dis;
        break;

      case 0xff:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xff";
        return dis;
        break;

    } // hctiws
    return dis;
  }

  function fd_ext(bus, addr) {
    var dis = new Object();
    dis.instruction = "Unknown opcode";
    dis.byte_length = 1;
    var instr; /* of type uint */
    let pc = new emf.Number(16, 2, addr);
    let opcode = read8(addr);

    switch (opcode) {
      case 0x0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x00";
        return dis;
        break;

      case 0x1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x01";
        return dis;
        break;

      case 0x2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x02";
        return dis;
        break;

      case 0x3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x03";
        return dis;
        break;

      case 0x4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x04";
        return dis;
        break;

      case 0x5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x05";
        return dis;
        break;

      case 0x6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x06";
        return dis;
        break;

      case 0x7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x07";
        return dis;
        break;

      case 0x8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x08";
        return dis;
        break;

      case 0x9:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        dis.byte_length = 1;
        dis.instruction = "ADD IY,bc";
        return dis;

        break;

      case 0xa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0a";
        return dis;
        break;

      case 0xb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0b";
        return dis;
        break;

      case 0xc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0c";
        return dis;
        break;

      case 0xd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0d";
        return dis;
        break;

      case 0xe:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0e";
        return dis;
        break;

      case 0xf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x0f";
        return dis;
        break;

      case 0x10:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x10";
        return dis;
        break;

      case 0x11:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x11";
        return dis;
        break;

      case 0x12:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x12";
        return dis;
        break;

      case 0x13:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x13";
        return dis;
        break;

      case 0x14:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x14";
        return dis;
        break;

      case 0x15:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x15";
        return dis;
        break;

      case 0x16:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x16";
        return dis;
        break;

      case 0x17:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x17";
        return dis;
        break;

      case 0x18:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x18";
        return dis;
        break;

      case 0x19:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        dis.byte_length = 1;
        dis.instruction = "ADD IY,de";
        return dis;

        break;

      case 0x1a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1a";
        return dis;
        break;

      case 0x1b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1b";
        return dis;
        break;

      case 0x1c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1c";
        return dis;
        break;

      case 0x1d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1d";
        return dis;
        break;

      case 0x1e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1e";
        return dis;
        break;

      case 0x1f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x1f";
        return dis;
        break;

      case 0x20:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x20";
        return dis;
        break;

      case 0x21:
        // LD IY,@n
        // Reference: zaks:82 page 340

        dis.byte_length = 3;
        dis.instruction = "LD IY," + getAddressText16(read16(addr + 1)) + "";
        return dis;

        break;

      case 0x22:
        // LD (@n),IY
        // Reference: zaks:82 page 327

        dis.byte_length = 3;
        dis.instruction = "LD (" + getAddressText16(read16(addr + 1)) + "),IY";
        return dis;

        break;

      case 0x23:
        // INC IY
        // Reference: zaks:82 page 273

        dis.byte_length = 1;
        dis.instruction = "INC IY";
        return dis;

        break;

      case 0x24:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x24";
        return dis;
        break;

      case 0x25:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x25";
        return dis;
        break;

      case 0x26:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x26";
        return dis;
        break;

      case 0x27:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x27";
        return dis;
        break;

      case 0x28:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x28";
        return dis;
        break;

      case 0x29:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        dis.byte_length = 1;
        dis.instruction = "ADD IY,iy";
        return dis;

        break;

      case 0x2a:
        // LD IY,(@n)
        // Reference: zaks:82 page 342

        dis.byte_length = 3;
        dis.instruction = "LD IY,(" + getAddressText16(read16(addr + 1)) + ")";
        return dis;

        break;

      case 0x2b:
        // DEC IY
        // Reference: zaks:82 page 243

        dis.byte_length = 1;
        dis.instruction = "DEC IY";
        return dis;

        break;

      case 0x2c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2c";
        return dis;
        break;

      case 0x2d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2d";
        return dis;
        break;

      case 0x2e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2e";
        return dis;
        break;

      case 0x2f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x2f";
        return dis;
        break;

      case 0x30:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x30";
        return dis;
        break;

      case 0x31:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x31";
        return dis;
        break;

      case 0x32:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x32";
        return dis;
        break;

      case 0x33:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x33";
        return dis;
        break;

      case 0x34:
        // INC (IY+@n)
        // Reference: zaks:82 page 270

        dis.byte_length = 2;
        dis.instruction = "INC (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x35:
        // DEC (IY+@n)
        // Reference: zaks:82 page 238

        dis.byte_length = 2;
        dis.instruction = "DEC (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x36:
        // LD (IY+@d),@n
        // Reference: zaks:82 page 311

        dis.byte_length = 3;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)," + (("0000" + read8(addr + 2).toString(16)).substr(-2)) + "H";
        return dis;

        break;

      case 0x37:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x37";
        return dis;
        break;

      case 0x38:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x38";
        return dis;
        break;

      case 0x39:
        // ADD IY,@r
        // Reference: zaks:82 page 207

        dis.byte_length = 1;
        dis.instruction = "ADD IY,sp";
        return dis;

        break;

      case 0x3a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3a";
        return dis;
        break;

      case 0x3b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3b";
        return dis;
        break;

      case 0x3c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3c";
        return dis;
        break;

      case 0x3d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3d";
        return dis;
        break;

      case 0x3e:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3e";
        return dis;
        break;

      case 0x3f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x3f";
        return dis;
        break;

      case 0x40:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x40";
        return dis;
        break;

      case 0x41:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x41";
        return dis;
        break;

      case 0x42:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x42";
        return dis;
        break;

      case 0x43:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x43";
        return dis;
        break;

      case 0x44:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x44";
        return dis;
        break;

      case 0x45:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x45";
        return dis;
        break;

      case 0x46:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        dis.byte_length = 2;
        dis.instruction = "LD b,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x47:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x47";
        return dis;
        break;

      case 0x48:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x48";
        return dis;
        break;

      case 0x49:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x49";
        return dis;
        break;

      case 0x4a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4a";
        return dis;
        break;

      case 0x4b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4b";
        return dis;
        break;

      case 0x4c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4c";
        return dis;
        break;

      case 0x4d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4d";
        return dis;
        break;

      case 0x4e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        dis.byte_length = 2;
        dis.instruction = "LD c,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x4f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x4f";
        return dis;
        break;

      case 0x50:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x50";
        return dis;
        break;

      case 0x51:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x51";
        return dis;
        break;

      case 0x52:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x52";
        return dis;
        break;

      case 0x53:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x53";
        return dis;
        break;

      case 0x54:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x54";
        return dis;
        break;

      case 0x55:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x55";
        return dis;
        break;

      case 0x56:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        dis.byte_length = 2;
        dis.instruction = "LD d,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x57:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x57";
        return dis;
        break;

      case 0x58:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x58";
        return dis;
        break;

      case 0x59:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x59";
        return dis;
        break;

      case 0x5a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5a";
        return dis;
        break;

      case 0x5b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5b";
        return dis;
        break;

      case 0x5c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5c";
        return dis;
        break;

      case 0x5d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5d";
        return dis;
        break;

      case 0x5e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        dis.byte_length = 2;
        dis.instruction = "LD e,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x5f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x5f";
        return dis;
        break;

      case 0x60:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x60";
        return dis;
        break;

      case 0x61:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x61";
        return dis;
        break;

      case 0x62:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x62";
        return dis;
        break;

      case 0x63:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x63";
        return dis;
        break;

      case 0x64:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x64";
        return dis;
        break;

      case 0x65:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x65";
        return dis;
        break;

      case 0x66:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        dis.byte_length = 2;
        dis.instruction = "LD h,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x67:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x67";
        return dis;
        break;

      case 0x68:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x68";
        return dis;
        break;

      case 0x69:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x69";
        return dis;
        break;

      case 0x6a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6a";
        return dis;
        break;

      case 0x6b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6b";
        return dis;
        break;

      case 0x6c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6c";
        return dis;
        break;

      case 0x6d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6d";
        return dis;
        break;

      case 0x6e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        dis.byte_length = 2;
        dis.instruction = "LD l,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x6f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x6f";
        return dis;
        break;

      case 0x70:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        dis.byte_length = 2;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),b";
        return dis;

        break;

      case 0x71:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        dis.byte_length = 2;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),c";
        return dis;

        break;

      case 0x72:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        dis.byte_length = 2;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),d";
        return dis;

        break;

      case 0x73:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        dis.byte_length = 2;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),e";
        return dis;

        break;

      case 0x74:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        dis.byte_length = 2;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),h";
        return dis;

        break;

      case 0x75:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        dis.byte_length = 2;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),l";
        return dis;

        break;

      case 0x76:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x76";
        return dis;
        break;

      case 0x77:
        // LD (IY+@n),@r
        // Reference: zaks:82 page 315

        dis.byte_length = 2;
        dis.instruction = "LD (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H),a";
        return dis;

        break;

      case 0x78:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x78";
        return dis;
        break;

      case 0x79:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x79";
        return dis;
        break;

      case 0x7a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7a";
        return dis;
        break;

      case 0x7b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7b";
        return dis;
        break;

      case 0x7c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7c";
        return dis;
        break;

      case 0x7d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7d";
        return dis;
        break;

      case 0x7e:
        // LD @r,(IY+@n)
        // Reference: zaks:82 page 307

        dis.byte_length = 2;
        dis.instruction = "LD a,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x7f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x7f";
        return dis;
        break;

      case 0x80:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x80";
        return dis;
        break;

      case 0x81:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x81";
        return dis;
        break;

      case 0x82:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x82";
        return dis;
        break;

      case 0x83:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x83";
        return dis;
        break;

      case 0x84:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x84";
        return dis;
        break;

      case 0x85:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x85";
        return dis;
        break;

      case 0x86:
        // ADD A,(IY+@n)
        // Reference: zaks:82 page 198

        dis.byte_length = 2;
        dis.instruction = "ADD A,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x87:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x87";
        return dis;
        break;

      case 0x88:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x88";
        return dis;
        break;

      case 0x89:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x89";
        return dis;
        break;

      case 0x8a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8a";
        return dis;
        break;

      case 0x8b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8b";
        return dis;
        break;

      case 0x8c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8c";
        return dis;
        break;

      case 0x8d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8d";
        return dis;
        break;

      case 0x8e:
        // ADC A,(IY+@n)
        // Reference: zaks:82 page 190

        dis.byte_length = 2;
        dis.instruction = "ADC A,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x8f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x8f";
        return dis;
        break;

      case 0x90:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x90";
        return dis;
        break;

      case 0x91:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x91";
        return dis;
        break;

      case 0x92:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x92";
        return dis;
        break;

      case 0x93:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x93";
        return dis;
        break;

      case 0x94:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x94";
        return dis;
        break;

      case 0x95:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x95";
        return dis;
        break;

      case 0x96:
        // SUB (IY+@n)
        // Reference: zaks:82 page 434

        dis.byte_length = 2;
        dis.instruction = "SUB (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x97:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x97";
        return dis;
        break;

      case 0x98:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x98";
        return dis;
        break;

      case 0x99:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x99";
        return dis;
        break;

      case 0x9a:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9a";
        return dis;
        break;

      case 0x9b:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9b";
        return dis;
        break;

      case 0x9c:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9c";
        return dis;
        break;

      case 0x9d:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9d";
        return dis;
        break;

      case 0x9e:
        // SBC A,(IY+@n)
        // Reference: zaks:82 page 420

        dis.byte_length = 2;
        dis.instruction = "SBC A,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0x9f:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0x9f";
        return dis;
        break;

      case 0xa0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa0";
        return dis;
        break;

      case 0xa1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa1";
        return dis;
        break;

      case 0xa2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa2";
        return dis;
        break;

      case 0xa3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa3";
        return dis;
        break;

      case 0xa4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa4";
        return dis;
        break;

      case 0xa5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa5";
        return dis;
        break;

      case 0xa6:
        // AND (IY+@n)
        // Reference: zaks:82 page 209

        dis.byte_length = 2;
        dis.instruction = "AND (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xa7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa7";
        return dis;
        break;

      case 0xa8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa8";
        return dis;
        break;

      case 0xa9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xa9";
        return dis;
        break;

      case 0xaa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xaa";
        return dis;
        break;

      case 0xab:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xab";
        return dis;
        break;

      case 0xac:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xac";
        return dis;
        break;

      case 0xad:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xad";
        return dis;
        break;

      case 0xae:
        // XOR A,(IY+@n)
        // Reference: zaks:82 page 436

        dis.byte_length = 2;
        dis.instruction = "XOR A,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xaf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xaf";
        return dis;
        break;

      case 0xb0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb0";
        return dis;
        break;

      case 0xb1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb1";
        return dis;
        break;

      case 0xb2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb2";
        return dis;
        break;

      case 0xb3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb3";
        return dis;
        break;

      case 0xb4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb4";
        return dis;
        break;

      case 0xb5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb5";
        return dis;
        break;

      case 0xb6:
        // OR (IY+@n)
        // Reference: zaks:82 page 360

        dis.byte_length = 2;
        dis.instruction = "OR (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xb7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb7";
        return dis;
        break;

      case 0xb8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb8";
        return dis;
        break;

      case 0xb9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xb9";
        return dis;
        break;

      case 0xba:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xba";
        return dis;
        break;

      case 0xbb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbb";
        return dis;
        break;

      case 0xbc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbc";
        return dis;
        break;

      case 0xbd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbd";
        return dis;
        break;

      case 0xbe:
        // CP A,(IY+@n)
        // Reference: zaks:82 page 225

        dis.byte_length = 2;
        dis.instruction = "CP A,(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
        return dis;

        break;

      case 0xbf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xbf";
        return dis;
        break;

      case 0xc0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc0";
        return dis;
        break;

      case 0xc1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc1";
        return dis;
        break;

      case 0xc2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc2";
        return dis;
        break;

      case 0xc3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc3";
        return dis;
        break;

      case 0xc4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc4";
        return dis;
        break;

      case 0xc5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc5";
        return dis;
        break;

      case 0xc6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc6";
        return dis;
        break;

      case 0xc7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc7";
        return dis;
        break;

      case 0xc8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc8";
        return dis;
        break;

      case 0xc9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xc9";
        return dis;
        break;

      case 0xca:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xca";
        return dis;
        break;

      case 0xcb:
        // RLC (IY+@n)
        // Reference: zaks:82 page 406
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
          dis.byte_length = 3;
          dis.instruction = "RLC (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RRC (IY+@n)
        // Reference: zaks:82 page 413
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
          dis.byte_length = 3;
          dis.instruction = "RRC (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RL (IY+@n)
        // Reference: zaks:82 page 396
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
          dis.byte_length = 3;
          dis.instruction = "RL (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RR (IY+@n)
        // Reference: zaks:82 page 410
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
          dis.byte_length = 3;
          dis.instruction = "RR (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SLA (IY+@n)
        // Reference: zaks:82 page 428
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
          dis.byte_length = 3;
          dis.instruction = "SLA (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SRA (IY+@n)
        // Reference: zaks:82 page 430
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
          dis.byte_length = 3;
          dis.instruction = "SRA (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SLL (IY+@n)
        // Reference:  page 
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
          dis.byte_length = 3;
          dis.instruction = "SLL (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SRL (IY+@n)
        // Reference: zaks:82 page 432
        if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
          dis.byte_length = 3;
          dis.instruction = "SRL (IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // BIT @r,(IY+@n)
        // Reference: zaks:82 page 213
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;
          dis.byte_length = 3;
          dis.instruction = "BIT " + bit + ",(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // RES @r,(IY+@n)
        // Reference: zaks:82 page 385
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;
          dis.byte_length = 3;
          dis.instruction = "RES " + bit + ",(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        // SET @r,(IY+@n)
        // Reference: zaks:82 page 425
        if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
          let bit = (read8(emf.Maths.add_u16u16(pc, 2)) & 0x38) >> 3;
          dis.byte_length = 3;
          dis.instruction = "SET " + bit + ",(IY+" + (("0000" + read8(addr + 1).toString(16)).substr(-2)) + "H)";
          return dis;
        }
        break;

      case 0xcc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcc";
        return dis;
        break;

      case 0xcd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcd";
        return dis;
        break;

      case 0xce:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xce";
        return dis;
        break;

      case 0xcf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xcf";
        return dis;
        break;

      case 0xd0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd0";
        return dis;
        break;

      case 0xd1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd1";
        return dis;
        break;

      case 0xd2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd2";
        return dis;
        break;

      case 0xd3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd3";
        return dis;
        break;

      case 0xd4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd4";
        return dis;
        break;

      case 0xd5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd5";
        return dis;
        break;

      case 0xd6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd6";
        return dis;
        break;

      case 0xd7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd7";
        return dis;
        break;

      case 0xd8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd8";
        return dis;
        break;

      case 0xd9:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xd9";
        return dis;
        break;

      case 0xda:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xda";
        return dis;
        break;

      case 0xdb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdb";
        return dis;
        break;

      case 0xdc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdc";
        return dis;
        break;

      case 0xdd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdd";
        return dis;
        break;

      case 0xde:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xde";
        return dis;
        break;

      case 0xdf:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xdf";
        return dis;
        break;

      case 0xe0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe0";
        return dis;
        break;

      case 0xe1:
        // POP IY
        // Reference: zaks:82 page 377

        dis.byte_length = 1;
        dis.instruction = "POP IY";
        return dis;

        break;

      case 0xe2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe2";
        return dis;
        break;

      case 0xe3:
        // EX (SP),IY
        // Reference: zaks:82 page 254

        dis.byte_length = 1;
        dis.instruction = "EX (SP),IY";
        return dis;

        break;

      case 0xe4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe4";
        return dis;
        break;

      case 0xe5:
        // PUSH IY
        // Reference: zaks:82 page 383

        dis.byte_length = 1;
        dis.instruction = "PUSH IY";
        return dis;

        break;

      case 0xe6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe6";
        return dis;
        break;

      case 0xe7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe7";
        return dis;
        break;

      case 0xe8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xe8";
        return dis;
        break;

      case 0xe9:
        // JP (IY)
        // Reference: zaks:82 page 286

        dis.byte_length = 1;
        dis.instruction = "JP (IY)";
        return dis;

        break;

      case 0xea:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xea";
        return dis;
        break;

      case 0xeb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xeb";
        return dis;
        break;

      case 0xec:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xec";
        return dis;
        break;

      case 0xed:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xed";
        return dis;
        break;

      case 0xee:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xee";
        return dis;
        break;

      case 0xef:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xef";
        return dis;
        break;

      case 0xf0:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf0";
        return dis;
        break;

      case 0xf1:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf1";
        return dis;
        break;

      case 0xf2:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf2";
        return dis;
        break;

      case 0xf3:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf3";
        return dis;
        break;

      case 0xf4:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf4";
        return dis;
        break;

      case 0xf5:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf5";
        return dis;
        break;

      case 0xf6:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf6";
        return dis;
        break;

      case 0xf7:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf7";
        return dis;
        break;

      case 0xf8:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xf8";
        return dis;
        break;

      case 0xf9:
        // LD SP,IY
        // Reference: zaks:82 page 347

        dis.byte_length = 1;
        dis.instruction = "LD SP,IY";
        return dis;

        break;

      case 0xfa:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfa";
        return dis;
        break;

      case 0xfb:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfb";
        return dis;
        break;

      case 0xfc:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfc";
        return dis;
        break;

      case 0xfd:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfd";
        return dis;
        break;

      case 0xfe:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xfe";
        return dis;
        break;

      case 0xff:
        // Unknown operation
        dis.byte_length = 1;
        dis.instruction = "dc.b 0xff";
        return dis;
        break;

    } // hctiws
    return dis;
  }
  return {
    start,
    disassemble
  }
});
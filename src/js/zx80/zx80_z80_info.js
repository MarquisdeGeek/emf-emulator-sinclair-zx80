// zx80_z80_info
let zx80_z80_info = (function(bus, options) {
  // Reference: zaks:82 page 359

  // 00               : nop

  // Reference: zaks:82 page 293

  // 01 nnnn          : LD bc,nnnn

  // Reference: zaks:82 page 299

  // 02               : LD (BC),A

  // Reference: zaks:82 page 265

  // 03               : INC bc

  // Reference: zaks:82 page 264

  // 04               : INC b            **-*-*p0c

  // Reference: zaks:82 page 238

  // 05               : DEC b            **-*-*p1c

  // Reference: zaks:82 page 295

  // 06 nn            : LD b,nn

  // Reference: zaks:82 page 399

  // 07               : RLCA             sz-0-vp0*

  // Reference: zaks:82 page 248

  // 08               : EX AF,AF’

  // Reference: zaks:82 page 203

  // 09               : ADD HL,bc        sz-*-vp0*

  // Reference: zaks:82 page 329

  // 0a               : LD A,(BC)

  // Reference: zaks:82 page 240

  // 0b               : DEC bc

  // Reference: zaks:82 page 264

  // 0c               : INC c            **-*-*p0c

  // Reference: zaks:82 page 238

  // 0d               : DEC c            **-*-*p1c

  // Reference: zaks:82 page 295

  // 0e nn            : LD c,nn

  // Reference: zaks:82 page 415

  // 0f               : RRCA             sz-0-vp0*

  // Reference: zaks:82 page 245

  // 10 nnnn          : DJNZ (PC+nn)

  // Reference: zaks:82 page 293

  // 11 nnnn          : LD de,nnnn

  // Reference: zaks:82 page 300

  // 12               : LD (DE),A

  // Reference: zaks:82 page 265

  // 13               : INC de

  // Reference: zaks:82 page 264

  // 14               : INC d            **-*-*p0c

  // Reference: zaks:82 page 238

  // 15               : DEC d            **-*-*p1c

  // Reference: zaks:82 page 295

  // 16 nn            : LD d,nn

  // Reference: zaks:82 page 398

  // 17               : RLA              sz-0-vp0*

  // Reference: zaks:82 page 290

  // 18 nn            : JR (PC+nn)

  // Reference: zaks:82 page 203

  // 19               : ADD HL,de        sz-*-vp0*

  // Reference: zaks:82 page 330

  // 1a               : LD A,(DE)

  // Reference: zaks:82 page 240

  // 1b               : DEC de

  // Reference: zaks:82 page 264

  // 1c               : INC e            **-*-*p0c

  // Reference: zaks:82 page 238

  // 1d               : DEC e            **-*-*p1c

  // Reference: zaks:82 page 295

  // 1e nn            : LD e,nn

  // Reference: zaks:82 page 412

  // 1f               : RRA              sz-0-vp0*

  // Reference: zaks:82 page 288

  // 20 nn            : JR nz,(PC+nn)

  // Reference: zaks:82 page 293

  // 21 nnnn          : LD hl,nnnn

  // Reference: zaks:82 page 323

  // 22 nnnn          : LD (nnnn),HL

  // Reference: zaks:82 page 265

  // 23               : INC hl

  // Reference: zaks:82 page 264

  // 24               : INC h            **-*-*p0c

  // Reference: zaks:82 page 238

  // 25               : DEC h            **-*-*p1c

  // Reference: zaks:82 page 295

  // 26 nn            : LD h,nn

  // Reference: zaks:82 page 236

  // 27               : DAA              **-*-v*n*

  // Reference: zaks:82 page 288

  // 28 nn            : JR z,(PC+nn)

  // Reference: zaks:82 page 203

  // 29               : ADD HL,hl        sz-*-vp0*

  // Reference: zaks:82 page 334

  // 2a nnnn          : LD HL,(nnnn)

  // Reference: zaks:82 page 240

  // 2b               : DEC hl

  // Reference: zaks:82 page 264

  // 2c               : INC l            **-*-*p0c

  // Reference: zaks:82 page 238

  // 2d               : DEC l            **-*-*p1c

  // Reference: zaks:82 page 295

  // 2e nn            : LD l,nn

  // Reference: zaks:82 page 235

  // 2f               : CPL              sz-1-vp1c

  // Reference: zaks:82 page 288

  // 30 nn            : JR nc,(PC+nn)

  // Reference: zaks:82 page 293

  // 31 nnnn          : LD sp,nnnn

  // Reference: zaks:82 page 319

  // 32 nnnn          : LD (nnnn),A

  // Reference: zaks:82 page 265

  // 33               : INC sp

  // Reference: zaks:82 page 264
  // Reference: zaks:82 page 267

  // 34               : INC (HL)         **-*-*p0c

  // Reference: zaks:82 page 238
  // Reference: zaks:82 page 238

  // 35               : DEC (HL)         **-*-*p1c

  // Reference: zaks:82 page 295
  // Reference: zaks:82 page 301

  // 36 nn            : LD (HL),nn

  // Reference: zaks:82 page 424

  // 37               : SCF              sz-0-vp01

  // Reference: zaks:82 page 288

  // 38 nn            : JR c,(PC+nn)

  // Reference: zaks:82 page 203

  // 39               : ADD HL,sp        sz-*-vp0*

  // Reference: zaks:82 page 317

  // 3a nnnn          : LD A,(nnnn)

  // Reference: zaks:82 page 240

  // 3b               : DEC sp

  // Reference: zaks:82 page 264

  // 3c               : INC a            **-*-*p0c

  // Reference: zaks:82 page 238

  // 3d               : DEC a            **-*-*p1c

  // Reference: zaks:82 page 295

  // 3e nn            : LD a,nn

  // Reference: zaks:82 page 224
  // Reference: The H flag should be set to the old carry, according to http://www.z80.info/z80sflag.htm 

  // 3f               : CCF              sz-*-vp0*

  // Reference: zaks:82 page 297

  // 40               : LD b,b

  // Reference: zaks:82 page 297

  // 41               : LD b,c

  // Reference: zaks:82 page 297

  // 42               : LD b,d

  // Reference: zaks:82 page 297

  // 43               : LD b,e

  // Reference: zaks:82 page 297

  // 44               : LD b,h

  // Reference: zaks:82 page 297

  // 45               : LD b,l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356

  // 46               : LD b,(HL)

  // Reference: zaks:82 page 297

  // 47               : LD b,a

  // Reference: zaks:82 page 297

  // 48               : LD c,b

  // Reference: zaks:82 page 297

  // 49               : LD c,c

  // Reference: zaks:82 page 297

  // 4a               : LD c,d

  // Reference: zaks:82 page 297

  // 4b               : LD c,e

  // Reference: zaks:82 page 297

  // 4c               : LD c,h

  // Reference: zaks:82 page 297

  // 4d               : LD c,l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356

  // 4e               : LD c,(HL)

  // Reference: zaks:82 page 297

  // 4f               : LD c,a

  // Reference: zaks:82 page 297

  // 50               : LD d,b

  // Reference: zaks:82 page 297

  // 51               : LD d,c

  // Reference: zaks:82 page 297

  // 52               : LD d,d

  // Reference: zaks:82 page 297

  // 53               : LD d,e

  // Reference: zaks:82 page 297

  // 54               : LD d,h

  // Reference: zaks:82 page 297

  // 55               : LD d,l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356

  // 56               : LD d,(HL)

  // Reference: zaks:82 page 297

  // 57               : LD d,a

  // Reference: zaks:82 page 297

  // 58               : LD e,b

  // Reference: zaks:82 page 297

  // 59               : LD e,c

  // Reference: zaks:82 page 297

  // 5a               : LD e,d

  // Reference: zaks:82 page 297

  // 5b               : LD e,e

  // Reference: zaks:82 page 297

  // 5c               : LD e,h

  // Reference: zaks:82 page 297

  // 5d               : LD e,l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356

  // 5e               : LD e,(HL)

  // Reference: zaks:82 page 297

  // 5f               : LD e,a

  // Reference: zaks:82 page 297

  // 60               : LD h,b

  // Reference: zaks:82 page 297

  // 61               : LD h,c

  // Reference: zaks:82 page 297

  // 62               : LD h,d

  // Reference: zaks:82 page 297

  // 63               : LD h,e

  // Reference: zaks:82 page 297

  // 64               : LD h,h

  // Reference: zaks:82 page 297

  // 65               : LD h,l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356

  // 66               : LD h,(HL)

  // Reference: zaks:82 page 297

  // 67               : LD h,a

  // Reference: zaks:82 page 297

  // 68               : LD l,b

  // Reference: zaks:82 page 297

  // 69               : LD l,c

  // Reference: zaks:82 page 297

  // 6a               : LD l,d

  // Reference: zaks:82 page 297

  // 6b               : LD l,e

  // Reference: zaks:82 page 297

  // 6c               : LD l,h

  // Reference: zaks:82 page 297

  // 6d               : LD l,l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356

  // 6e               : LD l,(HL)

  // Reference: zaks:82 page 297

  // 6f               : LD l,a

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 303

  // 70               : LD (HL),b

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 303

  // 71               : LD (HL),c

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 303

  // 72               : LD (HL),d

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 303

  // 73               : LD (HL),e

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 303

  // 74               : LD (HL),h

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 303

  // 75               : LD (HL),l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356
  // Reference: zaks:82 page 303
  // Reference: zaks:82 page 257

  // 76               : HALT

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 303

  // 77               : LD (HL),a

  // Reference: zaks:82 page 297

  // 78               : LD a,b

  // Reference: zaks:82 page 297

  // 79               : LD a,c

  // Reference: zaks:82 page 297

  // 7a               : LD a,d

  // Reference: zaks:82 page 297

  // 7b               : LD a,e

  // Reference: zaks:82 page 297

  // 7c               : LD a,h

  // Reference: zaks:82 page 297

  // 7d               : LD a,l

  // Reference: zaks:82 page 297
  // Reference: zaks:82 page 356

  // 7e               : LD a,(HL)

  // Reference: zaks:82 page 297

  // 7f               : LD a,a

  // Reference: zaks:82 page 201

  // 80               : ADD A,b          **-*-*p0*

  // Reference: zaks:82 page 201

  // 81               : ADD A,c          **-*-*p0*

  // Reference: zaks:82 page 201

  // 82               : ADD A,d          **-*-*p0*

  // Reference: zaks:82 page 201

  // 83               : ADD A,e          **-*-*p0*

  // Reference: zaks:82 page 201

  // 84               : ADD A,h          **-*-*p0*

  // Reference: zaks:82 page 201

  // 85               : ADD A,l          **-*-*p0*

  // Reference: zaks:82 page 201
  // Reference: zaks:82 page 194

  // 86               : ADD A,(HL)       **-*-*p0*

  // Reference: zaks:82 page 201

  // 87               : ADD A,a          **-*-*p0*

  // Reference: zaks:82 page 190

  // 88               : ADC A,b          **-*-*p0*

  // Reference: zaks:82 page 190

  // 89               : ADC A,c          **-*-*p0*

  // Reference: zaks:82 page 190

  // 8a               : ADC A,d          **-*-*p0*

  // Reference: zaks:82 page 190

  // 8b               : ADC A,e          **-*-*p0*

  // Reference: zaks:82 page 190

  // 8c               : ADC A,h          **-*-*p0*

  // Reference: zaks:82 page 190

  // 8d               : ADC A,l          **-*-*p0*

  // Reference: zaks:82 page 190
  // Reference: zaks:82 page 190

  // 8e               : ADC A,(HL)       **-*-*p0*

  // Reference: zaks:82 page 190

  // 8f               : ADC A,a          **-*-*p0*

  // Reference: zaks:82 page 434

  // 90               : SUB A,b          **-*-*p1*

  // Reference: zaks:82 page 434

  // 91               : SUB A,c          **-*-*p1*

  // Reference: zaks:82 page 434

  // 92               : SUB A,d          **-*-*p1*

  // Reference: zaks:82 page 434

  // 93               : SUB A,e          **-*-*p1*

  // Reference: zaks:82 page 434

  // 94               : SUB A,h          **-*-*p1*

  // Reference: zaks:82 page 434

  // 95               : SUB A,l          **-*-*p1*

  // Reference: zaks:82 page 434
  // Reference: zaks:82 page 434

  // 96               : SUB A,(HL)       **-*-*p1*

  // Reference: zaks:82 page 434

  // 97               : SUB A,a          **-*-*p1*

  // Reference: zaks:82 page 420

  // 98               : SBC A,b          **-*-*p1*

  // Reference: zaks:82 page 420

  // 99               : SBC A,c          **-*-*p1*

  // Reference: zaks:82 page 420

  // 9a               : SBC A,d          **-*-*p1*

  // Reference: zaks:82 page 420

  // 9b               : SBC A,e          **-*-*p1*

  // Reference: zaks:82 page 420

  // 9c               : SBC A,h          **-*-*p1*

  // Reference: zaks:82 page 420

  // 9d               : SBC A,l          **-*-*p1*

  // Reference: zaks:82 page 420
  // Reference: zaks:82 page 420

  // 9e               : SBC A,(HL)       **-*-*p1*

  // Reference: zaks:82 page 420

  // 9f               : SBC A,a          **-*-*p1*

  // Reference: zaks:82 page 209

  // a0               : AND A,b          **-1-v*00

  // Reference: zaks:82 page 209

  // a1               : AND A,c          **-1-v*00

  // Reference: zaks:82 page 209

  // a2               : AND A,d          **-1-v*00

  // Reference: zaks:82 page 209

  // a3               : AND A,e          **-1-v*00

  // Reference: zaks:82 page 209

  // a4               : AND A,h          **-1-v*00

  // Reference: zaks:82 page 209

  // a5               : AND A,l          **-1-v*00

  // Reference: zaks:82 page 209
  // Reference: zaks:82 page 209

  // a6               : AND A,(HL)       **-1-v*00

  // Reference: zaks:82 page 209

  // a7               : AND A,a          **-1-v*00

  // Reference: zaks:82 page 436

  // a8               : XOR A,b          **-0-v*00

  // Reference: zaks:82 page 436

  // a9               : XOR A,c          **-0-v*00

  // Reference: zaks:82 page 436

  // aa               : XOR A,d          **-0-v*00

  // Reference: zaks:82 page 436

  // ab               : XOR A,e          **-0-v*00

  // Reference: zaks:82 page 436

  // ac               : XOR A,h          **-0-v*00

  // Reference: zaks:82 page 436

  // ad               : XOR A,l          **-0-v*00

  // Reference: zaks:82 page 436
  // Reference: zaks:82 page 436

  // ae               : XOR A,(HL)       **-0-v*00

  // Reference: zaks:82 page 436

  // af               : XOR A,a          **-0-v*00

  // Reference: zaks:82 page 360

  // b0               : OR A,b           **-0-v*00

  // Reference: zaks:82 page 360

  // b1               : OR A,c           **-0-v*00

  // Reference: zaks:82 page 360

  // b2               : OR A,d           **-0-v*00

  // Reference: zaks:82 page 360

  // b3               : OR A,e           **-0-v*00

  // Reference: zaks:82 page 360

  // b4               : OR A,h           **-0-v*00

  // Reference: zaks:82 page 360

  // b5               : OR A,l           **-0-v*00

  // Reference: zaks:82 page 360
  // Reference: zaks:82 page 360

  // b6               : OR A,(HL)        **-0-v*00

  // Reference: zaks:82 page 360

  // b7               : OR A,a           **-0-v*00

  // Reference: zaks:82 page 225

  // b8               : CP A,b           **-*-*p1*

  // Reference: zaks:82 page 225

  // b9               : CP A,c           **-*-*p1*

  // Reference: zaks:82 page 225

  // ba               : CP A,d           **-*-*p1*

  // Reference: zaks:82 page 225

  // bb               : CP A,e           **-*-*p1*

  // Reference: zaks:82 page 225

  // bc               : CP A,h           **-*-*p1*

  // Reference: zaks:82 page 225

  // bd               : CP A,l           **-*-*p1*

  // Reference: zaks:82 page 225
  // Reference: zaks:82 page 225

  // be               : CP A,(HL)        **-*-*p1*

  // Reference: zaks:82 page 225

  // bf               : CP A,a           **-*-*p1*

  // Reference: zaks:82 page 390

  // c0               : RET nz

  // Reference: zaks:82 page 373

  // c1               : POP bc

  // Reference: zaks:82 page 282

  // c2 nnnn          : JP nz,(nnnn)

  // Reference: zaks:82 page 284

  // c3 nnnn          : JP (nnnn)

  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // c4 nnnn          : CALL nz,nnnn

  // Reference: zaks:82 page 379

  // c5               : PUSH bc

  // Reference: zaks:82 page 200

  // c6 nn            : ADD A,nn         **-*-*p0*

  // Reference: zaks:82 page 418

  // c7               : RST 0x00

  // Reference: zaks:82 page 390

  // c8               : RET z

  // Reference: zaks:82 page 388

  // c9               : RET

  // Reference: zaks:82 page 282

  // ca nnnn          : JP z,(nnnn)

  // Reference:  page 
  // ext
  // cb 
  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // cc nnnn          : CALL z,nnnn

  // Reference: zaks:82 page 222

  // cd nnnnnnnnnnnn  : CALL (nnnn)

  // Reference: zaks:82 page 190

  // ce nn            : ADC A,nn         **-*-*p0*

  // Reference: zaks:82 page 418

  // cf               : RST 0x08

  // Reference: zaks:82 page 390

  // d0               : RET nc

  // Reference: zaks:82 page 373

  // d1               : POP de

  // Reference: zaks:82 page 282

  // d2 nnnn          : JP nc,(nnnn)

  // Reference: zaks:82 page 368

  // d3 nn            : OUT (nn),A

  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // d4 nnnn          : CALL nc,nnnn

  // Reference: zaks:82 page 379

  // d5               : PUSH de

  // Reference: zaks:82 page 434

  // d6 nn            : SUB nn           **-*-*p1*

  // Reference: zaks:82 page 418

  // d7               : RST 0x10

  // Reference: zaks:82 page 390

  // d8               : RET c

  // Reference: zaks:82 page 256

  // d9               : EXX

  // Reference: zaks:82 page 282

  // da nnnn          : JP c,(nnnn)

  // Reference: zaks:82 page 263

  // db nnnn          : IN A,(nn)

  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // dc nnnn          : CALL c,nnnn

  // Reference:  page 
  // ext
  // dd 
  // Reference: zaks:82 page 420

  // de nn            : SBC A,nn         **-*-*p1*

  // Reference: zaks:82 page 418

  // df               : RST 0x18

  // Reference: zaks:82 page 390

  // e0               : RET po

  // Reference: zaks:82 page 373

  // e1               : POP hl

  // Reference: zaks:82 page 282

  // e2 nnnn          : JP po,(nnnn)

  // Reference: zaks:82 page 250

  // e3               : EX (SP),HL

  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // e4 nnnn          : CALL po,nnnn

  // Reference: zaks:82 page 379

  // e5               : PUSH hl

  // Reference: zaks:82 page 209

  // e6 nn            : AND nn           **-1-v*00

  // Reference: zaks:82 page 418

  // e7               : RST 0x20

  // Reference: zaks:82 page 390

  // e8               : RET pe

  // Reference: zaks:82 page 285

  // e9               : JP (HL)

  // Reference: zaks:82 page 282

  // ea nnnn          : JP pe,(nnnn)

  // Reference: zaks:82 page 249

  // eb               : EX DE,HL

  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // ec nnnn          : CALL pe,nnnn

  // Reference:  page 
  // ext
  // ed 
  // Reference: zaks:82 page 436

  // ee nn            : XOR A,nn         **-0-v*00

  // Reference: zaks:82 page 418

  // ef               : RST 0x28

  // Reference: zaks:82 page 390

  // f0               : RET p

  // Reference: zaks:82 page 373

  // f1               : POP af

  // Reference: zaks:82 page 282

  // f2 nnnn          : JP p,(nnnn)

  // Reference: zaks:82 page 244

  // f3               : DI

  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // f4 nnnn          : CALL p,nnnn

  // Reference: zaks:82 page 379

  // f5               : PUSH af

  // Reference: zaks:82 page 360

  // f6 nn            : OR A,nn          **-0-v*00

  // Reference: zaks:82 page 418

  // f7               : RST 0x30

  // Reference: zaks:82 page 390

  // f8               : RET m

  // Reference: zaks:82 page 345

  // f9               : LD SP,HL

  // Reference: zaks:82 page 282

  // fa nnnn          : JP m,(nnnn)

  // Reference: zaks:82 page 247

  // fb               : EI

  // Reference: zaks:82 page 219
  // Reference: This edition describes the P CC as 100, instead of 110

  // fc nnnn          : CALL m,nnnn

  // Reference:  page 
  // ext
  // fd 
  // Reference: zaks:82 page 225

  // fe nn            : CP nn            **-*-*p1*

  // Reference: zaks:82 page 418

  // ff               : RST 0x38

  // Unknown: 00
  // Unknown: 01
  // Unknown: 02
  // Unknown: 03
  // Unknown: 04
  // Unknown: 05
  // Unknown: 06
  // Unknown: 07
  // Unknown: 08
  // Reference: zaks:82 page 205

  // 09               : ADD IX,bc        sz-*-vp0*

  // Unknown: 0a
  // Unknown: 0b
  // Unknown: 0c
  // Unknown: 0d
  // Unknown: 0e
  // Unknown: 0f
  // Unknown: 10
  // Unknown: 11
  // Unknown: 12
  // Unknown: 13
  // Unknown: 14
  // Unknown: 15
  // Unknown: 16
  // Unknown: 17
  // Unknown: 18
  // Reference: zaks:82 page 205

  // 19               : ADD IX,de        sz-*-vp0*

  // Unknown: 1a
  // Unknown: 1b
  // Unknown: 1c
  // Unknown: 1d
  // Unknown: 1e
  // Unknown: 1f
  // Unknown: 20
  // Reference: zaks:82 page 336

  // 21 nnnn          : LD IX,nnnn

  // Reference: zaks:82 page 325

  // 22 nnnn          : LD (nnnn),IX

  // Reference: zaks:82 page 272

  // 23               : INC IX

  // Unknown: 24
  // Unknown: 25
  // Unknown: 26
  // Unknown: 27
  // Unknown: 28
  // Reference: zaks:82 page 205

  // 29               : ADD IX,ix        sz-*-vp0*

  // Reference: zaks:82 page 338

  // 2a nnnn          : LD IX,(nnnn)

  // Reference: zaks:82 page 242

  // 2b               : DEC IX

  // Unknown: 2c
  // Unknown: 2d
  // Unknown: 2e
  // Unknown: 2f
  // Unknown: 30
  // Unknown: 31
  // Unknown: 32
  // Unknown: 33
  // Reference: zaks:82 page 268

  // 34 nnnn          : INC (IX+nn)      **-*-*p0c

  // Reference: zaks:82 page 238

  // 35 nnnn          : DEC (IX+nn)      **-*-*p1c

  // Reference: zaks:82 page 309

  // 36 ddnn          : LD (IX+dd),nn

  // Unknown: 37
  // Unknown: 38
  // Reference: zaks:82 page 205

  // 39               : ADD IX,sp        sz-*-vp0*

  // Unknown: 3a
  // Unknown: 3b
  // Unknown: 3c
  // Unknown: 3d
  // Unknown: 3e
  // Unknown: 3f
  // Unknown: 40
  // Unknown: 41
  // Unknown: 42
  // Unknown: 43
  // Unknown: 44
  // Unknown: 45
  // Reference: zaks:82 page 305

  // 46 nn            : LD b,(IX+nn)

  // Unknown: 47
  // Unknown: 48
  // Unknown: 49
  // Unknown: 4a
  // Unknown: 4b
  // Unknown: 4c
  // Unknown: 4d
  // Reference: zaks:82 page 305

  // 4e nn            : LD c,(IX+nn)

  // Unknown: 4f
  // Unknown: 50
  // Unknown: 51
  // Unknown: 52
  // Unknown: 53
  // Unknown: 54
  // Unknown: 55
  // Reference: zaks:82 page 305

  // 56 nn            : LD d,(IX+nn)

  // Unknown: 57
  // Unknown: 58
  // Unknown: 59
  // Unknown: 5a
  // Unknown: 5b
  // Unknown: 5c
  // Unknown: 5d
  // Reference: zaks:82 page 305

  // 5e nn            : LD e,(IX+nn)

  // Unknown: 5f
  // Unknown: 60
  // Unknown: 61
  // Unknown: 62
  // Unknown: 63
  // Unknown: 64
  // Unknown: 65
  // Reference: zaks:82 page 305

  // 66 nn            : LD h,(IX+nn)

  // Unknown: 67
  // Unknown: 68
  // Unknown: 69
  // Unknown: 6a
  // Unknown: 6b
  // Unknown: 6c
  // Unknown: 6d
  // Reference: zaks:82 page 305

  // 6e nn            : LD l,(IX+nn)

  // Unknown: 6f
  // Reference: zaks:82 page 313

  // 70 nn            : LD (IX+nn),b

  // Reference: zaks:82 page 313

  // 71 nn            : LD (IX+nn),c

  // Reference: zaks:82 page 313

  // 72 nn            : LD (IX+nn),d

  // Reference: zaks:82 page 313

  // 73 nn            : LD (IX+nn),e

  // Reference: zaks:82 page 313

  // 74 nn            : LD (IX+nn),h

  // Reference: zaks:82 page 313

  // 75 nn            : LD (IX+nn),l

  // Reference: zaks:82 page 305
  // Reference: zaks:82 page 313
  // Unknown: 76
  // Reference: zaks:82 page 313

  // 77 nn            : LD (IX+nn),a

  // Unknown: 78
  // Unknown: 79
  // Unknown: 7a
  // Unknown: 7b
  // Unknown: 7c
  // Unknown: 7d
  // Reference: zaks:82 page 305

  // 7e nn            : LD a,(IX+nn)

  // Unknown: 7f
  // Unknown: 80
  // Unknown: 81
  // Unknown: 82
  // Unknown: 83
  // Unknown: 84
  // Unknown: 85
  // Reference: zaks:82 page 196

  // 86 nn            : ADD A,(IX+nn)    **-*-*p0*

  // Unknown: 87
  // Unknown: 88
  // Unknown: 89
  // Unknown: 8a
  // Unknown: 8b
  // Unknown: 8c
  // Unknown: 8d
  // Reference: zaks:82 page 190

  // 8e nn            : ADC A,(IX+nn)    **-*-*p0c

  // Unknown: 8f
  // Unknown: 90
  // Unknown: 91
  // Unknown: 92
  // Unknown: 93
  // Unknown: 94
  // Unknown: 95
  // Reference: zaks:82 page 434

  // 96 nn            : SUB (IX+nn)      **-*-*p1*

  // Unknown: 97
  // Unknown: 98
  // Unknown: 99
  // Unknown: 9a
  // Unknown: 9b
  // Unknown: 9c
  // Unknown: 9d
  // Reference: zaks:82 page 420

  // 9e nn            : SBC A,(IX+nn)    **-*-*p1*

  // Unknown: 9f
  // Unknown: a0
  // Unknown: a1
  // Unknown: a2
  // Unknown: a3
  // Unknown: a4
  // Unknown: a5
  // Reference: zaks:82 page 209

  // a6 nn            : AND (IX+nn)      **-1-v*00

  // Unknown: a7
  // Unknown: a8
  // Unknown: a9
  // Unknown: aa
  // Unknown: ab
  // Unknown: ac
  // Unknown: ad
  // Reference: zaks:82 page 436

  // ae nn            : XOR A,(IX+nn)    **-0-v*00

  // Unknown: af
  // Unknown: b0
  // Unknown: b1
  // Unknown: b2
  // Unknown: b3
  // Unknown: b4
  // Unknown: b5
  // Reference: zaks:82 page 360

  // b6 nn            : OR (IX+nn)       **-h-v*00

  // Unknown: b7
  // Unknown: b8
  // Unknown: b9
  // Unknown: ba
  // Unknown: bb
  // Unknown: bc
  // Unknown: bd
  // Reference: zaks:82 page 225

  // be nn            : CP A,(IX+nn)     **-*-*p1*

  // Unknown: bf
  // Unknown: c0
  // Unknown: c1
  // Unknown: c2
  // Unknown: c3
  // Unknown: c4
  // Unknown: c5
  // Unknown: c6
  // Unknown: c7
  // Unknown: c8
  // Unknown: c9
  // Unknown: ca
  // Reference: zaks:82 page 404
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
    // cb nnnn          : RLC (IX+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 413
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
    // cb nnnn          : RRC (IX+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 396
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
    // cb nnnn          : RL (IX+nn)       **-0-v*0*
  }
  // Reference: zaks:82 page 410
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
    // cb nnnn          : RR (IX+nn)       **-0-v*0*
  }
  // Reference: zaks:82 page 428
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
    // cb nnnn          : SLA (IX+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 430
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
    // cb nnnn          : SRA (IX+nn)      **-0-v*0*
  }
  // Reference:  page 
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
    // cb nnnn          : SLL (IX+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 432
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
    // cb nnnn          : SRL (IX+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 213
  if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
    // cb nnnn          : BIT 0,(IX+nn)    **-1-v*0c
  }
  // Reference: zaks:82 page 385
  if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
    // cb nnnn          : RES 0,(IX+nn)
  }
  // Reference: zaks:82 page 425
  if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
    // cb nnnn          : SET 0,(IX+nn)
  }
  // Unknown: cc
  // Unknown: cd
  // Unknown: ce
  // Unknown: cf
  // Unknown: d0
  // Unknown: d1
  // Unknown: d2
  // Unknown: d3
  // Unknown: d4
  // Unknown: d5
  // Unknown: d6
  // Unknown: d7
  // Unknown: d8
  // Unknown: d9
  // Unknown: da
  // Unknown: db
  // Unknown: dc
  // Unknown: dd
  // Unknown: de
  // Unknown: df
  // Unknown: e0
  // Reference: zaks:82 page 375

  // e1               : POP IX

  // Unknown: e2
  // Reference: zaks:82 page 252

  // e3               : EX (SP),IX

  // Unknown: e4
  // Reference: zaks:82 page 381

  // e5               : PUSH IX

  // Unknown: e6
  // Unknown: e7
  // Unknown: e8
  // Reference: zaks:82 page 286

  // e9               : JP (IX)

  // Unknown: ea
  // Unknown: eb
  // Unknown: ec
  // Unknown: ed
  // Unknown: ee
  // Unknown: ef
  // Unknown: f0
  // Unknown: f1
  // Unknown: f2
  // Unknown: f3
  // Unknown: f4
  // Unknown: f5
  // Unknown: f6
  // Unknown: f7
  // Unknown: f8
  // Reference: zaks:82 page 346

  // f9               : LD SP,IX

  // Unknown: fa
  // Unknown: fb
  // Unknown: fc
  // Unknown: fd
  // Unknown: fe
  // Unknown: ff
  // Reference: zaks:82 page 400

  // 00               : RLC b            **-0-v*0*

  // Reference: zaks:82 page 400

  // 01               : RLC c            **-0-v*0*

  // Reference: zaks:82 page 400

  // 02               : RLC d            **-0-v*0*

  // Reference: zaks:82 page 400

  // 03               : RLC e            **-0-v*0*

  // Reference: zaks:82 page 400

  // 04               : RLC h            **-0-v*0*

  // Reference: zaks:82 page 400

  // 05               : RLC l            **-0-v*0*

  // Reference: zaks:82 page 400
  // Reference: zaks:82 page 402

  // 06               : RLC (HL)         **-0-v*0*

  // Reference: zaks:82 page 400

  // 07               : RLC a            **-0-v*0*

  // Reference: zaks:82 page 413

  // 08               : RRC b            **-0-v*0*

  // Reference: zaks:82 page 413

  // 09               : RRC c            **-0-v*0*

  // Reference: zaks:82 page 413

  // 0a               : RRC d            **-0-v*0*

  // Reference: zaks:82 page 413

  // 0b               : RRC e            **-0-v*0*

  // Reference: zaks:82 page 413

  // 0c               : RRC h            **-0-v*0*

  // Reference: zaks:82 page 413

  // 0d               : RRC l            **-0-v*0*

  // Reference: zaks:82 page 413
  // Reference: zaks:82 page 413

  // 0e               : RRC (HL)         **-0-v*0*

  // Reference: zaks:82 page 413

  // 0f               : RRC a            **-0-v*0*

  // Reference: zaks:82 page 396

  // 10               : RL b             **-0-v*0*

  // Reference: zaks:82 page 396

  // 11               : RL c             **-0-v*0*

  // Reference: zaks:82 page 396

  // 12               : RL d             **-0-v*0*

  // Reference: zaks:82 page 396

  // 13               : RL e             **-0-v*0*

  // Reference: zaks:82 page 396

  // 14               : RL h             **-0-v*0*

  // Reference: zaks:82 page 396

  // 15               : RL l             **-0-v*0*

  // Reference: zaks:82 page 396
  // Reference: zaks:82 page 396

  // 16               : RL (HL)          **-0-v*0*

  // Reference: zaks:82 page 396

  // 17               : RL a             **-0-v*0*

  // Reference: zaks:82 page 410

  // 18               : RR b             **-0-v*0*

  // Reference: zaks:82 page 410

  // 19               : RR c             **-0-v*0*

  // Reference: zaks:82 page 410

  // 1a               : RR d             **-0-v*0*

  // Reference: zaks:82 page 410

  // 1b               : RR e             **-0-v*0*

  // Reference: zaks:82 page 410

  // 1c               : RR h             **-0-v*0*

  // Reference: zaks:82 page 410

  // 1d               : RR l             **-0-v*0*

  // Reference: zaks:82 page 410
  // Reference: zaks:82 page 410

  // 1e               : RR (HL)          **-0-v*0*

  // Reference: zaks:82 page 410

  // 1f               : RR a             **-0-v*0*

  // Reference: zaks:82 page 428

  // 20               : SLA b            **-0-v*0*

  // Reference: zaks:82 page 428

  // 21               : SLA c            **-0-v*0*

  // Reference: zaks:82 page 428

  // 22               : SLA d            **-0-v*0*

  // Reference: zaks:82 page 428

  // 23               : SLA e            **-0-v*0*

  // Reference: zaks:82 page 428

  // 24               : SLA h            **-0-v*0*

  // Reference: zaks:82 page 428

  // 25               : SLA l            **-0-v*0*

  // Reference: zaks:82 page 428
  // Reference: zaks:82 page 428

  // 26               : SLA (HL)         **-0-v*0*

  // Reference: zaks:82 page 428

  // 27               : SLA a            **-0-v*0*

  // Reference: zaks:82 page 430

  // 28               : SRA b            **-0-v*0*

  // Reference: zaks:82 page 430

  // 29               : SRA c            **-0-v*0*

  // Reference: zaks:82 page 430

  // 2a               : SRA d            **-0-v*0*

  // Reference: zaks:82 page 430

  // 2b               : SRA e            **-0-v*0*

  // Reference: zaks:82 page 430

  // 2c               : SRA h            **-0-v*0*

  // Reference: zaks:82 page 430

  // 2d               : SRA l            **-0-v*0*

  // Reference: zaks:82 page 430
  // Reference: zaks:82 page 430

  // 2e               : SRA (HL)         **-0-v*0*

  // Reference: zaks:82 page 430

  // 2f               : SRA a            **-0-v*0*

  // Reference:  page 

  // 30               : SLL b            **-0-v*0*

  // Reference:  page 

  // 31               : SLL c            **-0-v*0*

  // Reference:  page 

  // 32               : SLL d            **-0-v*0*

  // Reference:  page 

  // 33               : SLL e            **-0-v*0*

  // Reference:  page 

  // 34               : SLL h            **-0-v*0*

  // Reference:  page 

  // 35               : SLL l            **-0-v*0*

  // Reference:  page 
  // Reference:  page 

  // 36               : SLL (HL)         **-0-v*0*

  // Reference:  page 

  // 37               : SLL a            **-0-v*0*

  // Reference: zaks:82 page 432

  // 38               : SRL b            **-0-v*0*

  // Reference: zaks:82 page 432

  // 39               : SRL c            **-0-v*0*

  // Reference: zaks:82 page 432

  // 3a               : SRL d            **-0-v*0*

  // Reference: zaks:82 page 432

  // 3b               : SRL e            **-0-v*0*

  // Reference: zaks:82 page 432

  // 3c               : SRL h            **-0-v*0*

  // Reference: zaks:82 page 432

  // 3d               : SRL l            **-0-v*0*

  // Reference: zaks:82 page 432
  // Reference: zaks:82 page 432

  // 3e               : SRL (HL)         **-0-v*0*

  // Reference: zaks:82 page 432

  // 3f               : SRL a            **-0-v*0*

  // Reference: zaks:82 page 217

  // 40               : BIT 0,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 41               : BIT 0,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 42               : BIT 0,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 43               : BIT 0,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 44               : BIT 0,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 45               : BIT 0,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 46               : BIT 0, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 47               : BIT 0,a          **-1-v*0c

  // Reference: zaks:82 page 217

  // 48               : BIT 1,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 49               : BIT 1,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 4a               : BIT 1,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 4b               : BIT 1,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 4c               : BIT 1,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 4d               : BIT 1,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 4e               : BIT 1, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 4f               : BIT 1,a          **-1-v*0c

  // Reference: zaks:82 page 217

  // 50               : BIT 2,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 51               : BIT 2,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 52               : BIT 2,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 53               : BIT 2,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 54               : BIT 2,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 55               : BIT 2,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 56               : BIT 2, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 57               : BIT 2,a          **-1-v*0c

  // Reference: zaks:82 page 217

  // 58               : BIT 3,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 59               : BIT 3,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 5a               : BIT 3,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 5b               : BIT 3,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 5c               : BIT 3,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 5d               : BIT 3,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 5e               : BIT 3, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 5f               : BIT 3,a          **-1-v*0c

  // Reference: zaks:82 page 217

  // 60               : BIT 4,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 61               : BIT 4,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 62               : BIT 4,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 63               : BIT 4,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 64               : BIT 4,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 65               : BIT 4,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 66               : BIT 4, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 67               : BIT 4,a          **-1-v*0c

  // Reference: zaks:82 page 217

  // 68               : BIT 5,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 69               : BIT 5,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 6a               : BIT 5,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 6b               : BIT 5,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 6c               : BIT 5,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 6d               : BIT 5,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 6e               : BIT 5, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 6f               : BIT 5,a          **-1-v*0c

  // Reference: zaks:82 page 217

  // 70               : BIT 6,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 71               : BIT 6,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 72               : BIT 6,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 73               : BIT 6,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 74               : BIT 6,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 75               : BIT 6,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 76               : BIT 6, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 77               : BIT 6,a          **-1-v*0c

  // Reference: zaks:82 page 217

  // 78               : BIT 7,b          **-1-v*0c

  // Reference: zaks:82 page 217

  // 79               : BIT 7,c          **-1-v*0c

  // Reference: zaks:82 page 217

  // 7a               : BIT 7,d          **-1-v*0c

  // Reference: zaks:82 page 217

  // 7b               : BIT 7,e          **-1-v*0c

  // Reference: zaks:82 page 217

  // 7c               : BIT 7,h          **-1-v*0c

  // Reference: zaks:82 page 217

  // 7d               : BIT 7,l          **-1-v*0c

  // Reference: zaks:82 page 217
  // Reference: zaks:82 page 211

  // 7e               : BIT 7, (HL)      ?*-1-v?0c

  // Reference: zaks:82 page 217

  // 7f               : BIT 7,a          **-1-v*0c

  // Reference: zaks:82 page 385

  // 80               : RES 0,b

  // Reference: zaks:82 page 385

  // 81               : RES 0,c

  // Reference: zaks:82 page 385

  // 82               : RES 0,d

  // Reference: zaks:82 page 385

  // 83               : RES 0,e

  // Reference: zaks:82 page 385

  // 84               : RES 0,h

  // Reference: zaks:82 page 385

  // 85               : RES 0,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // 86               : RES 0, (HL)

  // Reference: zaks:82 page 385

  // 87               : RES 0,a

  // Reference: zaks:82 page 385

  // 88               : RES 1,b

  // Reference: zaks:82 page 385

  // 89               : RES 1,c

  // Reference: zaks:82 page 385

  // 8a               : RES 1,d

  // Reference: zaks:82 page 385

  // 8b               : RES 1,e

  // Reference: zaks:82 page 385

  // 8c               : RES 1,h

  // Reference: zaks:82 page 385

  // 8d               : RES 1,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // 8e               : RES 1, (HL)

  // Reference: zaks:82 page 385

  // 8f               : RES 1,a

  // Reference: zaks:82 page 385

  // 90               : RES 2,b

  // Reference: zaks:82 page 385

  // 91               : RES 2,c

  // Reference: zaks:82 page 385

  // 92               : RES 2,d

  // Reference: zaks:82 page 385

  // 93               : RES 2,e

  // Reference: zaks:82 page 385

  // 94               : RES 2,h

  // Reference: zaks:82 page 385

  // 95               : RES 2,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // 96               : RES 2, (HL)

  // Reference: zaks:82 page 385

  // 97               : RES 2,a

  // Reference: zaks:82 page 385

  // 98               : RES 3,b

  // Reference: zaks:82 page 385

  // 99               : RES 3,c

  // Reference: zaks:82 page 385

  // 9a               : RES 3,d

  // Reference: zaks:82 page 385

  // 9b               : RES 3,e

  // Reference: zaks:82 page 385

  // 9c               : RES 3,h

  // Reference: zaks:82 page 385

  // 9d               : RES 3,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // 9e               : RES 3, (HL)

  // Reference: zaks:82 page 385

  // 9f               : RES 3,a

  // Reference: zaks:82 page 385

  // a0               : RES 4,b

  // Reference: zaks:82 page 385

  // a1               : RES 4,c

  // Reference: zaks:82 page 385

  // a2               : RES 4,d

  // Reference: zaks:82 page 385

  // a3               : RES 4,e

  // Reference: zaks:82 page 385

  // a4               : RES 4,h

  // Reference: zaks:82 page 385

  // a5               : RES 4,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // a6               : RES 4, (HL)

  // Reference: zaks:82 page 385

  // a7               : RES 4,a

  // Reference: zaks:82 page 385

  // a8               : RES 5,b

  // Reference: zaks:82 page 385

  // a9               : RES 5,c

  // Reference: zaks:82 page 385

  // aa               : RES 5,d

  // Reference: zaks:82 page 385

  // ab               : RES 5,e

  // Reference: zaks:82 page 385

  // ac               : RES 5,h

  // Reference: zaks:82 page 385

  // ad               : RES 5,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // ae               : RES 5, (HL)

  // Reference: zaks:82 page 385

  // af               : RES 5,a

  // Reference: zaks:82 page 385

  // b0               : RES 6,b

  // Reference: zaks:82 page 385

  // b1               : RES 6,c

  // Reference: zaks:82 page 385

  // b2               : RES 6,d

  // Reference: zaks:82 page 385

  // b3               : RES 6,e

  // Reference: zaks:82 page 385

  // b4               : RES 6,h

  // Reference: zaks:82 page 385

  // b5               : RES 6,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // b6               : RES 6, (HL)

  // Reference: zaks:82 page 385

  // b7               : RES 6,a

  // Reference: zaks:82 page 385

  // b8               : RES 7,b

  // Reference: zaks:82 page 385

  // b9               : RES 7,c

  // Reference: zaks:82 page 385

  // ba               : RES 7,d

  // Reference: zaks:82 page 385

  // bb               : RES 7,e

  // Reference: zaks:82 page 385

  // bc               : RES 7,h

  // Reference: zaks:82 page 385

  // bd               : RES 7,l

  // Reference: zaks:82 page 385
  // Reference: zaks:82 page 385

  // be               : RES 7, (HL)

  // Reference: zaks:82 page 385

  // bf               : RES 7,a

  // Reference: zaks:82 page 425

  // c0               : SET 0,b

  // Reference: zaks:82 page 425

  // c1               : SET 0,c

  // Reference: zaks:82 page 425

  // c2               : SET 0,d

  // Reference: zaks:82 page 425

  // c3               : SET 0,e

  // Reference: zaks:82 page 425

  // c4               : SET 0,h

  // Reference: zaks:82 page 425

  // c5               : SET 0,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // c6               : SET 0, (HL)

  // Reference: zaks:82 page 425

  // c7               : SET 0,a

  // Reference: zaks:82 page 425

  // c8               : SET 1,b

  // Reference: zaks:82 page 425

  // c9               : SET 1,c

  // Reference: zaks:82 page 425

  // ca               : SET 1,d

  // Reference: zaks:82 page 425

  // cb               : SET 1,e

  // Reference: zaks:82 page 425

  // cc               : SET 1,h

  // Reference: zaks:82 page 425

  // cd               : SET 1,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // ce               : SET 1, (HL)

  // Reference: zaks:82 page 425

  // cf               : SET 1,a

  // Reference: zaks:82 page 425

  // d0               : SET 2,b

  // Reference: zaks:82 page 425

  // d1               : SET 2,c

  // Reference: zaks:82 page 425

  // d2               : SET 2,d

  // Reference: zaks:82 page 425

  // d3               : SET 2,e

  // Reference: zaks:82 page 425

  // d4               : SET 2,h

  // Reference: zaks:82 page 425

  // d5               : SET 2,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // d6               : SET 2, (HL)

  // Reference: zaks:82 page 425

  // d7               : SET 2,a

  // Reference: zaks:82 page 425

  // d8               : SET 3,b

  // Reference: zaks:82 page 425

  // d9               : SET 3,c

  // Reference: zaks:82 page 425

  // da               : SET 3,d

  // Reference: zaks:82 page 425

  // db               : SET 3,e

  // Reference: zaks:82 page 425

  // dc               : SET 3,h

  // Reference: zaks:82 page 425

  // dd               : SET 3,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // de               : SET 3, (HL)

  // Reference: zaks:82 page 425

  // df               : SET 3,a

  // Reference: zaks:82 page 425

  // e0               : SET 4,b

  // Reference: zaks:82 page 425

  // e1               : SET 4,c

  // Reference: zaks:82 page 425

  // e2               : SET 4,d

  // Reference: zaks:82 page 425

  // e3               : SET 4,e

  // Reference: zaks:82 page 425

  // e4               : SET 4,h

  // Reference: zaks:82 page 425

  // e5               : SET 4,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // e6               : SET 4, (HL)

  // Reference: zaks:82 page 425

  // e7               : SET 4,a

  // Reference: zaks:82 page 425

  // e8               : SET 5,b

  // Reference: zaks:82 page 425

  // e9               : SET 5,c

  // Reference: zaks:82 page 425

  // ea               : SET 5,d

  // Reference: zaks:82 page 425

  // eb               : SET 5,e

  // Reference: zaks:82 page 425

  // ec               : SET 5,h

  // Reference: zaks:82 page 425

  // ed               : SET 5,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // ee               : SET 5, (HL)

  // Reference: zaks:82 page 425

  // ef               : SET 5,a

  // Reference: zaks:82 page 425

  // f0               : SET 6,b

  // Reference: zaks:82 page 425

  // f1               : SET 6,c

  // Reference: zaks:82 page 425

  // f2               : SET 6,d

  // Reference: zaks:82 page 425

  // f3               : SET 6,e

  // Reference: zaks:82 page 425

  // f4               : SET 6,h

  // Reference: zaks:82 page 425

  // f5               : SET 6,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // f6               : SET 6, (HL)

  // Reference: zaks:82 page 425

  // f7               : SET 6,a

  // Reference: zaks:82 page 425

  // f8               : SET 7,b

  // Reference: zaks:82 page 425

  // f9               : SET 7,c

  // Reference: zaks:82 page 425

  // fa               : SET 7,d

  // Reference: zaks:82 page 425

  // fb               : SET 7,e

  // Reference: zaks:82 page 425

  // fc               : SET 7,h

  // Reference: zaks:82 page 425

  // fd               : SET 7,l

  // Reference: zaks:82 page 425
  // Reference: zaks:82 page 425

  // fe               : SET 7, (HL)

  // Reference: zaks:82 page 425

  // ff               : SET 7,a

  // Unknown: 00
  // Unknown: 01
  // Unknown: 02
  // Unknown: 03
  // Unknown: 04
  // Unknown: 05
  // Unknown: 06
  // Unknown: 07
  // Unknown: 08
  // Unknown: 09
  // Unknown: 0a
  // Unknown: 0b
  // Unknown: 0c
  // Unknown: 0d
  // Unknown: 0e
  // Unknown: 0f
  // Unknown: 10
  // Unknown: 11
  // Unknown: 12
  // Unknown: 13
  // Unknown: 14
  // Unknown: 15
  // Unknown: 16
  // Unknown: 17
  // Unknown: 18
  // Unknown: 19
  // Unknown: 1a
  // Unknown: 1b
  // Unknown: 1c
  // Unknown: 1d
  // Unknown: 1e
  // Unknown: 1f
  // Unknown: 20
  // Unknown: 21
  // Unknown: 22
  // Unknown: 23
  // Unknown: 24
  // Unknown: 25
  // Unknown: 26
  // Unknown: 27
  // Unknown: 28
  // Unknown: 29
  // Unknown: 2a
  // Unknown: 2b
  // Unknown: 2c
  // Unknown: 2d
  // Unknown: 2e
  // Unknown: 2f
  // Unknown: 30
  // Unknown: 31
  // Unknown: 32
  // Unknown: 33
  // Unknown: 34
  // Unknown: 35
  // Unknown: 36
  // Unknown: 37
  // Unknown: 38
  // Unknown: 39
  // Unknown: 3a
  // Unknown: 3b
  // Unknown: 3c
  // Unknown: 3d
  // Unknown: 3e
  // Unknown: 3f
  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 40               : IN b,(C)         **-h-v*0c

  // Reference: zaks:82 page 366

  // 41               : OUT (C),b

  // Reference: zaks:82 page 422

  // 42               : SBC HL,bc        **-*-*p1*

  // Reference: zaks:82 page 321

  // 43 nnnn          : LD (nnnn),bc

  // Reference: zaks:82 page 358

  // 44               : NEG              **-*-*p1*

  // Reference: zaks:82 page 394

  // 45               : RETN

  // Reference: zaks:82 page 258

  // 46               : IM 0

  // Reference: zaks:82 page 332

  // 47               : LD I,A

  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 48               : IN c,(C)         **-h-v*0c

  // Reference: zaks:82 page 366

  // 49               : OUT (C),c

  // Reference: zaks:82 page 192

  // 4a               : ADC HL,bc        **-*-*p0*

  // Reference: zaks:82 page 292

  // 4b nnnn          : LD bc,(nnnn)

  // Reference: zaks:82 page 358

  // 4c               : NEG              **-*-*p1*

  // Reference: zaks:82 page 392

  // 4d               : RETI


  // 4e               : IM 1

  // Reference: zaks:82 page 344

  // 4f               : LD R,A

  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 50               : IN d,(C)         **-h-v*0c

  // Reference: zaks:82 page 366

  // 51               : OUT (C),d

  // Reference: zaks:82 page 422

  // 52               : SBC HL,de        **-*-*p1*

  // Reference: zaks:82 page 321

  // 53 nnnn          : LD (nnnn),de

  // Reference: zaks:82 page 358

  // 54               : NEG              **-*-*p1*


  // 55               : RETN

  // Reference: zaks:82 page 259

  // 56               : IM 1

  // Reference: zaks:82 page 331

  // 57               : LD A,I           **-0-v*0c

  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 58               : IN e,(C)         **-h-v*0c

  // Reference: zaks:82 page 366

  // 59               : OUT (C),e

  // Reference: zaks:82 page 192

  // 5a               : ADC HL,de        **-*-*p0*

  // Reference: zaks:82 page 292

  // 5b nnnn          : LD de,(nnnn)

  // Reference: zaks:82 page 358

  // 5c               : NEG              **-*-*p1*


  // 5d               : RETN

  // Reference: zaks:82 page 260

  // 5e               : IM 2

  // Reference: zaks:82 page 333

  // 5f               : LD A,R           **-0-v*0c

  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 60               : IN h,(C)         **-h-v*0c

  // Reference: zaks:82 page 366

  // 61               : OUT (C),h

  // Reference: zaks:82 page 422

  // 62               : SBC HL,hl        **-*-*p1*

  // Reference: zaks:82 page 321

  // 63 nnnn          : LD (nnnn),hl

  // Reference: zaks:82 page 358

  // 64               : NEG              **-*-*p1*

  // Unknown: 65
  // Unknown: 66
  // Reference: zaks:82 page 416

  // 67               : RRD              **-0-v*0c

  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 68               : IN l,(C)         **-h-v*0c

  // Reference: zaks:82 page 366

  // 69               : OUT (C),l

  // Reference: zaks:82 page 192

  // 6a               : ADC HL,hl        **-*-*p0*

  // Reference: zaks:82 page 292

  // 6b nnnn          : LD hl,(nnnn)

  // Reference: zaks:82 page 358

  // 6c               : NEG              **-*-*p1*

  // Unknown: 6d
  // Unknown: 6e
  // Reference: zaks:82 page 408

  // 6f               : RLD              **-0-v*0c

  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 70               : IN (C)           **-h-v*0c

  // Reference: zaks:82 page 366

  // 71               : OUT (C),0

  // Reference: zaks:82 page 422

  // 72               : SBC HL,sp        **-*-*p1*

  // Reference: zaks:82 page 321

  // 73 nnnn          : LD (nnnn),sp

  // Reference: zaks:82 page 358

  // 74               : NEG              **-*-*p1*

  // Unknown: 75
  // Unknown: 76
  // Unknown: 77
  // Reference: zaks:82 page 261
  // Reference: We don't set the H flag

  // 78               : IN a,(C)         **-h-v*0c

  // Reference: zaks:82 page 366

  // 79               : OUT (C),a

  // Reference: zaks:82 page 192

  // 7a               : ADC HL,sp        **-*-*p0*

  // Reference: zaks:82 page 292

  // 7b nnnn          : LD sp,(nnnn)

  // Reference: zaks:82 page 358

  // 7c               : NEG              **-*-*p1*

  // Unknown: 7d
  // Unknown: 7e
  // Unknown: 7f
  // Unknown: 80
  // Unknown: 81
  // Unknown: 82
  // Unknown: 83
  // Unknown: 84
  // Unknown: 85
  // Unknown: 86
  // Unknown: 87
  // Unknown: 88
  // Unknown: 89
  // Unknown: 8a
  // Unknown: 8b
  // Unknown: 8c
  // Unknown: 8d
  // Unknown: 8e
  // Unknown: 8f
  // Unknown: 90
  // Unknown: 91
  // Unknown: 92
  // Unknown: 93
  // Unknown: 94
  // Unknown: 95
  // Unknown: 96
  // Unknown: 97
  // Unknown: 98
  // Unknown: 99
  // Unknown: 9a
  // Unknown: 9b
  // Unknown: 9c
  // Unknown: 9d
  // Unknown: 9e
  // Unknown: 9f
  // Reference: zaks:82 page 352

  // a0               : LDI              sz-0-v*0c

  // Reference: zaks:82 page 231

  // a1               : CPI              **-*-v*1c

  // Reference: zaks:82 page 278

  // a2               : INI              **-h-v*1c

  // Reference: zaks:82 page 371
  // Reference: confusion whether should N be set or not?

  // a3               : OUTI             s*-h-vp1c

  // Unknown: a4
  // Unknown: a5
  // Unknown: a6
  // Unknown: a7
  // Reference: zaks:82 page 348

  // a8               : LDD              sz-0-v*0c

  // Reference: zaks:82 page 227

  // a9               : CPD              **-*-v*1c

  // Reference: zaks:82 page 274

  // aa               : IND              **-h-v*1c

  // Reference: zaks:82 page 369

  // ab               : OUTD             s*-h-vp1c

  // Unknown: ac
  // Unknown: ad
  // Unknown: ae
  // Unknown: af
  // Reference: zaks:82 page 354
  // Reference: The book indicates to clear the PV flag, but http://www.z80.info/z80sflag.htm suggests otherwise

  // b0               : LDIR             sz-0-*p0c

  // Reference: zaks:82 page 233

  // b1               : CPIR             **-*-*p1c

  // Reference: zaks:82 page 280

  // b2               : INIR             s1-h-v*1c

  // Reference: zaks:82 page 364

  // b3               : OTIR             s1-h-v*1c

  // Unknown: b4
  // Unknown: b5
  // Unknown: b6
  // Unknown: b7
  // Reference: zaks:82 page 350

  // b8               : LDDR             sz-0-v*0c

  // Reference: zaks:82 page 229

  // b9               : CPDR             **-*-v*1c

  // Reference: zaks:82 page 276

  // ba               : INDR             sz-h-v*1c

  // Reference: zaks:82 page 362

  // bb               : OTDR             s1-h-vp1c

  // Unknown: bc
  // Unknown: bd
  // Unknown: be
  // Unknown: bf
  // Unknown: c0
  // Unknown: c1
  // Unknown: c2
  // Unknown: c3
  // Unknown: c4
  // Unknown: c5
  // Unknown: c6
  // Unknown: c7
  // Unknown: c8
  // Unknown: c9
  // Unknown: ca
  // Unknown: cb
  // Unknown: cc
  // Unknown: cd
  // Unknown: ce
  // Unknown: cf
  // Unknown: d0
  // Unknown: d1
  // Unknown: d2
  // Unknown: d3
  // Unknown: d4
  // Unknown: d5
  // Unknown: d6
  // Unknown: d7
  // Unknown: d8
  // Unknown: d9
  // Unknown: da
  // Unknown: db
  // Unknown: dc
  // Unknown: dd
  // Unknown: de
  // Unknown: df
  // Unknown: e0
  // Unknown: e1
  // Unknown: e2
  // Unknown: e3
  // Unknown: e4
  // Unknown: e5
  // Unknown: e6
  // Unknown: e7
  // Unknown: e8
  // Unknown: e9
  // Unknown: ea
  // Unknown: eb
  // Unknown: ec
  // Unknown: ed
  // Unknown: ee
  // Unknown: ef
  // Unknown: f0
  // Unknown: f1
  // Unknown: f2
  // Unknown: f3
  // Unknown: f4
  // Unknown: f5
  // Unknown: f6
  // Unknown: f7
  // Unknown: f8
  // Unknown: f9
  // Unknown: fa
  // Unknown: fb
  // Unknown: fc
  // Unknown: fd
  // Unknown: fe
  // Unknown: ff
  // Unknown: 00
  // Unknown: 01
  // Unknown: 02
  // Unknown: 03
  // Unknown: 04
  // Unknown: 05
  // Unknown: 06
  // Unknown: 07
  // Unknown: 08
  // Reference: zaks:82 page 207

  // 09               : ADD IY,bc        sz-*-vp0*

  // Unknown: 0a
  // Unknown: 0b
  // Unknown: 0c
  // Unknown: 0d
  // Unknown: 0e
  // Unknown: 0f
  // Unknown: 10
  // Unknown: 11
  // Unknown: 12
  // Unknown: 13
  // Unknown: 14
  // Unknown: 15
  // Unknown: 16
  // Unknown: 17
  // Unknown: 18
  // Reference: zaks:82 page 207

  // 19               : ADD IY,de        sz-*-vp0*

  // Unknown: 1a
  // Unknown: 1b
  // Unknown: 1c
  // Unknown: 1d
  // Unknown: 1e
  // Unknown: 1f
  // Unknown: 20
  // Reference: zaks:82 page 340

  // 21 nnnn          : LD IY,nnnn

  // Reference: zaks:82 page 327

  // 22 nnnn          : LD (nnnn),IY

  // Reference: zaks:82 page 273

  // 23               : INC IY

  // Unknown: 24
  // Unknown: 25
  // Unknown: 26
  // Unknown: 27
  // Unknown: 28
  // Reference: zaks:82 page 207

  // 29               : ADD IY,iy        sz-*-vp0*

  // Reference: zaks:82 page 342

  // 2a nnnn          : LD IY,(nnnn)

  // Reference: zaks:82 page 243

  // 2b               : DEC IY

  // Unknown: 2c
  // Unknown: 2d
  // Unknown: 2e
  // Unknown: 2f
  // Unknown: 30
  // Unknown: 31
  // Unknown: 32
  // Unknown: 33
  // Reference: zaks:82 page 270

  // 34 nnnn          : INC (IY+nn)      **-*-*p0c

  // Reference: zaks:82 page 238

  // 35 nnnn          : DEC (IY+nn)      **-*-*p1c

  // Reference: zaks:82 page 311

  // 36 ddnn          : LD (IY+dd),nn

  // Unknown: 37
  // Unknown: 38
  // Reference: zaks:82 page 207

  // 39               : ADD IY,sp        sz-*-vp0*

  // Unknown: 3a
  // Unknown: 3b
  // Unknown: 3c
  // Unknown: 3d
  // Unknown: 3e
  // Unknown: 3f
  // Unknown: 40
  // Unknown: 41
  // Unknown: 42
  // Unknown: 43
  // Unknown: 44
  // Unknown: 45
  // Reference: zaks:82 page 307

  // 46 nn            : LD b,(IY+nn)

  // Unknown: 47
  // Unknown: 48
  // Unknown: 49
  // Unknown: 4a
  // Unknown: 4b
  // Unknown: 4c
  // Unknown: 4d
  // Reference: zaks:82 page 307

  // 4e nn            : LD c,(IY+nn)

  // Unknown: 4f
  // Unknown: 50
  // Unknown: 51
  // Unknown: 52
  // Unknown: 53
  // Unknown: 54
  // Unknown: 55
  // Reference: zaks:82 page 307

  // 56 nn            : LD d,(IY+nn)

  // Unknown: 57
  // Unknown: 58
  // Unknown: 59
  // Unknown: 5a
  // Unknown: 5b
  // Unknown: 5c
  // Unknown: 5d
  // Reference: zaks:82 page 307

  // 5e nn            : LD e,(IY+nn)

  // Unknown: 5f
  // Unknown: 60
  // Unknown: 61
  // Unknown: 62
  // Unknown: 63
  // Unknown: 64
  // Unknown: 65
  // Reference: zaks:82 page 307

  // 66 nn            : LD h,(IY+nn)

  // Unknown: 67
  // Unknown: 68
  // Unknown: 69
  // Unknown: 6a
  // Unknown: 6b
  // Unknown: 6c
  // Unknown: 6d
  // Reference: zaks:82 page 307

  // 6e nn            : LD l,(IY+nn)

  // Unknown: 6f
  // Reference: zaks:82 page 315

  // 70 nn            : LD (IY+nn),b

  // Reference: zaks:82 page 315

  // 71 nn            : LD (IY+nn),c

  // Reference: zaks:82 page 315

  // 72 nn            : LD (IY+nn),d

  // Reference: zaks:82 page 315

  // 73 nn            : LD (IY+nn),e

  // Reference: zaks:82 page 315

  // 74 nn            : LD (IY+nn),h

  // Reference: zaks:82 page 315

  // 75 nn            : LD (IY+nn),l

  // Reference: zaks:82 page 307
  // Reference: zaks:82 page 315
  // Unknown: 76
  // Reference: zaks:82 page 315

  // 77 nn            : LD (IY+nn),a

  // Unknown: 78
  // Unknown: 79
  // Unknown: 7a
  // Unknown: 7b
  // Unknown: 7c
  // Unknown: 7d
  // Reference: zaks:82 page 307

  // 7e nn            : LD a,(IY+nn)

  // Unknown: 7f
  // Unknown: 80
  // Unknown: 81
  // Unknown: 82
  // Unknown: 83
  // Unknown: 84
  // Unknown: 85
  // Reference: zaks:82 page 198

  // 86 nn            : ADD A,(IY+nn)    **-*-*p0*

  // Unknown: 87
  // Unknown: 88
  // Unknown: 89
  // Unknown: 8a
  // Unknown: 8b
  // Unknown: 8c
  // Unknown: 8d
  // Reference: zaks:82 page 190

  // 8e nn            : ADC A,(IY+nn)    **-*-*p0c

  // Unknown: 8f
  // Unknown: 90
  // Unknown: 91
  // Unknown: 92
  // Unknown: 93
  // Unknown: 94
  // Unknown: 95
  // Reference: zaks:82 page 434

  // 96 nn            : SUB (IY+nn)      **-*-*p1*

  // Unknown: 97
  // Unknown: 98
  // Unknown: 99
  // Unknown: 9a
  // Unknown: 9b
  // Unknown: 9c
  // Unknown: 9d
  // Reference: zaks:82 page 420

  // 9e nn            : SBC A,(IY+nn)    **-*-*p1*

  // Unknown: 9f
  // Unknown: a0
  // Unknown: a1
  // Unknown: a2
  // Unknown: a3
  // Unknown: a4
  // Unknown: a5
  // Reference: zaks:82 page 209

  // a6 nn            : AND (IY+nn)      **-1-v*00

  // Unknown: a7
  // Unknown: a8
  // Unknown: a9
  // Unknown: aa
  // Unknown: ab
  // Unknown: ac
  // Unknown: ad
  // Reference: zaks:82 page 436

  // ae nn            : XOR A,(IY+nn)    **-0-v*00

  // Unknown: af
  // Unknown: b0
  // Unknown: b1
  // Unknown: b2
  // Unknown: b3
  // Unknown: b4
  // Unknown: b5
  // Reference: zaks:82 page 360

  // b6 nn            : OR (IY+nn)       **-h-v*00

  // Unknown: b7
  // Unknown: b8
  // Unknown: b9
  // Unknown: ba
  // Unknown: bb
  // Unknown: bc
  // Unknown: bd
  // Reference: zaks:82 page 225

  // be nn            : CP A,(IY+nn)     **-*-*p1*

  // Unknown: bf
  // Unknown: c0
  // Unknown: c1
  // Unknown: c2
  // Unknown: c3
  // Unknown: c4
  // Unknown: c5
  // Unknown: c6
  // Unknown: c7
  // Unknown: c8
  // Unknown: c9
  // Unknown: ca
  // Reference: zaks:82 page 406
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x6) {
    // cb nnnn          : RLC (IY+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 413
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0xe) {
    // cb nnnn          : RRC (IY+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 396
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x16) {
    // cb nnnn          : RL (IY+nn)       **-0-v*0*
  }
  // Reference: zaks:82 page 410
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x1e) {
    // cb nnnn          : RR (IY+nn)       **-0-v*0*
  }
  // Reference: zaks:82 page 428
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x26) {
    // cb nnnn          : SLA (IY+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 430
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x2e) {
    // cb nnnn          : SRA (IY+nn)      **-0-v*0*
  }
  // Reference:  page 
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x36) {
    // cb nnnn          : SLL (IY+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 432
  if ((read8(pc.getUnsigned() + (2)) & 0xff) == 0x3e) {
    // cb nnnn          : SRL (IY+nn)      **-0-v*0*
  }
  // Reference: zaks:82 page 213
  if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x46) {
    // cb nnnn          : BIT 0,(IY+nn)    **-1-v*0c
  }
  // Reference: zaks:82 page 385
  if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0x86) {
    // cb nnnn          : RES 0,(IY+nn)
  }
  // Reference: zaks:82 page 425
  if ((read8(pc.getUnsigned() + (2)) & 0xc7) == 0xc6) {
    // cb nnnn          : SET 0,(IY+nn)
  }
  // Unknown: cc
  // Unknown: cd
  // Unknown: ce
  // Unknown: cf
  // Unknown: d0
  // Unknown: d1
  // Unknown: d2
  // Unknown: d3
  // Unknown: d4
  // Unknown: d5
  // Unknown: d6
  // Unknown: d7
  // Unknown: d8
  // Unknown: d9
  // Unknown: da
  // Unknown: db
  // Unknown: dc
  // Unknown: dd
  // Unknown: de
  // Unknown: df
  // Unknown: e0
  // Reference: zaks:82 page 377

  // e1               : POP IY

  // Unknown: e2
  // Reference: zaks:82 page 254

  // e3               : EX (SP),IY

  // Unknown: e4
  // Reference: zaks:82 page 383

  // e5               : PUSH IY

  // Unknown: e6
  // Unknown: e7
  // Unknown: e8
  // Reference: zaks:82 page 286

  // e9               : JP (IY)

  // Unknown: ea
  // Unknown: eb
  // Unknown: ec
  // Unknown: ed
  // Unknown: ee
  // Unknown: ef
  // Unknown: f0
  // Unknown: f1
  // Unknown: f2
  // Unknown: f3
  // Unknown: f4
  // Unknown: f5
  // Unknown: f6
  // Unknown: f7
  // Unknown: f8
  // Reference: zaks:82 page 347

  // f9               : LD SP,IY

  // Unknown: fa
  // Unknown: fb
  // Unknown: fc
  // Unknown: fd
  // Unknown: fe
  // Unknown: ff
});
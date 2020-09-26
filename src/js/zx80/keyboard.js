let zx80_keyboard = (function(options) {
  const keyStates = [];
  // keycode table taken from Zeddy
  const keyCodes = {
    49: {
      row: 3,
      mask: 0x01
    },
    /* 1 */
    50: {
      row: 3,
      mask: 0x02
    },
    /* 2 */
    51: {
      row: 3,
      mask: 0x04
    },
    /* 3 */
    52: {
      row: 3,
      mask: 0x08
    },
    /* 4 */
    53: {
      row: 3,
      mask: 0x10
    },
    /* 5 */
    54: {
      row: 4,
      mask: 0x10
    },
    /* 6 */
    55: {
      row: 4,
      mask: 0x08
    },
    /* 7 */
    56: {
      row: 4,
      mask: 0x04
    },
    /* 8 */
    57: {
      row: 4,
      mask: 0x02
    },
    /* 9 */
    48: {
      row: 4,
      mask: 0x01
    },
    /* 0 */

    81: {
      row: 2,
      mask: 0x01
    },
    /* Q */
    87: {
      row: 2,
      mask: 0x02
    },
    /* W */
    69: {
      row: 2,
      mask: 0x04
    },
    /* E */
    82: {
      row: 2,
      mask: 0x08
    },
    /* R */
    84: {
      row: 2,
      mask: 0x10
    },
    /* T */
    89: {
      row: 5,
      mask: 0x10
    },
    /* Y */
    85: {
      row: 5,
      mask: 0x08
    },
    /* U */
    73: {
      row: 5,
      mask: 0x04
    },
    /* I */
    79: {
      row: 5,
      mask: 0x02
    },
    /* O */
    80: {
      row: 5,
      mask: 0x01
    },
    /* P */

    65: {
      row: 1,
      mask: 0x01
    },
    /* A */
    83: {
      row: 1,
      mask: 0x02
    },
    /* S */
    68: {
      row: 1,
      mask: 0x04
    },
    /* D */
    70: {
      row: 1,
      mask: 0x08
    },
    /* F */
    71: {
      row: 1,
      mask: 0x10
    },
    /* G */
    72: {
      row: 6,
      mask: 0x10
    },
    /* H */
    74: {
      row: 6,
      mask: 0x08
    },
    /* J */
    75: {
      row: 6,
      mask: 0x04
    },
    /* K */
    76: {
      row: 6,
      mask: 0x02
    },
    /* L */
    13: {
      row: 6,
      mask: 0x01
    },
    /* enter */

    16: {
      row: 0,
      mask: 0x01
    },
    /* caps */
    192: {
      row: 0,
      mask: 0x01
    },
    /* backtick as caps - because firefox screws up a load of key codes when pressing shift */
    90: {
      row: 0,
      mask: 0x02
    },
    /* Z */
    88: {
      row: 0,
      mask: 0x04
    },
    /* X */
    67: {
      row: 0,
      mask: 0x08
    },
    /* C */
    86: {
      row: 0,
      mask: 0x10
    },
    /* V */
    66: {
      row: 7,
      mask: 0x10
    },
    /* B */
    78: {
      row: 7,
      mask: 0x08
    },
    /* N */
    77: {
      row: 7,
      mask: 0x04
    },
    /* M */
    190: {
      row: 7,
      mask: 0x02
    },
    /* . */
    32: {
      row: 7,
      mask: 0x01
    },
    /* space */

    37: {
      row: 3,
      mask: 0x10
    },
    /* left as 5 */
    40: {
      row: 4,
      mask: 0x10
    },
    /* down as 6 */
    38: {
      row: 4,
      mask: 0x08
    },
    /* up as 7 */
    39: {
      row: 4,
      mask: 0x04
    },
    /* right as 8 */

    8: {
      row: 8,
      mask: 0x01
    },
    /* rubout */
    46: {
      row: 8,
      mask: 0x01
    },
    /* rubout */
    188: {
      row: 8,
      mask: 0x02
    },
    /* , */
    59: {
      row: 8,
      mask: 0x03
    },
    /* ; */
    173: {
      row: 8,
      mask: 0x04
    },
    /* - */
    61: {
      row: 8,
      mask: 0x05
    },
    /* = */
    191: {
      row: 8,
      mask: 0x06
    } /* / */
  };


  (function ctor() {
    for (let row = 0; row < 9; row++) {
      keyStates[row] = 0xff;
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
  })();

  function getState(row) {
    return keyStates[row];
  }

  function keyDown(evt) {
    const keyCode = keyCodes[evt.keyCode];
    if (keyCode == null) {
      return;
    }

    if (keyCode.row == 8) {
      switch (keyCode.mask) {
        case 0x01:
          keyStates[0] &= ~0x01;
          keyStates[4] &= ~0x01;
          break;
        case 0x02:
          keyStates[0] &= ~0x01;
          keyStates[7] &= ~0x02;
          break;
        case 0x03:
          keyStates[0] &= ~0x01;
          keyStates[0] &= ~0x04;
          break;
        case 0x04:
          keyStates[0] &= ~0x01;
          keyStates[6] &= ~0x08;
          break;
        case 0x05:
          keyStates[0] &= ~0x01;
          keyStates[6] &= ~0x02;
          break;
        case 0x06:
          keyStates[0] &= ~0x01;
          keyStates[0] &= ~0x10;
          break;
        default:
          ;
      }
    } else {
      keyStates[keyCode.row] &= ~(keyCode.mask);
    }
  }

  function keyUp(evt) {
    const keyCode = keyCodes[evt.keyCode];
    if (keyCode == null) {
      return;
    }

    if (keyCode.row == 8) {
      switch (keyCode.mask) {
        case 0x01:
          keyStates[0] |= 0x01;
          keyStates[4] |= 0x01;
          break;
        case 0x02:
          keyStates[0] |= 0x01;
          keyStates[7] |= 0x02;
          break;
        case 0x03:
          keyStates[0] |= 0x01;
          keyStates[0] |= 0x04;
          break;
        case 0x04:
          keyStates[0] |= 0x01;
          keyStates[6] |= 0x08;
          break;
        case 0x05:
          keyStates[0] |= 0x01;
          keyStates[6] |= 0x02;
          break;
        case 0x06:
          keyStates[0] |= 0x01;
          keyStates[0] |= 0x10;
          break;
        default:
          ;
      }
    } else {
      keyStates[keyCode.row] |= keyCode.mask;
    }
  }

  return {
    getState,
  }
})();
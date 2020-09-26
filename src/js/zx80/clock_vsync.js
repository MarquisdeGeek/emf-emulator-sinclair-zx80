const zx80_clock_vsync = (function(options, machine) {
  let cycles = 50;
  // Clock device : 
  // vsync
  let intervalvsync = setInterval(function() {
    machine.bus.pulseLow('int')
    machine.bus.display.render()
  }, 20); // i.e. 50 cycles

  function setRate(hz) {
    cycles = hz;
  }

  function getFrequency() {
    return cycles;
  }
  return {
    setRate,
    getFrequency,
  };
});
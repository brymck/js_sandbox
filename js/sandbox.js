var Sandbox = (function() {
  var KeyCodes = {
    R: 82
  };
  var form = document.getElementById("sandbox_form");
  var code = document.getElementById("code");
  var iter = document.getElementById("iter");
  var timer = document.getElementById("timer");
  var keycode = document.getElementById("keycode");
  var error = document.getElementById("error");

  function addListeners() {
    form.onsubmit = Sandbox.run;
    form.onkeydown = keyHandler;
  }

  function keyHandler(e) {
    if (e.which === KeyCodes.R) {
      if (e.ctrlKey && e.shiftKey) {
        Sandbox.run();
        e.preventDefault();
      }
    }
    keycode.value = e.which;
  }

  return {
    init: function() {
      addListeners();
    },

    run: function() {
      try {
        var count = parseInt(iter.value, 10),
            codeText = code.value,
            start = new Date(),
            end;

        for (var i = 0; i < count; i++) {
          eval(codeText);
        }
        end = new Date();
        error.value = "";
        timer.value = end - start + " ms";
        return false;
      } catch(e) {
        error.value = e.message;
      }
    }
  }
})();

Sandbox.init();

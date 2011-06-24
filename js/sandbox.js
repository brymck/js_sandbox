var Sandbox = (function() {
  var KeyCodes = {
    D: 68,
    R: 82,
    S: 83
  };
  var form = document.getElementById("sandbox_form");
  var code = document.getElementById("code");
  var iter = document.getElementById("iter");
  var timer = document.getElementById("timer");
  var keycode = document.getElementById("keycode");
  var error = document.getElementById("error");
  var saved = document.getElementById("saved");
  var saveBtn = document.getElementById("save_btn");
  var delBtn = document.getElementById("del_btn");

  function addListeners() {
    form.onsubmit = Sandbox.run;
    form.onkeydown = keyHandler;
    saved.onchange = loadSave;
    saveBtn = Sandbox.save;
    delBtn = Sandbox.remove;
  }

  function keyHandler(e) {
    if (e.ctrlKey && e.shiftKey) {
      switch (e.which) {
        case KeyCodes.D:
          Sandbox.remove();
          e.preventDefault();
          break;
        case KeyCodes.R:
          Sandbox.run();
          e.preventDefault();
          break;
        case KeyCodes.S:
          e.preventDefault();
          Sandbox.save();
          break;
        default:
          break;
      }
    }
    keycode.value = e.which;
  }

  function loadSave(e) {
    Sandbox.load(e.target.value);
  }

  function listSaves(loaded) {
    var keys = [];
    if (!("" in localStorage)) {
      localStorage[""] = "";
    }

    // Clear existing options
    while (saved.firstChild) {
      saved.removeChild(saved.firstChild);
    }

    // Alphabetize keys in local storage
    for (var key in localStorage) {
      keys.push(key);
    }
    keys.sort();

    for (var i = 0; i < keys.length; i++) {
      var option = document.createElement("option"),
          text = document.createTextNode(keys[i]);
      option.selected = (loaded === keys[i]);
      option.appendChild(text);
      saved.appendChild(option);
    }
  }

  return {
    init: function() {
      listSaves();
      addListeners();
    },

    load: function(name) {
      code.value = (name === "" ? "" : JSON.parse(localStorage[name]));
    },

    remove: function(name) {
      name = name || saved.value;
      if (confirm("Are you sure you wish to delete '" + name + "'?")) {
        code.value = "";
        delete localStorage[name];
        listSaves();
      }
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
    },

    save: function() {
      var name = prompt("Please enter a name for this code:");
      localStorage[name] = JSON.stringify(code.value);
      listSaves(name);
    }
  }
})();

Sandbox.init();

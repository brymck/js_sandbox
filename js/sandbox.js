/**
 * @preserve js_sandbox v0.5
 * http://www.brymck.com
 *
 * Copyright 2011, Bryan McKelvey
 * Licensed under the MIT License
 * http://www.brymck.com/license
 */

/**
 * A class handling code loading, saving and running in the sandbox
 */
var Sandbox = (function() {
  /**
   * Invalid names for local storage.
   * @type {Array.<string>}
   * @const
   */
  var RESERVED_NAMES = ["", "length"];

  /**
   * Enum for key codes.
   * @enum {number}
   */
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
  var self;

  /**
   * Adds event listeners to the sandbox DOM.
   */
  function addListeners() {
    form.onsubmit = Sandbox.run;
    form.onkeydown = keyHandler;
    saved.onchange = loadSave;
    saveBtn.onclick = Sandbox.save;
    delBtn.onclick = Sandbox.remove;
  }

  /**
   * Checks whether the provided name matches a reserved name for storage.
   * @param {?string} name The name to check.
   * @return {boolean} Whether the name is reserved.
   */
  function matchReservedName(name) {
    for (var i = 0; i < RESERVED_NAMES.length; i++) {
      if (name === RESERVED_NAMES[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Handles key presses.
   * @param {Event} e A key press event.
   */
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

  /**
   * Lists the names of saved code snippets in a dropdown.
   * @param {string=} loaded The name of the option to automatically select
   *   (optional).
   */
  function listSaves(loaded) {
    var keys = [];

    // Always keep a blank
    localStorage[""] = "";

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

  /**
   * Handles an event on a select object by loading the requested code.
   * @param {Event} e An event on a select object.
   */
  function loadSave(e) {
    self.load(e.target.value);
  }

  return {
    /**
     * Initializes the sandbox code by listing saves in the dropdown boxes and
     * adding listeners for button clicks and key presses.
     */
    init: function() {
      self = this;
      listSaves();
      addListeners();
    },

    /**
     * Loads a code snippet based on the provided name.
     * @param {?string} name The name of the code snippet to load.
     */
    load: function(name) {
      code.value = (name === "" ? "" : JSON.parse(localStorage[name]));
    },

    /**
     * Removes a saved code snippet.
     * @param {?string=} name The name of the saved code to remove.
     */
    remove: function(name) {
      if (typeof name !== "string") {
        name = saved.value;
      }
      if (name !== "") {
        if (confirm("Are you sure you wish to delete '" + name + "'?")) {
          code.value = "";
          delete localStorage[name];
          listSaves();
        }
      }
    },

    /**
     * Runs code and returns the time elapsed and any error messages.
     */
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

    /**
     * Saves code to local storage.
     */
    save: function() {
      var name;
      do {
        name = prompt("Please enter a name for this code:");
      } while (matchReservedName(name));
      if (name !== null) {
        localStorage[name] = JSON.stringify(code.value);
        listSaves(name);
      }
    }
  }
})();

Sandbox.init();

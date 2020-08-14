"use strict";
const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Main = imports.ui.main;
const Keyboard = imports.ui.keyboard;
const EdgeDragAction = imports.ui.edgeDragAction;
const Shell = imports.gi.Shell;
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const Workspace = imports.ui.workspace;
const Tweener = imports.ui.tweener;
const Overview = imports.ui.overview;
const Layout = imports.ui.layout;
const ExtensionUtils = imports.misc.extensionUtils;

var defaultKeyboardDelay;
var Backup_DefaultKeysForRow;
var Backup_contructor;
var Backup_keyvalPress;
var Backup_keyvalRelease;
var Backup_relayout;
let settings = ExtensionUtils.getSettings(
  "org.gnome.shell.extensions.improvedosk"
);

function init() {
  defaultKeyboardDelay = Layout.KEYBOARD_ANIMATION_TIME;
  Backup_DefaultKeysForRow =
    Keyboard.Keyboard.prototype["_getDefaultKeysForRow"];
  Backup_contructor = Keyboard.KeyboardController.prototype["constructor"];
  Backup_keyvalPress = Keyboard.KeyboardController.prototype["keyvalPress"];
  Backup_keyvalRelease = Keyboard.KeyboardController.prototype["keyvalRelease"];
  Backup_relayout = Keyboard.Keyboard.prototype["_relayout"];
}

function _relayout() {
  let monitor = Main.layoutManager.keyboardMonitor;

  if (!monitor) return;

  this.width = monitor.width;

  if (monitor.width > monitor.height) {
    this.height = (monitor.height * settings.get_int("landscape-height")) / 100;
  } else {
    this.height = (monitor.height * settings.get_int("portrait-height")) / 100;
  }
}

function enable() {
  Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);
  var KeyboardIsSetup = true;
  try {
    Main.keyboard._destroyKeyboard();
  } catch (e) {
    if (e instanceof TypeError) {
      // In case the keyboard is currently disabled in accessability settings, attempting to _destroyKeyboard() yields a TypeError ("TypeError: this.actor is null")
      // This doesn't affect functionality, so proceed as usual. The only difference is that we do not automatically _setupKeyboard at the end of this enable() (let the user enable the keyboard in accessability settings)
      KeyboardIsSetup = false;
    } else {
      // Something different happened
      throw e;
    }
  }
  Keyboard.Keyboard.prototype["_relayout"] = _relayout;
  Keyboard.Keyboard.prototype["_getDefaultKeysForRow"] = function (
    row,
    numRows,
    level
  ) {
    let defaultKeysPreMod = [
      [
        [{ label: "Esc", width: 1, keyval: Clutter.KEY_Escape }],
        [{ label: "↹", width: 1.5, keyval: Clutter.KEY_Tab }],
        [
          {
            label: "⇑",
            width: 1.5,
            level: 1,
            extraClassName: "shift-key-lowercase",
          },
        ],
        [
          {
            label: "Ctrl",
            width: 1,
            keyval: Clutter.KEY_Control_L,
            extraClassName: "control-key",
          },
          {
            label: "◆",
            width: 1,
            keyval: Clutter.KEY_Super_L,
            extraClassName: "super-key",
          },
          {
            label: "Alt",
            width: 1,
            keyval: Clutter.KEY_Alt_L,
            extraClassName: "alt-key",
          },
        ],
      ],
      [
        [{ label: "Esc", width: 1, keyval: Clutter.KEY_Escape }],
        [{ label: "↹", width: 1.5, keyval: Clutter.KEY_Tab }],
        [{ width: 1.5, level: 0, extraClassName: "shift-key-uppercase" }],
        [
          {
            label: "Ctrl",
            width: 1,
            keyval: Clutter.KEY_Control_L,
            extraClassName: "control-key",
          },
          {
            label: "◆",
            width: 1,
            keyval: Clutter.KEY_Super_L,
            extraClassName: "super-key",
          },
          {
            label: "Alt",
            width: 1,
            keyval: Clutter.KEY_Alt_L,
            extraClassName: "alt-key",
          },
        ],
      ],
      [
        [{ label: "Esc", width: 1, keyval: Clutter.KEY_Escape }],
        [{ label: "↹", width: 1.5, keyval: Clutter.KEY_Tab }],
        [{ label: "=/<F", width: 1.5, level: 3 }],
        [
          {
            label: "Ctrl",
            width: 1,
            keyval: Clutter.KEY_Control_L,
            extraClassName: "control-key",
          },
          {
            label: "◆",
            width: 1,
            keyval: Clutter.KEY_Super_L,
            extraClassName: "super-key",
          },
          {
            label: "Alt",
            width: 1,
            keyval: Clutter.KEY_Alt_L,
            extraClassName: "alt-key",
          },
        ],
      ],
      [
        [{ label: "Esc", width: 1, keyval: Clutter.KEY_Escape }],
        [{ label: "↹", width: 1.5, keyval: Clutter.KEY_Tab }],
        [{ label: "?123", width: 1.5, level: 2 }],
        [
          {
            label: "Ctrl",
            width: 1,
            keyval: Clutter.KEY_Control_L,
            extraClassName: "control-key",
          },
          {
            label: "◆",
            width: 1,
            keyval: Clutter.KEY_Super_L,
            extraClassName: "super-key",
          },
          {
            label: "Alt",
            width: 1,
            keyval: Clutter.KEY_Alt_L,
            extraClassName: "alt-key",
          },
        ],
      ],
    ];

    let defaultKeysPostMod = [
      [
        [
          { label: "⌫", width: 1.5, keyval: Clutter.KEY_BackSpace },
          { label: "⌦", width: 1, keyval: Clutter.KEY_Delete },
          { label: "⇊", width: 1, action: "hide", extraClassName: "hide-key" },
        ],
        [
          {
            label: "⏎",
            width: 2,
            keyval: Clutter.KEY_Return,
            extraClassName: "enter-key",
          },
          {
            label: "🗺",
            width: 1.5,
            action: "languageMenu",
            extraClassName: "layout-key",
          },
        ],
        [
          {
            label: "⇑",
            width: 3,
            level: 1,
            right: true,
            extraClassName: "shift-key-lowercase",
          },
          { label: "?123", width: 1.5, level: 2 },
        ],
        [
          { label: "←", width: 1, keyval: Clutter.KEY_Left },
          { label: "↑", width: 1, keyval: Clutter.KEY_Up },
          { label: "↓", width: 1, keyval: Clutter.KEY_Down },
          { label: "→", width: 1, keyval: Clutter.KEY_Right },
        ],
      ],
      [
        [
          { label: "⌫", width: 1.5, keyval: Clutter.KEY_BackSpace },
          { label: "⌦", width: 1, keyval: Clutter.KEY_Delete },
          { label: "⇊", width: 1, action: "hide", extraClassName: "hide-key" },
        ],
        [
          { width: 2, keyval: Clutter.KEY_Return, extraClassName: "enter-key" },
          {
            label: "🗺",
            width: 1.5,
            action: "languageMenu",
            extraClassName: "layout-key",
          },
        ],
        [
          {
            width: 3,
            level: 0,
            right: true,
            extraClassName: "shift-key-uppercase",
          },
          { label: "?123", width: 1.5, level: 2 },
        ],
        [
          { label: "←", width: 1, keyval: Clutter.KEY_Left },
          { label: "↑", width: 1, keyval: Clutter.KEY_Up },
          { label: "↓", width: 1, keyval: Clutter.KEY_Down },
          { label: "→", width: 1, keyval: Clutter.KEY_Right },
        ],
      ],
      [
        [
          { label: "⌫", width: 1.5, keyval: Clutter.KEY_BackSpace },
          { label: "⌦", width: 1, keyval: Clutter.KEY_Delete },
          { label: "⇊", width: 1, action: "hide", extraClassName: "hide-key" },
        ],
        [
          {
            label: "⏎",
            width: 2,
            keyval: Clutter.KEY_Return,
          },
          {
            label: "🗺",
            width: 1.5,
            action: "languageMenu",
            extraClassName: "layout-key",
          },
        ],
        [
          { label: "=/<F", width: 3, level: 3, right: true },
          { label: "ABC", width: 1.5, level: 0 },
        ],
        [
          { label: "←", width: 1, keyval: Clutter.KEY_Left },
          { label: "↑", width: 1, keyval: Clutter.KEY_Up },
          { label: "↓", width: 1, keyval: Clutter.KEY_Down },
          { label: "→", width: 1, keyval: Clutter.KEY_Right },
        ],
      ],
      [
        [
          { label: "F1", width: 1, keyval: Clutter.KEY_F1 },
          { label: "F2", width: 1, keyval: Clutter.KEY_F2 },
          { label: "F3", width: 1, keyval: Clutter.KEY_F3 },
          { label: "⌫", width: 1.5, keyval: Clutter.KEY_BackSpace },
          { label: "⌦", width: 1, keyval: Clutter.KEY_Delete },
          { label: "⇊", width: 1, action: "hide", extraClassName: "hide-key" },
        ],
        [
          { label: "F4", width: 1, keyval: Clutter.KEY_F4 },
          { label: "F5", width: 1, keyval: Clutter.KEY_F5 },
          { label: "F6", width: 1, keyval: Clutter.KEY_F6 },
          {
            label: "⏎",
            width: 2,
            keyval: Clutter.KEY_Return,
            extraClassName: "enter-key",
          },
          {
            label: "🗺",
            width: 1.5,
            action: "languageMenu",
            extraClassName: "layout-key",
          },
        ],
        [
          { label: "F7", width: 1, keyval: Clutter.KEY_F7 },
          { label: "F8", width: 1, keyval: Clutter.KEY_F8 },
          { label: "F9", width: 1, keyval: Clutter.KEY_F9 },
          { label: "?123", width: 3, level: 2, right: true },
          { label: "ABC", width: 1.5, level: 0 },
        ],
        [
          { label: "F10", width: 1, keyval: Clutter.KEY_F10 },
          { label: "F11", width: 1, keyval: Clutter.KEY_F11 },
          { label: "F12", width: 1, keyval: Clutter.KEY_F12 },
          { label: "←", width: 1, keyval: Clutter.KEY_Left },
          { label: "↑", width: 1, keyval: Clutter.KEY_Up },
          { label: "↓", width: 1, keyval: Clutter.KEY_Down },
          { label: "→", width: 1, keyval: Clutter.KEY_Right },
        ],
      ],
    ];

    /* The first 2 rows in defaultKeysPre/Post belong together with
     * the first 2 rows on each keymap. On keymaps that have more than
     * 4 rows, the last 2 default key rows must be respectively
     * assigned to the 2 last keymap ones.
     */
    if (row < 2) {
      return [defaultKeysPreMod[level][row], defaultKeysPostMod[level][row]];
    } else if (row >= numRows - 2) {
      let defaultRow = row - (numRows - 2) + 2;
      return [
        defaultKeysPreMod[level][defaultRow],
        defaultKeysPostMod[level][defaultRow],
      ];
    } else {
      return [null, null];
    }
  };

  Keyboard.KeyboardController.prototype["constructor"] = function () {
    let deviceManager = Clutter.DeviceManager.get_default();
    this._virtualDevice = deviceManager.create_virtual_device(
      Clutter.InputDeviceType.KEYBOARD_DEVICE
    );

    this._inputSourceManager = InputSourceManager.getInputSourceManager();
    this._sourceChangedId = this._inputSourceManager.connect(
      "current-source-changed",
      this._onSourceChanged.bind(this)
    );
    this._sourcesModifiedId = this._inputSourceManager.connect(
      "sources-changed",
      this._onSourcesModified.bind(this)
    );
    this._currentSource = this._inputSourceManager.currentSource;

    this._controlActive = false;
    this._superActive = false;
    this._altActive = false;

    Main.inputMethod.connect(
      "notify::content-purpose",
      this._onContentPurposeHintsChanged.bind(this)
    );
    Main.inputMethod.connect(
      "notify::content-hints",
      this._onContentPurposeHintsChanged.bind(this)
    );
    Main.inputMethod.connect("input-panel-state", (o, state) => {
      this.emit("panel-state", state);
    });
  };

  Keyboard.KeyboardController.prototype["keyvalPress"] = function (keyval) {
    if (keyval == Clutter.KEY_Control_L) {
      this._controlActive = !this._controlActive; // This allows to revert an accidental tap on Ctrl by tapping on it again
    }
    if (keyval == Clutter.KEY_Super_L) {
      this._superActive = !this._superActive;
    }
    if (keyval == Clutter.KEY_Alt_L) {
      this._altActive = !this._altActive;
    }

    if (this._controlActive) {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Control_L,
        Clutter.KeyState.PRESSED
      );
      Main.layoutManager.keyboardBox.add_style_class_name(
        "control-key-latched"
      );
    } else {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Control_L,
        Clutter.KeyState.RELEASED
      );
      Main.layoutManager.keyboardBox.remove_style_class_name(
        "control-key-latched"
      );
    }
    if (this._superActive) {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Super_L,
        Clutter.KeyState.PRESSED
      );
      Main.layoutManager.keyboardBox.add_style_class_name("super-key-latched");
    } else {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Super_L,
        Clutter.KeyState.RELEASED
      );
      Main.layoutManager.keyboardBox.remove_style_class_name(
        "super-key-latched"
      );
    }
    if (this._altActive) {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Alt_L,
        Clutter.KeyState.PRESSED
      );
      Main.layoutManager.keyboardBox.add_style_class_name("alt-key-latched");
    } else {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Alt_L,
        Clutter.KeyState.RELEASED
      );
      Main.layoutManager.keyboardBox.remove_style_class_name("alt-key-latched");
    }
    this._virtualDevice.notify_keyval(
      Clutter.get_current_event_time(),
      keyval,
      Clutter.KeyState.PRESSED
    );
  };

  Keyboard.KeyboardController.prototype["keyvalRelease"] = function (keyval) {
    if (
      keyval == Clutter.KEY_Control_L ||
      keyval == Clutter.KEY_Alt_L ||
      keyval == Clutter.KEY_Super_L
    ) {
      return;
    }

    this._virtualDevice.notify_keyval(
      Clutter.get_current_event_time(),
      keyval,
      Clutter.KeyState.RELEASED
    );

    if (this._controlActive) {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Control_L,
        Clutter.KeyState.RELEASED
      );
      this._controlActive = false;
      Main.layoutManager.keyboardBox.remove_style_class_name(
        "control-key-latched"
      );
    }
    if (this._superActive) {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Super_L,
        Clutter.KeyState.RELEASED
      );
      this._superActive = false;
      Main.layoutManager.keyboardBox.remove_style_class_name(
        "super-key-latched"
      );
    }
    if (this._altActive) {
      this._virtualDevice.notify_keyval(
        Clutter.get_current_event_time(),
        Clutter.KEY_Alt_L,
        Clutter.KeyState.RELEASED
      );
      this._altActive = false;
      Main.layoutManager.keyboardBox.remove_style_class_name("alt-key-latched");
    }
  };

  Layout.KEYBOARD_ANIMATION_TIME = 0;
  if (KeyboardIsSetup) {
    Main.keyboard._setupKeyboard();
  }

  Main.layoutManager.addTopChrome(Main.layoutManager.keyboardBox, {
    affectsStruts: settings.get_boolean("resize-desktop"),
    trackFullscreen: false,
  });
}

function disable() {
  Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);

  var KeyboardIsSetup = true;
  try {
    Main.keyboard._destroyKeyboard();
  } catch (e) {
    if (e instanceof TypeError) {
      // In case the keyboard is currently disabled in accessability settings, attempting to _destroyKeyboard() yields a TypeError ("TypeError: this.actor is null")
      // This doesn't affect functionality, so proceed as usual. The only difference is that we do not automatically _setupKeyboard at the end of this enable() (let the user enable the keyboard in accessability settings)
      KeyboardIsSetup = false;
    } else {
      // Something different happened
      throw e;
    }
  }

  Keyboard.Keyboard.prototype[
    "_getDefaultKeysForRow"
  ] = Backup_DefaultKeysForRow;
  Keyboard.KeyboardController.prototype["constructor"] = Backup_contructor;
  Keyboard.KeyboardController.prototype["keyvalPress"] = Backup_keyvalPress;
  Keyboard.KeyboardController.prototype["keyvalRelease"] = Backup_keyvalRelease;
  Keyboard.Keyboard.prototype["_relayout"] = Backup_relayout;
  Layout.KEYBOARD_ANIMATION_TIME = defaultKeyboardDelay;
  if (KeyboardIsSetup) {
    Main.keyboard._setupKeyboard();
  }
  Main.layoutManager.addTopChrome(Main.layoutManager.keyboardBox);
}

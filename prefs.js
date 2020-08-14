"use strict";

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {}

function buildPrefsWidget() {
  let gschema = Gio.SettingsSchemaSource.new_from_directory(
    Me.dir.get_child("schemas").get_path(),
    Gio.SettingsSchemaSource.get_default(),
    false
  );

  this.settings = new Gio.Settings({
    settings_schema: gschema.lookup(
      "org.gnome.shell.extensions.improvedosk",
      true
    ),
  });

  let prefsWidget = new Gtk.Grid({
    margin: 24,
    column_spacing: 24,
    row_spacing: 12,
    visible: true,
  });

  let labelPortraitHeight = new Gtk.Label({
    label: "Portrait Height in Percent:",
    halign: Gtk.Align.START,
    visible: true,
  });
  prefsWidget.attach(labelPortraitHeight, 0, 0, 1, 1);

  let inputPortraitHeight = new Gtk.SpinButton();
  inputPortraitHeight.set_range(0, 100);
  inputPortraitHeight.set_sensitive(true);
  inputPortraitHeight.set_increments(1, 10);
  prefsWidget.attach(inputPortraitHeight, 1, 0, 1, 1);
  inputPortraitHeight.set_value(settings.get_int("portrait-height"));
  inputPortraitHeight.connect("value-changed", (widget) => {
    settings.set_int("portrait-height", widget.get_value_as_int());
  });
  settings.connect("changed::portrait-height", () => {
    inputPortraitHeight.set_value(settings.get_int("portrait-height"));
  });

  let labelLandscapeHeight = new Gtk.Label({
    label: "Landscape Height in Percent:",
    halign: Gtk.Align.START,
    visible: true,
  });
  prefsWidget.attach(labelLandscapeHeight, 0, 1, 1, 1);

  let inputLandscapeHeight = new Gtk.SpinButton();
  inputLandscapeHeight.set_range(0, 100);
  inputLandscapeHeight.set_sensitive(true);
  inputLandscapeHeight.set_increments(1, 10);
  prefsWidget.attach(inputLandscapeHeight, 1, 1, 1, 1);
  inputLandscapeHeight.set_value(settings.get_int("landscape-height"));
  inputLandscapeHeight.connect("value-changed", (widget) => {
    settings.set_int("landscape-height", widget.get_value_as_int());
  });
  settings.connect("changed::landscape-height", () => {
    inputLandscapeHeight.set_value(settings.get_int("landscape-height"));
  });

  let labelResizeDesktop = new Gtk.Label({
    label: "Resize Desktop (Shell restart required ):",
    halign: Gtk.Align.START,
    visible: true,
  });

  let inputResizeDesktop = new Gtk.CheckButton({
    label: "active",
  });
  inputResizeDesktop.set_active(settings.get_boolean("resize-desktop"));
  inputResizeDesktop.connect("toggled", (widget) => {
    settings.set_boolean("resize-desktop", widget.get_active());
  });
  settings.connect("changed::resize-dekstop", () => {
    inputResizeDesktop.set_active(settings.get_boolean("resize-desktop"));
  });
  prefsWidget.attach(inputResizeDesktop, 1, 2, 1, 1);

  prefsWidget.attach(labelResizeDesktop, 0, 2, 1, 1);
  prefsWidget.show_all();
  return prefsWidget;
}

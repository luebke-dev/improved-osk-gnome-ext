'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function buildPrefsWidget() {

    let gschema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    this.settings = new Gio.Settings({
        settings_schema: gschema.lookup('org.gnome.shell.extensions.improvedosk', true)
    });

    let prefsWidget = new Gtk.Grid({
        margin: 24,
        column_spacing: 24,
        row_spacing: 12,
        visible: true
    });

    let labelPortraitHeight = new Gtk.Label({
        label: 'Portrait Height in Percent:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelPortraitHeight, 0, 0, 1, 1);

    let inputPortraitHeight = new Gtk.SpinButton()
    inputPortraitHeight.set_range(0, 100)
    inputPortraitHeight.set_sensitive(true)
    inputPortraitHeight.set_increments(1, 10)
    prefsWidget.attach(inputPortraitHeight, 1, 0, 1, 1)
    inputPortraitHeight.set_value(settings.get_int('portrait-height'))
    inputPortraitHeight.connect('value-changed', widget => {
        settings.set_int('portrait-height', widget.get_value_as_int())
    })
    settings.connect('changed::portrait-height', () => {
        inputPortraitHeight.set_value(settings.get_int('portrait-height'))
    })


    let labelLandscapeHeight = new Gtk.Label({
        label: 'Landscape Height in Percent:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelLandscapeHeight, 0, 1, 1, 1);
    let inputLandscapeHeight = new Gtk.SpinButton()
    inputLandscapeHeight.set_range(0, 100)
    inputLandscapeHeight.set_sensitive(true)
    inputLandscapeHeight.set_increments(1, 10)
    prefsWidget.attach(inputLandscapeHeight, 1, 1, 1, 1)
    inputLandscapeHeight.set_value(settings.get_int('landscape-height'))
    inputLandscapeHeight.connect('value-changed', widget => {
        settings.set_int('landscape-height', widget.get_value_as_int())
    })
    settings.connect('changed::landscape-height', () => {
        inputLandscapeHeight.set_value(settings.get_int('landscape-height'))
    })
    
    prefsWidget.show_all();
    return prefsWidget;
}
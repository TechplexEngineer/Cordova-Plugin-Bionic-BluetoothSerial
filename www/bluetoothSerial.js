/*global cordova*/

const PLUGIN_NAME = "BluetoothSerial";

module.exports = {

    // Start listening for connections
    listen: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "listen", []);
    },

    // Stop listening for connections
    stopListen: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "stopListen", []);
    },

    // Connect to the provided macAddress
    //
    // https://developer.android.com/reference/android/bluetooth/BluetoothDevice#createRfcommSocketToServiceRecord(java.util.UUID)
    connect: function (macAddress, success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "connect", [macAddress]);
    },

    // Disconnect and free all resources
    disconnect: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "disconnect", []);
    },

    // Returns a list of paired devices
    //
    // eg: [{"name":"DeviceName","address":"AA:BB:CC:DD:EE:FF","id":"AA:BB:CC:DD:EE:FF","class":524}]
    //
    // https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#getBondedDevices()
    // Classes can be found: https://developer.android.com/reference/android/bluetooth/BluetoothClass.Device#PHONE_SMART
    listPaired: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "list", []);
    },

    // Success if Bluetooth is currently enabled and ready for use.
    //
    // https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#isEnabled()
    isEnabled: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "isEnabled", []);
    },

    // Show the user a prompt to turn on bluetooth
    // https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#ACTION_REQUEST_ENABLE
    enable: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "enable", []);
    },

    // Success if bluetooth state is connected
    //
    // getState() == STATE_CONNECTED
    // https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#getState()
    isConnected: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "isConnected", []);
    },

    // The number of bytes of data available to read is passed to the success function
    available: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "available", []);
    },

    // All the data in the buffer is passed to the success function
    read: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "read", []);
    },

    // Reads the data in the buffer up to and including the delimiter and passes to success function
    readUntil: function (delimiter, success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "readUntil", [delimiter]);
    },

    // Writes data to the bluetooth serial port
    // data can be an ArrayBuffer, string, integer array, or Uint8Array
    write: function (data, success, failure) {

        // convert to ArrayBuffer
        if (typeof data === 'string') {
            data = stringToArrayBuffer(data);
        } else if (data instanceof Array) {
            // assuming array of interger
            data = new Uint8Array(data).buffer;
        } else if (data instanceof Uint8Array) {
            data = data.buffer;
        }

        cordova.exec(success, failure, PLUGIN_NAME, "write", [data]);
    },

    // Calls the success callback when new data is available up to and including the delimiter
    subscribe: function (delimiter, success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "subscribe", [delimiter]);
    },

    // Removes data subscription
    unsubscribe: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "unsubscribe", []);
    },

    // Calls the success callback when new data is available with an ArrayBuffer
    subscribeRawData: function (success, failure) {

        successWrapper = function(data) {
            // Windows Phone flattens an array of one into a number which
            // breaks the API. Stuff it back into an ArrayBuffer.
            if (typeof data === 'number') {
                var a = new Uint8Array(1);
                a[0] = data;
                data = a.buffer;
            }
            success(data);
        };
        cordova.exec(successWrapper, failure, PLUGIN_NAME, "subscribeRaw", []);
    },

    // Removes raw data subscription
    unsubscribeRawData: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "unsubscribeRaw", []);
    },

    // Clears the data buffer
    // The data buffer is used for subscribe data. If subscribe is not being used
    // the buffer should be cleared occasionally.
    clear: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "clear", []);
    },

    // Reads the RSSI of the *connected* peripheral
    readRSSI: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "readRSSI", []);
    },

    // Show the bluetooth settings dialog
    //
    // https://developer.android.com/reference/android/provider/Settings#ACTION_BLUETOOTH_SETTINGS
    showBluetoothSettings: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "showBluetoothSettings", []);
    },

    // Start the remote device discovery process.
    // The discovery process usually involves an inquiry scan of about 12 seconds,
    // followed by a page scan of each new device to retrieve its Bluetooth name.
    //
    // https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#startDiscovery()
    startDiscovery: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "startDiscovery", []);
    },

    // Cancel the current device discovery process.
    //
    // Because discovery is a heavyweight procedure for the Bluetooth adapter, this
    // method should always be called before attempting to connect to a remote device.
    // Discovery is not managed by the Activity, but is run as a system service, so
    // an application should always call cancel discovery before connecting even
    // if it did not directly request a discovery, just to be sure.
    //
    // https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#cancelDiscovery()
    cancelDiscovery: function (success, failure) {
        cordova.exec(success, failure, PLUGIN_NAME, "cancelDiscovery", [])
    },

    // Notify will be called for each device discovered with scan
    // only one listener can be registered. If this function is called more than once, the last
    // listener set will be used.
    setDeviceDiscoveredListener: function (notify) {
        if (typeof notify != 'function')
            throw 'BluetoothSerial.setDeviceDiscoveredListener: Callback not a function';

        cordova.exec(notify, null, PLUGIN_NAME, "setDeviceDiscoveredListener", []);
    },

    // Unregister the discovery listener
    clearDeviceDiscoveredListener: function () {
        cordova.exec(null, null, PLUGIN_NAME, "clearDeviceDiscoveredListener", []);
    },

    // Sets the friendly Bluetooth name of the local Bluetooth adapter.
    // This name is visible to remote Bluetooth devices.
    //
    // Valid Bluetooth names are a maximum of 248 bytes using UTF-8 encoding, although many
    // remote devices can only display the first 40 characters, and some may be limited to just 20.
    //
    // https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#setName(java.lang.String)
    setName: function (newName) {
        cordova.exec(null, null, PLUGIN_NAME, "setName", [newName]);
    },

    // Make the device discoverable
    // Max 300 seconds https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#EXTRA_DISCOVERABLE_DURATION
    setDiscoverable: function (discoverableDurationSec) {
        cordova.exec(null, null, PLUGIN_NAME, "setDiscoverable", [discoverableDurationSec]);
    }

};

var stringToArrayBuffer = function(str) {
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret.buffer;
};

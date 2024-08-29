## Install

```ruby
    npm i @aigens/electron-virtual-keyboard
```

## use

* electron
  
```js
const {
    VirtualKeyboard
} = require('@aigens/electron-virtual-keyboard');

vkb = new VirtualKeyboard(mainWindow.webContents)

ipcMain.handle('run-method', async (event, ...arg) => {
    const method = arg?.[0];
    const params = arg?.[1];
    switch (method) {
        case 'virtual-keyboard-keypress':
            return vkb.receiveKeyPress(null, params);
    }

    return `${method}`;
});



preload.js


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aigensElectronAPI', {
    run: async (...arg) => {
        const result = await ipcRenderer.invoke('run-method', ...arg);
        return result;
    }
});


```

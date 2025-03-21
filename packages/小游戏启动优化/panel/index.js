const fs = require('fs');

const PKG_NAME = 'minigame-launch-fast';

const DEFAULT_CONFIG = {
    launchFast: true,
    bgColor: [0, 0, 0, 1],
    imageFile: 'first.jpg',
    imageRatio: 0.5,
    imageMode: 1,
    barRatio: 0.45,
    barOffset: -0.25,
    barBgColor: [100, 111, 118, 1],
    barColor: [61, 197, 222, 1]
}

Editor.Panel.extend({

    style: fs.readFileSync(Editor.url(`packages://${PKG_NAME}/panel/index.css`), 'utf8'),

    template: fs.readFileSync(Editor.url(`packages://${PKG_NAME}/panel/index.html`), 'utf8'),

    ready() {
        const app = new window.Vue({
            el: this.shadowRoot,
            data() {
                const data = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                return data;
            },

            methods: {
                saveConfig() {
                    if (this.isSaving) {
                        return;
                    }
                    this.isSaving = true;
                    const config = {
                        launchFast: this.launchFast,
                        bgColor: this.bgColor,
                        imageFile: this.imageFile,
                        imageRatio: this.imageRatio,
                        imageMode: this.imageMode,
                        barRatio: this.barRatio,
                        barOffset: this.barOffset,
                        barBgColor: this.barBgColor,
                        barColor: this.barColor
                    };
                    Editor.Ipc.sendToMain(`${PKG_NAME}:save-config`, config, () => {
                        this.isSaving = false;
                    });
                },
                readConfig() {
                    Editor.Ipc.sendToMain(`${PKG_NAME}:read-config`, (err, config) => {
                        if (err || !config) {
                            return;
                        }
                        for (const key in config) {
                            this[key] = config[key];
                        }
                    });
                }
            }
        });

        app.readConfig();

    }

});
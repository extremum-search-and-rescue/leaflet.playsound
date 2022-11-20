var L;
(function (L) {
    let PathKind;
    (function (PathKind) {
        PathKind["Absolute"] = "absolute";
        PathKind["RelativeToSite"] = "site-relative";
        PathKind["FilesystemRelative"] = "filesystem-relative";
    })(PathKind = L.PathKind || (L.PathKind = {}));
    class PlaySoundOptions {
        constructor() {
            this.crossOrigin = 'anonymous';
            this.soundsPath = "/sounds/";
            this.soundsPathKind = PathKind.RelativeToSite;
            this.defaultExtension = "mp3";
            this.defaultVolume = 0.3;
        }
    }
    L.PlaySoundOptions = PlaySoundOptions;
    class PlaySoundHandler extends L.Handler {
        initialize(map) {
            map.options.playSound = Object.assign(Object.assign({}, new PlaySoundOptions()), map.options.playSound);
            this._map = map;
            this._self = this;
        }
        addHooks() {
            this._map.on('playsound', this._playsound, this);
        }
        removeHooks() {
            this._map.off('playsound', this._playsound, this);
        }
        _playsound(e) {
            if (this._playing)
                return;
            const options = this._map.options.playSound;
            let audioAddress = null;
            if (options.soundsPathKind == PathKind.FilesystemRelative) {
                audioAddress = `${window.location.href}${options.soundsPath}${e.audioName}.${options.defaultExtension}`;
            }
            else if (options.soundsPathKind == PathKind.RelativeToSite) {
                audioAddress = `${window.location.origin}${options.soundsPath}${e.audioName}${options.defaultExtension}`;
            }
            else {
                audioAddress = e.audioName;
            }
            var audio = new Audio(audioAddress);
            audio.crossOrigin = options.crossOrigin;
            audio.volume = e.volume ? e.volume : options.defaultVolume;
            this._play.call(this, audio);
        }
        _play(audio) {
            this._playing = audio;
            audio.play()
                .catch(err => console.warn(err))
                .then(() => delete this._playing);
        }
    }
    L.PlaySoundHandler = PlaySoundHandler;
    function playSoundHandler(opts) {
        return new L.PlaySoundHandler(opts);
    }
    L.playSoundHandler = playSoundHandler;
    L.Map.addInitHook('addHandler', 'playSoundHandler', L.playSoundHandler);
})(L || (L = {}));

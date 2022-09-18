L.Handler.PlaySoundHandler = L.Handler.extend({
    _self: this,

    initialize: function(map, options) {
        this._map = map;
        this._options = options;
        _self = this;
        if (!map.options.soundsPath)
            throw new Error('playsound plugin requires map.options.soundsPath parameter to be set');
        this._map.on('playsound', this._playsound, this);
    },
    addHooks: function() {
    },

    _playsound(e) {
        var audio = new Audio(`${window.location.origin}${map.options.soundsPath}${e.audioName}.mp3`);
        audio.crossOrigin = 'anonymous';
        audio.volume = e.volume ? e.volume : 0.3;
        L.Util.throttle(audio.play().catch(err => console.warn(err),1000));
    }
});

L.playSoundHandler = function (opts) {
    return new L.Handler.PlaySoundHandler(opts);
}
L.Map.addInitHook('addHandler', 'playSoundHandler', L.playSoundHandler);
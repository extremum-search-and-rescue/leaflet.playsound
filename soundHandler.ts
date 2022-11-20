namespace L { 
    export interface Evented {
        on(type: 'playsound', fn: ((event: PlaysoundEvent) => void), context: PlaySoundHandler) : this;
        off(type: 'playsound', fn: ((event: PlaysoundEvent) => void), context: PlaySoundHandler): this;
        /**
         * plays one sound at once
         * */
        fire(type: 'playsound', data: PlaysoundEvent, propagate?: boolean): this;
    }

    export enum PathKind{
        Absolute = "absolute",
        RelativeToSite = "site-relative",
        FilesystemRelative = "filesystem-relative"
    }

    export class PlaySoundOptions {
        /** 
        * set to null when working on local file system
        */
        crossOrigin: string = 'anonymous'
        soundsPath?: string = "/sounds/";
        soundsPathKind: PathKind = PathKind.RelativeToSite;
        /**
         * for relative paths
         * */
        defaultExtension: string = "mp3";
        /**
         * Volume: 0-1
         * */
        defaultVolume: number = 0.3;
    }

    export interface MapOptions {
        
        playSoundHandler: L.PlaySoundHandler,
        playSound: PlaySoundOptions
    }
    export interface PlaysoundEvent {
        audioName: string;
        volume: number;
    }
    export class PlaySoundHandler extends L.Handler {
        _self: PlaySoundHandler;
        _map: Map;
        _playing?: HTMLAudioElement;


        initialize(map: Map) {
            map.options.playSound = { ...new PlaySoundOptions(), ...map.options.playSound };
            this._map = map;
            this._self = this;
        }

        addHooks() {
            this._map.on('playsound', this._playsound, this);
        }
        removeHooks() {
            this._map.off('playsound', this._playsound, this);
        }

        private _playsound(e: PlaysoundEvent) {
            if (this._playing) return;
            
            const options = this._map.options.playSound;
            let audioAddress: string = null;            
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
        private _play(this: PlaySoundHandler, audio: HTMLAudioElement) {
            this._playing = audio;
            audio.play()
                .catch(err => console.warn(err))
                .then(() => delete this._playing);
        }
    }

    export function playSoundHandler (opts) {
        return new L.PlaySoundHandler(opts);
    }
    L.Map.addInitHook('addHandler', 'playSoundHandler', L.playSoundHandler);
}
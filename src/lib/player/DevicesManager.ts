import { Lunify } from '..';
import { PlayerManager } from '.';
import { ApiGetDevice } from '../../interfaces/player';
import { PlayerDeviceManager } from './DeviceManager';

export class PlayerDevicesManager {

    constructor(
        public client: Lunify,
        private player: PlayerManager,
    ) { }

    async fetch() {

        const res = await this.client.rest.get<{ devices: ApiGetDevice[] }>('/me/player/devices', {
            headers: {
                Authorization: this.player.user.oauth.getAuthorization()
            }
        });

        const devices: PlayerDeviceManager[] = [];

        for (const apiDevice of res.devices) devices.push(new PlayerDeviceManager(this.client, this.player.user, apiDevice));

        return devices;
    }

    async transferPlaybackTo(device: string | string[]) {

        const finalDevices: string[] = [];

        if (typeof device !== 'string') {
            for (const d of device) finalDevices.push(d);
        }
        else {
            finalDevices.push(device);
        }

        await this.client.rest.put('/me/player', {
            headers: {
                Authorization: this.player.user.oauth.getAuthorization()
            },
            body: {
                device_ids: finalDevices
            }
        });

        return true;
    }

}
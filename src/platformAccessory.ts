import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { HonACPlatform } from './platform';

export class HonACPlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: HonACPlatform,
    private readonly accessory: PlatformAccessory,
    private readonly device: any,
  ) {
    this.service = this.accessory.getService(this.platform.Service.Thermostat) ||
                   this.accessory.addService(this.platform.Service.Thermostat);
    this.service.setCharacteristic(this.platform.Characteristic.Name, device.name);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetTemperature)
      .onSet(this.setTargetTemperature.bind(this));
  }

  async getCurrentTemperature(): Promise<CharacteristicValue> {
    return this.device.currentTemperature;
  }

  async setTargetTemperature(value: CharacteristicValue) {
    this.device.setTargetTemperature(value);
  }
}

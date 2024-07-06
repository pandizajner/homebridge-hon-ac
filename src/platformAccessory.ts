import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { HonPlatform } from './platform';

export class HonPlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: HonPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    const { hap } = this.platform.api;

    this.accessory.getService(hap.Service.AccessoryInformation)!
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Haier')
      .setCharacteristic(hap.Characteristic.Model, 'AC')
      .setCharacteristic(hap.Characteristic.SerialNumber, accessory.context.device.id);

    this.service = this.accessory.getService(hap.Service.HeaterCooler) ||
      this.accessory.addService(hap.Service.HeaterCooler);

    this.service.setCharacteristic(hap.Characteristic.Name, accessory.context.device.name);

    this.service.getCharacteristic(hap.Characteristic.Active)
      .onSet(this.setActive.bind(this))
      .onGet(this.getActive.bind(this));

    this.service.getCharacteristic(hap.Characteristic.CurrentHeaterCoolerState)
      .onGet(this.getCurrentHeaterCoolerState.bind(this));

    this.service.getCharacteristic(hap.Characteristic.TargetHeaterCoolerState)
      .onSet(this.setTargetHeaterCoolerState.bind(this))
      .onGet(this.getTargetHeaterCoolerState.bind(this));
  }

  async setActive(value: CharacteristicValue) {
    await this.platform.honApi.setActive(this.accessory.context.device.id, value as boolean);
  }

  async getActive(): Promise<CharacteristicValue> {
    return this.platform.honApi.getActive(this.accessory.context.device.id);
  }

  async getCurrentHeaterCoolerState(): Promise<CharacteristicValue> {
    // Implement the logic to get the current state
    return 1; // example state
  }

  async setTargetHeaterCoolerState(value: CharacteristicValue) {
    // Implement the logic to set the target state
  }

  async getTargetHeaterCoolerState(): Promise<CharacteristicValue> {
    // Implement the logic to get the target state
    return 1; // example state
  }
}

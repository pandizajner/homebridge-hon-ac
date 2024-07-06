import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { HonACPlatform } from './platform';

export class HonACPlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: HonACPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Haier')
      .setCharacteristic(this.platform.Characteristic.Model, 'AC')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.macAddress);

    this.service = this.accessory.getService(this.platform.Service.HeaterCooler) || this.accessory.addService(this.platform.Service.HeaterCooler);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);

    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onGet(this.handleActiveGet.bind(this))
      .onSet(this.handleActiveSet.bind(this));
  }

  handleActiveGet(): CharacteristicValue {
    const isActive = this.accessory.context.device.isActive;
    return isActive ? this.platform.Characteristic.Active.ACTIVE : this.platform.Characteristic.Active.INACTIVE;
  }

  async handleActiveSet(value: CharacteristicValue) {
    const isActive = value === this.platform.Characteristic.Active.ACTIVE;
    await this.platform.honApi.setDeviceActive(this.accessory.context.device, isActive);
    this.accessory.context.device.isActive = isActive;
  }
}

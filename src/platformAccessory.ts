import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { HonAcPlatform } from './platform';

export class HonAcPlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: HonAcPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Haier')
      .setCharacteristic(this.platform.Characteristic.Model, 'hOn AC')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.serialNumber);

    this.service = this.accessory.getService(this.platform.Service.Thermostat) || 
                   this.accessory.addService(this.platform.Service.Thermostat);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentHeatingCoolingState)
      .onGet(this.handleCurrentHeatingCoolingStateGet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
      .onSet(this.handleTargetHeatingCoolingStateSet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetTemperature)
      .onSet(this.handleTargetTemperatureSet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits)
      .onSet(this.handleTemperatureDisplayUnitsSet.bind(this));
  }

  handleCurrentHeatingCoolingStateGet(): CharacteristicValue {
    return this.accessory.context.device.currentState;
  }

  handleTargetHeatingCoolingStateSet(value: CharacteristicValue) {
    this.accessory.context.device.targetState = value;
  }

  handleCurrentTemperatureGet(): CharacteristicValue {
    return this.accessory.context.device.currentTemperature;
  }

  handleTargetTemperatureSet(value: CharacteristicValue) {
    this.accessory.context.device.targetTemperature = value;
  }

  handleTemperatureDisplayUnitsSet(value: CharacteristicValue) {
    this.accessory.context.device.displayUnits = value;
  }
}

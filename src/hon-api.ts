import axios from 'axios';

export class HonAPI {
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  async getDevices() {
    const response = await axios.post('https://geofence.haiersmart.com/v2/auth/login', {
      email: this.email,
      password: this.password,
    });
    const token = response.data.token;
    const devicesResponse = await axios.get('https://geofence.haiersmart.com/v2/device', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return devicesResponse.data.devices;
  }
}

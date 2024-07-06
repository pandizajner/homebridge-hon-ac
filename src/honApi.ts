import axios from 'axios';

const AUTH_API = "https://account2.hon-smarthome.com";
const API_URL = "https://api-iot.he.services";
const API_KEY = "GRCqFhC6Gk@ikWXm1RmnSmX1cm,MxY-configuration";
const AWS_ENDPOINT = "a30f6tqw0oh1x0-ats.iot.eu-west-1.amazonaws.com";
const AWS_AUTHORIZER = "candy-iot-authorizer";
const APP = "hon";
const CLIENT_ID = "3MVG9QDx8IX8nP5T2Ha8ofvlmjLZl5L_gvfbT9.HJvpHGKoAS_dcMN8LYpTSYeVFCraUnV.2Ag1Ki7m4znVO6";
const APP_VERSION = "2.6.5";
const OS_VERSION = 999;
const OS = "android";
const DEVICE_MODEL = "pyhOn";
const USER_AGENT = "Chrome/999.999.999.999";
const MOBILE_ID = "pyhOn";

class HonAPI {
  private email: string;
  private password: string;
  private accessToken: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.accessToken = '';
  }

  public async authenticate(): Promise<void> {
    const loginData = {
      username: this.email,
      password: this.password,
      client_id: CLIENT_ID,
      headers: {
        'User-Agent': USER_AGENT,
      },
    };

    try {
      const response = await axios.post(`${AUTH_API}/auth/v1/login`, loginData);
      if (response.status === 200 && response.data && response.data.access_token) {
        this.accessToken = response.data.access_token;
        console.log('Authentication successful');
      } else {
        console.error('Failed to authenticate:', response.data);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  }

  public async getDevices(): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_URL}/appliance/v1/user/appliance`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return response.data.payload.appliances || [];
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }

  public async setDeviceActive(device: any, isActive: boolean): Promise<void> {
    try {
      const command = isActive ? 'turnOn' : 'turnOff';
      await axios.post(`${API_URL}/appliance/v1/device/${device.macAddress}/command`, {
        command,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'x-api-key': API_KEY,
        },
      });
    } catch (error) {
      console.error(`Error setting device ${isActive ? 'active' : 'inactive'}`, error);
    }
  }
}

export { HonAPI };

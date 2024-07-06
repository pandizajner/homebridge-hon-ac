import axios, { AxiosInstance } from 'axios';

const AUTH_API = "https://account2.hon-smarthome.com";
const API_URL = "https://api-iot.he.services";
const CLIENT_ID = "3MVG9QDx8IX8nP5T2Ha8ofvlmjLZl5L_gvfbT9.HJvpHGKoAS_dcMN8LYpTSYeVFCraUnV.2Ag1Ki7m4znVO6";
const USER_AGENT = "Chrome/999.999.999.999";

export class HonAPI {
  private client: AxiosInstance;
  private email: string;
  private password: string;
  private accessToken: string | null;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.accessToken = null;

    this.client = axios.create({
      baseURL: API_URL,
    });
  }

  async authenticate(): Promise<void> {
    const response = await this.client.post(`${AUTH_API}/auth/v1/login`, {
      username: this.email,
      password: this.password,
      client_id: CLIENT_ID,
      headers: {
        'User-Agent': USER_AGENT,
      },
    });
    this.accessToken = response.data.access_token;
  }

  async getDevices(): Promise<any[]> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const response = await this.client.get('/appliance/v1/devices', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.data;
  }

  async setActive(deviceId: string, active: boolean): Promise<void> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const url = `/appliance/v1/devices/${deviceId}/command`;
    const data = {
      command: 'setActive',
      parameters: {
        active,
      },
    };

    await this.client.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  async getActive(deviceId: string): Promise<boolean> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const url = `/appliance/v1/devices/${deviceId}/status`;
    const response = await this.client.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.data.active;
  }
}

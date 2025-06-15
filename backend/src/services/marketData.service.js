import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXMLAsync = promisify(parseString);

class MarketDataService {
  constructor() {
    this.AMFI_NAV_URL = 'https://www.amfiindia.com/spages/NAVAll.txt';
    this.BSE_API_URL = 'https://api.bseindia.com/BseIndiaAPI/api/';
    this.NSE_API_URL = 'https://www.nseindia.com/api/';
  }

  async fetchLatestNAVs() {
    try {
      const response = await axios.get(this.AMFI_NAV_URL);
      return this.parseAMFIData(response.data);
    } catch (error) {
      console.error('Error fetching NAV data:', error);
      throw new Error('Failed to fetch NAV data');
    }
  }

  parseAMFIData(data) {
    const lines = data.split('\n');
    const navs = {};
    let currentScheme = null;

    for (const line of lines) {
      if (line.startsWith('Scheme Code')) continue;
      
      const fields = line.split(';');
      if (fields.length >= 4) {
        navs[fields[0]] = {
          schemeName: fields[1],
          nav: parseFloat(fields[4]),
          date: fields[5],
        };
      }
    }

    return navs;
  }

  async fetchStockData(symbol) {
    try {
      const response = await axios.get(`${this.BSE_API_URL}/QuoteData/GetQuoteData`, {
        params: { symbol },
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw new Error('Failed to fetch stock data');
    }
  }

  async fetchIndexData(index) {
    try {
      const response = await axios.get(`${this.NSE_API_URL}/marketStatus`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching index data:', error);
      throw new Error('Failed to fetch index data');
    }
  }

  async updateSchemeNAVs() {
    try {
      const navs = await this.fetchLatestNAVs();
      const Scheme = require('../models/scheme.model').default;
      
      for (const [code, data] of Object.entries(navs)) {
        await Scheme.findOneAndUpdate(
          { code },
          { 
            nav: data.nav,
            navDate: new Date(data.date),
            lastUpdated: new Date()
          },
          { new: true }
        );
      }

      return true;
    } catch (error) {
      console.error('Error updating scheme NAVs:', error);
      throw new Error('Failed to update scheme NAVs');
    }
  }
}

export default new MarketDataService();

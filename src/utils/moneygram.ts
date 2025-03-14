  import axios from 'axios';

const API_URL = 'https://api.moneygram.com/'; // Replace with actual MoneyGram API URL

export const verifyUser = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MONEYGRAM_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('User verification failed');
  }
};

export const registerUser = async (userData: object) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${process.env.MONEYGRAM_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('User registration failed');
  }
};

export const sendMoneyGramTransfer = async (transactionData: object) => {
  try {
    const response = await axios.post(`${API_URL}/transactions`, transactionData, {
      headers: {
        Authorization: `Bearer ${process.env.MONEYGRAM_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Transaction creation failed');
  }
};

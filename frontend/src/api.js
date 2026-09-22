import { Platform } from 'react-native';

// In browser or mobile emulator, resolve backend API correctly
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();

export async function fetchCompetitions(userId = '') {
  try {
    const url = userId ? `${API_BASE_URL}/competitions?userId=${encodeURIComponent(userId)}` : `${API_BASE_URL}/competitions`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching competitions list:', error);
    throw error;
  }
}

export async function fetchUserProfile(userId = 'user_registered_01') {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/profile`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function fetchCompetitionDetails(slug = 'feedants-classical-dance', userId = 'user_registered_01') {
  try {
    const res = await fetch(`${API_BASE_URL}/competitions/${slug}?userId=${encodeURIComponent(userId)}`);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching competition details:', error);
    throw error;
  }
}

export async function registerForCompetition(competitionId, user) {
  try {
    const res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        competitionId,
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
      }),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}

export async function uploadCompetitionSubmission(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error uploading submission:', error);
    throw error;
  }
}

export async function simulateConcurrencyRush(count = 15) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/simulate-rush`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error simulating rush:', error);
    throw error;
  }
}

export async function resetDatabaseState() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error resetting DB state:', error);
    throw error;
  }
}

export async function setSpotsCount(bookedSpots) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/set-spots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookedSpots }),
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error setting spots:', error);
    throw error;
  }
}

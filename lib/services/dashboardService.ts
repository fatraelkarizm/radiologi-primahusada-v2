import * as dashboardRepository from '@/lib/repositories/dashboardRepository';

export async function getStats() {
  try {
    return await dashboardRepository.getDashboardStats();
  } catch (error) {
    console.error('Error in getStats service:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

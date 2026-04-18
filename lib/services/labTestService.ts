import * as labTestRepository from '@/lib/repositories/labTestRepository';
import { Prisma } from '@prisma/client';

export async function getLabTests() {
  try {
    return await labTestRepository.getAllLabTests();
  } catch (error) {
    console.error('Error in getLabTests service:', error);
    throw new Error('Failed to fetch lab tests');
  }
}

export async function getLabTest(id: string) {
  try {
    const labTestId = parseInt(id);
    if (isNaN(labTestId)) throw new Error('Invalid lab test ID');
    return await labTestRepository.getLabTestById(labTestId);
  } catch (error) {
    console.error(`Error in getLabTest service for ID ${id}:`, error);
    throw new Error('Failed to fetch lab test');
  }
}

export async function createLabTest(data: any) {
  try {
    if (!data.testCode || !data.patientId) {
      throw new Error('Test Code and Patient ID are required');
    }

    const labTestData: any = {
      ...data,
      patient: { connect: { id: parseInt(data.patientId) } },
      testDate: data.testDate ? new Date(data.testDate) : undefined,
    };
    
    // Remove patientId from the flat object to avoid Prisma errors if it's there
    delete labTestData.patientId;

    return await labTestRepository.createLabTest(labTestData);
  } catch (error) {
    console.error('Error in createLabTest service:', error);
    throw error;
  }
}

export async function updateLabTest(id: string, data: any) {
  try {
    const labTestId = parseInt(id);
    if (isNaN(labTestId)) throw new Error('Invalid lab test ID');

    const updateData: Prisma.LabTestUpdateInput = {
      ...data,
      testDate: data.testDate ? new Date(data.testDate) : undefined,
    };

    return await labTestRepository.updateLabTest(labTestId, updateData);
  } catch (error) {
    console.error(`Error in updateLabTest service for ID ${id}:`, error);
    throw new Error('Failed to update lab test');
  }
}

export async function deleteLabTest(id: string) {
  try {
    const labTestId = parseInt(id);
    if (isNaN(labTestId)) throw new Error('Invalid lab test ID');
    return await labTestRepository.deleteLabTest(labTestId);
  } catch (error) {
    console.error(`Error in deleteLabTest service for ID ${id}:`, error);
    throw new Error('Failed to delete lab test');
  }
}

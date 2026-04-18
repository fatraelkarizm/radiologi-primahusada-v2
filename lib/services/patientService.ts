import * as patientRepository from '@/lib/repositories/patientRepository';
import { Prisma } from '@prisma/client';

export async function getPatients() {
  try {
    return await patientRepository.getAllPatients();
  } catch (error) {
    console.error('Error in getPatients service:', error);
    throw new Error('Failed to fetch patients');
  }
}

export async function getPatient(id: string) {
  try {
    const patientId = parseInt(id);
    if (isNaN(patientId)) throw new Error('Invalid patient ID');
    return await patientRepository.getPatientById(patientId);
  } catch (error) {
    console.error(`Error in getPatient service for ID ${id}:`, error);
    throw new Error('Failed to fetch patient');
  }
}

export async function createPatient(data: any) {
  try {
    // Basic validation could happen here
    if (!data.name || !data.registrationNo) {
      throw new Error('Name and Registration Number are required');
    }

    const patientData: Prisma.PatientCreateInput = {
      ...data,
      birthDate: new Date(data.birthDate),
    };

    return await patientRepository.createPatient(patientData);
  } catch (error) {
    console.error('Error in createPatient service:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Patient with this Registration Number already exists');
      }
    }
    throw error;
  }
}

export async function updatePatient(id: string, data: any) {
  try {
    const patientId = parseInt(id);
    if (isNaN(patientId)) throw new Error('Invalid patient ID');

    const updateData: Prisma.PatientUpdateInput = {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    };

    return await patientRepository.updatePatient(patientId, updateData);
  } catch (error) {
    console.error(`Error in updatePatient service for ID ${id}:`, error);
    throw new Error('Failed to update patient');
  }
}

export async function deletePatient(id: string) {
  try {
    const patientId = parseInt(id);
    if (isNaN(patientId)) throw new Error('Invalid patient ID');
    return await patientRepository.deletePatient(patientId);
  } catch (error) {
    console.error(`Error in deletePatient service for ID ${id}:`, error);
    throw new Error('Failed to delete patient');
  }
}

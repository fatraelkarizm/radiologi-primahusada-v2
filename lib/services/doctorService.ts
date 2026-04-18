import * as doctorRepository from '@/lib/repositories/doctorRepository';
import { Prisma } from '@prisma/client';

export async function getDoctors() {
  try {
    return await doctorRepository.getAllDoctors();
  } catch (error) {
    console.error('Error in getDoctors service:', error);
    throw new Error('Failed to fetch doctors');
  }
}

export async function getDoctor(id: string) {
  try {
    const doctorId = parseInt(id);
    if (isNaN(doctorId)) throw new Error('Invalid doctor ID');
    return await doctorRepository.getDoctorById(doctorId);
  } catch (error) {
    console.error(`Error in getDoctor service for ID ${id}:`, error);
    throw new Error('Failed to fetch doctor');
  }
}

export async function createDoctor(data: any) {
  try {
    if (!data.name || !data.specialization) {
      throw new Error('Name and Specialization are required');
    }

    const doctorData: Prisma.DoctorCreateInput = {
      ...data,
      experience: data.experience ? parseInt(data.experience) : undefined,
    };

    return await doctorRepository.createDoctor(doctorData);
  } catch (error) {
    console.error('Error in createDoctor service:', error);
    throw error;
  }
}

export async function updateDoctor(id: string, data: any) {
  try {
    const doctorId = parseInt(id);
    if (isNaN(doctorId)) throw new Error('Invalid doctor ID');

    const updateData: Prisma.DoctorUpdateInput = {
      ...data,
      experience: data.experience ? parseInt(data.experience) : undefined,
    };

    return await doctorRepository.updateDoctor(doctorId, updateData);
  } catch (error) {
    console.error(`Error in updateDoctor service for ID ${id}:`, error);
    throw new Error('Failed to update doctor');
  }
}

export async function deleteDoctor(id: string) {
  try {
    const doctorId = parseInt(id);
    if (isNaN(doctorId)) throw new Error('Invalid doctor ID');
    return await doctorRepository.deleteDoctor(doctorId);
  } catch (error) {
    console.error(`Error in deleteDoctor service for ID ${id}:`, error);
    throw new Error('Failed to delete doctor');
  }
}

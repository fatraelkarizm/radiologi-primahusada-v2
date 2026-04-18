import * as xrayRepository from '@/lib/repositories/xrayRepository';
import { Prisma } from '@prisma/client';

export async function getXRayExams() {
  try {
    return await xrayRepository.getAllXRayExams();
  } catch (error) {
    console.error('Error in getXRayExams service:', error);
    throw new Error('Failed to fetch X-Ray examinations');
  }
}

export async function getXRayExam(id: string) {
  try {
    const examId = parseInt(id);
    if (isNaN(examId)) throw new Error('Invalid X-Ray examination ID');
    return await xrayRepository.getXRayExamById(examId);
  } catch (error) {
    console.error(`Error in getXRayExam service for ID ${id}:`, error);
    throw new Error('Failed to fetch X-Ray examination');
  }
}

export async function createXRayExam(data: any) {
  try {
    if (!data.patientId || !data.examinationType) {
      throw new Error('Patient ID and Examination Type are required');
    }

    const xrayData: any = {
      ...data,
      patient: { connect: { id: parseInt(data.patientId) } },
      doctor: data.doctorId ? { connect: { id: parseInt(data.doctorId) } } : undefined,
      examinationDate: data.examinationDate ? new Date(data.examinationDate) : undefined,
    };
    
    // Remove IDs from the flat object
    delete xrayData.patientId;
    delete xrayData.doctorId;

    return await xrayRepository.createXRayExam(xrayData);
  } catch (error) {
    console.error('Error in createXRayExam service:', error);
    throw error;
  }
}

export async function updateXRayExam(id: string, data: any) {
  try {
    const examId = parseInt(id);
    if (isNaN(examId)) throw new Error('Invalid X-Ray examination ID');

    const updateData: Prisma.XRayExaminationUpdateInput = {
      ...data,
      examinationDate: data.examinationDate ? new Date(data.examinationDate) : undefined,
    };

    return await xrayRepository.updateXRayExam(examId, updateData);
  } catch (error) {
    console.error(`Error in updateXRayExam service for ID ${id}:`, error);
    throw new Error('Failed to update X-Ray examination');
  }
}

export async function deleteXRayExam(id: string) {
  try {
    const examId = parseInt(id);
    if (isNaN(examId)) throw new Error('Invalid X-Ray examination ID');
    return await xrayRepository.deleteXRayExam(examId);
  } catch (error) {
    console.error(`Error in deleteXRayExam service for ID ${id}:`, error);
    throw new Error('Failed to delete X-Ray examination');
  }
}

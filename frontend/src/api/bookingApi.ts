import client from './client';

export interface AppointmentPayload {
  doctorId: string;
  datetime: string;
  notes?: string;
}

export interface Appointment {
  _id: string;
  patient: string;
  doctor: string;
  datetime: string;
  status?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function bookAppointment(payload: AppointmentPayload): Promise<Appointment> {
  const { data } = await client.post<Appointment>('/api/bookings', payload);
  return data;
}

export async function fetchMyAppointments(): Promise<Appointment[]> {
  const { data } = await client.get<Appointment[]>('/api/bookings/my');
  return data;
}

export async function cancelAppointment(id: string): Promise<{ message: string }> {
  const { data } = await client.delete<{ message: string }>(`/api/bookings/${id}`);
  return data;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const { data } = await client.patch<Appointment>(`/api/bookings/${id}`, { status });
  return data;
}

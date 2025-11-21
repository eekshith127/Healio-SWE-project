export type NotificationType = 'appointment' | 'lab_result' | 'medicine' | 'system' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  actionScreen?: keyof import('./navigation').PatientStackParamList;
  actionData?: any;
}

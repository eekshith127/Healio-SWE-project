import { create } from 'zustand';
import { Doctor } from '../types/doctor';
import { fetchDoctors as fetchMockDoctors } from '../api/mockapi';
import { fetchDoctorsFromBackend, BackendUser } from '../api/usersapi';

interface DoctorsState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Actions
  loadDoctors: () => Promise<void>;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  setDoctors: (doctors: Doctor[]) => void;
}

export const useDoctorsStore = create<DoctorsState>((set, get) => ({
  doctors: [],
  loading: false,
  error: null,
  lastUpdated: null,

  loadDoctors: async () => {
    set({ loading: true, error: null });
    try {
      // Try to fetch from backend first
      const backendDoctors = await fetchDoctorsFromBackend();
      
      if (backendDoctors.length > 0) {
        // Transform backend users to Doctor format
        const doctors: Doctor[] = backendDoctors.map((user: BackendUser) => ({
          id: user._id,
          name: user.name || user.email.split('@')[0],
          specialty: user.specialization || 'General Physician',
          image: 'https://via.placeholder.com/150', // Default placeholder
          rating: 4.5,
          experience: '5+ years',
          qualification: 'MBBS, MD',
          description: `${user.specialization || 'General Physician'} specialist`,
        }));
        
        set({ 
          doctors, 
          loading: false, 
          lastUpdated: new Date() 
        });
      } else {
        // Fallback to mock data if no doctors in backend
        console.debug('No doctors in backend, using mock data');
        const mockData = await fetchMockDoctors();
        set({ 
          doctors: mockData, 
          loading: false, 
          lastUpdated: new Date() 
        });
      }
    } catch (error) {
      // If backend fails, use mock data
      console.debug('Backend unavailable, using mock doctors');
      try {
        const mockData = await fetchMockDoctors();
        set({ 
          doctors: mockData, 
          loading: false, 
          lastUpdated: new Date() 
        });
      } catch (mockError) {
        set({ 
          error: 'Failed to load doctors', 
          loading: false 
        });
        console.error('Error loading doctors:', error);
      }
    }
  },

  addDoctor: (doctor: Doctor) => {
    const currentDoctors = get().doctors;
    set({ 
      doctors: [...currentDoctors, doctor],
      lastUpdated: new Date()
    });
  },

  updateDoctor: (id: string, updates: Partial<Doctor>) => {
    const currentDoctors = get().doctors;
    set({ 
      doctors: currentDoctors.map(d => 
        d.id === id ? { ...d, ...updates } : d
      ),
      lastUpdated: new Date()
    });
  },

  deleteDoctor: (id: string) => {
    const currentDoctors = get().doctors;
    set({ 
      doctors: currentDoctors.filter(d => d.id !== id),
      lastUpdated: new Date()
    });
  },

  setDoctors: (doctors: Doctor[]) => {
    set({ 
      doctors,
      lastUpdated: new Date()
    });
  },
}));

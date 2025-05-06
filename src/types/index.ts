export interface User {
    email: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
  }
  
  export interface Launch {
    id: string;
    name: string;
    date_utc: string;
    flight_number: number;
    details: string | null;
    rocket: string;
    success: boolean;
    links: {
      patch: {
        small: string | null;
      }
    };
  }
  
  export interface Rocket {
    id: string;
    name: string;
    type: string;
    first_flight: string;
    description: string;
    success_rate_pct: number;
  }
  
  export interface LaunchesResponse {
    docs: Launch[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    totalDocs: number;
    totalPages: number;
  }
  
  export interface LoginFormValues {
    email: string;
    password: string;
  }
  
  export interface LaunchesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    success?: boolean;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }
  export interface ApiError {
    message: string;
    status?: number;
  }
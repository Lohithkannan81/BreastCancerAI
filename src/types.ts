export enum UserRole {
    DOCTOR = 'Doctor',
    RESEARCHER = 'Researcher',
    STUDENT = 'Student',
    ADMIN = 'Admin'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organization: string;
}

export enum AnalysisStatus {
    IDLE = 'Idle',
    ANALYZING = 'Analyzing',
    COMPLETED = 'Completed',
    ERROR = 'Error'
}

export enum TumorClass {
    BENIGN = 'Benign',
    MALIGNANT = 'Malignant'
}

export interface Report {
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    // type: string; // Removed as requested
    tumorClass: TumorClass;
    confidence: number;
    explanation: string;
    imageUrl?: string;
    status: AnalysisStatus;
    recommendations?: string[];
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    contact: string;
    history: string;
    registeredDate: string;
}

export interface PredictionResult {
    result: 'Malignant' | 'Benign';
    confidence: number;
    grad_cam_path?: string;
}

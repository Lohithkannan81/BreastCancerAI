import emailjs from '@emailjs/browser';

interface UserCredentials {
    email: string;
    password: string;
    name: string;
    role: string;
    organization: string;
    department: string;
    resetToken?: string;
    resetTokenExpiry?: number;
}

// Simple password hashing (for demo - use bcrypt in production)
const hashPassword = (password: string): string => {
    return btoa(password); // Base64 encoding for demo
};

const verifyPassword = (password: string, hash: string): boolean => {
    return btoa(password) === hash;
};

// Get all users from localStorage
const getUsers = (): UserCredentials[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: UserCredentials[]) => {
    localStorage.setItem('users', JSON.stringify(users));
};

// Register new user
export const registerUser = (
    email: string,
    password: string,
    name: string,
    role: string,
    organization: string,
    department: string
): boolean => {
    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return false; // User already exists
    }

    users.push({
        email,
        password: hashPassword(password),
        name,
        role,
        organization,
        department
    });

    saveUsers(users);
    return true;
};

// Login user
export const loginUser = (email: string, password: string): UserCredentials | null => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return null; // User not found
    }

    if (!verifyPassword(password, user.password)) {
        return null; // Wrong password
    }

    return user;
};

// Generate reset token
const generateResetToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        throw new Error('No account found with this email address');
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Update user with reset token
    users[userIndex].resetToken = resetToken;
    users[userIndex].resetTokenExpiry = resetTokenExpiry;
    saveUsers(users);

    // Create reset link
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // EmailJS configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Improved Demo Mode Detection: Check if keys are missing or still contain "your_" placeholders
    const isPlaceholder = (val: string | undefined) => !val || val.includes('your_') || val.includes('here');

    if (isPlaceholder(serviceId) || isPlaceholder(templateId) || isPlaceholder(publicKey)) {
        console.warn('⚠️ EmailJS not configured. Entering Demo Mode...');
        // For demo purposes, show the reset link in console
        console.log('🔑 Password Reset Link (Demo Mode):', resetLink);
        alert(`🔓 Demo Mode Active\n\nReset link generated for: ${email}\n\nLink: ${resetLink}\n\n(This link has also been copied to your browser console for easy access)`);
        return true;
    }

    try {
        // Send email via EmailJS
        await emailjs.send(
            serviceId,
            templateId,
            {
                to_email: email,
                to_name: users[userIndex].name,
                reset_link: resetLink,
                app_name: 'BreastCancerAI'
            },
            publicKey
        );

        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send reset email. Please try again later.');
    }
};

// Verify reset token
export const verifyResetToken = (email: string, token: string): boolean => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
        return false;
    }

    if (user.resetToken !== token) {
        return false;
    }

    if (Date.now() > user.resetTokenExpiry) {
        return false; // Token expired
    }

    return true;
};

// Reset password
export const resetPassword = (email: string, token: string, newPassword: string): boolean => {
    if (!verifyResetToken(email, token)) {
        return false;
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return false;
    }

    // Update password and clear reset token
    users[userIndex].password = hashPassword(newPassword);
    delete users[userIndex].resetToken;
    delete users[userIndex].resetTokenExpiry;

    saveUsers(users);
    return true;
};

// Change password (when logged in)
export const changePassword = (email: string, oldPassword: string, newPassword: string): boolean => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return false;
    }

    if (!verifyPassword(oldPassword, users[userIndex].password)) {
        return false; // Wrong old password
    }

    users[userIndex].password = hashPassword(newPassword);
    saveUsers(users);
    return true;
};

"use server"

import { updateUserInfo, updateContactInfo, updatePasswordInDB } from '@/queries/users';
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';


export const updateUserInfoAction = async (email, updatedData) => {
    try {
        await updateUserInfo(email, updatedData);
        revalidatePath('/account');
    } catch (error) {
        throw new Error('Error updating user information');
    }
};

export const updateContactInfoAction = async (email, updatedData) => {
    try {
        await updateContactInfo(email, updatedData);
        revalidatePath('/account');
    } catch (error) {
        throw new Error('Error updating user information');
    }
};



export async function updatePasswordAction(email, newPassword) {
    try {
        // Hash the new password before storing it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Call the database function to update the password
        await updatePasswordInDB(email, hashedPassword);
        
        return { success: true };
    } catch (error) {
        console.error("Database Update Error:", error); // Log full error
        throw new Error('Error updating password: ' + error.message);
    }
}

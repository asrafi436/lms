'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import bcrypt from 'bcryptjs';
import { updatePasswordAction } from '@/app/action/account';

const ChangePassword = ({ userInfo }) => {
    const [passwordState, setPasswordState] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPasswordState({
            ...passwordState,
            [name]: value,
        });
    };

    async function doPasswordChange(event) {
        event.preventDefault();

        // Ensure new password and confirm password match
        if (passwordState.newPassword !== passwordState.confirmNewPassword) {
            toast.error("New password and confirmation do not match");
            return;
        }

        // Verify old password
        const isMatch = await bcrypt.compare(passwordState.oldPassword, userInfo.password);
        if (!isMatch) {
            toast.error("Old Password does not match");
            return;
        }

        // Update password
        try {
            await updatePasswordAction(userInfo.email, passwordState.newPassword);
            toast.success("Password changed successfully");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    }

    return (
        <div>
            <h5 className="text-lg font-semibold mb-4">Change password:</h5>
            <form onSubmit={doPasswordChange}>
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <Label className="mb-2 block">Old password:</Label>
                        <Input
                            type="password"
                            name="oldPassword"
                            onChange={handleChange}
                            placeholder="Old password"
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">New password:</Label>
                        <Input
                            type="password"
                            name="newPassword"
                            onChange={handleChange}
                            placeholder="New password"
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Re-type New password:</Label>
                        <Input
                            type="password"
                            name="confirmNewPassword"
                            onChange={handleChange}
                            placeholder="Re-type New password"
                            required
                        />
                    </div>
                </div>
                <Button className="mt-5" type="submit">
                    Save password
                </Button>
            </form>
        </div>
    );
};

export default ChangePassword;

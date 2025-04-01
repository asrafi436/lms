// app/account/page.js
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateUserInfoAction } from '@/app/action/account';
import { toast } from 'sonner';

const PersonalDetails = ({ userInfo }) => {
    const [infoState, setInfoState] = useState({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        designation: userInfo.designation,
        bio: userInfo.bio,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInfoState({ ...infoState, [name]: value });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            
            await updateUserInfoAction(userInfo.email, infoState);
            toast.success("Update successful!");
            console.log("Triggering toast...");
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-6 rounded-md shadow bg-white dark:bg-slate-900">
            <h5 className="text-lg font-semibold mb-4">Personal Detail:</h5>
            <form onSubmit={handleUpdate}>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                    <div>
                        <Label className="mb-2 block">First Name:</Label>
                        <Input
                            type="text"
                            name="first_name"
                            value={infoState.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Last Name:</Label>
                        <Input
                            type="text"
                            name="last_name"
                            value={infoState.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Email:</Label>
                        <Input
                            type="email"
                            name="email"
                            value={infoState.email}
                            disabled
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Occupation:</Label>
                        <Input
                            type="text"
                            name="designation"
                            value={infoState.designation ?? ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 mt-5">
                    <Label className="mb-2 block">Description:</Label>
                    <Textarea
                        name="bio"
                        value={infoState.bio ?? ""}
                        onChange={handleChange}
                    />
                </div>
                <Button className="mt-5" type="submit">
                    Save Changes
                </Button>
            </form>
        </div>
    );
};

export default PersonalDetails;

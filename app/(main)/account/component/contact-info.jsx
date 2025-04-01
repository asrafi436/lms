"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateContactInfoAction } from '@/app/action/account';
import { toast } from 'sonner';

const ContactInfo = ({ userInfo }) => {
    const [infoState, setInfoState] = useState({
        phone: userInfo?.phone ?? "",
        twitter: userInfo?.twitter ?? "",
        linkedin: userInfo?.linkedin ?? "",
        facebook: userInfo?.facebook ?? "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInfoState({ ...infoState, [name]: value });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            await updateContactInfoAction(userInfo.email, infoState);
            toast.success("Update successful!");
        } catch (error) {
            toast.error(`Error: ${error.message || "Something went wrong!"}`);
        }
    };

    return (
        <div>
            <h5 className="text-lg font-semibold mb-4">Contact Info :</h5>
            <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <Label className="mb-2 block">Phone No. :</Label>
                        <Input
                            name="phone"
                            id="phone"
                            type="tel"
                            placeholder="Phone :"
                            value={infoState.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Facebook :</Label>
                        <Input
                            name="facebook"
                            id="facebook"
                            type="text"
                            placeholder="Facebook URL"
                            value={infoState.facebook}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Twitter :</Label>
                        <Input
                            name="twitter"
                            id="twitter"
                            type="text"
                            placeholder="Twitter URL"
                            value={infoState.twitter}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">LinkedIn :</Label>
                        <Input
                            name="linkedin"
                            id="linkedin"
                            type="text"
                            placeholder="LinkedIn URL"
                            value={infoState.linkedin}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* End grid */}
                <Button className="mt-5" type="submit">
                    Update
                </Button>
            </form>
        </div>
    );
};

export default ContactInfo;

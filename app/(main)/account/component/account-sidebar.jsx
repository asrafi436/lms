import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/users';
import Image from "next/image";
import Menu from './account-menu';

const AccountSidebar = async () => {
    const session = await auth();


    if (!session?.user) {
        redirect("/login");
    }

    // Fetch user from MySQL
    const loggedInUser = await getUserByEmail(session.user.email);
    // console.log(loggedInUser);

    if (!loggedInUser) {
        console.error('User not found in MySQL');
        redirect("/login");
    }

    return (
        <div className="lg:w-1/4 md:px-3">
            <div className="relative">
                <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
                    <div className="profile-pic text-center mb-5">
                        <div>
                            <div className="relative size-28 mx-auto">
                                <Image
                                    src={loggedInUser?.profile_picture || "/assets/images/profile.jpg"}
                                    className="rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800"
                                    alt={`Image of: ${loggedInUser?.first_name}`}
                                    width={112}
                                    height={112}
                                />
                            </div>
                            <div className="mt-4">
                                <h5 className="text-lg font-semibold">{loggedInUser?.first_name} {loggedInUser?.last_name}</h5>
                                <p className="text-slate-400">{loggedInUser?.email}</p>
                                <p className="text-slate-800">User Type: {loggedInUser?.role}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700">
                        <Menu />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSidebar;

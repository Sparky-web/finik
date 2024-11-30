
import RegisterCard from "~/app/_lib/components/auth/register-card";
import { api } from "~/trpc/server";

// pages/auth/Register.tsx
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { api } from '~/trpc/react';
// import { signIn } from 'next-auth/react';

const Register = async () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background  py-12 px-4 sm:px-6 lg:px-8">
            <RegisterCard />
        </div>
    );
};

export default Register;
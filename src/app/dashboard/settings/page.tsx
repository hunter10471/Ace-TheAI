"use client";

import PageHeader from "@/components/big/PageHeader/PageHeader";
import ChangePasswordForm from "@/components/medium/ChangePasswordForm/ChangePasswordForm";
import DataSharingSettings from "@/components/medium/DataSharingSettings/DataSharingSettings";
import LanguageSettings from "@/components/medium/LanguageSettings/LanguageSettings";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                subtitle="Manage your account settings and preferences"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChangePasswordForm />
                <div className="space-y-8">
                    <DataSharingSettings />
                    <LanguageSettings />
                </div>
            </div>
        </div>
    );
}

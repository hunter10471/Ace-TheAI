import PageHeader from "@/components/big/PageHeader/PageHeader";
import { getUser } from "../../actions/actions";
import ChangePasswordForm from "@/components/medium/ChangePasswordForm/ChangePasswordForm";
import DataSharingSettings from "@/components/medium/DataSharingSettings/DataSharingSettings";
import LanguageSettings from "@/components/medium/LanguageSettings/LanguageSettings";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings"
        subtitle="Manage your account settings and preferences"
        userName={user.name}
        userEmail={user.email}
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
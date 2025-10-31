import { ProfileForm } from "./profile-form";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account and profile settings.
      </p>
      <ProfileForm />
    </div>
  );
}

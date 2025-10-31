import PersonalInfoForm from "@/components/form/PersonalInfoForm";
import { getPersonalInfo } from "./action";

export default async function PersonalInfoPage() {
  const personalInfo = await getPersonalInfo();

  return (
    <main className="p-6">
      <PersonalInfoForm defaultValues={personalInfo || {}} />
    </main>
  );
}

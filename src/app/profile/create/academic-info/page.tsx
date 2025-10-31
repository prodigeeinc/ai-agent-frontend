import AcademicInfoForm from "@/components/form/AcademicInfoForm";
import { getAcademicInfo } from "./actions";

export default async function AcademicInfoPage() {
  const academicInfo = await getAcademicInfo();

  return (
    <main className="p-6">
      <AcademicInfoForm defaultValues={academicInfo || []} />
    </main>
  );
}

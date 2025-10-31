import { getEmploymentInfo } from "./actions";
import EmploymentInfoForm from "@/components/form/EmploymentInfoForm";

export default async function EmploymentInfoPage() {
  const employmentData = await getEmploymentInfo();

  return (
    <main>
      <EmploymentInfoForm defaultValues={employmentData} />
    </main>
  );
}

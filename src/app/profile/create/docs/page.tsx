import DocumentsForm from "@/components/form/DocumentsForm";
import { getAcademicInfo } from "../academic-info/actions";

async function PersonalInfo() {
  const academicInfo = await getAcademicInfo();

  return (
    <main>
      <DocumentsForm academicInfo={academicInfo || []} />
    </main>
  );
}

export default PersonalInfo;

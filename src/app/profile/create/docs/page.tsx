import DocumentsForm from "@/components/form/DocumentsForm";
import { getAcademicInfo } from "../academic-info/actions";
import { getDocuments } from "./actions";

async function PersonalInfo() {
  const academicInfo = await getAcademicInfo();
  const documents = await getDocuments();

  console.log({ documents });

  return (
    <main>
      <DocumentsForm
        academicInfo={academicInfo || []}
        documents={documents || []}
      />
    </main>
  );
}

export default PersonalInfo;

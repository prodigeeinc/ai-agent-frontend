"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useRouter } from "next/navigation";
import {
  uploadDocument,
  deleteDocument,
} from "@/app/profile/create/docs/actions";
import { toast } from "sonner";
import {
  academicInfoSchema,
  type AcademicInfoFormValues,
} from "@/lib/zodSchemas";
import { Trash2, FileText, Image } from "lucide-react";

registerPlugin(FilePondPluginFileValidateType);

// ✅ Validation schema
const documentsSchema = z.object({
  transcripts: z.array(z.any()).optional(),
  certificates: z.array(z.any()).optional(),
  resume: z.any().optional(),
  recommendationLetters: z.array(z.any()).optional(),
  personalStatement: z.any().optional(),
  supportingDocs: z.array(z.any()).optional(),
  miscellaneous: z.array(z.any()).optional(),
});

type DocumentsFormValues = z.infer<typeof documentsSchema>;

type DocumentsFormProps = {
  academicInfo: z.infer<typeof academicInfoSchema>["education"];
  documents: Array<{
    id: string;
    category: string;
    file_name: string;
    publicUrl: string;
    file_type: string;
    file_size: number;
  }>;
};

export default function DocumentsForm({
  academicInfo,
  documents,
}: DocumentsFormProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
  });

  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const isCompleted = (endDate: string) => new Date(endDate) < new Date();

  // Group documents by category
  function getDocsByCategory(category: string) {
    return documents.filter((doc) => doc.category === category);
  }

  // 📏 Format file size
  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  // 📤 Upload file to Supabase
  async function handleUpload(file: File, category: string) {
    toast.loading(`Uploading ${file.name}...`);
    setUploading(true);

    const result = await uploadDocument(file, category);
    setUploading(false);
    toast.dismiss();

    if (result?.error) {
      toast.error(`❌ ${result.error}`);
    } else {
      toast.success(`✅ ${file.name} uploaded successfully!`);
      router.refresh(); // reload to show new file preview
    }
  }

  // 🗑️ Delete file from Supabase
  async function handleDelete(fileName: string, category: string) {
    const confirmDelete = confirm(`Do you want to delete "${fileName}"?`);
    if (!confirmDelete) return;

    const result = await deleteDocument(fileName, category);

    if (result?.error) {
      toast.error(`❌ Failed to delete: ${result.error}`);
    } else {
      toast.success(`🗑️ ${fileName} deleted successfully.`);
      router.refresh(); // reload after deletion
    }
  }

  const onSubmit = async () => {
    router.push("/profile/create/review");
  };

  // ✅ Reusable preview section
  const ExistingDocs = ({ category }: { category: string }) => {
    const docs = getDocsByCategory(category);
    if (!docs.length) return null;

    return (
      <div className="flex flex-wrap gap-3 mb-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-3 flex items-center justify-between w-full sm:w-auto sm:min-w-[250px]"
          >
            <div className="flex items-center gap-2 truncate">
              {doc.file_type.startsWith("image/") ? (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                  <Image className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate max-w-[140px]">
                  {doc.file_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(doc.file_size)}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(doc.file_name, doc.category)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-8 space-y-10 max-w-3xl mx-auto"
    >
      <div>
        <h1 className="text-2xl font-semibold">Upload Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload transcripts, certificates, and other supporting documents to
          complete your profile. Files are uploaded automatically when selected.
        </p>
      </div>

      {/* 📚 Transcripts */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Academic Transcripts</h2>
        <ExistingDocs category="transcript" />

        {academicInfo.map((school, i) => (
          <div key={i} className="grid gap-2">
            <Label>{school.university_name} Transcript</Label>
            <FilePond
              name={`transcript-${i}`}
              allowMultiple={false}
              acceptedFileTypes={["application/pdf", "image/*"]}
              onaddfile={(_error, fileItem) => {
                if (fileItem?.file)
                  handleUpload(fileItem.file as File, "transcript");
              }}
              onremovefile={(_error, fileItem) => {
                if (fileItem?.file)
                  handleDelete(fileItem.file.name, "transcript");
              }}
            />
          </div>
        ))}
      </section>

      {/* 🎓 Certificates */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Degree Certificates</h2>
        <ExistingDocs category="certificate" />

        {academicInfo
          .filter((school) => isCompleted(school.end_date))
          .map((school, i) => (
            <div key={i} className="grid gap-2">
              <Label>{school.university_name} Certificate</Label>
              <FilePond
                name={`certificate-${i}`}
                allowMultiple={false}
                acceptedFileTypes={["application/pdf", "image/*"]}
                onaddfile={(_error, fileItem) => {
                  if (fileItem?.file)
                    handleUpload(fileItem.file as File, "certificate");
                }}
                onremovefile={(_error, fileItem) => {
                  if (fileItem?.file)
                    handleDelete(fileItem.file.name, "certificate");
                }}
              />
            </div>
          ))}
      </section>

      {/* 🧾 Resume */}
      <section className="space-y-2">
        <Label>Resume / CV</Label>
        <ExistingDocs category="resume" />
        <FilePond
          name="resume"
          allowMultiple={false}
          acceptedFileTypes={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
          onaddfile={(_error, fileItem) => {
            if (fileItem?.file) handleUpload(fileItem.file as File, "resume");
          }}
          onremovefile={(_error, fileItem) => {
            if (fileItem?.file) handleDelete(fileItem.file.name, "resume");
          }}
        />
      </section>

      {/* ✉️ Recommendation Letters */}
      <section className="space-y-2">
        <Label>Recommendation Letters</Label>
        <ExistingDocs category="recommendation_letter" />
        <FilePond
          name="recommendationLetters"
          allowMultiple={true}
          maxFiles={3}
          acceptedFileTypes={["application/pdf", "image/*"]}
          onaddfile={(_error, fileItem) => {
            if (fileItem?.file)
              handleUpload(fileItem.file as File, "recommendation_letter");
          }}
          onremovefile={(_error, fileItem) => {
            if (fileItem?.file)
              handleDelete(fileItem.file.name, "recommendation_letter");
          }}
        />
      </section>

      {/* 📝 Personal Statement */}
      <section className="space-y-2">
        <Label>Personal Statement / Essay</Label>
        <ExistingDocs category="personal_statement" />
        <FilePond
          name="personalStatement"
          allowMultiple={false}
          acceptedFileTypes={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
          onaddfile={(_error, fileItem) => {
            if (fileItem?.file)
              handleUpload(fileItem.file as File, "personal_statement");
          }}
          onremovefile={(_error, fileItem) => {
            if (fileItem?.file)
              handleDelete(fileItem.file.name, "personal_statement");
          }}
        />
      </section>

      {/* 📎 Supporting Documents */}
      <section className="space-y-2">
        <Label>Supporting Documents</Label>
        <ExistingDocs category="supporting_document" />
        <FilePond
          name="supportingDocs"
          allowMultiple={true}
          acceptedFileTypes={["application/pdf", "image/*"]}
          onaddfile={(_error, fileItem) => {
            if (fileItem?.file)
              handleUpload(fileItem.file as File, "supporting_document");
          }}
          onremovefile={(_error, fileItem) => {
            if (fileItem?.file)
              handleDelete(fileItem.file.name, "supporting_document");
          }}
        />
      </section>

      {/* 📂 Miscellaneous */}
      <section className="space-y-2">
        <Label>Miscellaneous Documents</Label>
        <ExistingDocs category="miscellaneous" />
        <FilePond
          name="miscellaneous"
          allowMultiple={true}
          acceptedFileTypes={[
            "application/pdf",
            "image/*",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
          onaddfile={(_error, fileItem) => {
            if (fileItem?.file)
              handleUpload(fileItem.file as File, "miscellaneous");
          }}
          onremovefile={(_error, fileItem) => {
            if (fileItem?.file)
              handleDelete(fileItem.file.name, "miscellaneous");
          }}
        />
      </section>

      {/* 🔘 Submit */}
      <div className="pt-4 flex justify-end gap-4">
        <Link
          href={isSubmitting ? "#" : "/profile/create/employment-info"}
          className={`px-4 py-2 rounded ${
            isSubmitting ? "pointer-events-none opacity-50" : "hover:underline"
          }`}
        >
          Back
        </Link>

        <Button type="submit" size={"lg"} disabled={uploading || isSubmitting}>
          {uploading ? "Uploading..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}

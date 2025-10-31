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
import { uploadDocument } from "@/app/profile/create/docs/actions";

registerPlugin(FilePondPluginFileValidateType);

// ✅ Schema
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

// ✅ Dummy academic data (simulate your academic info)
const academicData = [
  {
    university_name: "University of Ghana",
    city: "Accra",
    country: "Ghana",
    level_of_study: "bachelor",
    major: "Computer Science",
    gpa: "3.8",
    start_date: "2018-09-01",
    end_date: "2022-07-30",
    honors: "First Class Honors",
  },
  {
    university_name: "Ashesi University",
    city: "Berekuso",
    country: "Ghana",
    level_of_study: "master",
    major: "Data Science",
    gpa: "3.9",
    start_date: "2023-01-01",
    end_date: "2026-05-15",
    honors: "",
  },
];

export default function DocumentsForm() {
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      transcripts: [],
      certificates: [],
      resume: undefined,
      recommendationLetters: [],
      personalStatement: undefined,
      supportingDocs: [],
      miscellaneous: [],
    },
  });

  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const isCompleted = (endDate: string) => new Date(endDate) < new Date();

  // 📤 Helper to upload each file to Supabase immediately
  async function handleUpload(file: File, category: string) {
    setUploading(true);
    const result = await uploadDocument(file, category);
    setUploading(false);

    if (result?.error) {
      alert(`❌ ${result.error}`);
    } else {
      console.log("✅ Uploaded:", category, result);
    }
  }

  const onSubmit = async () => {
    router.push("/profile/create/review");
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

      {/* Academic Transcripts */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Academic Transcripts</h2>
        {academicData.map((school, i) => (
          <div key={i} className="grid gap-2">
            <Label>{school.university_name} Transcript</Label>
            <FilePond
              name={`transcript-${i}`}
              allowMultiple={false}
              acceptedFileTypes={["application/pdf", "image/*"]}
              onupdatefiles={(files) => {
                const file = files[0]?.file;
                if (file) handleUpload(file as File, "transcript");
              }}
            />
          </div>
        ))}
      </section>

      {/* Certificates */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Degree Certificates</h2>
        {academicData
          .filter((school) => isCompleted(school.end_date))
          .map((school, i) => (
            <div key={i} className="grid gap-2">
              <Label>{school.university_name} Certificate</Label>
              <FilePond
                name={`certificate-${i}`}
                allowMultiple={false}
                acceptedFileTypes={["application/pdf", "image/*"]}
                onupdatefiles={(files) => {
                  const file = files[0]?.file;
                  if (file) handleUpload(file as File, "certificate");
                }}
              />
            </div>
          ))}
      </section>

      {/* Resume */}
      <section className="space-y-2">
        <Label>Resume / CV</Label>
        <FilePond
          name="resume"
          allowMultiple={false}
          acceptedFileTypes={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
          onupdatefiles={(files) => {
            const file = files[0]?.file;
            if (file) handleUpload(file as File, "resume");
          }}
        />
      </section>

      {/* Recommendation Letters */}
      <section className="space-y-2">
        <Label>Recommendation Letters</Label>
        <FilePond
          name="recommendationLetters"
          allowMultiple={true}
          maxFiles={3}
          acceptedFileTypes={["application/pdf", "image/*"]}
          onupdatefiles={(files) => {
            files.forEach((f) =>
              handleUpload(f.file as File, "recommendation_letter")
            );
          }}
        />
      </section>

      {/* Personal Statement */}
      <section className="space-y-2">
        <Label>Personal Statement / Essay</Label>
        <FilePond
          name="personalStatement"
          allowMultiple={false}
          acceptedFileTypes={[
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
          onupdatefiles={(files) => {
            const file = files[0]?.file;
            if (file) handleUpload(file as File, "personal_statement");
          }}
        />
      </section>

      {/* Supporting Docs */}
      <section className="space-y-2">
        <Label>Supporting Documents</Label>
        <FilePond
          name="supportingDocs"
          allowMultiple={true}
          acceptedFileTypes={["application/pdf", "image/*"]}
          onupdatefiles={(files) => {
            files.forEach((f) =>
              handleUpload(f.file as File, "supporting_document")
            );
          }}
        />
      </section>

      {/* Miscellaneous */}
      <section className="space-y-2">
        <Label>Miscellaneous Documents</Label>
        <FilePond
          name="miscellaneous"
          allowMultiple={true}
          acceptedFileTypes={[
            "application/pdf",
            "image/*",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]}
          onupdatefiles={(files) => {
            files.forEach((f) => handleUpload(f.file as File, "miscellaneous"));
          }}
        />
      </section>

      {/* Submit */}
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

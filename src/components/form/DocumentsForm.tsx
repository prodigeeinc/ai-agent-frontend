"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dummy academic data (matches your academic form structure)
const academicData = [
  {
    universityName: "University of Ghana",
    city: "Accra",
    country: "Ghana",
    levelOfStudy: "bachelor",
    major: "Computer Science",
    gpa: "3.8",
    startDate: "2018-09-01",
    endDate: "2022-07-30",
    honors: "First Class Honors",
  },
  {
    universityName: "Ashesi University",
    city: "Berekuso",
    country: "Ghana",
    levelOfStudy: "master",
    major: "Data Science",
    gpa: "3.9",
    startDate: "2023-01-01",
    endDate: "2026-05-15",
    honors: "",
  },
];

// Zod schema
const documentsSchema = z.object({
  transcripts: z.array(z.any().optional()).optional(),
  certificates: z.array(z.any().optional()).optional(),
  resume: z.any().optional(),
  recommendationLetters: z.array(z.any().optional()).optional(),
  personalStatement: z.any().optional(),
  supportingDocs: z.array(z.any().optional()).optional(),
  miscellaneous: z.array(z.any().optional()).optional(),
});

type DocumentsFormValues = z.infer<typeof documentsSchema>;

export default function DocumentsForm() {
  const form = useForm<DocumentsFormValues>({
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

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = (data: DocumentsFormValues) => {
    console.log("Uploaded documents:", data);
    // TODO: Handle file upload or link to Supabase Storage later
  };

  // Helper — check if the school is completed
  const isCompleted = (endDate: string) => new Date(endDate) < new Date();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 grid gap-10">
      <div>
        <h1 className="text-2xl font-semibold">Upload Documents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload transcripts, certificates, and other supporting documents to
          complete your profile. All uploads are optional but recommended.
        </p>
      </div>

      {/* Transcripts */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Academic Transcripts</h2>
        <p className="text-sm text-muted-foreground">
          Upload official transcripts for each institution listed in your
          academic background.
        </p>

        {academicData.map((school, i) => (
          <div key={i} className="grid gap-2">
            <Label htmlFor={`transcript-${i}`}>
              {school.universityName} Transcript
            </Label>
            <Input
              id={`transcript-${i}`}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register(`transcripts.${i}`)}
            />
          </div>
        ))}
      </div>

      {/* Certificates (only if completed) */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Degree Certificates</h2>
        <p className="text-sm text-muted-foreground">
          Upload certificates for completed programs only.
        </p>

        {academicData
          .filter((school) => isCompleted(school.endDate))
          .map((school, i) => (
            <div key={i} className="grid gap-2">
              <Label htmlFor={`certificate-${i}`}>
                {school.universityName} Certificate
              </Label>
              <Input
                id={`certificate-${i}`}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                {...register(`certificates.${i}`)}
              />
            </div>
          ))}
      </div>

      {/* Resume / CV */}
      <div className="grid gap-2">
        <Label htmlFor="resume">Resume / CV</Label>
        <p className="text-sm text-muted-foreground">
          Upload your latest professional CV or résumé in PDF format.
        </p>
        <Input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          {...register("resume")}
        />
      </div>

      {/* Recommendation Letters */}
      <div className="grid gap-2">
        <Label htmlFor="recommendationLetters">Recommendation Letters</Label>
        <p className="text-sm text-muted-foreground">
          You can upload up to three recommendation letters from academic or
          professional references.
        </p>
        <Input
          id="recommendationLetters"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          {...register("recommendationLetters")}
        />
      </div>

      {/* Personal Statement */}
      <div className="grid gap-2">
        <Label htmlFor="personalStatement">Personal Statement / Essay</Label>
        <p className="text-sm text-muted-foreground">
          Upload your statement of purpose or motivation letter (PDF or Word).
        </p>
        <Input
          id="personalStatement"
          type="file"
          accept=".pdf,.doc,.docx"
          {...register("personalStatement")}
        />
      </div>

      {/* Supporting Documents */}
      <div className="grid gap-2">
        <Label htmlFor="supportingDocs">Supporting Documents</Label>
        <p className="text-sm text-muted-foreground">
          Upload any other documents that support your application (e.g.,
          awards, test scores, certificates).
        </p>
        <Input
          id="supportingDocs"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          {...register("supportingDocs")}
        />
      </div>

      {/* Miscellaneous */}
      <div className="grid gap-2">
        <Label htmlFor="miscellaneous">Miscellaneous Documents</Label>
        <p className="text-sm text-muted-foreground">
          Upload any additional documents not listed above.
        </p>
        <Input
          id="miscellaneous"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple
          {...register("miscellaneous")}
        />
      </div>

      {/* Submit */}
      <div className="pt-4 flex justify-end gap-4">
        <Link
          href={isSubmitting ? "#" : "/profile/create/employment-info"}
          onClick={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          className={`px-4 py-2 rounded ${
            isSubmitting ? "pointer-events-none opacity-50" : "hover:underline"
          }`}
        >
          Back
        </Link>

        <Button type="submit" size={"lg"} disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}

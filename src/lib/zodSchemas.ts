import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  birthCountry: z.string().min(1, "Birth country is required"),
  citizenship: z.string().min(1, "Primary citizenship is required"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  addressStreet: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region/State is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone number is required"),
});

export const academicInfoSchema = z.object({
  education: z.array(
    z
      .object({
        universityName: z.string().min(1, "University name is required"),
        city: z.string().min(1, "City is required"),
        region: z.string().min(1, "Region is required"),
        country: z.string().min(1, "Country is required"),
        levelOfStudy: z.string().min(1, "Level of study is required"),
        major: z.string().min(1, "Degree name or major is required"),
        gpa: z.string().min(1, "GPA is required"),
        startDate: z.string().min(1, "Start date required"),
        endDate: z.string().min(1, "End date required"),
        honors: z.string().optional(),
      })
      .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
      })
  ),
});

export const employmentInfoSchema = z.object({
  experience: z.array(
    z
      .object({
        companyName: z.string().min(1, "Company name is required"),
        positionTitle: z.string().min(1, "Position/Job title is required"),
        city: z.string().min(1, "City is required"),
        country: z.string().min(1, "Country is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        currentlyWorking: z.boolean().optional(),
        responsibilities: z
          .string()
          .min(1, "Please describe your responsibilities"),
      })
      .refine(
        (data) =>
          data.currentlyWorking ||
          new Date(data.endDate!) > new Date(data.startDate),
        {
          message: "End date must be after start date",
          path: ["endDate"],
        }
      )
  ),
});

export type EmploymentInfoFormValues = z.infer<typeof employmentInfoSchema>;
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type AcademicInfoFormValues = z.infer<typeof academicInfoSchema>;

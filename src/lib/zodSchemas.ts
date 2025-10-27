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
    z.object({
      universityName: z.string().min(1, "University name is required"),
      region: z.string().min(1, "Region is required"),
      country: z.string().min(1, "Country is required"),
      degreeType: z.string().min(1, "Degree type is required"),
      major: z.string().min(1, "Degree name or major is required"),
      gpa: z.string().min(1, "GPA is required"),
      startDate: z.string().min(1, "Start date required"),
      endDate: z.string().min(1, "End date required"),
      honors: z.string().optional(),
    })
  ),
});

export type AcademicInfoFormValues = z.infer<typeof academicInfoSchema>;
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

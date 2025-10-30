import { z } from "zod";

export const personalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female", "other"]).optional(),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  birth_country: z.string().min(1, "Birth country is required"),
  citizenship: z.string().min(1, "Primary citizenship is required"),
  country_of_residence: z.string().min(1, "Country of residence is required"),
  address_street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone number is required"),
});

export const academicInfoSchema = z.object({
  education: z.array(
    z
      .object({
        university_name: z.string().min(1, "University name is required"),
        city: z.string().min(1, "City is required"),
        country: z.string().min(1, "Country is required"),
        level_of_study: z.string().min(1, "Level of study is required"),
        major: z.string().min(1, "Degree name or major is required"),
        gpa: z.string().min(1, "GPA is required"),
        start_date: z.string().min(1, "Start date required"),
        end_date: z.string().min(1, "End date required"),
        honors: z.string().optional(),
      })
      .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
        message: "End date must be after start date",
        path: ["end_date"],
      })
  ),
});

export const employmentInfoSchema = z.object({
  experience: z.array(
    z
      .object({
        company_name: z.string().min(1, "Company name is required"),
        position_title: z.string().min(1, "Position/Job title is required"),
        city: z.string().min(1, "City is required"),
        country: z.string().min(1, "Country is required"),
        start_date: z.string().min(1, "Start date is required"),
        end_date: z.string().optional(),
        currently_working: z.boolean().optional(),
        responsibilities: z
          .string()
          .min(1, "Please describe your responsibilities"),
      })
      .refine(
        (data) =>
          data.currently_working ||
          new Date(data.end_date!) > new Date(data.start_date),
        {
          message: "End date must be after start date",
          path: ["end_date"],
        }
      )
  ),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type EmploymentInfoFormValues = z.infer<typeof employmentInfoSchema>;
export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
export type AcademicInfoFormValues = z.infer<typeof academicInfoSchema>;

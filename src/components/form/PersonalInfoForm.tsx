"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoFormValues } from "@/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { savePersonalInfo } from "@/app/profile/create/personal-info/action";

export default function PersonalInfoForm() {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: undefined,
      date_of_birth: "",
      birth_country: "",
      citizenship: "",
      country_of_residence: "",
      address_street: "",
      city: "",
      email: "",
      phone: "",
    },
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      const result = await savePersonalInfo(data);
      if (result?.error) {
        console.error(result);
        // Optionally show toast error
      }
      // redirect or toast
      console.log("Employment info saved!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 grid gap-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Personal Information</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide your biographical details. This information will remain
          consistent across all applications.
        </p>
      </div>

      {/* Personal Details */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Personal Details</h2>

        <div className="grid gap-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            {...register("first_name")}
            placeholder="e.g. Sarah"
          />
          {errors.first_name && (
            <p className="text-xs text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            {...register("last_name")}
            placeholder="e.g. Mensah"
          />
          {errors.last_name && (
            <p className="text-xs text-red-500">{errors.last_name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="grid gap-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth")}
            />
            {errors.date_of_birth && (
              <p className="text-xs text-red-500">
                {errors.date_of_birth.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Sex *</Label>
            <Select
              onValueChange={(value) =>
                setValue("gender", value as "male" | "female")
              }
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Contact & Address</h2>

        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="example@gmail.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Mobile Phone *</Label>
          <Input id="phone" {...register("phone")} placeholder="+233..." />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address_street">Street Address *</Label>
          <Input
            id="address_street"
            {...register("address_street")}
            placeholder="e.g. 123 Ring Road"
          />
          {errors.address_street && (
            <p className="text-xs text-red-500">
              {errors.address_street.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" {...register("city")} placeholder="e.g. Accra" />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country_of_residence">Country of Residence *</Label>
            <Input
              id="country_of_residence"
              {...register("country_of_residence")}
              placeholder="e.g. Ghana"
            />
            {errors.country_of_residence && (
              <p className="text-xs text-red-500">
                {errors.country_of_residence.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="birth_country">Birth Country *</Label>
          <Input
            id="birth_country"
            {...register("birth_country")}
            placeholder="e.g. Ghana"
          />
          {errors.birth_country && (
            <p className="text-xs text-red-500">
              {errors.birth_country.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="citizenship">Primary Citizenship *</Label>
          <Input
            id="citizenship"
            {...register("citizenship")}
            placeholder="e.g. Ghanaian"
          />
          {errors.citizenship && (
            <p className="text-xs text-red-500">{errors.citizenship.message}</p>
          )}
        </div>
      </section>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}

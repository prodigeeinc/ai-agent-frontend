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

export default function PersonalInfoForm() {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: "",
      birthCountry: "",
      citizenship: "",
      countryOfResidence: "",
      addressStreet: "",
      city: "",
      region: "",
      email: "",
      phone: "",
    },
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: PersonalInfoFormValues) => {
    console.log("Personal Info submitted:", data);
    // TODO: Save to backend later
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
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            placeholder="e.g. Sarah"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            placeholder="e.g. Mensah"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500">
                {errors.dateOfBirth.message}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="addressStreet">Street Address *</Label>
            <Input
              id="addressStreet"
              {...register("addressStreet")}
              placeholder="e.g. 123 Ring Road"
            />
            {errors.addressStreet && (
              <p className="text-xs text-red-500">
                {errors.addressStreet.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" {...register("city")} placeholder="e.g. Accra" />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="region">Region/State *</Label>
            <Input
              id="region"
              {...register("region")}
              placeholder="e.g. Greater Accra"
            />
            {errors.region && (
              <p className="text-xs text-red-500">{errors.region.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="countryOfResidence">Country of Residence *</Label>
            <Input
              id="countryOfResidence"
              {...register("countryOfResidence")}
              placeholder="e.g. Ghana"
            />
            {errors.countryOfResidence && (
              <p className="text-xs text-red-500">
                {errors.countryOfResidence.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="birthCountry">Birth Country *</Label>
          <Input
            id="birthCountry"
            {...register("birthCountry")}
            placeholder="e.g. Ghana"
          />
          {errors.birthCountry && (
            <p className="text-xs text-red-500">
              {errors.birthCountry.message}
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
        <Button type="submit" size={"lg"} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}

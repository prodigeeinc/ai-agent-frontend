"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { academicInfoSchema, AcademicInfoFormValues } from "@/lib/zodSchemas";
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
import { Trash2, Plus } from "lucide-react";

import { saveAcademicInfo } from "@/app/profile/create/academic-info/actions";

export default function AcademicInfoForm() {
  const form = useForm<AcademicInfoFormValues>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      education: [
        {
          university_name: "",
          city: "",
          country: "",
          level_of_study: "",
          major: "",
          gpa: "",
          start_date: "",
          end_date: "",
          honors: "",
        },
      ],
    },
  });

  const { control, handleSubmit, register, setValue, formState } = form;
  const { errors, isSubmitting } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const onSubmit = async (data: AcademicInfoFormValues) => {
    try {
      const result = await saveAcademicInfo(data);
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
        <h1 className="text-2xl font-semibold">Academic Background</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add your post-secondary education details. You can include more than
          one institution if applicable.
        </p>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative border rounded-lg p-5 space-y-5 bg-muted/20"
        >
          {/* Delete button */}
          {fields.length > 1 && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => remove(index)}
              className="absolute top-2 -right-10"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}

          {/* University Name */}
          <div className="grid gap-2">
            <Label htmlFor={`university_name-${index}`}>
              University Name *
            </Label>
            <Input
              id={`university_name-${index}`}
              {...register(`education.${index}.university_name`)}
              placeholder="e.g. University of Ghana"
            />
            {errors.education?.[index]?.university_name && (
              <p className="text-xs text-red-500">
                {errors.education[index]?.university_name?.message}
              </p>
            )}
          </div>

          {/* City & Country */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`city-${index}`}>City *</Label>
              <Input
                id={`city-${index}`}
                {...register(`education.${index}.city`)}
                placeholder="e.g. Accra"
              />
              {errors.education?.[index]?.city && (
                <p className="text-xs text-red-500">
                  {errors.education[index]?.city?.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`country-${index}`}>Country *</Label>
              <Input
                id={`country-${index}`}
                {...register(`education.${index}.country`)}
                placeholder="e.g. Ghana"
              />
              {errors.education?.[index]?.country && (
                <p className="text-xs text-red-500">
                  {errors.education[index]?.country?.message}
                </p>
              )}
            </div>
          </div>

          {/* Start / End Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`start_date-${index}`}>Start Date *</Label>
              <Input
                id={`start_date-${index}`}
                type="date"
                {...register(`education.${index}.start_date`)}
              />
              {errors.education?.[index]?.start_date && (
                <p className="text-xs text-red-500">
                  {errors.education[index]?.start_date?.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`end_date-${index}`}>End Date *</Label>
              <Input
                id={`end_date-${index}`}
                type="date"
                {...register(`education.${index}.end_date`)}
              />
              {errors.education?.[index]?.end_date && (
                <p className="text-xs text-red-500">
                  {errors.education[index]?.end_date?.message}
                </p>
              )}
            </div>
          </div>

          {/* Level of Study */}
          <div className="grid gap-2">
            <Label htmlFor={`level_of_study-${index}`}>Level of Study *</Label>
            <Select
              onValueChange={(value) =>
                setValue(`education.${index}.level_of_study`, value)
              }
            >
              <SelectTrigger id={`level_of_study-${index}`}>
                <SelectValue placeholder="Select level of study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bachelor">Bachelor’s</SelectItem>
                <SelectItem value="master">Master’s</SelectItem>
                <SelectItem value="phd">PhD / Doctorate</SelectItem>
                <SelectItem value="associate">Associate Degree</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.education?.[index]?.level_of_study && (
              <p className="text-xs text-red-500">
                {errors.education[index]?.level_of_study?.message}
              </p>
            )}
          </div>

          {/* Major */}
          <div className="grid gap-2">
            <Label htmlFor={`major-${index}`}>Degree Name or Major *</Label>
            <Input
              id={`major-${index}`}
              {...register(`education.${index}.major`)}
              placeholder="e.g. Computer Science"
            />
            {errors.education?.[index]?.major && (
              <p className="text-xs text-red-500">
                {errors.education[index]?.major?.message}
              </p>
            )}
          </div>

          {/* GPA */}
          <div className="grid gap-2">
            <Label htmlFor={`gpa-${index}`}>GPA *</Label>
            <Input
              id={`gpa-${index}`}
              {...register(`education.${index}.gpa`)}
              placeholder="e.g. 3.8 / 4.0"
            />
            {errors.education?.[index]?.gpa && (
              <p className="text-xs text-red-500">
                {errors.education[index]?.gpa?.message}
              </p>
            )}
          </div>

          {/* Honors */}
          <div className="grid gap-2">
            <Label htmlFor={`honors-${index}`}>Honors / Achievements</Label>
            <Input
              id={`honors-${index}`}
              {...register(`education.${index}.honors`)}
              placeholder="e.g. First Class Honors, Dean’s List"
            />
          </div>
        </div>
      ))}

      {/* Add More Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            university_name: "",
            city: "",
            country: "",
            level_of_study: "",
            major: "",
            gpa: "",
            start_date: "",
            end_date: "",
            honors: "",
          })
        }
        className="w-fit flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Another School
      </Button>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}

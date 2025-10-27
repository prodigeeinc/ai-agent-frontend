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

export default function AcademicInfoForm() {
  const form = useForm<AcademicInfoFormValues>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      education: [
        {
          universityName: "",
          region: "",
          country: "",
          degreeType: "",
          major: "",
          gpa: "",
          startDate: "",
          endDate: "",
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
    console.log("Academic info submitted:", data);
    // TODO: save to Supabase later
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 grid gap-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Academic Background</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add details of your university or college education. You can add more
          than one institution if applicable.
        </p>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative border rounded-lg p-4 space-y-4 bg-muted/20"
        >
          {/* Delete button */}
          <div className="absolute top-0 -right-10">
            {fields.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>

          {/* University */}
          <div className="grid gap-2">
            <Label htmlFor={`universityName-${index}`}>University Name *</Label>
            <Input
              id={`universityName-${index}`}
              {...register(`education.${index}.universityName`)}
              placeholder="e.g. University of Ghana"
            />
            {errors.education?.[index]?.universityName && (
              <p className="text-xs text-red-500">
                {errors.education[index]?.universityName?.message}
              </p>
            )}
          </div>

          {/* Region / Country / Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`region-${index}`}>Region *</Label>
              <Input
                id={`region-${index}`}
                {...register(`education.${index}.region`)}
                placeholder="e.g. Greater Accra"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`country-${index}`}>Country *</Label>
              <Input
                id={`country-${index}`}
                {...register(`education.${index}.country`)}
                placeholder="e.g. Ghana"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
              <Input
                id={`startDate-${index}`}
                type="date"
                {...register(`education.${index}.startDate`)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`endDate-${index}`}>End Date *</Label>
              <Input
                id={`endDate-${index}`}
                type="date"
                {...register(`education.${index}.endDate`)}
              />
            </div>
          </div>

          {/* Degree Type */}
          <div className="grid gap-2">
            <Label htmlFor={`degreeType-${index}`}>Degree Type *</Label>
            <Select
              onValueChange={(value) =>
                setValue(`education.${index}.degreeType`, value)
              }
            >
              <SelectTrigger id={`degreeType-${index}`}>
                <SelectValue placeholder="Select degree type" />
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
            {errors.education?.[index]?.degreeType && (
              <p className="text-xs text-red-500">
                {errors.education[index]?.degreeType?.message}
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

      {/* Add more schools button */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            universityName: "",
            region: "",
            country: "",
            degreeType: "",
            major: "",
            gpa: "",
            startDate: "",
            endDate: "",
            honors: "",
          })
        }
        className="w-fit flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Another School
      </Button>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}

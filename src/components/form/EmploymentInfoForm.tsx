"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employmentInfoSchema,
  EmploymentInfoFormValues,
} from "@/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { saveEmploymentInfo } from "@/app/profile/create/employment-info/actions";

export default function EmploymentInfoForm() {
  const form = useForm<EmploymentInfoFormValues>({
    resolver: zodResolver(employmentInfoSchema),
    defaultValues: {
      experience: [
        {
          company_name: "",
          position_title: "",
          city: "",
          country: "",
          start_date: "",
          end_date: "",
          currently_working: false,
          responsibilities: "",
        },
      ],
    },
  });

  const { control, handleSubmit, register, watch, setValue, formState } = form;
  const { errors, isSubmitting } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const onSubmit = async (data: EmploymentInfoFormValues) => {
    try {
      const result = await saveEmploymentInfo(data);
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
      <div>
        <h1 className="text-2xl font-semibold">Employment History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide details about your professional experience. Include
          internships or part-time work if relevant.
        </p>
      </div>

      {fields.map((field, index) => {
        const currently_working = watch(
          `experience.${index}.currently_working`
        );

        return (
          <div
            key={field.id}
            className="relative border rounded-lg p-5 space-y-5 bg-muted/20"
          >
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

            {/* Company Name */}
            <div className="grid gap-2">
              <Label htmlFor={`company_name-${index}`}>Company Name *</Label>
              <Input
                id={`company_name-${index}`}
                {...register(`experience.${index}.company_name`)}
                placeholder="e.g. Prodigee"
              />
              {errors.experience?.[index]?.company_name && (
                <p className="text-xs text-red-500">
                  {errors.experience[index]?.company_name?.message}
                </p>
              )}
            </div>

            {/* Position */}
            <div className="grid gap-2">
              <Label htmlFor={`position_title-${index}`}>
                Position / Title *
              </Label>
              <Input
                id={`position_title-${index}`}
                {...register(`experience.${index}.position_title`)}
                placeholder="e.g. Software Engineer"
              />
              {errors.experience?.[index]?.position_title && (
                <p className="text-xs text-red-500">
                  {errors.experience[index]?.position_title?.message}
                </p>
              )}
            </div>

            {/* Region + Country */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`city-${index}`}>City *</Label>
                <Input
                  id={`city-${index}`}
                  {...register(`experience.${index}.city`)}
                  placeholder="e.g. Accra"
                />
                {errors.experience?.[index]?.city && (
                  <p className="text-xs text-red-500">
                    {errors.experience[index]?.city?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`country-${index}`}>Country *</Label>
                <Input
                  id={`country-${index}`}
                  {...register(`experience.${index}.country`)}
                  placeholder="e.g. Ghana"
                />
                {errors.experience?.[index]?.country && (
                  <p className="text-xs text-red-500">
                    {errors.experience[index]?.country?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Dates + Checkbox */}
            <div className="grid md:grid-cols-2 gap-4 items-center">
              <div className="grid gap-2">
                <Label htmlFor={`start_date-${index}`}>Start Date *</Label>
                <Input
                  id={`start_date-${index}`}
                  type="date"
                  {...register(`experience.${index}.start_date`)}
                />
                {errors.experience?.[index]?.start_date && (
                  <p className="text-xs text-red-500">
                    {errors.experience[index]?.start_date?.message}
                  </p>
                )}
              </div>

              {!currently_working && (
                <div className="grid gap-2">
                  <Label htmlFor={`end_date-${index}`}>End Date *</Label>
                  <Input
                    id={`end_date-${index}`}
                    type="date"
                    {...register(`experience.${index}.end_date`)}
                  />
                  {errors.experience?.[index]?.end_date && (
                    <p className="text-xs text-red-500">
                      {errors.experience[index]?.end_date?.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id={`currently_working-${index}`}
                  checked={currently_working}
                  onCheckedChange={(checked) =>
                    setValue(`experience.${index}.currently_working`, !!checked)
                  }
                />
                <Label htmlFor={`currently_working-${index}`}>
                  I currently work here
                </Label>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="grid gap-2">
              <Label htmlFor={`responsibilities-${index}`}>
                Key Responsibilities / Achievements *
              </Label>
              <Textarea
                id={`responsibilities-${index}`}
                {...register(`experience.${index}.responsibilities`)}
                placeholder="e.g. Developed and maintained client-facing web apps using React and Node.js..."
              />
              {errors.experience?.[index]?.responsibilities && (
                <p className="text-xs text-red-500">
                  {errors.experience[index]?.responsibilities?.message}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Add More Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            company_name: "",
            position_title: "",
            city: "",
            country: "",
            start_date: "",
            end_date: "",
            currently_working: false,
            responsibilities: "",
          })
        }
        className="w-fit flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Another Job
      </Button>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <Button type="submit" size={"lg"} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </form>
  );
}

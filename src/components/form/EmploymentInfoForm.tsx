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

export default function EmploymentInfoForm() {
  const form = useForm<EmploymentInfoFormValues>({
    resolver: zodResolver(employmentInfoSchema),
    defaultValues: {
      experience: [
        {
          companyName: "",
          positionTitle: "",
          city: "",
          country: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
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
    console.log("Employment info submitted:", data);
    // TODO: Save to Supabase
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
        const currentlyWorking = watch(`experience.${index}.currentlyWorking`);

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
              <Label htmlFor={`companyName-${index}`}>Company Name *</Label>
              <Input
                id={`companyName-${index}`}
                {...register(`experience.${index}.companyName`)}
                placeholder="e.g. Prodigee"
              />
              {errors.experience?.[index]?.companyName && (
                <p className="text-xs text-red-500">
                  {errors.experience[index]?.companyName?.message}
                </p>
              )}
            </div>

            {/* Position */}
            <div className="grid gap-2">
              <Label htmlFor={`positionTitle-${index}`}>
                Position / Title *
              </Label>
              <Input
                id={`positionTitle-${index}`}
                {...register(`experience.${index}.positionTitle`)}
                placeholder="e.g. Software Engineer"
              />
              {errors.experience?.[index]?.positionTitle && (
                <p className="text-xs text-red-500">
                  {errors.experience[index]?.positionTitle?.message}
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
                <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
                <Input
                  id={`startDate-${index}`}
                  type="date"
                  {...register(`experience.${index}.startDate`)}
                />
                {errors.experience?.[index]?.startDate && (
                  <p className="text-xs text-red-500">
                    {errors.experience[index]?.startDate?.message}
                  </p>
                )}
              </div>

              {!currentlyWorking && (
                <div className="grid gap-2">
                  <Label htmlFor={`endDate-${index}`}>End Date *</Label>
                  <Input
                    id={`endDate-${index}`}
                    type="date"
                    {...register(`experience.${index}.endDate`)}
                  />
                  {errors.experience?.[index]?.endDate && (
                    <p className="text-xs text-red-500">
                      {errors.experience[index]?.endDate?.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id={`currentlyWorking-${index}`}
                  checked={currentlyWorking}
                  onCheckedChange={(checked) =>
                    setValue(`experience.${index}.currentlyWorking`, !!checked)
                  }
                />
                <Label htmlFor={`currentlyWorking-${index}`}>
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
            companyName: "",
            positionTitle: "",
            city: "",
            country: "",
            startDate: "",
            endDate: "",
            currentlyWorking: false,
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

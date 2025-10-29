import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateProfileHome() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Create Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Let's build your study profile step-by-step. This information helps us
          tailor school recommendations and streamline your application process.
        </p>
      </div>

      {/* Steps Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">You'll be asked to provide:</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Personal details (name, contact, date of birth, etc.)</li>
          <li>Academic background and qualifications</li>
          <li>Employment or professional experience (if any)</li>
          <li>
            Required supporting documents like transcripts or certificates
          </li>
          <li>Final review before submission</li>
        </ul>
      </div>

      {/* Action */}
      <div className="pt-6">
        <Link href="/profile/create/personal-info">
          <Button size="lg">Start Now</Button>
        </Link>
      </div>
    </div>
  );
}

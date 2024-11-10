import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cookies } from "next/headers";

export default function Profile() {
  const email = cookies().get("email").value;
  const password = cookies().get("password").value;
  const fullName = cookies().get("fullName").value;
  const empCode = cookies().get("empCode").value;

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee Profile</h1>
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="employee-id">Employee ID</Label>
          <Input
            id="employee-id"
            placeholder="Enter your employee ID"
            value={empCode}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            value={password}
            placeholder="Enter your password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            placeholder="Enter your full name"
            value={fullName}
          />
        </div>
      </form>
    </div>
  );
}

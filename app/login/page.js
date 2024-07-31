import { handleLogin } from "@/actions/login";
import { handleOtp, handleOtpMail } from "@/actions/otp";
import CountButton from "@/components/CountButton";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <form>
              <CardHeader>
                <CardTitle>Log In</CardTitle>
                <CardDescription>
                  Enter your prodapt email. If you&apos;re new to this, generate the
                  password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="abc@prodapt.com"
                    pattern="[a-z0-9._%+\-]+@prodapt\.com$"
                    title="Email should be a valid @prodapt.com address"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <LoadingButton
                  type="submit"
                  formAction={handleLogin}
                  className="w-1/3"
                >
                  Login
                </LoadingButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <form>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Know your password here. After verifying, the password will be
                  shown.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="abc@prodapt.com"
                    pattern="[a-z0-9._%+\-]+@prodapt\.com$"
                    title="Email should be a valid @prodapt.com address"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="otp">OTP</Label>
                  <div className="flex flex-row gap-2">
                    <InputOTP maxLength={6} name="otp" id="id">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <CountButton formAction={handleOtpMail} className="w-full">
                      Send OTP
                    </CountButton>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button formAction={handleOtp}>Show password</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

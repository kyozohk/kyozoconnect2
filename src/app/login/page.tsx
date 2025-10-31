import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KyozoConnectLogo } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

export default function LoginPage() {
  const loginImage = PlaceHolderImages.find(p => p.id === "login-background");

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <KyozoConnectLogo className="h-10 w-10 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">KyozoConnect2</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>
                    Welcome back! Please enter your details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign Up</CardTitle>
                  <CardDescription>
                    Create an account to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignupForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            data-ai-hint={loginImage.imageHint}
            width={800}
            height={1200}
            className="h-full w-full object-cover dark:brightness-[0.3]"
            priority
          />
        )}
      </div>
    </div>
  );
}

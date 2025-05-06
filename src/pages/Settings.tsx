
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const [accountForm, setAccountForm] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Inc.",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    productUpdates: true,
  });

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account settings saved");
  };

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/lovable-uploads/2e3078bb-010d-4252-9baa-31b498e924e7.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button size="sm" variant="outline">
                        Change avatar
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={accountForm.name}
                        onChange={handleAccountChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={accountForm.email}
                        onChange={handleAccountChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={accountForm.company}
                        onChange={handleAccountChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue="admin">
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button>Save changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing information and view your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pro Plan</p>
                    <p className="text-sm text-muted-foreground">$29/month</p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next billing date</span>
                    <span>June 21, 2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment method</span>
                    <span>Visa ending in 4242</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Update payment</Button>
              <Button variant="ghost" className="text-red-500">
                Cancel subscription
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which emails you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new products, features, and promotions
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={() => handleNotificationToggle("marketingEmails")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="security-alerts">Security alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about security updates and account activity
                  </p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={() => handleNotificationToggle("securityAlerts")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="product-updates">Product updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about product updates and new features
                  </p>
                </div>
                <Switch
                  id="product-updates"
                  checked={notificationSettings.productUpdates}
                  onCheckedChange={() => handleNotificationToggle("productUpdates")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => toast.success("Notification settings saved")}
              >
                Save preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Color scheme</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["Default", "Blue", "Green", "Purple"].map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className="h-10 justify-start"
                    >
                      <span
                        className={`mr-2 h-4 w-4 rounded-full ${
                          color === "Default"
                            ? "bg-primary"
                            : color === "Blue"
                            ? "bg-blue-500"
                            : color === "Green"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      />
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">UI animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion">Reduced motion</Label>
                  <Switch id="reduced-motion" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Reduce the amount of animations for accessibility purposes
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => toast.success("Appearance settings saved")}
              >
                Save preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password to maintain security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => toast.success("Password changed successfully")}
              >
                Change password
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Enhance your account security with two-factor authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-factor authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Authentication method</Label>
                <Select defaultValue="authenticator">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authenticator">Authenticator app</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => toast.success("2FA settings saved")}
              >
                Save settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

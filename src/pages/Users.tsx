
import { useState, useEffect } from "react";
import { UsersTable, User } from "@/components/users/UsersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const UserForm = ({ 
  user, 
  onSubmit, 
  onCancel,
  processing = false
}: { 
  user?: User, 
  onSubmit: (data: Omit<User, "id" | "email">) => void,
  onCancel: () => void,
  processing?: boolean
}) => {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    role: user?.role || "User",
    status: user?.status || "Active",
    avatar_url: user?.avatar_url || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          value={formData.avatar_url || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as any }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Editor">Editor</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={processing}>
          {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user: authUser, profile } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // First get all auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
        toast.error("Error loading users");
        setLoading(false);
        return;
      }
      
      // Then get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast.error("Error loading user profiles");
        setLoading(false);
        return;
      }

      // Combine the data
      const combinedUsers = authUsers.users.map(authUser => {
        const userProfile = profiles?.find(profile => profile.id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || "",
          full_name: userProfile?.full_name || null,
          avatar_url: userProfile?.avatar_url || null,
          role: (userProfile?.role as "Admin" | "Editor" | "User") || "User",
          status: (userProfile?.status as "Active" | "Inactive" | "Pending") || "Pending"
        };
      });
      
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditUser = async (data: Omit<User, "id" | "email">) => {
    if (!currentUser) return;
    
    try {
      setProcessing(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role,
          status: data.status,
        })
        .eq("id", currentUser.id);

      if (error) {
        toast.error("Failed to update user");
        console.error("Error updating user:", error);
        return;
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === currentUser.id ? { ...user, ...data } : user
        )
      );
      
      toast.success("User updated successfully");
      setIsEditSheetOpen(false);
      
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      setProcessing(true);
      
      // We don't actually delete the user from auth, just update their status to Inactive
      const { error } = await supabase
        .from("profiles")
        .update({ status: "Inactive" })
        .eq("id", currentUser.id);

      if (error) {
        toast.error("Failed to deactivate user");
        console.error("Error deactivating user:", error);
        return;
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === currentUser.id ? { ...user, status: "Inactive" } : user
        )
      );
      
      toast.success("User deactivated successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("An error occurred while deactivating the user");
    } finally {
      setProcessing(false);
    }
  };

  // Check if current user is admin
  const isAdmin = profile?.role === "Admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <UsersTable
            users={filteredUsers}
            onEdit={(user) => {
              if (isAdmin || authUser?.id === user.id) {
                setCurrentUser(user);
                setIsEditSheetOpen(true);
              } else {
                toast.error("You don't have permission to edit this user");
              }
            }}
            onDelete={(user) => {
              if (isAdmin && authUser?.id !== user.id) {
                setCurrentUser(user);
                setIsDeleteDialogOpen(true);
              } else if (authUser?.id === user.id) {
                toast.error("You cannot delete your own account");
              } else {
                toast.error("You don't have permission to delete users");
              }
            }}
          />
        )}
      </div>

      {/* Edit User Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user details and permissions.
            </SheetDescription>
          </SheetHeader>
          {currentUser && (
            <div className="py-6">
              <div className="mb-4">
                <Label className="text-muted-foreground">Email</Label>
                <div className="mt-1 font-medium">{currentUser.email}</div>
              </div>
              <UserForm
                user={currentUser}
                onSubmit={handleEditUser}
                onCancel={() => setIsEditSheetOpen(false)}
                processing={processing}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this user? They will no longer be able to access the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={processing}
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;

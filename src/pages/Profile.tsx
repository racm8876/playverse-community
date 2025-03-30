
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setBio(user.bio || "");
      setProfilePicture(user.profilePicture || "");
    }
  }, [user, isLoading, isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: "", text: "" });
    
    try {
      // Mock update profile success
      setTimeout(() => {
        setMessage({ 
          type: "success", 
          text: "Profile updated successfully" 
        });
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "Failed to update profile. Please try again."
      });
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>View and manage your account</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={user?.profilePicture} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{user?.username}</h2>
                    <p className="text-sm text-foreground/70">{user?.email}</p>
                    <p className="text-xs text-foreground/50 mt-1">
                      Joined {new Date(user?.joinedDate || "").toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  {message.text && (
                    <Alert 
                      className={`mb-4 ${
                        message.type === "success" 
                          ? "bg-green-500/20 text-green-600 border-green-600" 
                          : "bg-red-500/20 text-red-600 border-red-600"
                      }`}
                    >
                      {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="profilePicture">Profile Picture URL</Label>
                        <Input
                          id="profilePicture"
                          value={profilePicture}
                          onChange={(e) => setProfilePicture(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useTransition } from "../../components/ui/transition-wrapper";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

function UserSettings() {
  const { t } = useTranslation('global');
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { transitionType, setTransitionType } = useTransition();
  
  const [userSettings, setUserSettings] = useState({
    // Profile Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    department: '',
    location: '',
    bio: '',
    
    // Preferences
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    reportUpdates: true,
    systemAlerts: false,
    weeklyDigest: true,
    
    // Privacy & Security
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    twoFactorEnabled: false,
    
    // Interface Preferences
    compactMode: false,
    showTooltips: true,
    autoSave: true,
    defaultView: 'list'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingChange = (key, value) => {
    setUserSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswordForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save user settings
      console.log('Saving user settings:', userSettings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to change password
      console.log('Changing password');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()} 
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              ←
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('userSettings.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('userSettings.subtitle')}</p>
              </div>
            </div>
          </div>
          <Button onClick={handleSaveSettings} disabled={isLoading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? t('userSettings.saving') : t('userSettings.saveChanges')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>{t('userSettings.profileInformation')}</CardTitle>
              </div>
              <CardDescription>{t('userSettings.profileInfoDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-lg">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    {t('userSettings.changePhoto')}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF (max 2MB)</p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('userSettings.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={userSettings.firstName}
                    onChange={(e) => handleSettingChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('userSettings.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={userSettings.lastName}
                    onChange={(e) => handleSettingChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('userSettings.emailAddress')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('userSettings.phoneNumber')}</Label>
                    <Input
                      id="phone"
                      value={userSettings.phone}
                      onChange={(e) => handleSettingChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">{t('userSettings.department')}</Label>
                    <Input
                      id="department"
                      value={userSettings.department}
                      onChange={(e) => handleSettingChange('department', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('userSettings.location')}</Label>
                  <Input
                    id="location"
                    value={userSettings.location}
                    onChange={(e) => handleSettingChange('location', e.target.value)}
                    placeholder={t('userSettings.location')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">{t('userSettings.bio')}</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                    value={userSettings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    placeholder={t('userSettings.bioPlaceholder')}
                    maxLength="500"
                  />
                  <p className="text-xs text-muted-foreground">{userSettings.bio.length}/500 characters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings Sidebar */}
          <div className="space-y-6">
            
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{t('userSettings.appearance')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('userSettings.darkMode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('userSettings.darkModeDescription')}</p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('userSettings.compactMode')}</Label>
                    <p className="text-sm text-muted-foreground">{t('userSettings.compactModeDescription')}</p>
                  </div>
                  <Switch
                    checked={userSettings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>{t('userSettings.pageTransitions')}</Label>
                  <Select value={transitionType} onValueChange={setTransitionType}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fadeScale">Fade & Scale</SelectItem>
                      <SelectItem value="slide">Slide 3D</SelectItem>
                      <SelectItem value="liquid">Liquid Morph</SelectItem>
                      <SelectItem value="curtain">Curtain Reveal</SelectItem>
                      <SelectItem value="glitch">Glitch Effect</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t('userSettings.pageTransitionsDescription')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Preferences */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={userSettings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="ms">Bahasa Melayu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={userSettings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={userSettings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Report Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about report changes</p>
                </div>
                <Switch
                  checked={userSettings.reportUpdates}
                  onCheckedChange={(checked) => handleSettingChange('reportUpdates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important system notifications</p>
                </div>
                <Switch
                  checked={userSettings.systemAlerts}
                  onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Weekly summary of activities</p>
                </div>
                <Switch
                  checked={userSettings.weeklyDigest}
                  onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security & Privacy</CardTitle>
              </div>
              <CardDescription>Manage your security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select value={userSettings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Email Address</Label>
                  <p className="text-sm text-muted-foreground">Display email on profile</p>
                </div>
                <Switch
                  checked={userSettings.showEmail}
                  onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Extra security for your account</p>
                </div>
                <Switch
                  checked={userSettings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Change */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleChangePassword} 
              disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="mt-4"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserSettings;
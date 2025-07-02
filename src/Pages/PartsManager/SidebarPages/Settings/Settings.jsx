import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Separator } from "../../../../components/ui/separator";
import { Badge } from "../../../../components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Database, 
  Bell, 
  Shield, 
  Mail, 
  Server, 
  Globe, 
  Clock,
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';

function Settings() {
  const [settings, setSettings] = useState({
    // System Configuration
    systemName: 'Valmet Spare Parts Portal',
    companyName: 'Valmet Corporation',
    systemEmail: 'admin@valmet.com',
    timezone: 'UTC',
    language: 'en',
    
    // Database Settings
    dbBackupFrequency: 'daily',
    dbRetentionPeriod: '90',
    autoBackup: true,
    
    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    reportNotifications: true,
    maintenanceAlerts: true,
    
    // Security Settings
    sessionTimeout: '8',
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    twoFactorAuth: false,
    
    // API Settings
    apiRateLimit: '1000',
    apiTimeout: '30',
    enableApiLogging: true,
    
    // Integration Settings
    enableAzureIntegration: true,
    azureStorageAccount: 'stasptusedvapp',
    enableExcelExport: true,
    maxFileSize: '50'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save settings
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
            <p className="text-sm text-muted-foreground">Configure system-wide settings and preferences</p>
          </div>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle>System Configuration</CardTitle>
            </div>
            <CardDescription>Basic system information and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => handleSettingChange('systemName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemEmail">System Email</Label>
              <Input
                id="systemEmail"
                type="email"
                value={settings.systemEmail}
                onChange={(e) => handleSettingChange('systemEmail', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="CET">Central European Time</SelectItem>
                    <SelectItem value="JST">Japan Standard Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger>
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
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Database Settings</CardTitle>
            </div>
            <CardDescription>Backup and maintenance configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">Enable automated database backups</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select value={settings.dbBackupFrequency} onValueChange={(value) => handleSettingChange('dbBackupFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbRetentionPeriod">Retention Period (days)</Label>
              <Input
                id="dbRetentionPeriod"
                type="number"
                value={settings.dbRetentionPeriod}
                onChange={(e) => handleSettingChange('dbRetentionPeriod', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">System-wide email notifications</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>System Alerts</Label>
                <p className="text-sm text-muted-foreground">Critical system alerts</p>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Report Notifications</Label>
                <p className="text-sm text-muted-foreground">Report generation notifications</p>
              </div>
              <Switch
                checked={settings.reportNotifications}
                onCheckedChange={(checked) => handleSettingChange('reportNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Alerts</Label>
                <p className="text-sm text-muted-foreground">Scheduled maintenance notifications</p>
              </div>
              <Switch
                checked={settings.maintenanceAlerts}
                onCheckedChange={(checked) => handleSettingChange('maintenanceAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>Authentication and security policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* API Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>API Settings</CardTitle>
            </div>
            <CardDescription>API rate limits and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiRateLimit">Rate Limit (req/hour)</Label>
                <Input
                  id="apiRateLimit"
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => handleSettingChange('apiRateLimit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiTimeout">Timeout (seconds)</Label>
                <Input
                  id="apiTimeout"
                  type="number"
                  value={settings.apiTimeout}
                  onChange={(e) => handleSettingChange('apiTimeout', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>API Logging</Label>
                <p className="text-sm text-muted-foreground">Enable detailed API request logging</p>
              </div>
              <Switch
                checked={settings.enableApiLogging}
                onCheckedChange={(checked) => handleSettingChange('enableApiLogging', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Integration Settings</CardTitle>
            </div>
            <CardDescription>External service integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Azure Integration</Label>
                <p className="text-sm text-muted-foreground">Enable Azure storage integration</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.enableAzureIntegration}
                  onCheckedChange={(checked) => handleSettingChange('enableAzureIntegration', checked)}
                />
                {settings.enableAzureIntegration && (
                  <Badge variant="outline" className="text-success border-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="azureStorageAccount">Azure Storage Account</Label>
              <Input
                id="azureStorageAccount"
                value={settings.azureStorageAccount}
                onChange={(e) => handleSettingChange('azureStorageAccount', e.target.value)}
                disabled={!settings.enableAzureIntegration}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Excel Export</Label>
                <p className="text-sm text-muted-foreground">Enable Excel file exports</p>
              </div>
              <Switch
                checked={settings.enableExcelExport}
                onCheckedChange={(checked) => handleSettingChange('enableExcelExport', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <CardTitle>System Status</CardTitle>
          </div>
          <CardDescription>Current system information and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Database Status</p>
                <p className="text-xs text-muted-foreground">Connected & Healthy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">API Status</p>
                <p className="text-xs text-muted-foreground">All endpoints active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;
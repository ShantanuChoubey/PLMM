import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from '@/context/ThemeContext'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PLATFORM_SETTINGS_DEFAULTS } from '@/mock/systemStatusData'

function SettingToggle({ label, description, checked, onChange, id }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input"
        aria-label={label}
      />
    </div>
  )
}

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState(PLATFORM_SETTINGS_DEFAULTS)

  const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }))

  const handleSave = () => {
    toast.success('Settings saved (mock).')
  }

  return (
    <PageContainer title="Platform Settings" description="Configure platform behavior, notifications, and security." actions={<Button type="button" onClick={handleSave}>Save Changes</Button>}>
      <div className="space-y-6">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>General platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="platform-name" className="text-sm font-medium">Platform Name</label>
              <Input id="platform-name" value={settings.platformName} onChange={(e) => update('platformName', e.target.value)} />
            </div>
            <SettingToggle id="maintenance" label="Maintenance Mode" description="Disable public access during maintenance" checked={settings.maintenanceMode} onChange={(v) => update('maintenanceMode', v)} />
            <SettingToggle id="registration" label="Registration Enabled" description="Allow new user sign-ups" checked={settings.registrationEnabled} onChange={(v) => update('registrationEnabled', v)} />
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Session Settings</CardTitle>
            <CardDescription>Configure mentoring session defaults</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="max-duration" className="text-sm font-medium">Max Session Duration (min)</label>
              <Input id="max-duration" type="number" value={settings.maxSessionDuration} onChange={(e) => update('maxSessionDuration', Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="default-duration" className="text-sm font-medium">Default Duration (min)</label>
              <Input id="default-duration" type="number" value={settings.defaultSessionDuration} onChange={(e) => update('defaultSessionDuration', Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>User Management Settings</CardTitle>
            <CardDescription>User account policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="session-timeout" className="text-sm font-medium">Session Timeout (min)</label>
              <Input id="session-timeout" type="number" value={settings.sessionTimeout} onChange={(e) => update('sessionTimeout', Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password-length" className="text-sm font-medium">Minimum Password Length</label>
              <Input id="password-length" type="number" value={settings.passwordMinLength} onChange={(e) => update('passwordMinLength', Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Platform notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingToggle id="email-notif" label="Email Notifications" checked={settings.emailNotifications} onChange={(v) => update('emailNotifications', v)} />
            <SettingToggle id="push-notif" label="Push Notifications" checked={settings.pushNotifications} onChange={(v) => update('pushNotifications', v)} />
            <SettingToggle id="session-reminders" label="Session Reminders" checked={settings.sessionReminders} onChange={(v) => update('sessionReminders', v)} />
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Admin interface appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {['light', 'dark'].map((t) => (
                <Button key={t} type="button" variant={theme === t ? 'default' : 'outline'} onClick={() => setTheme(t)} className="capitalize">{t}</Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Authentication and access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingToggle id="two-factor" label="Require Two-Factor Authentication" description="Enforce 2FA for admin accounts" checked={settings.twoFactorRequired} onChange={(v) => update('twoFactorRequired', v)} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

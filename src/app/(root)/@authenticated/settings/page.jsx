import { Settings } from "./_components/settings"

function SettingsPage() {
  return (
    <div className="pb-10 pt-5">
      <div className="mb-10">
        <p className="font-semibold text-xl text-center">Profile settings</p>
        <p className="text-sm text-muted-foreground text-center">Set your username and profile picture</p>
      </div>
      <Settings />
    </div>
  )
}
export default SettingsPage
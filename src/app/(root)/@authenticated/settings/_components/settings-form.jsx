import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserInfoForm } from "./user-info-form"
import { ProfileImageUploader } from "./profile-image-uploader"
import { ChangePasswordForm } from "./change-password-form"

export const SettingsForm = ({ user, isOwn }) => {
  return (
    <>
        <div className="flex flex-col gap-10 justify-between lg:flex-row">
            <div className="space-y-10 w-full">
            {
                isOwn && (
                    <div className="flex items-center justify-between lg:justify-stretch gap-10">
                        <p className="font-semibold text-lg">Färgtema:</p>
                        <ModeToggle />
                    </div>
                )
            }
                <div className="flex items-center justify-between lg:justify-stretch gap-10">
                    <p className="font-semibold text-lg">Kortfärg:</p>
                    {/* TODO: gör så man kan ändra kortfärg */}
                </div>

                <UserInfoForm user={user}/>

                <div className="flex items-center justify-between lg:justify-stretch gap-10">
                    <p className="font-semibold text-lg">Profilbild:</p>
                    <ProfileImageUploader />
                </div>
            </div>
                {
                    isOwn && <ChangePasswordForm className="bg-pink-700 w-full"/>
                }
        </div>
    </>
  )
}
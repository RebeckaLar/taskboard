"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const MAX_MB = 5;
const MAX_B = MAX_MB * 1024 * 1024
const MIME_RX = /^image\/(png|jpe?g|webp)$/i

export const ProfileImageUploader = ({ user, isOwn }) => {


  const [preview, setPreview] = useState(user?.photoURL || null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageUploaded, setImageUploaded] = useState(false)

  const { setUser } = useAuth()

  useEffect(() => {
    return () => preview?.startsWith("blob:") && URL.revokeObjectURL(preview)
  }, [preview]) 
  //If our current preview is changed, then we want the useeffect (the cleanup function) to start

  const onPickImage = async (e) => {
    const pickedFile = e.target.files[0]
    if(!pickedFile) return

    if(!MIME_RX.test(pickedFile.type)) {
      setError("Valid types: PNG, JPEG or WEBP")
      return
    }
    if(pickedFile.size > MAX_B) {
      setError(`Max ${MAX_MB} MB`)
      return
    }
    
    setError(null)
    setFile(pickedFile)
    setPreview(URL.createObjectURL(pickedFile)) //Creates a blob and stores it in memory
    setImageUploaded(false)
  }

  const handleUpload = async () => {
    if(!file || !user) return
    setLoading(true)

    try {
      //Create a reference to a user
      const storageRef = ref(storage, `avatars/${user.uid}`) 
      //ref returns a StorageReference to the given URL (the photoURL-property in a user-object)
      //StorageReferens is where data should be uploaded

      await uploadBytes(storageRef, file, { contentType: file.type }) //Upload file (the data) with metadata to storageRef (the objects location)

      //Downloadable URL to use:
      const photoURL = await getDownloadURL(storageRef)
      
      //photoURL is the object to be updated:
      // await updateUser(user, { photoURL }) 

      //The admin should be able to update another users profile image:
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, { photoURL})

      setFile(null)
      setImageUploaded(true)

      //Update local users avatar image
      if(isOwn) {
        setUser(prev => ({ ...prev, photoURL }))
      }

    } catch (error) {
      console.error(error)
      setError("Error updating picture, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {
        preview
        ? (
          <>
          <div className="relative">
            <label htmlFor="image-pick" className="block border rounded-lg aspect-square sm:w-80 overflow-hidden">
              <Image
                alt="Profile picture."
                src={preview}
                width={320}
                height={320}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-radial from-transparent from-70% to-black/60 to-70%"/>
            </label>
              {
                loading && (
                  <div className="absolute flex items-center justify-center inset-0 bg-black/40 pointer-events-auto">
                    <Loader2Icon className="size-20 animate-spin"/>
                  </div>
                )
              }
            </div>

            <div>
              {
                file && !imageUploaded && (
                  <Button className="mt-4" disabled={loading} onClick={handleUpload}>
                    { loading ? 'Uploading...' : 'Save'}
                  </Button>
                )
              }
            </div>
          </>
        )
        : (
          <label 
          htmlFor="image-pick" 
          className="border border-foreground/30 rounded-lg aspect-square flex items-center justify-center bg-gray-500/20 hover:bg-foreground/30 transition-colors cursor-pointer p-10 sm:w-50 mx-auto"
          >
            <p className="text-muted-foreground group-hover:text-foreground trainsition-colors">Choose image</p>
          </label>
        )
      }
      { error && <p className="text-red-500 text-sm">{ error }</p>}
      <input type="file" id="image-pick" accept="image/*" className="hidden" onChange={onPickImage}/>
    </div>
  )
}
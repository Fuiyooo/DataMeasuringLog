"use client";

import React, { useState } from "react";

// Components
import Layout from "@/app/components/layout";
import BigModal from "@/app/components/contents/BigModal";
import SmallModal from "@/app/components/contents/SmallModal";
import Input from "@/app/components/smallcomponents/Input";
import Button from "@/app/components/smallcomponents/Button";

// Functions
import checkPassword from "@/app/components/contents/functions/checkPassword";
import changePasswordAdmin from "@/app/components/contents/functions/changePasswordAdmin";

function page() {
  const activePage = "Admin Settings";
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleSave = async () => {
    try {
      // Call checkPassword and wait for the result
      const isPasswordValid = await checkPassword(oldPassword);
      if (!isPasswordValid) {
        // Jika password lama salah (password invalid)
        setShowErrorPopup(true);
      } else {
        // Jika password lama benar (password valid)
        setShowConfirmPopup(true);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  const confirmSave = async () => {
    try {
      const passwordUpdate = changePasswordAdmin(newPassword);
      if (passwordUpdate) {
        // Simulasi update password
        setShowConfirmPopup(false);
        setOldPassword("");
        setNewPassword("");
      }
      // TODO: Notifikasi Berhasil + Error jika password tidak berhasil diupdate
    } catch (error) {
      console.error("Error in confirming: ", error);
    }
  };

  const cancelSave = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div>
      <Layout
        activePage={activePage}
        contents={
          <BigModal
            title="Change Password"
            props={
              <>
                <Input
                  title="Old Password"
                  type="password"
                  value={oldPassword}
                  set={setOldPassword}
                  placeholder="Enter Old Password"
                />
                <Input
                  title="New Password"
                  type="password"
                  value={newPassword}
                  set={setNewPassword}
                  placeholder="Enter New Password"
                />
              </>
            }
            buttons={
              <>
                <Button
                  title="Save"
                  bgColor="bg-green-500"
                  hoverBgColor="bg-green-600"
                  textColor="text-white"
                  go={handleSave}
                />
              </>
            }
            confirmModal={
              <SmallModal
                title="Are you sure you want to save?"
                buttons={
                  <>
                    <Button
                      title="Cancel"
                      bgColor="bg-red-500"
                      hoverBgColor="bg-red-600"
                      textColor="text-white"
                      go={cancelSave}
                    />
                    <Button
                      title="Save"
                      bgColor="bg-green-500"
                      hoverBgColor="bg-green-600"
                      textColor="text-white"
                      go={confirmSave}
                    />
                  </>
                }
              />
            }
            errorModal={
              <SmallModal
                title=" Password Lama Salah!"
                textColor="text-red-600"
                buttons={
                  <Button
                    title="OK"
                    go={() => setShowErrorPopup(false)}
                    bgColor="bg-red-500"
                    hoverBgColor="bg-red-600"
                    textColor="text-white"
                  />
                }
              />
            }
            showConfirmPopup={showConfirmPopup}
            setShowConfirmPopup={setShowConfirmPopup}
            setShowErrorPopup={setShowErrorPopup}
            showErrorPopup={showErrorPopup}
            shadow={true}
            backBtn={true}
          />
        }
      />
    </div>
  );
}

export default page;

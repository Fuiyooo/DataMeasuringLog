"use client";

import React from "react";
import { useRouter } from "next/navigation";

import Button from "@/app/components/smallcomponents/Button";

export default function BigModal({
  onBack,
  title,
  props,
  buttons,
  confirmModal,
  errorModal,
  successModal,
  showErrorPopup,
  showConfirmPopup,
  setShowErrorPopup,
  setShowConfirmPopup,
  showSuccessPopup,
  back,
  bgColor,
  shadow,
  backBtn,
  padding,
  onSubmit,
  formRef,
}) {
  const router = useRouter();

  return (
    <div className="max-h-screen flex flex-col items-center justify-start ">
      <div
        className={`bg-white ${padding ? padding : "p-8"} rounded ${
          shadow ? "shadow-lg" : ""
        } w-full`}
      >
        {onSubmit ? (
          <form onSubmit={onSubmit} ref={formRef}>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
              {title}
            </h1>
            {props}

            {backBtn ? (
              <div className="flex justify-between gap-4">
                <Button
                  title="Back"
                  go={back ? back : () => router.back()}
                  bgColor="bg-gray-500"
                  hoverBgColor="bg-gray-600"
                  textColor="text-white"
                />

                <div className="flex justify-end gap-4">{buttons}</div>
              </div>
            ) : (
              <div className="flex justify-end gap-4">{buttons}</div>
            )}
          </form>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
              {title}
            </h1>
            {props}

            {backBtn ? (
              <div className="flex justify-between gap-4">
                <Button
                  title="Back"
                  go={back ? back : () => router.back()}
                  bgColor="bg-gray-500"
                  hoverBgColor="bg-gray-600"
                  textColor="text-white"
                />

                <div className="flex justify-end gap-4">{buttons}</div>
              </div>
            ) : (
              <div className="flex justify-end gap-4">{buttons}</div>
            )}
          </>
        )}
      </div>

      {/* Popup: Error Password */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {errorModal}
        </div>
      )}

      {/* Popup: Konfirmasi Save */}
      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {confirmModal}
        </div>
      )}

      {/* Popup: Konfirmasi Save */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {successModal}
        </div>
      )}
    </div>
  );
}

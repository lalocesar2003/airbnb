"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import React, { useCallback, useState } from "react";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import Modal from "./Modals";

const RegisterModal = () => {
  const registerModal = useRegisterModal();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("Submitting data:", data); // Log para ver los datos enviados

    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/register", data);
      console.log("Server response:", response.data); // Log para ver la respuesta del servidor
      toast.success("Success!");
      registerModal.onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Something went wrong.");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
      console.log("Finished submitting"); // Log para confirmar que se completó
    }
  };

  const toggle = useCallback(() => {
    console.log("Toggling modal");
    registerModal.onClose();
  }, [registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.email && (
        <p className="text-red-500 text-sm">Email is required.</p>
      )}
      {errors.name && <p className="text-red-500 text-sm">Name is required.</p>}
      {errors.password && (
        <p className="text-red-500 text-sm">Password is required.</p>
      )}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {
          console.log("Signing in with Google");
          signIn("google");
        }}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => {
          console.log("Signing in with GitHub");
          signIn("github");
        }}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Already have an account?</div>
          <div
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={() => {
        console.log("Closing modal");
        registerModal.onClose();
      }}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;

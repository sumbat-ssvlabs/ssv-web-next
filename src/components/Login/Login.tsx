import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Location, Navigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

export type LoginProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof LoginProps> & LoginProps
>;

export const Login: FCProps = ({ className, ...props }) => {
  const { isConnected } = useAccount();
  const location = useLocation() as Location<Location | undefined>;
  console.log("location:", location);
  if (isConnected) {
    return <Navigate to={location.state?.pathname ?? "/"} replace />;
  }
  return (
    <div className={cn(className)} {...props}>
      Login
    </div>
  );
};

Login.displayName = "Login";

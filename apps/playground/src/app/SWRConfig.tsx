"use client";
import { ComponentProps, PropsWithChildren } from "react";
import { trpc } from "../utils/trpc";

const SWRConfig = ({
  children,
  ...rest
}: PropsWithChildren<ComponentProps<typeof trpc.SWRConfig>>) => {
  return <trpc.SWRConfig {...rest}>{children}</trpc.SWRConfig>;
};

export default SWRConfig;

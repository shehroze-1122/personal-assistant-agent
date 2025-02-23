import Image from "next/image";
import React from "react";
import logoSrc from "./logo.png";

function Logo() {
  return <Image height={50} src={logoSrc} placeholder="blur" alt="Logo" />;
}

export default Logo;

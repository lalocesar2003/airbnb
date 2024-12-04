"use client";

import React from "react";
import Image from "next/image";

interface AvatarImgProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarImgProps> = ({ src }) => {
  return (
    <div>
      <Image
        className="rounded-full"
        height="30"
        width="30"
        alt="avatar"
        src={src || "/images/placeholder.png"}
      />
    </div>
  );
};

export default Avatar;

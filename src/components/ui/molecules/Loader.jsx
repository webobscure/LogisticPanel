import React from "react";
import { PuffLoader } from "react-spinners";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <PuffLoader color="hsl(192, 100%, 67%)" />
      Загрузка данных...
    </div>
  );
}

import { type IconProps } from "./iconProps";

const MessageTickIcon = ({
  stroke = "#3D367D",
  width = 15,
  height = 14,
}: IconProps) => {
  return (
    <svg
      // className="fill-current"
      width={width}
      height={height}
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.72217 5.19488L5.56949 9.1671L9.42361 5.19488L13.2777 1.22266"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 8.44466L5.32824 12.778L9.66412 8.44466L14 4.11133"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { MessageTickIcon };

import { type IconProps } from "./iconProps";

const UserIcon = ({ fill = "#A3A3A3", size = 20 }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        fill={fill}
      />
      <path
        d="M12.0002 14.5C6.99015 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5901C20.8701 22.5 21.0901 22.28 21.0901 22C21.0901 17.86 17.0102 14.5 12.0002 14.5Z"
        fill={fill}
      />
    </svg>
  );
};

export { UserIcon };

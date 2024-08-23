type IconProps = {
  color: string;
};
export const TransferIcon = ({ color }: IconProps) => {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9.75 -1.90735e-06C4.365 -1.90735e-06 0 4.365 0 9.75C0 15.135 4.365 19.5 9.75 19.5C15.135 19.5 19.5 15.135 19.5 9.75C19.5 4.365 15.135 -1.90735e-06 9.75 -1.90735e-06ZM14.03 10.28C14.171 10.14 14.25 9.949 14.25 9.75C14.25 9.551 14.171 9.36 14.03 9.22L11.03 6.22C10.737 5.927 10.263 5.927 9.97 6.22C9.677 6.513 9.677 6.987 9.97 7.28L11.689 9H6C5.586 9 5.25 9.336 5.25 9.75C5.25 10.164 5.586 10.5 6 10.5H11.689L9.97 12.22C9.677 12.513 9.677 12.987 9.97 13.28C10.263 13.573 10.737 13.573 11.03 13.28L14.03 10.28Z'
        fill={color}
      />
    </svg>
  );
};

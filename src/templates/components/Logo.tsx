type Props = {
  mobile?: boolean
}

const Logo = ({
  mobile
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
      <path d="M8.40404 0H11.4055V16H8.40404V0Z" fill={`url(#paint0_linear_536_7134${mobile ? "-mobile" : ""})`}/>
      <path d="M13.8066 0H16.8081L19.8095 8L16.8081 16H13.8066L16.8081 8L13.8066 0Z" fill={`url(#paint1_linear_536_7134${mobile ? "-mobile" : ""})`}/>
      <path d="M6.00289 0H3.00144L0 8L3.00144 16H6.00289L3.00144 8L6.00289 0Z" fill={`url(#paint2_linear_536_7134${mobile ? "-mobile" : ""})`}/>
      <defs>
        <linearGradient id={`paint0_linear_536_7134${mobile ? "-mobile" : ""}`} x1="2.61143" y1="16.2444" x2="21.2486" y2="-14.6573" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7F96FF"/>
          <stop offset="0.505785" stop-color="#F58E8E"/>
          <stop offset="1" stop-color="#F2D398"/>
        </linearGradient>
        <linearGradient id={`paint1_linear_536_7134${mobile ? "-mobile" : ""}`} x1="2.61143" y1="16.2444" x2="21.2486" y2="-14.6573" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7F96FF"/>
          <stop offset="0.505785" stop-color="#F58E8E"/>
          <stop offset="1" stop-color="#F2D398"/>
        </linearGradient>
        <linearGradient id={`paint2_linear_536_7134${mobile ? "-mobile" : ""}`} x1="2.61143" y1="16.2444" x2="21.2486" y2="-14.6573" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7F96FF"/>
          <stop offset="0.505785" stop-color="#F58E8E"/>
          <stop offset="1" stop-color="#F2D398"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Logo

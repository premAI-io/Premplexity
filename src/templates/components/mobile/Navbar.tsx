import Icon from "$templates/components/Icon"

const Navbar = () => {
  return (
    <div class={"mobile-navbar"}>
      <div class={"mobile-navbar__item active"}>
        <Icon name="chat-messages" viewBox={"0 0 17 17"} />
        <div>Chat</div>
      </div>
      <div class={"mobile-navbar__item"}>
        <Icon name="book" viewBox={"0 0 16 14"} />
        <div>History</div>
      </div>
    </div>
  )
}

export default Navbar

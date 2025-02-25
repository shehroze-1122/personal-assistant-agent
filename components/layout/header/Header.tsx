import Logo from "./Logo";
import Logout from "./Logout";

function Header() {
  return (
    <header className="w-full flex flex-row items-center justify-between">
      <Logo />
      <div className="flex flex-row items-center gap-3">
        <Logout />
      </div>
    </header>
  );
}

export default Header;
